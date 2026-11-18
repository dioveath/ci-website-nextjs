import { defineField, defineType } from 'sanity';

// Keep in sync with lib/courses/ids.ts.
const LESSON_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,95}$/;

// The public outline of one lesson. Its paid body (article text or video
// notes) is a `lessonContent` document in the private "course content"
// workspace, matched by courseId + lessonId.
export default defineType({
  name: 'courseLesson',
  title: 'Lesson',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Lesson title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lessonId',
      title: 'Lesson ID (stable key)',
      type: 'slug',
      description:
        'Used in the lesson URL and to track each student\'s progress. Must be unique within the course. Do NOT change once students have started the course.',
      options: {
        source: (_doc, context) => context.parent?.title,
        maxLength: 96,
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value?.current || LESSON_ID_PATTERN.test(value.current)
              ? true
              : 'Use lowercase letters, digits and dashes only.',
          ),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['video', 'article'], layout: 'radio', direction: 'horizontal' },
      initialValue: 'video',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Duration (minutes)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'isPreview',
      title: 'Free preview',
      type: 'boolean',
      initialValue: false,
      description: 'Anyone can open this lesson without buying the course.',
    }),
    defineField({
      name: 'videoUid',
      title: 'Cloudflare Stream video ID',
      type: 'string',
      hidden: ({ parent }) => parent?.type === 'article',
      description:
        'Leave empty for now: every video lesson plays the placeholder video until Cloudflare Stream is set up.',
    }),
  ],
  preview: {
    select: { title: 'title', type: 'type', isPreview: 'isPreview', minutes: 'durationMinutes' },
    prepare: ({ title, type, isPreview, minutes }) => ({
      title,
      subtitle: [type, minutes ? `${minutes} min` : null, isPreview ? 'free preview' : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
