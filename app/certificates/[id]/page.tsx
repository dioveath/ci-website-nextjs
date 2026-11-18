import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer/Footer';
import { CertificateService } from '../../../lib/service/CertificateService';

// Certificates never change once issued.
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const certificate = await CertificateService.getCertificate(id);
  return {
    title: certificate
      ? `${certificate.studentName} completed ${certificate.courseTitle} | Charicha Institute`
      : 'Certificate | Charicha Institute',
  };
}

export default async function CertificatePage({ params }: Params) {
  const { id } = await params;
  const certificate = await CertificateService.getCertificate(id);
  if (!certificate) notFound();

  const issued = new Date(certificate.issuedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-slategray min-h-screen">
      <Navbar />
      <main className="px-4 py-12 flex justify-center">
        <article className="w-full max-w-3xl rounded-xl bg-white text-timbergreen shadow-2xl border-8 border-eggblue p-8 lg:p-14 flex flex-col items-center gap-5 text-center">
          <Image src="/ci_logo_light_blue.png" alt="Charicha Institute" width={96} height={96} />
          <p className="uppercase tracking-widest text-pinegreen">Certificate of completion</p>
          <p className="text-gray-600">This certifies that</p>
          <h1 className="text-3xl lg:text-5xl font-bold">{certificate.studentName}</h1>
          <p className="text-gray-600">has successfully completed the course</p>
          <h2 className="text-2xl lg:text-3xl font-semibold text-pinegreen">{certificate.courseTitle}</h2>
          <p className="text-gray-600">at Charicha Institute on {issued}.</p>
          <div className="w-full border-t border-gray-300 pt-4 mt-4 flex flex-wrap justify-between gap-2 text-sm text-gray-500">
            <span>Certificate ID: {certificate.id}</span>
            <Link href={`/courses/${certificate.courseId}`} className="text-pinegreen hover:underline">
              About this course
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
