import type { RawCourse, RawLesson } from '../../lib/courses/catalog';

// Bundled catalog used when Sanity is not configured (see SANITY.md). It
// mirrors the courses in seed/seed.ndjson, in the shape the GROQ projection in
// lib/sanity/queries.ts returns. Titles, lessons and prices are samples:
// replace them in the Studio.

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-');
}

// Same outline as the seed: the first three lessons are 'Getting started',
// the first lesson is a free preview, and the last one is an article.
function course(input: {
  id: string;
  slug: string;
  title: string;
  level: string;
  priceNpr: number;
  description: string;
  lessons: string[];
}): RawCourse {
  const lessons: RawLesson[] = input.lessons.map((title, index) => {
    const type = index === input.lessons.length - 1 ? 'article' : 'video';
    return {
      id: slugify(title),
      title,
      type,
      durationSec: (6 + ((index * 7) % 12)) * 60,
      isPreview: index === 0,
      video: type === 'video' ? { provider: 'placeholder' } : null,
    };
  });
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    level: input.level,
    coverImg: '/george.jpg',
    description: input.description,
    price: input.priceNpr > 0 ? { amount: input.priceNpr * 100, currency: 'NPR' } : null,
    listed: true,
    prerequisiteIds: [],
    sections: [
      { key: 's1', title: 'Getting started', lessons: lessons.slice(0, 3) },
      { key: 's2', title: 'Core lessons', lessons: lessons.slice(3) },
    ],
  };
}

export const coursesList: RawCourse[] = [
  course({
    id: '1',
    slug: 'computer-basics',
    title: 'Computer Basics',
    level: 'Beginner',
    priceNpr: 0,
    description: 'Pellentesque id nibh tortor, id aliquet! Lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit, scelerisque in dictum non, consectetur a.',
    lessons: ['Diam quis', 'Enim lobortis', 'Scelerisque', 'Fermentum', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula'],
  }),
  course({
    id: '2',
    slug: 'advance-basics',
    title: 'Advance Basics',
    level: 'Beginner',
    priceNpr: 1500,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '3',
    slug: 'office-basics',
    title: 'Office Basics',
    level: 'Beginner',
    priceNpr: 1500,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '4',
    slug: 'computer-operator',
    title: 'Computer Operator',
    level: 'Intermediate',
    priceNpr: 2500,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '5',
    slug: 'lok-shewa-preparation',
    title: 'Lok Shewa Preparation',
    level: 'Intermediate',
    priceNpr: 3000,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '6',
    slug: 'accounting-package',
    title: 'Accounting Package',
    level: 'Intermediate',
    priceNpr: 3500,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '7',
    slug: 'introduction-to-programming',
    title: 'Introduction to Programming',
    level: 'Advance',
    priceNpr: 4000,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '8',
    slug: 'web-development',
    title: 'Web Development',
    level: 'Advance',
    priceNpr: 5000,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
  course({
    id: '9',
    slug: 'flutter-mobile-development',
    title: 'Flutter Mobile Development',
    level: 'Advance',
    priceNpr: 5000,
    description: 'Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.',
    lessons: ['Fermentum', 'Scelerisque', 'Diam quis', 'Volutpat maecenas', 'Enim lobortis', 'Dui faucibus', 'Nulla facilisi', 'Nullam vehicula', 'Pellentesque id'],
  }),
];
