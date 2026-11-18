import { before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { adminDb, resetFirestore, signIn } from './helpers';
import {
  completeLesson,
  enrollFree,
  getCourseAccess,
  getLesson,
  getMyCourses,
} from '../../app/courses/actions';
import { normalizeCourse } from '../../lib/courses/catalog';
import { allLessons } from '../../lib/courses/progress';
import { coursesFallback } from '../../lib/sanity/fallbacks';

// Sample catalog: course 1 is free, course 2 is paid.
const FREE = normalizeCourse(coursesFallback.find((course) => course.id === '1'))!;
const PAID = normalizeCourse(coursesFallback.find((course) => course.id === '2'))!;
const lessons = allLessons(FREE);
const preview = lessons.find((lesson) => lesson.isPreview)!;
const locked = lessons.find((lesson) => !lesson.isPreview && lesson.type === 'video')!;
const article = lessons.find((lesson) => lesson.type === 'article')!;

let alice: string;
let bob: string;
let admin: string;

before(async () => {
  alice = await signIn('alice');
  bob = await signIn('bob');
  admin = await signIn('admin', { admin: true });
});

beforeEach(async () => {
  await resetFirestore();
});

function expectError<T>(result: { ok: boolean; error?: string } & T, code: string) {
  assert.equal(result.ok, false, `expected ${code}, got ok`);
  assert.equal((result as { error?: string }).error, code);
}

describe('lesson access', () => {
  it('opens free previews to everyone and nothing else', async () => {
    const open = await getLesson(null, { courseId: FREE.id, lessonId: preview.id });
    assert.ok(open.ok);
    assert.equal(open.data.type, 'video');
    assert.ok(open.data.type === 'video' && open.data.playback.isPlaceholder);

    expectError(await getLesson(null, { courseId: FREE.id, lessonId: locked.id }), 'unauthenticated');
    expectError(await getLesson(alice, { courseId: FREE.id, lessonId: locked.id }), 'not_enrolled');
    expectError(await getLesson('not-a-token', { courseId: FREE.id, lessonId: locked.id }), 'unauthenticated');
  });

  it('rejects unknown and malformed ids', async () => {
    expectError(await getLesson(alice, { courseId: FREE.id, lessonId: 'no-such-lesson' }), 'not_found');
    expectError(await getLesson(alice, { courseId: 'Bad_Id', lessonId: preview.id }), 'invalid');
    expectError(await getLesson(alice, { courseId: FREE.id, lessonId: '../x' }), 'invalid');
    expectError(await getCourseAccess(alice, 'missing-course'), 'not_found');
  });

  it('lets admins review any lesson without enrolling', async () => {
    const result = await getLesson(admin, { courseId: PAID.id, lessonId: allLessons(PAID)[1].id });
    assert.ok(result.ok);
  });
});

describe('free enrollment', () => {
  it('refuses paid courses and anonymous callers', async () => {
    expectError(await enrollFree(alice, { courseId: PAID.id }), 'payment_required');
    expectError(await enrollFree('', { courseId: FREE.id }), 'unauthenticated');
  });

  it('enrolls once, unlocks every lesson and records where to resume', async () => {
    const first = await enrollFree(alice, { courseId: FREE.id });
    assert.ok(first.ok);
    assert.equal(first.data.id, `${FREE.id}_alice`);
    assert.equal(first.data.status, 'active');
    assert.deepEqual(first.data.source, { type: 'free' });
    assert.equal(typeof first.data.enrolledAt, 'number', 'timestamps reach the browser as millis');

    const again = await enrollFree(alice, { courseId: FREE.id });
    assert.ok(again.ok);
    assert.equal(again.data.enrolledAt, first.data.enrolledAt, 'second enroll is a no-op');

    const access = await getCourseAccess(alice, FREE.id);
    assert.ok(access.ok && access.data.hasAccess);
    assert.equal(access.data.resumeLessonId, lessons[0].id);

    const video = await getLesson(alice, { courseId: FREE.id, lessonId: locked.id });
    assert.ok(video.ok);
    const text = await getLesson(alice, { courseId: FREE.id, lessonId: article.id });
    assert.ok(text.ok);
    assert.equal(text.data.type, 'article');

    const stored = await adminDb().doc(`enrollments/${FREE.id}_alice`).get();
    assert.equal(stored.data()?.lastLessonId, article.id);

    expectError(await getLesson(bob, { courseId: FREE.id, lessonId: locked.id }), 'not_enrolled');
  });
});

describe('progress and certificates', () => {
  it('tracks completion and issues exactly one certificate', async () => {
    expectError(await completeLesson(alice, { courseId: FREE.id, lessonId: lessons[0].id }), 'not_enrolled');
    await enrollFree(alice, { courseId: FREE.id });

    let certificateId: string | null = null;
    for (const [index, lesson] of lessons.entries()) {
      const result = await completeLesson(alice, { courseId: FREE.id, lessonId: lesson.id });
      assert.ok(result.ok);
      assert.equal(result.data.progress.completed, index + 1);
      certificateId = result.data.certificateId;
      if (index < lessons.length - 1) assert.equal(certificateId, null);
    }
    assert.ok(certificateId, 'last lesson issues the certificate');

    const repeat = await completeLesson(alice, { courseId: FREE.id, lessonId: lessons[0].id });
    assert.ok(repeat.ok);
    assert.equal(repeat.data.certificateId, certificateId);
    const certificates = await adminDb().collection('certificates').where('uid', '==', 'alice').get();
    assert.equal(certificates.size, 1);
    assert.equal(certificates.docs[0].data().courseTitle, FREE.title);
    assert.equal(certificates.docs[0].data().studentName, 'User alice');

    const mine = await getMyCourses(alice);
    assert.ok(mine.ok);
    assert.equal(mine.data.length, 1);
    assert.equal(mine.data[0].progress.percent, 100);
    assert.equal(mine.data[0].enrollment.certificateId, certificateId);

    expectError(await completeLesson(alice, { courseId: FREE.id, lessonId: 'nope' }), 'not_found');
  });

  it('cuts off access when an enrollment is revoked', async () => {
    await enrollFree(alice, { courseId: FREE.id });
    await adminDb().doc(`enrollments/${FREE.id}_alice`).update({ status: 'revoked' });

    expectError(await getLesson(alice, { courseId: FREE.id, lessonId: locked.id }), 'not_enrolled');
    const access = await getCourseAccess(alice, FREE.id);
    assert.ok(access.ok && !access.data.hasAccess && access.data.enrollment?.status === 'revoked');
    const mine = await getMyCourses(alice);
    assert.ok(mine.ok && mine.data.length === 0);

    // Enrolling again restores access and keeps earlier progress.
    await adminDb().doc(`enrollments/${FREE.id}_alice`).update({ [`progress.${lessons[0].id}`]: { completedAt: new Date() } });
    const back = await enrollFree(alice, { courseId: FREE.id });
    assert.ok(back.ok && back.data.status === 'active');
    assert.ok(back.data.progress[lessons[0].id]);
  });
});
