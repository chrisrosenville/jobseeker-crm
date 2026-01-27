"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Bot, User, Copy, Check, ChevronDown, Loader2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const QUICK_SUGGESTIONS = [
  "Make it shorter and punchier",
  "Add more enthusiasm and personality",
  "Highlight technical skills more",
  "Focus on achievements and impact",
  "Make it more conversational",
  "Emphasize leadership experience",
];

export default function AiApplicationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [creativity, setCreativity] = useState<number>(0.6);
  const [age, setAge] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [tone, setTone] = useState<string>("professional");
  const [loading, setLoading] = useState(false);
  const [jobPost, setJobPost] = useState("");
  const [feedback, setFeedback] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>
  >([]);
  const [showStartOverDialog, setShowStartOverDialog] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [inputExpanded, setInputExpanded] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory, streamingContent]);

  const creativityLabel = useMemo(() => {
    if (creativity < 0.2) return "Focused & precise";
    if (creativity < 0.4) return "Structured";
    if (creativity < 0.6) return "Balanced";
    if (creativity < 0.8) return "Creative";
    return "Highly diverse";
  }, [creativity]);

  const hasConversation = conversationHistory.length > 0 || streamingContent;

  const applicationText = useMemo(() => {
    return (
      conversationHistory.find((m) => m.role === "assistant")?.content || ""
    );
  }, [conversationHistory]);

  const wordCount = useMemo(() => {
    return applicationText.trim()
      ? applicationText.trim().split(/\s+/).length
      : 0;
  }, [applicationText]);

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
    setInputExpanded(false);
    setStreamingContent("");
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

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      setConversationHistory([
        { role: "assistant", content: accumulated, timestamp: new Date() },
      ]);
      setStreamingContent("");
      setFeedback("");
      toast.success("Application draft generated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine() {
    if (!feedback.trim()) {
      toast.error("Please provide feedback for refinement.");
      return;
    }

    setLoading(true);
    const userFeedback = feedback.trim();
    setFeedback("");
    setStreamingContent("");

    // Add user message to conversation
    const updatedHistory = [
      ...conversationHistory,
      { role: "user" as const, content: userFeedback, timestamp: new Date() },
    ];
    setConversationHistory(updatedHistory);

    try {
      const res = await fetch("/api/ai-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "refine",
          feedback: userFeedback,
          conversationHistory,
          creativity,
          language,
          tone,
        }),
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

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: accumulated, timestamp: new Date() },
      ]);
      setStreamingContent("");
      toast.success("Application refined.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      // Remove user message on error
      setConversationHistory(conversationHistory);
    } finally {
      setLoading(false);
    }
  }

  function handleStartOver() {
    setStreamingContent("");
    setFeedback("");
    setConversationHistory([]);
    setFile(null);
    setJobPost("");
    setAge("");
    setCreativity(0.6);
    setTone("professional");
    setLanguage("en");
    setShowStartOverDialog(false);
    toast.success("Form reset. Ready to start over.");
  }
  function handleCopyMessage(content: string, index: number) {
    navigator.clipboard.writeText(content).then(
      () => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
        toast.success("Copied to clipboard");
      },
      () => toast.error("Copy failed"),
    );
  }
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4 md:p-6 lg:p-8">
      {/* Input Configuration Card */}
      <Card>
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setInputExpanded(!inputExpanded)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">AI Application Writer</CardTitle>
              <CardDescription>
                Upload your resume and configure generation settings
              </CardDescription>
            </div>
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                inputExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div
            className={`overflow-hidden transition-all duration-300 ${inputExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}
          >
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
                  <Select
                    value={language}
                    onValueChange={(v) => setLanguage(v)}
                  >
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
                <Button type="submit" disabled={loading || !!hasConversation}>
                  {loading
                    ? "Generating…"
                    : hasConversation
                      ? "Ready to refine"
                      : "Generate application"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Chat Conversation Card (always visible) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Conversation</CardTitle>
              {applicationText && (
                <CardDescription className="mt-1">
                  {wordCount} words • {applicationText.length} characters
                </CardDescription>
              )}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={() => setShowStartOverDialog(true)}
              className="btn-destructive-hover"
            >
              Start over
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[60vh] sm:max-h-[600px] overflow-y-auto space-y-4 sm:space-y-6 px-1 sm:px-0">
            {conversationHistory.length === 0 && !loading && (
              <div className="flex items-center justify-center py-12 text-center">
                <div className="max-w-md space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Fill in the form above and click{" "}
                    <strong>Generate application</strong> to create your first
                    draft.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Once generated, you can refine it using the quick
                    suggestions or custom feedback below.
                  </p>
                </div>
              </div>
            )}
            {conversationHistory.map((message, index) => (
              <div
                key={index}
                className={[
                  "flex gap-3 mb-4",
                  message.role === "user" ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={[
                    "group relative w-full sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border",
                  ].join(" ")}
                >
                  <div className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(message.content, index)}
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Copy message"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && !streamingContent && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="w-full sm:max-w-[80%] rounded-lg border bg-card px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating response…</span>
                  </div>
                </div>
              </div>
            )}
            {streamingContent && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="w-full sm:max-w-[80%] rounded-lg border bg-card px-3 py-2 sm:px-4 sm:py-3">
                  <div className="whitespace-pre-wrap break-words text-sm">
                    {streamingContent}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading || !hasConversation}
                  onClick={() => {
                    setFeedback(s);
                    setTimeout(() => handleRefine(), 0);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
            <Label htmlFor="feedback">Refine your application</Label>
            <Textarea
              id="feedback"
              placeholder="Ask for changes (e.g., 'Make it more enthusiastic', 'Add more details about my Python experience', 'Shorten the introduction')..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              disabled={loading || !hasConversation}
            />
            <Button
              type="button"
              onClick={handleRefine}
              disabled={loading || !hasConversation || !feedback.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? "Refining…" : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={showStartOverDialog}
        onOpenChange={setShowStartOverDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to start over?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all input fields, the generated result, and any
              refinement history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartOver}>
              Start over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
