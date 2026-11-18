import Image from 'next/image';

import { Card, CardContent } from '../ui/card';

export default function TestimonialCard({
  content,
  reviewer,
  role,
  avatar = '/profile.jpg'
}: {
  content: string;
  reviewer: string;
  role?: string;
  avatar?: string;
}) {
  return (
    <Card className="h-full">
      <CardContent className="h-full">
        <figure className="flex h-full flex-col gap-5">
        <blockquote className="flex-1 text-base text-card-foreground">
          &ldquo;{content}&rdquo;
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <Image
            src={avatar}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">{reviewer}</span>
            {role ? <span className="text-xs text-muted-foreground">{role}</span> : null}
          </span>
        </figcaption>
        </figure>
      </CardContent>
    </Card>
  );
}
