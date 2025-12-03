"use client";

import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = { id: string };

export function DeleteResumeButton({ id }: Props) {
  const router = useRouter();

  const onDelete = async () => {
    const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Resume deleted");
      router.refresh();
    } else {
      toast.error("Could not delete resume");
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-destructive hover:text-destructive"
      onClick={onDelete}
    >
      <Trash className="mr-2 h-4 w-4" /> Delete
    </Button>
  );
}
