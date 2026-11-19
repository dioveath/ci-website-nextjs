import type { ProgressSummary } from '@/types/courses';

export default function ProgressBar({ progress, compact = false }: { progress: ProgressSummary; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label="Course progress"
      >
        {/* The dynamic width goes through a custom property, as on the media
            upload bar, so the class list stays static. */}
        <div
          className="h-full w-(--course-progress) bg-primary transition-all"
          style={{ '--course-progress': `${progress.percent}%` } as React.CSSProperties}
        />
      </div>
      {!compact ? (
        <p className="text-sm text-muted-foreground">
          {progress.completed} of {progress.total} lessons complete
        </p>
      ) : null}
    </div>
  );
}
