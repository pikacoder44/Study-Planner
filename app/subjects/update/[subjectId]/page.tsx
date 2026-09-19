"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { getSubject, updateSubject } from "@/lib/frontend-data";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";

export default function UpdateSubjectPage() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = params?.subjectId;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Guard against running fetch before dynamic params hydrate
    if (!subjectId) return;

    const fetchSubject = async () => {
      try {
        const subject = await getSubject(subjectId);
        setName(subject.name);
        setCode(subject.code);
        setColor(subject.color);
        setDescription(subject.description);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    };
    fetchSubject();
  }, [subjectId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subjectId) return;

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      code: formData.get("code"),
      color: formData.get("color"),
      description: formData.get("description"),
    };
    try {
      await updateSubject(
        subjectId,
        data as Parameters<typeof updateSubject>[1],
      );
      router.push("/subjects");
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Subjects"
        title="Update a subject"
        description="Update your course's information and progress."
      />
      <Card className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Subject name">
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Course code">
              <Input
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS603"
              />
            </Field>
            <Field label="Accent color">
              <Select
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="blue">Ocean blue</option>
                <option value="green">Sage green</option>
                <option value="amber">Warm amber</option>
              </Select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              name="description"
              className="min-h-28 w-full rounded-md border border-(--border) p-3 text-sm outline-none focus:border-(--accent)"
              placeholder="What is this course about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <div className="flex justify-end gap-3 border-t border-(--border) pt-5">
            <Link href="/subjects">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Update subject</Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}