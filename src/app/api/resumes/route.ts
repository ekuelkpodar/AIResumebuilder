import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { resumeCreateSchema } from "@/lib/validators";
import { defaultTemplates } from "@/lib/templates";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, atsScore: true, updatedAt: true, templateId: true },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Resumes GET error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = resumeCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const template =
      defaultTemplates.find((t) => t.id === parsed.data.templateId) ?? defaultTemplates[0];

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        templateId: parsed.data.templateId,
        layout: parsed.data.layout ?? template.layoutConfig,
        data: parsed.data.data ?? {
          summary: "",
          experience: [],
          skills: [],
        },
      },
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Resumes POST error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
