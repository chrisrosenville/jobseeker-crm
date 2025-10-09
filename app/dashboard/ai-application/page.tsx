"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";

export default function AiApplicationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [creativity, setCreativity] = useState<number>(0.6);
  const [age, setAge] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [tone, setTone] = useState<string>("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [jobPost, setJobPost] = useState("");

  const creativityLabel = useMemo(() => {
    if (creativity < 0.2) return "Focused & precise";
    if (creativity < 0.4) return "Structured";
    if (creativity < 0.6) return "Balanced";
    if (creativity < 0.8) return "Creative";
    return "Highly diverse";
  }, [creativity]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload your resume as a PDF.");
      return;
    }
    if (!age || Number.isNaN(Number(age))) {
      toast.error("Please provide a valid age.");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("creativity", String(creativity));
      form.append("age", age);
      form.append("language", language);
      form.append("tone", tone);
      if (jobPost.trim()) form.append("jobPost", jobPost.trim());

      const res = await fetch("/api/ai-application", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const text = await res.text();
        let message = "Request failed";
        try {
          const parsed = JSON.parse(text) as { message?: string };
          if (parsed?.message) message = parsed.message;
        } catch {
          if (text) message = text;
        }
        throw new Error(message);
      }
      const data = (await res.json()) as { content: string };
      setResult(data.content);
      toast.success("Application draft generated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Application Writer</CardTitle>
          <CardDescription>
            Upload your resume PDF and generate a tailored, professional job
            application in your preferred tone and language.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Resume */}
            <div className="grid gap-2">
              <Label htmlFor="resume">Resume (PDF)</Label>
              <FileUpload
                file={file}
                onFileChange={setFile}
                accept="application/pdf"
                maxSize={10}
                description="We only use your file to generate the application. It is not stored."
              />
            </div>

            {/* Job Post */}
            <div className="grid gap-2">
              <Label htmlFor="jobPost">Job post</Label>
              <Textarea
                id="jobPost"
                className="max-h-[500px]"
                placeholder="Paste the job posting here to tailor your application."
                rows={8}
                value={jobPost}
                onChange={(e) => setJobPost(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The content remains local to this request and is not stored.
              </p>
            </div>

            {/* Creativity - top_p */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="humanization">Response creativity</Label>
                <span className="text-xs text-muted-foreground">
                  {creativityLabel}
                </span>
              </div>
              <input
                id="humanization"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={creativity}
                onChange={(e) => setCreativity(Number(e.target.value))}
                className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{creativity.toFixed(2)}</span>
                <span>1</span>
              </div>
            </div>

            {/* Age, Tone, Language */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="age">Your age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 29"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={14}
                  max={100}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v)}>
                  <SelectTrigger id="tone" className="w-full">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">
                      Conversational
                    </SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v)}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="nl">Dutch</SelectItem>
                    <SelectItem value="sv">Swedish</SelectItem>
                    <SelectItem value="da">Danish</SelectItem>
                    <SelectItem value="no">Norwegian</SelectItem>
                    <SelectItem value="fi">Finnish</SelectItem>
                    <SelectItem value="pl">Polish</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit button and copy button */}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Generating…" : "Generate application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!result}
                onClick={() => {
                  if (!result) return;
                  navigator.clipboard.writeText(result).then(
                    () => toast.success("Copied to clipboard"),
                    () => toast.error("Copy failed")
                  );
                }}
              >
                Copy result
              </Button>
            </div>

            <div className="grid gap-2">
              <Label>Result</Label>
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder={
                  loading
                    ? "Generating application…"
                    : "Your generated application will appear here"
                }
                rows={14}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
