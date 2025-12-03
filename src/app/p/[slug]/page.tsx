import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const portfolio = await prisma.portfolio.findUnique({ where: { slug: params.slug } });
  if (!portfolio) return {};
  return {
    title: `${portfolio.title} – Portfolio`,
    description: portfolio.headline ?? portfolio.bio ?? "",
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: params.slug },
    include: { projects: true },
  });
  if (!portfolio) notFound();
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <Badge>Public</Badge>
        <h1 className="text-4xl font-semibold">{portfolio.title}</h1>
        <p className="text-muted-foreground">{portfolio.headline}</p>
      </div>
      <div className="prose max-w-none">
        <p>{portfolio.bio}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {portfolio.projects.map((proj) => (
          <div key={proj.id} className="rounded-lg border p-4">
            <p className="text-lg font-semibold">{proj.title}</p>
            <p className="text-sm text-muted-foreground">{proj.subtitle}</p>
            <p className="mt-2 text-sm">{proj.description}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {proj.technologies.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
