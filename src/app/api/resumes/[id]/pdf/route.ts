import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Document, Page, StyleSheet, Text, View, renderToStream } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type Context = { params: { id: string } };

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  header: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    color: "#0ea5e9",
  },
  bullet: {
    marginBottom: 4,
  },
});

export async function GET(_request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resume = await prisma.resume.findFirst({
      where: { id: context.params.id, user: { email: session.user.email } },
    });

    if (!resume) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const resumeData = (resume.data as any) ?? {};
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>{resume.title}</Text>
          {resumeData.summary && <Text style={styles.subheader}>{resumeData.summary}</Text>}
          {Array.isArray(resumeData.experience) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {resumeData.experience.map((exp: any, idx: number) => (
                <View key={idx} style={styles.bullet}>
                  <Text>
                    {exp.role} • {exp.company} — {exp.period}
                  </Text>
                  {Array.isArray(exp.bullets) &&
                    exp.bullets.map((bullet: string, bulletIdx: number) => (
                      <Text key={bulletIdx}>• {bullet}</Text>
                    ))}
                </View>
              ))}
            </View>
          )}
          {Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Text>{resumeData.skills.join(", ")}</Text>
            </View>
          )}
        </Page>
      </Document>
    );

    const stream = await renderToStream(doc);
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.title}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
