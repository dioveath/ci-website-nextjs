'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { contactPageFallback } from '../../lib/sanity/fallbacks';

type ContactPage = typeof contactPageFallback;

const FIELDS = [
  { id: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name', required: true },
  { id: 'lastName', label: 'Last name', type: 'text', autoComplete: 'family-name', required: true },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { id: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', required: false }
] as const;

export default function ContactContent({ page = contactPageFallback }: { page?: ContactPage }) {
  const contact = page.contact ?? {};

  const details = [
    { Icon: Phone, label: 'Phone', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : undefined },
    { Icon: Mail, label: 'Email', value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { Icon: MapPin, label: 'Address', value: contact.address, href: undefined }
  ].filter((detail) => Boolean(detail.value));

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <Card>
        <CardContent>
          {/*
            Every field has a real <label htmlFor>, a name, and an autocomplete
            hint. The old form used `name=""` with placeholder-only labels, so
            a screen reader announced four unlabelled text boxes and the
            browser could not autofill any of them.
          */}
          <form className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-card-foreground">Send us a message</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map(({ id, label, type, autoComplete, required }) => (
                <div key={id} className="flex flex-col gap-2">
                  <Label htmlFor={id}>
                    {label}
                    {required ? null : <span className="text-muted-foreground"> (optional)</span>}
                  </Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    autoComplete={autoComplete}
                    required={required}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={6} required />
            </div>

            <Button type="submit" size="xl" className="self-start">
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">Charicha Institute</h2>
          <p className="text-muted-foreground">
            We look forward to hearing from you and helping you learn more about the
            opportunities available at our institute.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {details.map(({ Icon, label, value, href }) => (
            <li key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span className="flex flex-col">
                <span className="text-sm text-muted-foreground">{label}</span>
                {href ? (
                  <a href={href} className="text-foreground hover:text-primary">
                    {value}
                  </a>
                ) : (
                  <span className="text-foreground">{value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {page.mapEmbedUrl ? (
          <iframe
            src={page.mapEmbedUrl}
            title="Charicha Institute on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-80 w-full rounded-2xl border shadow-card"
          />
        ) : null}
      </div>
    </div>
  );
}
