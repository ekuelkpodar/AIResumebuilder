import { notFound } from "next/navigation";
import { posts } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: `${post.title} – ResumeCraft`, description: post.content.slice(0, 140) };
}

export default function ResourceDetail({ params }: Props) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <Badge variant="secondary">{post?.category}</Badge>
        <h1 className="mt-2 text-3xl font-semibold">{post?.title}</h1>
      </div>
      <p className="text-muted-foreground leading-7">{post?.content}</p>
      <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
        Related:
        <ul className="mt-2 list-disc pl-4">
          {posts
            .filter((p) => p.slug !== post?.slug)
            .slice(0, 3)
            .map((p) => (
              <li key={p.slug}>
                <a className="text-primary" href={`/resources/${p.slug}`}>
                  {p.title}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
