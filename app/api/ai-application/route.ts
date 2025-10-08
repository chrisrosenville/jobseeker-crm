import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

// @ts-expect-error - Expecting error since we're not importing from the default index file in the package.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume");
    const jobPost = String(formData.get("jobPost") ?? "");
    const creativity = Number(formData.get("creativity") ?? 0.6);
    const age = String(formData.get("age") ?? "");
    const tone = String(formData.get("tone") ?? "professional");
    const language = String(formData.get("language") ?? "en");

    if (!resumeFile || !(resumeFile instanceof File)) {
      return NextResponse.json(
        { message: "Missing resume PDF upload" },
        { status: 400 }
      );
    }

    if (!age || Number.isNaN(Number(age))) {
      return NextResponse.json(
        { message: "Invalid or missing age" },
        { status: 400 }
      );
    }

    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const resumeText = await pdfParse(resumeBuffer);

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
    Given a candidate's resume text, age, and an optional job post, craft a tailored job application/cover letter.

    Guidelines:
    - Output language: ${language}.
    - Tone: ${tone}. Adjust the writing style accordingly:
      * Formal: Use formal language, avoid contractions, maintain professional distance
      * Professional: Balanced professional tone, some personality but still formal
      * Conversational: More natural, use contractions, friendly but professional
      * Friendly: Warm and approachable, show personality while staying professional
      * Enthusiastic: Energetic and passionate, use strong action words and excitement
    - Emphasize relevant skills and experience matching the job post when provided.
    - Keep it concise (max 1 page), compelling, and specific.
    - Avoid fabricating facts beyond the resume.
    - Include a strong opening, body aligned to the role, and a courteous closing.
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
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      top_p: Math.min(Math.max(creativity, 0.1), 1), // 0.1 to 1.0 based on slider
      max_tokens: 800,
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
