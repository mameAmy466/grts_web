import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center text-fg">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">GRTS</p>
      <h1 className="mt-3 text-3xl font-bold">This page is off air</h1>
      <p className="mt-2 max-w-md text-sm text-fg-muted">
        The page you asked for is not on the schedule. Head back to the homepage or the newsroom.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold">
          Home
        </Link>
        <Link href="/news" className="rounded-md border border-fg/20 px-4 py-2 text-sm font-semibold">
          News
        </Link>
      </div>
    </div>
  );
}
