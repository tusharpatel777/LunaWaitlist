function Bone({ className = '' }) {
  return <div className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`} />
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 glass border space-y-3">
      <div className="flex items-center justify-between">
        <Bone className="h-4 w-24" />
        <Bone className="h-9 w-9 rounded-xl" />
      </div>
      <Bone className="h-8 w-32" />
      <Bone className="h-3 w-20" />
    </div>
  )
}

export function ChartSkeleton({ height = 'h-72' }) {
  return (
    <div className={`rounded-2xl p-5 glass border ${height} space-y-4`}>
      <div className="flex items-center justify-between">
        <Bone className="h-5 w-36" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>
      <Bone className="flex-1 h-full rounded-xl" style={{ height: 'calc(100% - 48px)' }} />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="rounded-2xl glass border overflow-hidden">
      <div className="p-5 border-b border-white/[0.05] space-y-2">
        <Bone className="h-5 w-32" />
        <Bone className="h-3 w-20" />
      </div>
      <div className="divide-y divide-white/[0.03]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-5 py-3.5 flex items-center gap-4">
            <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
            <Bone className="flex-1 h-4" />
            <Bone className="w-16 h-4" />
            <Bone className="w-14 h-4 hidden sm:block" />
            <Bone className="w-20 h-4 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  )
}
