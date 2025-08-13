"use client"

export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-8">
        {/* BTB coin */}
        <div className="relative h-16 w-16 md:h-20 md:w-20">
          <div className="absolute inset-0 rounded-full border" />
          <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-foreground/10 to-transparent" />
          <div className="absolute inset-[6px] grid place-items-center rounded-full border bg-background animate-[flip_1200ms_ease-in-out_infinite]">
            <span className="font-black tracking-tight">BTB</span>
          </div>
        </div>

        {/* Bet slip + sparkline */}
        <div className="w-[min(92vw,680px)]">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            {/* Slip header shimmer */}
            <div className="mb-3 h-4 w-40 overflow-hidden rounded bg-muted/60 relative">
              <span className="absolute inset-0 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
            </div>

            {/* Odds rows */}
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-24 overflow-hidden rounded bg-muted/60 relative">
                    <span className="absolute inset-0 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
                  </div>
                  <div className="h-3 w-16 overflow-hidden rounded bg-muted/60 relative">
                    <span className="absolute inset-0 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
                  </div>
                  <div className="ml-auto h-3 w-10 overflow-hidden rounded bg-muted/60 relative">
                    <span className="absolute inset-0 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
                  </div>
                </div>
              ))}
            </div>

            {/* Kelly/EV sparkline */}
            <div className="mt-5 h-14 w-full">
              <svg viewBox="0 0 100 30" className="h-full w-full">
                <path
                  d="M0 20 C 10 10, 20 25, 30 18 S 50 8, 60 15 80 28, 100 16"
                  className="stroke-current"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.35"
                />
                <path
                  d="M0 20 C 10 10, 20 25, 30 18 S 50 8, 60 15 80 28, 100 16"
                  className="stroke-current"
                  strokeWidth="2"
                  fill="none"
                  style={{ strokeDasharray: 220, strokeDashoffset: 220 }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="220;0;220"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </path>
                {/* EV pulse point */}
                <circle r="2.4" className="fill-current" cx="60" cy="15">
                  <animate
                    attributeName="r"
                    values="2.4;4;2.4"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-muted-foreground">
          Calculating edges & sizing stakes…
        </p>
      </div>

      {/* Local keyframes (scoped) */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes flip {
          0%,
          100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </div>
  );
}
