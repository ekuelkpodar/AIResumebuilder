"use client";

import { useEffect, useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

export function CareerCoachPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ask me how to position your resume for your next role.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: "user", content: input }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/ai/career-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(json.error?.message ?? "AI unavailable");
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `${json.answer}\n\nSuggested: ${json.suggestedActions?.join("; ")}`,
      },
    ]);
  };

  useEffect(() => {
    const area = document.getElementById("coach-scroll");
    if (area) area.scrollTop = area.scrollHeight;
  }, [messages]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Career coach
          </CardTitle>
          <CardDescription>Context-aware AI based on your profile and applications.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea id="coach-scroll" className="h-48 rounded-md border p-3">
          <div className="space-y-3 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.role === "assistant" ? "text-foreground" : "text-primary font-medium"}
              >
                {m.content}
              </div>
            ))}
          </div>
        </ScrollArea>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about positioning, keywords, or interview prep..."
        />
        <div className="flex justify-end">
          <Button onClick={send} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
