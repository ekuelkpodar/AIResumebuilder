import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

type Props = { params: { jobId: string } };

export default async function ApplyPage({ params }: Props) {
  const job = await prisma.jobOpening.findUnique({ where: { id: params.jobId } });
  if (!job || job.status === "CLOSED") notFound();
  async function submit(formData: FormData) {
    "use server";
    await prisma.candidateSubmission.create({
      data: {
        jobOpeningId: params.jobId,
        candidateName: (formData.get("name") as string) ?? "",
        candidateEmail: (formData.get("email") as string) ?? "",
        resumeLink: (formData.get("resume") as string) ?? "",
        notes: (formData.get("notes") as string) ?? "",
      },
    });
    revalidatePath("/");
  }
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Apply to {job.title}</CardTitle>
          <CardDescription>{job.location}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={submit} className="space-y-3">
            <Input name="name" placeholder="Your name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="resume" placeholder="Resume URL" required />
            <Textarea name="notes" placeholder="Notes (optional)" />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
