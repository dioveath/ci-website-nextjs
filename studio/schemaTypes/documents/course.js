import { defineArrayMember, defineField, defineType } from 'sanity';

// Keep in sync with lib/courses/ids.ts. Course ids may not contain "_":
// enrollments are stored as `${courseId}_${uid}`.
const COURSE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

// A digital, self-paced course. This document is in the PUBLIC dataset, so it
// holds only what anyone may see: the outline, lesson titles and the price.
// Paid lesson bodies live in the private "course content" workspace.
export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'curriculum', title: 'Curriculum' },
    { name: 'sales', title: 'Pricing & visibility' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'courseId',
      title: 'Course ID (stable key)',
      type: 'string',
      group: 'details',
      description:
        'Used in course URLs (/courses/<id>) and in every purchase, enrollment and certificate. Lowercase letters, digits and dashes. Do NOT change once the course has been sold.',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || COURSE_ID_PATTERN.test(value)
              ? true
              : 'Use lowercase letters, digits and dashes only (no spaces or underscores).',
          ),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'details',
      options: {
        list: ['Beginner', 'Intermediate', 'Advance'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'details',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'details',
      rows: 4,
    }),
    defineField({
      name: 'prerequisites',
      title: 'Recommended before this course',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'course' }] })],
      description: 'Shown on the course page. Not enforced.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'curriculum',
      of: [defineArrayMember({ type: 'courseSection' })],
      validation: (rule) =>
        rule.custom((sections) => {
          // Lesson ids key each student's progress, so they must be unique
          // across the whole course, not just within a section.
          const seen = new Set();
          for (const section of sections ?? []) {
            for (const lesson of section.lessons ?? []) {
              const id = lesson.lessonId?.current;
              if (!id) continue;
              if (seen.has(id)) return `Lesson ID "${id}" is used more than once in this course.`;
              seen.add(id);
            }
          }
          return true;
        }),
    }),
    defineField({
      name: 'price',
      title: 'Price (NPR)',
      type: 'number',
      group: 'sales',
      description:
        'In rupees. Leave empty or 0 for a free course. Khalti cannot charge less than Rs 10.',
      validation: (rule) =>
        rule
          .integer()
          .min(0)
          .custom((value) =>
            !value || value >= 10 ? true : 'Paid courses must cost at least Rs 10.',
          ),
    }),
    defineField({
      name: 'listed',
      title: 'Listed on /courses',
      type: 'boolean',
      group: 'sales',
      initialValue: true,
      description:
        'Turn off to stop selling the course. Students who already bought it keep access.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      group: 'details',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', level: 'level', price: 'price', media: 'coverImage' },
    prepare: ({ title, level, price, media }) => ({
      title,
      subtitle: [level, price ? `Rs ${price}` : 'Free'].filter(Boolean).join(' · '),
      media,
    }),
  },
});
