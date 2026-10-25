export function PagePlaceholder({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-6 text-center">
      <h1 className="text-xl font-extrabold">{title}</h1>
      {hint ? <p className="text-sm opacity-60">{hint}</p> : null}
    </div>
  );
}
