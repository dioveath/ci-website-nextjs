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

export const homePageFallback = {
  hero: {
    title: 'Start your Tech Journey!',
    subtitle:
      'Welcome to Charicha Institute, a premier computer training institute offering expert-led courses for all levels. Our team of qualified instructors and state-of-the-art facilities are dedicated to helping you succeed in the tech industry. Explore our course catalog and sign up for a class today.',
    ctaLabel: 'Join Us',
    ctaLink: '/login',
  },
  featureVideoUrl: 'https://www.youtube.com/watch?v=lvWUO2YTe-M',
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
    "Thank you for visiting our website. If you have any questions or would like to schedule a tour of our facilities, please don't hesitate to reach out to us.",
  contact: {
    phone: '+977 9817-388966',
    email: 'charichainstitute@gmail.com',
    address: 'Belbari - 11, Laxmimarga',
  },
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14263.539457521121!2d87.4492403!3d26.6521686!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xec11a5cb93e0fac1!2sCharicha%20Institute!5e0!3m2!1sen!2suk!4v1672662347634!5m2!1sen!2suk',
};

// Courses and services, used when Sanity has none.
export const coursesFallback = [
  {
    id: "1",
    level: "Beginner",
    title: "Computer Basics",
    thumbImg: "/george.jpg",
    coverImg: "/george.jpg",
    lessons: [
      "Diam quis", 
      "enim lobortis", 
      "scelerisque", 
      "fermentum", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula"
    ],
    description: "Pellentesque id nibh tortor, id aliquet! Lacinia at quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit, scelerisque in dictum non, consectetur a.",
    time: 56  // in days
  },

  {
    id: "2",
    level: "Beginner",
    title: "Advance Basics",
    thumbImg: "/george.jpg",    
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },

  {
    id: "3",
    level: "Beginner",
    title: "Office Basics",
    thumbImg: "/george.jpg",    
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },

  {
    id: "4",
    level: "Intermediate",
    title: "Computer Operator",
    thumbImg: "/george.jpg",    
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },   


  {
    id: "5",
    level: "Intermediate",
    title: "Lok Shewa Preparation",
    thumbImg: "/george.jpg",    
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },

  {
    id: "6",
    level: "Intermediate",
    title: "Accounting Package",
    thumbImg: "/george.jpg",    
    coverImg: "/computer_course_cover_2.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },

  {
    id: "7",
    level: "Advance",
    title: "Introduction to Programming",
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },

  {
    id: "8",
    level: "Advance",
    title: "Web Development",
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },

  {
    id: "9",
    level: "Advance",
    title: "Flutter Mobile Development",
    coverImg: "/george.jpg",
    lessons: [
      "fermentum", 
      "scelerisque", 
      "Diam quis",
      "volutpat maecenas",
      "enim lobortis", 
      "dui faucibus", 
      "Nulla facilisi",
      "nullam vehicula",
      "Pellentesque id",
    ],
    description: "Bibendum enim, facilisis gravida neque convallis a cras? Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc, consequat interdum varius sit amet, mattis vulputate.",
    time: 68  // in days
  },   
     
];

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
