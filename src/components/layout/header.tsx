import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">PLUGGIST</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/search" className="text-sm font-medium transition-colors hover:text-primary">
              Find Stations
            </Link>
            <Link href="/trip-planner" className="text-sm font-medium transition-colors hover:text-primary">
              Trip Planner
            </Link>
            <Link href="/resources" className="text-sm font-medium transition-colors hover:text-primary">
              Resources
            </Link>
            <Link href="/for-business" className="text-sm font-medium transition-colors hover:text-primary">
              For Business
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
