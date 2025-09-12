import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight, Battery, Zap, TrendingUp, MapPin } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to EV Charging: Everything You Need to Know in 2025",
    excerpt: "From Level 1 to DC Fast Charging, understand all the different types of EV charging and how to choose the right one for your needs.",
    author: "Sarah Chen",
    date: "2025-01-10",
    readTime: "8 min read",
    category: "Education",
    featured: true,
    image: "/api/placeholder/600/400"
  },
  {
    id: 2,
    title: "Tesla Supercharger Network Opens to All EVs: What This Means for You",
    excerpt: "Tesla's decision to open its Supercharger network is revolutionary. Here's how to access it and what to expect.",
    author: "Marcus Rodriguez",
    date: "2025-01-08",
    readTime: "5 min read",
    category: "Industry News",
    featured: true,
    image: "/api/placeholder/600/400"
  },
  {
    id: 3,
    title: "Planning Your First EV Road Trip: Routes, Apps, and Essential Tips",
    excerpt: "Don't let range anxiety stop your adventure. Our comprehensive guide to EV road trip planning ensures you'll never get stranded.",
    author: "Jessica Park",
    date: "2025-01-05",
    readTime: "12 min read",
    category: "Travel",
    featured: false,
    image: "/api/placeholder/600/400"
  },
  {
    id: 4,
    title: "Home EV Charging Installation: Costs, Permits, and What to Expect",
    excerpt: "Everything you need to know about installing a Level 2 charger at home, from electrical requirements to contractor selection.",
    author: "Sarah Chen",
    date: "2025-01-03",
    readTime: "10 min read",
    category: "Installation",
    featured: false,
    image: "/api/placeholder/600/400"
  },
  {
    id: 5,
    title: "ChargePal AI: How Our Smart Assistant is Revolutionizing EV Charging",
    excerpt: "Meet ChargePal, the AI assistant that learns your driving patterns and finds the perfect charging solutions for any situation.",
    author: "Tech Team",
    date: "2025-01-01",
    readTime: "6 min read",
    category: "Technology",
    featured: false,
    image: "/api/placeholder/600/400"
  },
  {
    id: 6,
    title: "EV Charging Etiquette: The Do's and Don'ts Every Driver Should Know",
    excerpt: "Be a considerate EV driver with our guide to charging station etiquette and community best practices.",
    author: "Community Team",
    date: "2024-12-28",
    readTime: "4 min read",
    category: "Community",
    featured: false,
    image: "/api/placeholder/600/400"
  }
];

const categories = ["All", "Education", "Industry News", "Travel", "Installation", "Technology", "Community"];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                The EV Charging Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Expert insights, industry news, and practical guides to help you navigate the world of electric vehicle charging.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Articles</h2>
              <Badge variant="secondary" className="px-3 py-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {blogPosts.filter(post => post.featured).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      {post.category}
                    </Badge>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Battery className="h-16 w-16 mx-auto mb-2" />
                        <span className="text-sm">Featured Article</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>
                          Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 border-t">
          <div className="container">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <Badge className="absolute top-3 left-3 text-xs bg-background/80 text-foreground">
                      {post.category}
                    </Badge>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        {post.category === "Education" && <Battery className="h-12 w-12 mx-auto mb-1" />}
                        {post.category === "Industry News" && <TrendingUp className="h-12 w-12 mx-auto mb-1" />}
                        {post.category === "Travel" && <MapPin className="h-12 w-12 mx-auto mb-1" />}
                        {post.category === "Installation" && <Zap className="h-12 w-12 mx-auto mb-1" />}
                        {post.category === "Technology" && <Battery className="h-12 w-12 mx-auto mb-1" />}
                        {post.category === "Community" && <User className="h-12 w-12 mx-auto mb-1" />}
                        <span className="text-xs">Article Image</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>
                          Read <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Charged with Our Newsletter</h2>
              <p className="text-muted-foreground mb-8">
                Get the latest EV charging news, tips, and exclusive deals delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background"
                />
                <Button className="px-6">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                No spam, unsubscribe at any time. Read our privacy policy.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Need Charging Help Right Now?</h2>
            <p className="text-lg opacity-90 mb-8">
              Don't wait – find available chargers near you instantly with our emergency search.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/search?location=current">
                🚨 Find Chargers Now
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}