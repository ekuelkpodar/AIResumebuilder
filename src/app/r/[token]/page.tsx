import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResumePreview } from "@/components/resume/resume-preview";

type Props = { params: { token: string } };

export default async function PublicResumePage({ params }: Props) {
  const resume = await prisma.resume.findFirst({
    where: { shareToken: params.token, isPublic: true },
  });
  if (!resume) {
    notFound();
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <p className="text-xs uppercase text-muted-foreground">Shared resume</p>
        <h1 className="text-3xl font-semibold">{resume?.title}</h1>
      </div>
      <ResumePreview title={resume?.title ?? ""} data={(resume?.data as any) ?? {}} accent="#0ea5e9" />
    </div>
  );
}
