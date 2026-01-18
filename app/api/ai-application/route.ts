import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { z } from "zod";

// @ts-expect-error - Expecting error since we're not importing from the default index file in the package.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated)
    return new NextResponse("Unauthorized", { status: 401 });

  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const contentType = request.headers.get("content-type");

    // Check if this is a refinement request (JSON body)
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      const { mode, feedback, conversationHistory, language, tone } = body;

      if (mode !== "refine") {
        return NextResponse.json(
          { message: "Invalid mode for JSON request" },
          { status: 400 },
        );
      }

      if (
        !feedback ||
        typeof feedback !== "string" ||
        feedback.trim().length === 0
      ) {
        return NextResponse.json(
          { message: "Feedback is required for refinement" },
          { status: 400 },
        );
      }

      if (
        !Array.isArray(conversationHistory) ||
        conversationHistory.length === 0
      ) {
        return NextResponse.json(
          { message: "Conversation history is required for refinement" },
          { status: 400 },
        );
      }

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      if (!openai.apiKey) {
        return NextResponse.json(
          { message: "OpenAI API key not configured" },
          { status: 500 },
        );
      }

      const systemPrompt = `
You're refining a job application. Keep the person's voice—don't make it sound more corporate or robotic.

Language: ${language || "en"}. Tone: ${tone || "professional"}.

Apply the user's feedback precisely. If they ask for "more energy," add that. If they want "shorter," cut the fluff. But don't lose what makes this application sound like a real person.

Don't add clichés, corporate jargon, or overly formal language unless that's specifically what they asked for.

Keep it under 1 page. Make sure the edits feel natural, not like a template.
      `;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...conversationHistory,
        {
          role: "user" as const,
          content: `Please refine the application based on this feedback: ${feedback}`,
        },
      ];

      const stream = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages,
        max_completion_tokens: 5000,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Original flow: FormData for initial generation
    const formData = await request.formData();
    const resumeFile = formData.get("resume");

    const schema = z.object({
      jobPost: z.string().min(100).max(10_000).default(""),
      creativity: z
        .string()
        .transform((v) => Number(v))
        .refine((n) => !Number.isNaN(n), { message: "Invalid creativity" })
        .transform((n) => Math.min(Math.max(n, 0.1), 1)),
      age: z
        .string()
        .transform((v) => Number(v))
        .refine((n) => Number.isInteger(n) && n >= 14 && n <= 100, {
          message: "Invalid age",
        }),
      tone: z.preprocess(
        (v) => String(v ?? "").toLowerCase(),
        z
          .enum([
            "formal",
            "professional",
            "conversational",
            "friendly",
            "enthusiastic",
          ])
          .default("professional"),
      ),
      language: z.preprocess(
        (v) => String(v ?? "").toLowerCase(),
        z
          .enum([
            "en",
            "de",
            "fr",
            "es",
            "it",
            "nl",
            "sv",
            "da",
            "no",
            "fi",
            "pl",
            "pt",
          ])
          .default("en"),
      ),
    });

    const parsed = schema.safeParse({
      jobPost: formData.get("jobPost") ?? "",
      creativity: formData.get("creativity") ?? "0.6",
      age: formData.get("age") ?? "",
      tone: formData.get("tone") ?? "professional",
      language: formData.get("language") ?? "en",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const { jobPost, age, tone, language } = parsed.data;

    if (!resumeFile || !(resumeFile instanceof File)) {
      return NextResponse.json(
        { message: "Missing resume PDF upload" },
        { status: 400 },
      );
    }

    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const resumeParsed = await pdfParse(resumeBuffer);

    type PdfParseResult = { text?: string };
    const pdfResult = resumeParsed as PdfParseResult;
    const resumeText = pdfResult.text?.trim().slice(0, 120_000) || "";

    if (!resumeText) {
      return NextResponse.json(
        { message: "Could not extract text from the PDF" },
        { status: 400 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!openai.apiKey) {
      return NextResponse.json(
        { message: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const systemPrompt = `
You're writing a job application for a ${age}-year-old professional. The hiring manager will read dozens of these—yours needs to feel genuinely human, not templated.

Language: ${language}. Keep the tone ${tone === "formal" ? "professional and respectful" : tone === "professional" ? "confident but personable" : tone === "conversational" ? "natural and warm" : tone === "friendly" ? "warm and approachable" : "energetic and passionate"}.

Here's what actually works:

1. Start with real motivation. Not "I'm excited about this role." Instead: Why does this specific job matter to this person? What problem does it solve for them? What excites them about it?

2. Show, don't tell. Instead of listing "strong problem-solver," show them solving a real problem from the resume with specific context and outcome.

3. Make the connection explicit. Which resume skills directly matter for this role? Help the hiring manager see the fit without spelling everything out.

4. Sound like a real person. Use natural sentence variety. Include personality without being unprofessional. Contractions are fine. Avoid corporate buzzwords.

5. Keep it concise and scannable. Less than 1 page. Make it easy to follow without a formal structure.

What NOT to do:
- Don't open with "I am writing to express my interest"
- Don't fabricate skills or experience
- Don't repeat every job requirement back
- Don't sound generic—make it personal to this person and this role
- Don't use em-dashes or en-dashes

The goal: A hiring manager reads this and thinks "Okay, I get who this person is and why they care about this role."
`;

    const userPrompt = [
      `Candidate age: ${age}`,
      jobPost ? `Job Post:\n${jobPost}` : undefined,
      `Resume Text:\n${resumeText}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    console.log("System Prompt:", systemPrompt);
    console.log("User Prompt:", userPrompt);

    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_completion_tokens: 5000,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
