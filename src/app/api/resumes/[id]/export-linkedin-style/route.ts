import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
  const exportJson = {
    headline: data.summary ?? "",
    positions: (data.experience ?? []).map((exp: any) => ({
      title: exp.role,
      company: exp.company,
      period: exp.period,
      description: (exp.bullets ?? []).join("\n"),
    })),
    education: data.education ?? [],
    skills: data.skills ?? [],
  };

  return NextResponse.json(exportJson);
}
