export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F9F6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#D8E4DC] border-t-[#1A5C3A] rounded-full animate-spin" />
        <div className="text-xs font-semibold text-[#6B7E72] uppercase tracking-wider">Loading Civitas…</div>
      </div>
    </div>
  );
}
