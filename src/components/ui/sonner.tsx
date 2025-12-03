import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      toastOptions={{
        classNames: {
          toast: "rounded-md border border-border bg-card text-foreground shadow-md",
        },
      }}
      position="top-right"
      richColors
      closeButton
    />
  );
}
