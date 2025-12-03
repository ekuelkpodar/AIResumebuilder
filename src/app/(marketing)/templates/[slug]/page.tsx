import { notFound } from "next/navigation";
import { defaultTemplates } from "@/lib/templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props) {
  const template = defaultTemplates.find((t) => t.slug === params.slug);
  if (!template) return {};
  return {
    title: `${template.name} Resume Template – ResumeCraft`,
    description: template.description,
  };
}

export default function TemplateDetailPage({ params }: Props) {
  const template = defaultTemplates.find((t) => t.slug === params.slug);
  if (!template) notFound();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Template</p>
        <h1 className="text-3xl font-semibold">{template?.name}</h1>
        <p className="text-muted-foreground">{template?.description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Who it’s for</CardTitle>
          <CardDescription>
            Built for roles in {template?.category}. Works well for {template?.tags.join(", ")}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {template?.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
            <p>Layout: {template?.layoutConfig.columns === 2 ? "Two column" : "Single column"}</p>
            <p>Accent: {template?.themeConfig.accent}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Use this template</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
            href={`/app/resumes/new?templateId=${template?.id}`}
          >
            Start with {template?.name}
          </a>
        </CardContent>
      </Card>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${template?.name} Resume Template`,
            description: template?.description,
          }),
        }}
      />
    </div>
  );
}
