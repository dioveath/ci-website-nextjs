import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 4 }),
    defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string' }),
    defineField({ name: 'ctaLink', title: 'CTA link', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Illustration',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
