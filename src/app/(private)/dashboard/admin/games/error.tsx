"use client";

export default function ErrorGames({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6 space-y-2">
      <p className="text-destructive">Failed to load games.</p>
      <button
        onClick={reset}
        className="text-sm underline hover:no-underline"
      >
        Try again
      </button>
    </div>
  );
}
