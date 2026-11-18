import groq from 'groq';

// Course projections return the RawCourse shape (lib/courses/catalog.ts);
// fetchers run every result through normalizeCourse. Prices are stored in the
// Studio in rupees and returned in paisa. A video lesson with no Cloudflare
// video uid plays the placeholder video.
const courseProjection = `{
  "id": courseId,
  "slug": slug.current,
  title,
  level,
  "coverImg": coalesce(coverImage.asset->url, "/george.jpg"),
  description,
  "price": select(price > 0 => { "amount": price * 100, "currency": "NPR" }, null),
  "listed": coalesce(listed, true),
  "prerequisiteIds": coalesce(prerequisites[]->courseId, []),
  "sections": coalesce(sections[]{
    "key": _key,
    title,
    "lessons": coalesce(lessons[]{
      "id": lessonId.current,
      title,
      "type": coalesce(type, "video"),
      "durationSec": durationMinutes * 60,
      "isPreview": coalesce(isPreview, false),
      "video": select(
        type == "article" => null,
        defined(videoUid) => { "provider": "cloudflare", videoUid },
        { "provider": "placeholder" }
      )
    }, [])
  }, [])
}`;

// The public catalog: unlisted courses are hidden here but still resolvable
// by id, so students who bought them keep access.
export const coursesQuery = groq`
  *[_type == "course" && defined(courseId) && coalesce(listed, true)] | order(order asc) ${courseProjection}
`;

export const courseByIdQuery = groq`
  *[_type == "course" && courseId == $id][0] ${courseProjection}
`;

export const coursesByIdsQuery = groq`
  *[_type == "course" && courseId in $ids] ${courseProjection}
`;

// Every course, listed or not (admin panel).
export const allCoursesQuery = groq`
  *[_type == "course" && defined(courseId)] | order(order asc) ${courseProjection}
`;

export const courseIdsQuery = groq`*[_type == "course" && defined(courseId)].courseId`;

// Private "course content" dataset: the paid body of one lesson.
export const lessonContentQuery = groq`
  *[_type == "lessonContent" && courseId == $courseId && lessonId == $lessonId][0]{ body }
`;

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
    stats,
    appPromo,
    // Editor-picked featured courses, in the same RawCourse shape as
    // coursesQuery (getHomePage normalises them), so <CourseCard> needs no
    // second variant. Falls back to the first three listed courses by order
    // when the editor has chosen none; unlisted courses are never featured.
    "featuredCourses": coalesce(
      featuredCourses[]->[defined(courseId) && coalesce(listed, true)] ${courseProjection},
      *[_type == "course" && defined(courseId) && coalesce(listed, true)] | order(order asc) [0...3] ${courseProjection}
    )
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
