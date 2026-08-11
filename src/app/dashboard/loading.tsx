export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F5F9F6] flex">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-[#D8E4DC] fixed top-0 left-0 h-screen z-30 p-6 gap-4">
        <div className="h-6 w-24 bg-[#D8E4DC] rounded-lg animate-pulse" />
        <div className="h-12 w-full bg-[#EEF7F2] rounded-xl animate-pulse mt-2" />
        <div className="space-y-2 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 w-full bg-[#F5F9F6] rounded-xl animate-pulse" />
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 lg:ml-56">
        {/* Topbar skeleton */}
        <div className="h-14 bg-white border-b border-[#D8E4DC] flex items-center px-8 gap-4">
          <div className="flex-1" />
          <div className="w-9 h-9 bg-[#F5F9F6] rounded-xl animate-pulse" />
          <div className="w-9 h-9 bg-[#D8E4DC] rounded-full animate-pulse" />
        </div>

        {/* Page body skeleton */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-[#D8E4DC] rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-[#EEF7F2] rounded-lg animate-pulse" />
          </div>

          {/* Stats cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-[#D8E4DC] space-y-3">
                <div className="h-3 w-20 bg-[#EEF7F2] rounded animate-pulse" />
                <div className="h-8 w-28 bg-[#D8E4DC] rounded-lg animate-pulse" />
                <div className="h-3 w-16 bg-[#EEF7F2] rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Main table skeleton */}
          <div className="bg-white rounded-3xl border border-[#D8E4DC] overflow-hidden">
            <div className="p-6 border-b border-[#D8E4DC]">
              <div className="h-5 w-36 bg-[#D8E4DC] rounded-lg animate-pulse" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-[#D8E4DC] flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-48 bg-[#EEF7F2] rounded animate-pulse" />
                  <div className="h-3 w-32 bg-[#F5F9F6] rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-[#EEF7F2] rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
