export function LoadingScreen() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
