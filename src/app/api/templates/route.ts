import { NextResponse } from "next/server";
import { defaultTemplates } from "@/lib/templates";

export async function GET() {
  return NextResponse.json({ templates: defaultTemplates });
}
