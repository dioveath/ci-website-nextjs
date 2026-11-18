# Courses — Charicha Institute

Digital, self-paced courses sold online through **eSewa** and **Khalti**.
There are no in-person classes, batches, schedules or attendance.

- [How it fits together](#how-it-fits-together)
- [Going live: checklist](#going-live-checklist)
- [Running it locally](#running-it-locally)
- [Day-to-day operations](#day-to-day-operations)
- [Security model](#security-model)
- [Payments in detail](#payments-in-detail)
- [Video: placeholder now, Cloudflare Stream later](#video-placeholder-now-cloudflare-stream-later)
- [Code map](#code-map)
- [Tests](#tests)

---

## How it fits together

| What | Where | Who can read it | Who writes it |
|---|---|---|---|
| Catalog: courses, sections, lesson titles, prices, free-preview flags | Sanity, **public** dataset | Anyone | Editors in the Studio ("Website" workspace) |
| Paid lesson content: article text, video notes | Sanity, **private** dataset `course-content` | The website's server only (`SANITY_READ_TOKEN`) | Editors ("Course content" workspace) |
| Videos | Placeholder file now; Cloudflare Stream later | Served after an access check | — |
| `orders/{orderId}` | Firestore | The buyer and admins | Server only |
| `enrollments/{courseId}_{uid}`: access plus per-lesson progress | Firestore | The student and admins | Server only |
| `certificates/{id}` | Firestore | Anyone (verifiable links) | Server only |
| Admin role | Firebase Auth custom claim `admin` | Read from the ID token | Server only (`npm run admin`, admin panel) |

A student's journey:

1. **Browse.** `/courses` and `/courses/<id>` are static pages built from the catalog.
2. **Preview.** Lessons marked "Free preview" open for anyone.
3. **Enroll.** Free courses: "Enroll for free". Paid courses: "Pay with Khalti" or "Pay with eSewa".
4. **Pay.** The server creates an `orders` document at the price it reads from Sanity and sends the student to the provider.
5. **Confirm.** The provider sends the student back to `/api/payments/<provider>/return/<orderId>`. The server asks the provider directly whether the order was paid for the exact amount. If so, it marks the order `paid` and creates an `active` enrollment, both in one transaction.
6. **Learn.** `/courses/<id>/learn/<lessonId>` plays the video or shows the article. "Mark as complete" (or reaching the end of a video) records progress.
7. **Certificate.** Completing the last lesson issues a certificate at `/certificates/<id>`, linked from the dashboard and the student's public profile.

Students find their courses on the dashboard's **My Courses** tab.

---

## Going live: checklist

Do these in order. Steps 1–4 and 7 change production systems, so do them deliberately.

1. **Firebase Admin credentials.** In the hosting environment, set `FIREBASE_SERVICE_ACCOUNT`: Firebase Console → Project settings → Service accounts → "Generate new private key", pasted on one line. On Firebase App Hosting or Cloud Run it can be left unset.
2. **Deploy the Firestore rules.**
   ```bash
   firebase deploy --only firestore:rules --project <project-id>
   ```
   Run `npm run test:rules` first. These rules **replace** whatever is live.
3. **Migrate existing users.** This moves contact details out of the public profile and turns `roles.manager` into the admin claim:
   ```bash
   npm run admin -- migrate-users          # dry run: review the output
   npm run admin -- migrate-users --apply
   ```
4. **Make sure at least one admin exists.**
   ```bash
   npm run admin -- list-admins
   npm run admin -- set-admin you@example.com
   ```
   Admins must sign out and back in once to pick up the role.
5. **Sanity.**
   - Run the course migration: `cd studio && npm run migrate:digital-courses`, then the same with `-- --no-dry-run`.
   - Create the private dataset: `npx sanity dataset create course-content --visibility private`.
   - Create a **Viewer** API token and set it as `SANITY_READ_TOKEN`.
   - Deploy the Studio (`npm run deploy`). It now has two workspaces.
   - Review each course: sections, lesson IDs, free previews and price.
6. **Payments, still in sandbox.** Set `SITE_URL` to the public origin and add `KHALTI_SECRET_KEY` (sandbox key from test-admin.khalti.com). eSewa's sandbox works with its public test merchant. Buy a course end to end with each provider's test accounts.
7. **Go live.** Set `PAYMENTS_ENV=live`, `ESEWA_PRODUCT_CODE`, `ESEWA_SECRET_KEY` and the live `KHALTI_SECRET_KEY`. Redeploy and make one small real purchase per provider.

---

## Running it locally

```bash
npm run dev:emulators     # site on :3000, Emulator UI on :4000, no credentials needed
```

Sign in with the emulator's fake Google screen. To make that account an admin, use the same emulator ports:

```bash
npm run admin:emulators -- set-admin you@example.com
```

Without Sanity configured, the bundled sample catalog is used: course 1 is free and the others are paid. eSewa checkout works against eSewa's real sandbox. eSewa test logins are in eSewa's developer docs; Khalti needs `KHALTI_SECRET_KEY` in `.env.local`.

---

## Day-to-day operations

All of this is in **Admin panel → Manage Courses**:

- **Orders.** Every checkout with its status. A `pending` order that the student says they paid for can be re-checked with the provider ("Re-check"). Pending orders are also re-checked automatically whenever the student opens the course page or My Courses.
- **Enrollments.** Who has which course and how they got it (purchased, free, or granted). "Revoke" ends access. "Refunded" ends access and marks the order refunded.
  - **Refunds move no money.** Return the money from the eSewa or Khalti merchant dashboard.
- **Grant access.** Gives a course to a student by email, for example after a bank transfer or as a scholarship. The student must have signed in once.

**Manage Users** lists every account and toggles the admin role. Admins cannot remove their own role.

Course content, prices and visibility are edited in the **Sanity Studio**:

- **Price** is in rupees. Leave it empty for a free course. Khalti's minimum is Rs 10.
- **Listed** off: the course stops being sold and disappears from `/courses`. Existing students keep access.
- **Course ID and Lesson ID** are permanent keys for purchases and progress. Never change them once a course has sold.
- **Removing a lesson** simply drops it from everyone's progress count.

---

## Security model

- **The browser never writes anything that grants access or records money.** Enrollments, orders, certificates and roles are written only by the server (Firebase Admin SDK). `firestore.rules` denies those writes to every client, admins included.
- **Every server action is a public endpoint and checks for itself.** It verifies the caller's Firebase ID token (`lib/server/authz.ts`). Admin actions also reject revoked sessions.
- **Roles live only in the `admin` custom claim.** The `roles` field on a profile is a display copy written by the server.
- **The server decides prices.** The amount comes from Sanity (bypassing the CDN) when the order is created. It is stored on the order, and payment confirmation checks the provider's amount against it.
- **Paid content stays private.** It is never in the public Sanity dataset. Lesson content is returned only after the access check. Free previews are the exception, by design.
- **Contact details are private.** Email, phone and address are in `ci_users/{uid}/private/contact`, readable by the user and admins only. Public profiles hold names, photos and points.
- **No sample-catalog fallback once Sanity is configured.** Course lookups do not fall back to the bundled sample catalog, so a Sanity outage can never sell sample courses at sample prices.

---

## Payments in detail

`lib/server/orders.ts` and `lib/server/payments/`.

| | eSewa (ePay v2) | Khalti (KPG-2) |
|---|---|---|
| Start | Signed form POSTed by the browser. HMAC-SHA256 over `total_amount,transaction_uuid,product_code`. | Server calls `epayment/initiate/` (amount in paisa) and redirects to `payment_url`. |
| Order reference | Our order id = `transaction_uuid` | Our order id = `purchase_order_id`; `pidx` stored on the order |
| Confirm | `GET …/transaction/status/` with **our stored** amount | `POST epayment/lookup/` with the stored `pidx` |
| Paid when | `COMPLETE` and the amount matches | `Completed` and the amount matches |
| Sandbox | `rc-epay.esewa.com.np` / `rc.esewa.com.np`, merchant `EPAYTEST` | `dev.khalti.com` |

Rules that hold for both:

- **Redirect parameters are never trusted.** eSewa's `data` and Khalti's query string are ignored; the order is always checked server to server.
- **Settlement is idempotent.** A paid order is never re-checked. The order update and the enrollment are one transaction.
- **Unfinished orders close.** An order the student never paid closes as `failed` when they cancel, or after 30 minutes.
- **Outages don't decide anything.** If the provider can't be reached, the order stays `pending`; it is never marked paid or failed on a guess.
- **Late confirmations are caught.** A student who paid but closed the tab gets access the next time they open the course or My Courses.

Endpoints can be overridden with `ESEWA_FORM_URL`, `ESEWA_STATUS_URL` and `KHALTI_API_URL`.

The eSewa sandbox endpoints and signature were checked against the live sandbox: a correctly signed form is accepted, and a tampered signature is rejected with `ES104 Invalid payload signature`.

---

## Video: placeholder now, Cloudflare Stream later

Every video lesson plays `public/videos/placeholder-lesson.mp4`. The page shows a note that the real video is being produced.

To switch to Cloudflare Stream:

1. Upload videos to Stream with **"Require signed URLs"** on.
2. Put each video's uid in the lesson's **Cloudflare Stream video ID** field in the Studio. Until step 3 is done, those lessons keep playing the placeholder.
3. Implement `resolvePlayback` in `lib/server/content.ts` (the steps are documented there). It should issue a short-lived token for `{ provider: 'cloudflare' }` sources and return the HLS URL with its expiry. `react-player` plays HLS without other changes.

---

## Code map

```
types/courses.ts                    all course, order, enrollment and action types
lib/courses/                        pure helpers: ids, progress, formatting, catalog normalising
lib/server/                         server only ('server-only')
  firebaseAdmin.ts                  Admin SDK (emulators / service account / ADC)
  authz.ts                          ID-token verification, admin checks
  actions.ts, errors.ts             ActionResult wrapper and typed failures
  catalog.ts                        the catalog as the server trusts it
  content.ts                        private lesson bodies, video playback
  enrollments.ts                    access, progress, certificates
  orders.ts                         checkout, settlement, reconciliation
  payments/                         eSewa and Khalti gateways
  roles.ts, courseAdmin.ts          admin role and course administration
app/courses/actions.ts              student server actions
app/admin/actions.ts                admin: users and roles
app/admin/courseActions.ts          admin: orders, enrollments, grants
app/api/payments/[provider]/return/[orderId]/route.ts   provider redirect target
app/courses/[id]/learn/[lessonId]/  lesson player
app/certificates/[id]/              public certificate
components/course/                  course card, curriculum, enroll/buy box, progress
app/dashboard/_my-courses, app/admin/{Course,User}Management.tsx   dashboard and admin tabs
scripts/admin.ts                    admin CLI (roles, user migration)
firestore.rules                     production rules (tested)
studio/                             Sanity schemas, migration, two workspaces
```

---

## Tests

```bash
npm test                  # unit: helpers, eSewa signature, status mapping
npm run test:rules        # Firestore rules on the emulator
npm run test:integration  # real server actions on the Auth/Firestore emulators,
                          # with eSewa/Khalti HTTP faked
npm run typecheck && npm run lint
```

`test:rules` and `test:integration` start their own emulators on separate ports (`emulators/firebase.test.json`), so they can run while `npm run dev:emulators` is up.
