import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'courseSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [defineArrayMember({ type: 'courseLesson' })],
    }),
  ],
  preview: {
    select: { title: 'title', lessons: 'lessons' },
    prepare: ({ title, lessons }) => ({
      title,
      subtitle: `${lessons?.length ?? 0} lessons`,
    }),
  },
});
