import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { posts } from "@/lib/posts";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Resources</p>
        <h1 className="text-3xl font-semibold text-foreground">Job search playbooks</h1>
        <p className="text-muted-foreground">
          A growing library of guides and templates. New articles arrive weekly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="hover:-translate-y-0.5 transition-transform">
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription>{post.content.slice(0, 80)}...</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <a className="text-primary" href={`/resources/${post.slug}`}>
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
