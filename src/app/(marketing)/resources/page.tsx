import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const posts = [
  {
    title: "How to write STAR-format bullets",
    description: "A quick formula to communicate impact in 3 lines.",
  },
  {
    title: "ATS checklists for 2025",
    description: "Formatting and keyword tips to avoid parsing issues.",
  },
  {
    title: "Structuring a two-page resume",
    description: "When to expand beyond one page and how to keep it clean.",
  },
];

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
          <Card key={post.title} className="hover:-translate-y-0.5 transition-transform">
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coming soon — subscribe for updates.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
