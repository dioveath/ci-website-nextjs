import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import PageShell from '@/components/layout/PageShell';
import Section from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCertificate } from '@/lib/certificates';

// Certificates never change once issued.
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const certificate = await getCertificate(id);
  // The root layout's title template appends the site name.
  return {
    title: certificate
      ? `${certificate.studentName} completed ${certificate.courseTitle}`
      : 'Certificate'
  };
}

export default async function CertificatePage({ params }: Params) {
  const { id } = await params;
  const certificate = await getCertificate(id);
  if (!certificate) notFound();

  const issued = new Date(certificate.issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <PageShell>
      <Section tone="muted" width="narrow">
        <Card>
          <CardContent>
            <article className="flex flex-col items-center gap-5 py-6 text-center">
              <Image src="/ci_logo_light_blue.png" alt="Charicha Institute" width={96} height={96} />
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Certificate of completion
              </p>
              <p className="text-muted-foreground">This certifies that</p>
              <h1 className="text-3xl font-semibold tracking-tight text-card-foreground md:text-5xl">
                {certificate.studentName}
              </h1>
              <p className="text-muted-foreground">has successfully completed the course</p>
              <h2 className="text-2xl font-semibold text-primary md:text-3xl">{certificate.courseTitle}</h2>
              <p className="text-muted-foreground">at Charicha Institute on {issued}.</p>

              <Separator className="mt-4" />
              <div className="flex w-full flex-wrap justify-between gap-2 text-sm text-muted-foreground">
                <span>Certificate ID: {certificate.id}</span>
                <Link
                  href={`/courses/${certificate.courseId}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  About this course
                </Link>
              </div>
            </article>
          </CardContent>
        </Card>
      </Section>
    </PageShell>
  );
}
