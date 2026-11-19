import type { ReactNode } from 'react';

import { Card, CardContent } from '../ui/card';

export default function ServiceCard({
  title,
  children,
  headingLevel = 3
}: {
  title: ReactNode;
  children?: ReactNode;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';

  return (
    <Card className="h-full">
      <CardContent className="h-full">
        <div className="flex h-full flex-col gap-3">
          <span className="h-1 w-10 rounded-full bg-highlight" aria-hidden />
          <Heading className="text-lg font-semibold text-card-foreground">
            {title}
          </Heading>
          <p className="text-sm text-muted-foreground">{children}</p>
        </div>
      </CardContent>
    </Card>
  );
}
