export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">ResumeCraft</p>
          <p className="text-xs text-muted-foreground">
            Build resumes, cover letters, and track applications with AI.
          </p>
        </div>
        <div className="flex gap-4">
          <a href="mailto:hello@resumecraft.app" className="hover:text-foreground">
            Contact
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
