import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted">
        <SearchX className="size-10 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Page not found. The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-6">
        <Button className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
          <ArrowLeft className="size-4" />
          Go Home
        </Button>
      </Link>
    </div>
  );
}
