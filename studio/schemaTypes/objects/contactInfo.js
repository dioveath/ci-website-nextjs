import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactInfo',
  title: 'Contact info',
  type: 'object',
  fields: [
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'phone' },
  },
});
