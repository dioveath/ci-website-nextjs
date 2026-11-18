import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stat',
  title: 'Statistic',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'Shown large, e.g. "1,200+" or "12".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Shown small underneath, e.g. "Students trained".',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
});
