import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'headerLinks',
      title: 'Header links',
      type: 'array',
      of: [{ type: 'navLink' }],
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer links',
      type: 'array',
      of: [{ type: 'navLink' }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
});
