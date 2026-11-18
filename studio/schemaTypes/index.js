// Document types (repeatable)
import course from './documents/course';
import service from './documents/service';
import post from './documents/post';

// Singletons (one document each)
import siteSettings from './singletons/siteSettings';
import homePage from './singletons/homePage';
import contactPage from './singletons/contactPage';
import navigation from './singletons/navigation';

// Reusable object types
import hero from './objects/hero';
import story from './objects/story';
import appPromo from './objects/appPromo';
import contactInfo from './objects/contactInfo';
import navLink from './objects/navLink';
import courseSection from './objects/courseSection';
import courseLesson from './objects/courseLesson';

// Private "course content" workspace only (see sanity.config.js)
import lessonContent from './content/lessonContent';

export const schemaTypes = [
  // documents
  course,
  service,
  post,
  // singletons
  siteSettings,
  homePage,
  contactPage,
  navigation,
  // objects
  hero,
  story,
  appPromo,
  contactInfo,
  navLink,
  courseSection,
  courseLesson,
];

// Schema for the private dataset that holds paid lesson bodies.
export const contentSchemaTypes = [lessonContent];
