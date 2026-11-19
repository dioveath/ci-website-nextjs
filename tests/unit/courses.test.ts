import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { enrollmentId, isCourseId, isLessonId, parseEnrollmentId } from '../../lib/courses/ids';
import {
  adjacentLessons,
  findLesson,
  isCourseComplete,
  resumeLessonId,
  summarizeProgress,
} from '../../lib/courses/progress';
import { formatDuration, formatMoney, toRupeeString } from '../../lib/courses/format';
import { normalizeCourse, normalizeCourses } from '../../lib/courses/catalog';

const course = normalizeCourse({
  id: 'web-dev',
  title: 'Web Development',
  level: 'Advance',
  sections: [
    {
      key: 's1',
      title: 'Basics',
      lessons: [
        { id: 'intro', title: 'Intro', isPreview: true, durationSec: 300 },
        { id: 'html', title: 'HTML', durationSec: 600 },
      ],
    },
    { key: 's2', title: 'Next', lessons: [{ id: 'css', title: 'CSS', type: 'article' }] },
  ],
  price: { amount: 150000, currency: 'NPR' },
})!;

describe('ids', () => {
  it('accepts lowercase slugs and the legacy numeric ids', () => {
    assert.ok(isCourseId('web-dev'));
    assert.ok(isCourseId('1'));
    assert.ok(!isCourseId('web_dev'), 'underscore would make enrollment ids ambiguous');
    assert.ok(!isCourseId('Web'));
    assert.ok(!isCourseId(''));
    assert.ok(!isLessonId('a/b'));
  });

  it('round-trips enrollment ids, splitting at the first underscore', () => {
    const id = enrollmentId('web-dev', 'abc_DEF123');
    assert.equal(id, 'web-dev_abc_DEF123');
    assert.deepEqual(parseEnrollmentId(id), { courseId: 'web-dev', uid: 'abc_DEF123' });
    assert.equal(parseEnrollmentId('nounderscore'), null);
    assert.throws(() => enrollmentId('bad_id', 'uid'));
  });
});

describe('normalizeCourse', () => {
  it('fills defaults and computes totals', () => {
    assert.equal(course.totalLessons, 3);
    assert.equal(course.totalDurationSec, 900);
    assert.equal(course.listed, true);
    assert.equal(course.coverImg, '/george.jpg');
    assert.deepEqual(course.sections[0].lessons[0].video, { provider: 'placeholder' });
    assert.equal(course.sections[1].lessons[0].video, null, 'articles have no video');
  });

  it('drops invalid and duplicate lessons, and rejects courses without an id or title', () => {
    const messy = normalizeCourse({
      id: 'x',
      title: ' X ',
      sections: [{ lessons: [{ id: 'a' }, { id: 'a' }, { id: 'Bad Id' }, null as never] }],
      price: { amount: 0 },
    })!;
    assert.deepEqual(messy.sections[0].lessons.map((l) => l.id), ['a']);
    assert.equal(messy.title, 'X');
    assert.equal(messy.price, null, 'zero price means free');
    assert.equal(normalizeCourse({ title: 'no id' }), null);
    assert.equal(normalizeCourses([{ id: 'a', title: 'A' }, { id: 'b' }]).length, 1);
  });

  it('only trusts a cloudflare source that has a uid', () => {
    const c = normalizeCourse({
      id: 'v',
      title: 'V',
      sections: [{ lessons: [
        { id: 'a', video: { provider: 'cloudflare', videoUid: 'uid123' } },
        { id: 'b', video: { provider: 'cloudflare', videoUid: ' ' } },
      ] }],
    })!;
    assert.deepEqual(c.sections[0].lessons[0].video, { provider: 'cloudflare', videoUid: 'uid123' });
    assert.deepEqual(c.sections[0].lessons[1].video, { provider: 'placeholder' });
  });
});

describe('progress', () => {
  it('summarises only lessons still in the course', () => {
    const progress = { intro: { completedAt: 1 }, removed: { completedAt: 1 } };
    assert.deepEqual(summarizeProgress(course, progress), { completed: 1, total: 3, percent: 33 });
    assert.equal(isCourseComplete(course, progress), false);
    assert.equal(
      isCourseComplete(course, { intro: {}, html: {}, css: {} }),
      true
    );
  });

  it('resumes at the first incomplete lesson, then the last opened one', () => {
    assert.equal(resumeLessonId(course, {}), 'intro');
    assert.equal(resumeLessonId(course, { intro: {} }), 'html');
    assert.equal(resumeLessonId(course, { intro: {}, html: {}, css: {} }, 'html'), 'html');
    assert.equal(resumeLessonId(course, { intro: {}, html: {}, css: {} }, 'gone'), 'intro');
    assert.equal(resumeLessonId({ sections: [] }, {}), null);
  });

  it('finds lessons and their neighbours across sections', () => {
    assert.equal(findLesson(course, 'css')?.index, 2);
    assert.equal(findLesson(course, 'nope'), null);
    const { previous, next } = adjacentLessons(course, 'html');
    assert.equal(previous?.id, 'intro');
    assert.equal(next?.id, 'css');
    assert.deepEqual(adjacentLessons(course, 'nope'), { previous: null, next: null });
  });
});

describe('format', () => {
  it('formats money in rupees', () => {
    assert.equal(formatMoney(null), 'Free');
    assert.equal(formatMoney({ amount: 150000, currency: 'NPR' }), 'Rs 1,500');
    assert.equal(formatMoney({ amount: 15000050, currency: 'NPR' }), 'Rs 1,50,000.50');
  });

  it('produces the exact rupee string eSewa signs', () => {
    assert.equal(toRupeeString(150000), '1500');
    assert.equal(toRupeeString(150050), '1500.50');
    assert.throws(() => toRupeeString(1.5));
  });

  it('formats durations', () => {
    assert.equal(formatDuration(null), '');
    assert.equal(formatDuration(20), '1m');
    assert.equal(formatDuration(45 * 60), '45m');
    assert.equal(formatDuration(2 * 3600 + 5 * 60), '2h 05m');
    assert.equal(formatDuration(3600), '1h');
  });
});
