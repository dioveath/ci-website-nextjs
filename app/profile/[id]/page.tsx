import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, Heart } from 'lucide-react';

import PageShell from '../../../components/layout/PageShell';
import Section from '../../../components/layout/Section';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

import { getCourses } from '@/lib/sanity/fetchers';
import { getUser } from '@/lib/users';
import type { UserData } from '../../../types';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'A Charicha Institute student profile.',
  // Per-visitor personal data; robots.ts disallows the path as well.
  robots: { index: false, follow: false }
};

// getStaticPaths returned no paths with fallback:"blocking"; the App Router
// equivalent is an empty generateStaticParams with dynamicParams left on.
export async function generateStaticParams() {
  return [];
}

function UserNotFound() {
  return (
    <Section space="lg">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Error 404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          We couldn&apos;t find that student
        </h1>
        <p className="max-w-md text-muted-foreground">
          The profile may have been removed, or the link may be out of date.
        </p>
        <Button asChild size="xl">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Section>
  );
}

function StatCard({
  Icon,
  value,
  label
}: {
  Icon: typeof Heart;
  value: string | number;
  label: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3">
          <Icon className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="flex flex-col">
            <span className="text-lg font-semibold text-card-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// courseTitles comes from getCourses(), so enrolled courses show their CMS
// titles (falling back to the static list), looked up by id.
function ProfileView({ userData, courseTitles }: { userData: UserData; courseTitles: Map<string, string> }) {
  const joined = userData.joined_at ? new Date(userData.joined_at) : null;
  // `roles` is a { roleName: boolean } map, not an array.
  const activeRoles = Object.keys(userData.roles ?? {}).filter((role) => userData.roles[role]);
  const enrolledCourseIds = Object.keys(userData.courses ?? {});
  const name = [userData.first_name, userData.last_name].filter(Boolean).join(' ');

  return (
    <>
      <Section tone="brand" space="sm" as="div">
        <div className="flex flex-wrap items-center gap-6">
          <Image
            src={userData.profile_URL || '/profile.jpg'}
            alt=""
            width={112}
            height={112}
            className="size-28 rounded-full border-4 border-on-brand/30 object-cover"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-on-brand md:text-4xl">
              {name || 'Charicha student'}
            </h1>
            {joined ? (
              <p className="text-on-brand-muted">
                Member since{' '}
                <time dateTime={joined.toISOString()}>
                  {joined.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </time>
              </p>
            ) : null}
            {activeRoles.length ? (
              <ul className="mt-1 flex flex-wrap gap-2">
                {activeRoles.map((role) => (
                  <li key={role}>
                    <Badge variant="on-brand">{role}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <StatCard Icon={Heart} value={userData.hearts ?? 0} label="Hearts" />
          <StatCard Icon={Eye} value={userData.profile_visits ?? 0} label="Profile visits" />
          <StatCard Icon={Clock} value={userData.exp_points ?? 0} label="Experience points" />
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">
          Courses enrolled
        </h2>

        {enrolledCourseIds.length ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {enrolledCourseIds.map((courseId) => (
              <li key={courseId}>
                <Badge variant="secondary">{courseTitles.get(String(courseId)) ?? `Course ${courseId}`}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-muted-foreground">No courses enrolled yet.</p>
        )}
      </Section>
    </>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [userData, courses] = await Promise.all([getUser(id).catch(() => null), getCourses()]);
  const courseTitles = new Map(courses.map((c) => [String(c.id), c.title]));

  return (
    <PageShell>
      {userData ? <ProfileView userData={userData} courseTitles={courseTitles} /> : <UserNotFound />}
    </PageShell>
  );
}
