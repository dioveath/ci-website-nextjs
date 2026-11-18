import { at, defineMigration, set, setIfMissing, unset } from 'sanity/migrate';

/*
 * One-off migration for the switch to digital, self-paced courses.
 *
 *   - `lessons` (a list of plain strings) becomes `sections`: one "Lessons"
 *     section whose lessons get a stable lessonId slug. The first lesson is
 *     marked as a free preview. Review and rename sections afterwards.
 *   - `durationDays` (in-person class length) is removed.
 *   - `listed` defaults to true.
 *
 * Dry run (default), then apply:
 *   npx sanity migration run digital-courses
 *   npx sanity migration run digital-courses --no-dry-run
 *
 * Safe to re-run: courses that already have sections keep them.
 */

const KEY_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
function randomKey() {
  let key = '';
  for (let i = 0; i < 12; i++) key += KEY_ALPHABET[Math.floor(Math.random() * KEY_ALPHABET.length)];
  return key;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .slice(0, 90);
}

function lessonsToSections(titles) {
  const used = new Set();
  const lessons = titles
    .filter((title) => typeof title === 'string' && title.trim())
    .map((title, index) => {
      let lessonId = slugify(title) || `lesson-${index + 1}`;
      if (used.has(lessonId)) lessonId = `${lessonId}-${index + 1}`;
      used.add(lessonId);
      return {
        _type: 'courseLesson',
        _key: randomKey(),
        title: title.trim(),
        lessonId: { _type: 'slug', current: lessonId },
        type: 'video',
        isPreview: index === 0,
      };
    });
  return [{ _type: 'courseSection', _key: randomKey(), title: 'Lessons', lessons }];
}

export default defineMigration({
  title: 'Digital courses: lessons -> sections, drop durationDays',
  documentTypes: ['course'],
  migrate: {
    document(doc) {
      const operations = [];
      if (Array.isArray(doc.lessons)) {
        if (!Array.isArray(doc.sections)) {
          operations.push(at('sections', set(lessonsToSections(doc.lessons))));
        }
        operations.push(at('lessons', unset()));
      }
      if (doc.durationDays !== undefined) operations.push(at('durationDays', unset()));
      operations.push(at('listed', setIfMissing(true)));
      return operations;
    },
  },
});
