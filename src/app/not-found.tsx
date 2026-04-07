import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-purple-500">404</h1>
        <h2 className="text-2xl font-bold text-zinc-100">Page not found</h2>
        <p className="text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
