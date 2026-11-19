import type { RawCourse, RawLesson } from '../courses/catalog';

// Static fallbacks for the singleton documents. These mirror the original
// hardcoded copy so the site renders identically when Sanity is unconfigured,
// empty, or unreachable.

export const siteSettingsFallback = {
  orgName: 'Charicha Institute',
  footerDescription:
    'Charicha Institute helps interested students to learn and use their computer skills from basic courses to advanced courses like programming in real world. Come join us and grow.',
  contact: {
    phone: '+977 981-7388966',
    email: 'charichainstitute@gmail.com',
    address: 'Belbari - 11, Morang',
  },
  partners: [
    { label: 'Charicha Productions', href: '#' },
    { label: 'Charicha Gaming', href: 'https://chcgaming.azurewebsites.net' },
  ],
  footerLinks: [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
  ],
  playStoreLink:
    'https://play.google.com/store/apps/dev?id=8427452924742673238',
  copyright: 'Charicha Institute © All Rights Reserved',
};

// Courses: the bundled catalog used when Sanity is not configured (see
// SANITY.md), defined before homePageFallback, which features its first three. It
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

export const coursesFallback: RawCourse[] = [
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

export const homePageFallback = {
  hero: {
    title: 'Start your Tech Journey!',
    subtitle:
      'Welcome to Charicha Institute, a premier computer training institute offering expert-led courses for all levels. Our team of qualified instructors and state-of-the-art facilities are dedicated to helping you succeed in the tech industry. Explore our course catalog and sign up for a class today.',
    ctaLabel: 'Join Us',
    ctaLink: '/login',
  },
  featureVideoUrl: 'https://www.youtube.com/watch?v=lvWUO2YTe-M',
  // Shown in the hero's trust band. Edited in the Studio under Home Page.
  stats: [
    { value: '10+', label: 'Years teaching' },
    { value: '1,500+', label: 'Students trained' },
    { value: '20+', label: 'Courses offered' },
    { value: '6', label: 'Days a week open' },
  ],
  // The first three of the static course list, so the home page still shows a
  // courses section before an editor has picked any -- the same way every
  // other CMS-backed section falls back rather than disappearing.
  featuredCourses: coursesFallback.slice(0, 3),
  stories: [
    {
      title: 'How it all started?',
      body: 'Initially, Charicha Institute was established in a garage with bunch of friends taking over computer parts. Charicha Institute has now paved its path through hardships & efforts to a great Company. Now, Charicha Institute is turning over thousands in a year. This is our success story.',
      videoUrl: 'https://www.youtube.com/watch?v=ymth0TSHuvU&t=1s',
    },
    {
      title: 'Moments in Charicha Institute',
      body: "You many also get great experiences, including celebrating festivals and spending enjoyable evenings together. Our company's success is a result of the hard work, dedication, and perseverance of everyone involved. We continue to work towards continued success and growth in the future. We thank Madan Gurung for this great evening.",
      videoUrl: 'https://www.youtube.com/watch?v=32mWaj4o6Z4',
    },
  ],
  appPromo: {
    title: 'Find us in PlayStore',
    subtitle: 'Enter your email id for the download link',
    ctaLabel: 'Send Link',
    badgeLink:
      'https://play.google.com/store/apps/dev?id=8427452924742673238&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1',
  },
};

// Header links for the global <Navbar>. Must match the previously hardcoded
// menu so the server / first client render is identical (no hydration mismatch)
// before CMS data swaps in after mount.
export const navigationFallback = {
  headerLinks: [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
};

export const contactPageFallback = {
  title: 'Contact Us',
  description:
    "Thank you for visiting our website. If you have any questions about our courses, please don't hesitate to reach out to us.",
  contact: {
    phone: '+977 9817-388966',
    email: 'charichainstitute@gmail.com',
    address: 'Belbari - 11, Laxmimarga',
  },
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14263.539457521121!2d87.4492403!3d26.6521686!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xec11a5cb93e0fac1!2sCharicha%20Institute!5e0!3m2!1sen!2suk!4v1672662347634!5m2!1sen!2suk',
};


// Services, used when Sanity has none.
export const servicesFallback = [
  {
    title: 'Computer training courses',
    description: 'These may include beginner, intermediate, and advanced courses in various computer software and operating systems.'
  },
  {
    title: 'Certification exam preparation',
    description: 'Many computer institutes offer training and resources to help students prepare for industry-recognized certification exams.'
  },
  {
    title: 'Computer repair and maintenance services',
    description: 'These services can include hardware and software troubleshooting, as well as repairs and maintenance for computers and other electronic devices.'
  },
  {
    title: 'Network and security consulting',
    description: 'Computer institutes may offer services to help businesses and organizations set up and secure their networks and protect against cyber threats.'
  },
  {
    title: 'Web design and development services',
    description: 'These services may include the design and development of websites, as well as search engine optimization and digital marketing.'
  },
  {
    title: 'Data recovery and backup services',
    description: 'Computer institutes may offer services to help individuals and organizations recover lost or damaged data, as well as implement backup solutions to protect against data loss.'
  }
];
