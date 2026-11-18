import { defineArrayMember, defineField, defineType } from 'sanity';

// The paid body of one lesson. Lives ONLY in the private "course content"
// dataset, which the website reads on the server with a token after checking
// that the student has bought the course. Never add this type to the public
// workspace: everything in the public dataset can be read by anyone.
export default defineType({
  name: 'lessonContent',
  title: 'Lesson content',
  type: 'document',
  fields: [
    defineField({
      name: 'courseId',
      title: 'Course ID',
      type: 'string',
      description: 'The "Course ID" of the course in the Website workspace.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lessonId',
      title: 'Lesson ID',
      type: 'string',
      description: 'The "Lesson ID" of the lesson inside that course.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description:
        'Article lessons: the article. Video lessons: notes shown under the video.',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
      ],
    }),
  ],
  preview: {
    select: { courseId: 'courseId', lessonId: 'lessonId' },
    prepare: ({ courseId, lessonId }) => ({
      title: lessonId || 'Untitled',
      subtitle: courseId ? `Course ${courseId}` : 'No course',
    }),
  },
});
