import type { ProgressSummary } from '../../types/courses';

export default function ProgressBar({ progress, compact = false }: { progress: ProgressSummary; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-2 w-full rounded-full bg-riverbed overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-label="Course progress"
      >
        <div className="h-full bg-eggblue transition-all" style={{ width: `${progress.percent}%` }} />
      </div>
      {!compact && (
        <p className="text-sm text-gray-300">
          {progress.completed} of {progress.total} lessons complete
        </p>
      )}
    </div>
  );
}
