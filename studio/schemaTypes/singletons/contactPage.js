import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'contact', title: 'Contact', type: 'contactInfo' }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps embed URL',
      type: 'url',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
});
