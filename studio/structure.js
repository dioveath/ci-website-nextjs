// Desk structure: pin the four singletons as single editable documents,
// and list the repeatable Course / Service documents below a divider.
const SINGLETONS = [
  { id: 'siteSettings', title: 'Site Settings', schemaType: 'siteSettings' },
  { id: 'homePage', title: 'Home Page', schemaType: 'homePage' },
  { id: 'contactPage', title: 'Contact Page', schemaType: 'contactPage' },
  { id: 'navigation', title: 'Navigation', schemaType: 'navigation' },
];

const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.schemaType));

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      ...SINGLETONS.map(({ id, title, schemaType }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(schemaType).documentId(id)),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId()),
      ),
    ]);
