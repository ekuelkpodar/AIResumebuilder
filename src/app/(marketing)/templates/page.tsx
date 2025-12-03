import Link from "next/link";
import { defaultTemplates } from "@/lib/templates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Templates</p>
          <h1 className="text-3xl font-semibold text-foreground">Pick a style, keep your data</h1>
          <p className="text-muted-foreground">
            Filter by industry, career stage, and style. Swap templates anytime without retyping.
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {["Tech", "Marketing", "Finance", "Healthcare", "Operations"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              {["Minimal", "Bold", "Conservative"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {defaultTemplates.map((template) => (
          <Card key={template.slug} className="flex flex-col border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="rounded-md border border-dashed bg-muted/40 p-4 text-xs text-muted-foreground">
                {template.layoutConfig.columns === 2
                  ? "Two-column layout with sidebar placement."
                  : "Single column, ATS-friendly layout."}
              </div>
            </CardContent>
            <CardFooter className="mt-auto flex items-center justify-between px-6 pb-6">
              <Badge variant="outline">{template.category}</Badge>
              <Button asChild>
                <Link href={`/app/resumes/new?templateId=${template.id}`}>Use template</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
