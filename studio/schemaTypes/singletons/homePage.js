import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({
      name: 'featureVideoUrl',
      title: '"See us in Action" video URL',
      type: 'url',
    }),
    defineField({
      name: 'stories',
      title: 'Stories',
      type: 'array',
      of: [{ type: 'story' }],
    }),
    defineField({ name: 'appPromo', title: 'App promotion', type: 'appPromo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
});
