import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = { params: { id: string } };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const resume = await prisma.resume.findFirst({
    where: { id: context.params.id, userId: session.user.id },
  });
  if (!resume) return NextResponse.json({ error: { message: "Not found" } }, { status: 404 });

  const data = (resume.data as any) ?? {};
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: resume.title, heading: "Heading1" }),
          new Paragraph({ text: data.summary ?? "" }),
          new Paragraph({ text: "Experience", heading: "Heading2" }),
          ...(data.experience ?? []).flatMap((exp: any) => [
            new Paragraph({ text: `${exp.role} — ${exp.company} (${exp.period})`, bullet: { level: 0 } }),
            ...(exp.bullets ?? []).map(
              (b: string) =>
                new Paragraph({
                  children: [new TextRun({ text: b })],
                  bullet: { level: 1 },
                }),
            ),
          ]),
          new Paragraph({ text: "Skills", heading: "Heading2" }),
          new Paragraph({ text: (data.skills ?? []).join(", ") }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${resume.title}.docx"`,
    },
  });
}
