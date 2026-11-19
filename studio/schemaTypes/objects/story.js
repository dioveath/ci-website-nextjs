import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'story',
  title: 'Story',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'videoUrl' },
  },
});
