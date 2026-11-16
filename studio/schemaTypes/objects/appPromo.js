import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'appPromo',
  title: 'App promotion',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string' }),
    defineField({ name: 'badgeLink', title: 'Store link', type: 'url' }),
    defineField({
      name: 'appImage',
      title: 'App screenshot',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
