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
    defineField({
      name: 'stats',
      title: 'Proof points',
      description: 'The short trust band under the hero. Three or four reads best.',
      type: 'array',
      of: [{ type: 'stat' }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featuredCourses',
      title: 'Featured courses',
      description: 'Shown on the home page. Leave empty to fall back to the newest courses.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'course' }] }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({ name: 'appPromo', title: 'App promotion', type: 'appPromo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
});
