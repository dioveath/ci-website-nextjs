'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone } from 'lucide-react';

import Logo from '../brand/Logo';
import Container from '../layout/Container';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/lib/sanity/hooks';

function FooterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'text-sm transition-colors hover:text-foreground',
        active ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  );
}

function LinkColumn({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname() ?? '/';
  const settings = useSiteSettings();
  const contact = settings.contact ?? {};

  const details = [
    { Icon: Phone, value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : undefined },
    { Icon: Mail, value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { Icon: MapPin, value: contact.address, href: undefined }
  ].filter((d) => Boolean(d.value));

  return (
    <footer className="border-t bg-muted text-foreground">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex max-w-sm flex-col gap-4">
            <Logo className="h-9" />
            <p className="text-sm text-muted-foreground">{settings.footerDescription}</p>
          </div>

          <LinkColumn title="Menu">
            <ul className="flex flex-col gap-2">
              {(settings.footerLinks ?? []).map((link) => (
                <li key={link.href + link.label}>
                  <FooterLink
                    href={link.href}
                    label={link.label}
                    active={link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)}
                  />
                </li>
              ))}
            </ul>
          </LinkColumn>

          <LinkColumn title="Partners">
            <ul className="flex flex-col gap-2">
              {(settings.partners ?? []).map((partner) => (
                <li key={partner.href + partner.label}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {partner.label}
                  </a>
                </li>
              ))}
            </ul>
          </LinkColumn>

          <LinkColumn title="Contact">
            <ul className="flex flex-col gap-3">
              {details.map(({ Icon, value, href }) => (
                <li key={value} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {href ? (
                    <a href={href} className="transition-colors hover:text-foreground">
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </LinkColumn>
        </div>

        <Separator className="my-8" />

        <p className="text-sm text-muted-foreground">{settings.copyright}</p>
      </Container>
    </footer>
  );
}
