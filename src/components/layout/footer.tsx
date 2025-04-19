import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">PLUGGIST</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Find EV charging stations with real-time availability, reviews, and amenities. Plan your trips with confidence.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">Explore</h3>
            <Link href="/search" className="text-sm text-muted-foreground hover:text-primary">
              Find Stations
            </Link>
            <Link href="/trip-planner" className="text-sm text-muted-foreground hover:text-primary">
              Trip Planner
            </Link>
            <Link href="/resources" className="text-sm text-muted-foreground hover:text-primary">
              Resources
            </Link>
            <Link href="/for-business" className="text-sm text-muted-foreground hover:text-primary">
              For Business
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
              About Us
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
              Blog
            </Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
              Careers
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium">Legal</h3>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PLUGGIST. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
              Twitter
            </Link>
            <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
              Facebook
            </Link>
            <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
              Instagram
            </Link>
            <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
