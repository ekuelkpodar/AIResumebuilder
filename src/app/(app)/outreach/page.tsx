"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Contact = { id: string; name: string; company?: string };
type Message = { id: string; body: string; status: string; contact?: Contact; subject?: string };

export default function OutreachPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contactForm, setContactForm] = useState({ name: "", company: "", email: "" });
  const [messageForm, setMessageForm] = useState({
    contactId: "",
    channel: "EMAIL",
    purpose: "informational interview",
    body: "",
    subject: "",
  });

  const load = async () => {
    const c = await fetch("/api/contacts").then((res) => res.json());
    setContacts(c.items ?? []);
    const m = await fetch("/api/outreach").then((res) => res.json());
    setMessages(m.items ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const saveContact = async () => {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });
    if (res.ok) {
      toast.success("Contact saved");
      setContactForm({ name: "", company: "", email: "" });
      load();
    }
  };

  const generateMessage = async () => {
    const contact = contacts.find((c) => c.id === messageForm.contactId);
    const res = await fetch("/api/ai/outreach-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactProfile: contact,
        userCareerContext: {},
        purpose: messageForm.purpose,
        channel: messageForm.channel,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setMessageForm((p) => ({ ...p, body: json.body, subject: json.subject ?? p.subject }));
    } else toast.error(json.error?.message ?? "Could not generate");
  };

  const saveMessage = async () => {
    const res = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageForm),
    });
    if (res.ok) {
      toast.success("Message saved");
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Outreach</p>
          <h1 className="text-3xl font-semibold">Contacts & follow-ups</h1>
        </div>
        <Button onClick={generateMessage}>Generate outreach</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>Add people to reach out to.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} />
            <Input placeholder="Company" value={contactForm.company} onChange={(e) => setContactForm((p) => ({ ...p, company: e.target.value }))} />
            <Input placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} />
            <Button onClick={saveContact}>Save contact</Button>
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="rounded-md border p-3 text-sm">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-muted-foreground">{c.company}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Message draft</CardTitle>
            <CardDescription>AI-assisted outreach and follow-ups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select value={messageForm.contactId} onValueChange={(v) => setMessageForm((p) => ({ ...p, contactId: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={messageForm.channel} onValueChange={(v) => setMessageForm((p) => ({ ...p, channel: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Purpose (referral, intro...)"
              value={messageForm.purpose}
              onChange={(e) => setMessageForm((p) => ({ ...p, purpose: e.target.value }))}
            />
            <Input placeholder="Subject" value={messageForm.subject} onChange={(e) => setMessageForm((p) => ({ ...p, subject: e.target.value }))} />
            <Textarea
              value={messageForm.body}
              onChange={(e) => setMessageForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Draft message"
              className="min-h-[160px]"
            />
            <Button onClick={saveMessage}>Save message</Button>
            <div className="space-y-2">
              {messages.map((m) => (
                <div key={m.id} className="rounded-md border p-3">
                  <p className="text-sm text-muted-foreground">{m.contact?.name}</p>
                  <p className="text-sm">{m.body.slice(0, 120)}...</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
