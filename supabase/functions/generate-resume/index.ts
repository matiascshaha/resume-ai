import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { personalData, jobDescription, jobTitle, companyName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert resume writer and career coach. Your task is to create tailored, professional resumes and cover letters that match candidates' experiences to specific job requirements.

Guidelines:
- Extract relevant skills, experiences, and achievements from the candidate's data
- Match them precisely to the job requirements
- Use strong action verbs and quantify achievements where possible
- Format the resume professionally with clear sections
- Write a compelling cover letter that tells a story
- Be concise but impactful
- Use the exact job title and company name provided`;

    const userPrompt = `Create a tailored resume and cover letter for this candidate applying to ${jobTitle || "the role"} at ${companyName || "the company"}.

CANDIDATE'S BACKGROUND:
${personalData}

JOB DESCRIPTION:
${jobDescription}

Please respond with a JSON object containing two fields:
1. "resume" - A professionally formatted resume (as plain text with clear sections)
2. "coverLetter" - A compelling cover letter addressed to the hiring manager

Make sure both documents:
- Highlight the most relevant experiences for this specific role
- Use keywords from the job description naturally
- Are ready to be submitted without further editing`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse as JSON, fall back to splitting if needed
    let resume = "";
    let coverLetter = "";

    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        resume = parsed.resume || "";
        coverLetter = parsed.coverLetter || "";
      }
    } catch {
      // If JSON parsing fails, try to split by common markers
      const resumeMatch = content.match(/resume[:\s]*([\s\S]*?)(?=cover\s*letter|$)/i);
      const coverMatch = content.match(/cover\s*letter[:\s]*([\s\S]*)/i);
      
      resume = resumeMatch?.[1]?.trim() || content;
      coverLetter = coverMatch?.[1]?.trim() || "";
    }

    return new Response(
      JSON.stringify({ resume, coverLetter }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-resume:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
