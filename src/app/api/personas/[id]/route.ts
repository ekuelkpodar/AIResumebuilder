import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { personaSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

type Context = { params: { id: string } };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = personaSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const persona = await prisma.careerPersona.update({
    where: { id: context.params.id, userId: session.user.id },
    data: parsed.data,
  });
  return NextResponse.json({ persona });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  await prisma.careerPersona.delete({ where: { id: context.params.id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
