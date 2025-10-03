export function LoadingScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-black/20 border-t-black animate-spin" />
        <p className="text-sm text-gray-700">Loading…</p>
      </div>
    </div>
  );
}
