import groq from 'groq';

// Projections are shaped to match the legacy hardcoded objects exactly, so the
// existing components (CourseCard, ServiceCard, course detail page) need no
// changes. `coverImg` coalesces to a local /public asset when no image is set.

export const coursesQuery = groq`
  *[_type == "course"] | order(order asc) {
    "id": courseId,
    level,
    title,
    "coverImg": coalesce(coverImage.asset->url, "/george.jpg"),
    lessons,
    description,
    "time": durationDays
  }
`;

export const courseByIdQuery = groq`
  *[_type == "course" && courseId == $id][0] {
    "id": courseId,
    level,
    title,
    "coverImg": coalesce(coverImage.asset->url, "/george.jpg"),
    lessons,
    description,
    "time": durationDays
  }
`;

export const courseIdsQuery = groq`*[_type == "course" && defined(courseId)].courseId`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    title,
    description
  }
`;

// Footer pulls site settings + the footer link list from the navigation doc.
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    orgName,
    footerDescription,
    contact,
    partners,
    playStoreLink,
    copyright,
    "footerLinks": *[_type == "navigation"][0].footerLinks
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero,
    featureVideoUrl,
    stories,
    appPromo
  }
`;

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    title,
    description,
    contact,
    mapEmbedUrl
  }
`;

// Header navigation for the global <Navbar>.
export const navigationQuery = groq`
  *[_type == "navigation"][0]{
    headerLinks
  }
`;

// Editorial blog posts (merged with Firebase user articles on /blog). The list
// projection is flattened so the blog page can normalise it alongside Firebase
// articles; `coverImg`/`authorImg` coalesce to local /public assets.
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    excerpt,
    "coverImg": coalesce(coverImage.asset->url, "/charichatower.jpg"),
    "authorName": coalesce(authorName, "Charicha Institute"),
    "authorImg": coalesce(authorImage.asset->url, "/ci_logo_light_blue.png"),
    "category": coalesce(category, "Tech"),
    publishedAt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    excerpt,
    "coverImg": coalesce(coverImage.asset->url, null),
    "authorName": coalesce(authorName, "Charicha Institute"),
    "authorImg": coalesce(authorImage.asset->url, "/ci_logo_light_blue.png"),
    "category": coalesce(category, "Tech"),
    publishedAt,
    body
  }
`;

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)].slug.current`;
