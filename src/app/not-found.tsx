import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-20 sm:px-6">
      <p className="text-accent font-mono text-sm">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">
        Nothing here
      </h1>
      <p className="text-muted mt-5 text-lg text-pretty">
        That page does not exist, or it is a draft that has not been published
        yet.
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="bg-accent inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back home
        </Link>
      </div>
    </div>
  );
}
