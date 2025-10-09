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
    const formData = await request.formData();
    const resumeFile = formData.get("resume");

    const schema = z.object({
      jobPost: z.string().max(10_000).optional().default(""),
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
          .default("professional")
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
          .default("en")
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
        { status: 400 }
      );
    }

    const { jobPost, creativity, age, tone, language } = parsed.data;

    if (!resumeFile || !(resumeFile instanceof File)) {
      return NextResponse.json(
        { message: "Missing resume PDF upload" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!openai.apiKey) {
      return NextResponse.json(
        { message: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `
    You are an expert job application writer. 
    Given a candidate's resume text, age, tone, and an optional job post, craft a tailored job application/cover letter.
    Sound warm, approachable and human.

    Template:
    

    Guidelines:
    - Output language: ${language}.
    - Creativity level from 0.1 to 1.0: ${creativity}.
    - Tone: ${tone}. Adjust the writing style accordingly:
      * Formal: Use formal language, avoid contractions, maintain professional distance
      * Professional: Balanced professional tone, some personality but still formal
      * Conversational: More natural, use contractions, friendly but professional
      * Friendly: Warm and approachable, show personality while staying professional
      * Enthusiastic: Energetic and passionate, use strong action words and excitement
    - Emphasize relevant skills and experience matching the job post when provided.
    - Describe professional competencies and qualifications. Use concrete examples to go into depth with without fabrication.
    - Describe why the user is applying for the job. It's not enough to simply write that the user is interested in the job.
    - Describe how the user handles tasks and how the user is perceived by colleagues.
    - Make sure it's easy to read.
    - Keep it concise (max 1 page), compelling, and specific.
    - Avoid fabricating facts beyond the resume.
    - Include a strong opening, body aligned to the role, and a courteous closing.
    - Vary sentence length. Mix short direct sentences with longer ones.
    - End with a polite, simple closing (e.g., "Thanks for your time," / "Looking forward to hearing from you").
    - Avoid clichés like "I am writing to express my interest" or "It would be an honor."
    - Do NOT restate every requirement in the job posting.
    - Do absolutely NOT use em dashes, en dashes or regular dashes to insert a break in thought, emphasize contrast, or replace parentheses or commas.
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

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_completion_tokens: 5000,
    });

    const content =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Unable to generate application text.";

    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
