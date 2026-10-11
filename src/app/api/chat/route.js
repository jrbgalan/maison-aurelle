import { NextResponse } from "next/server";
import OpenAI from "openai";
import { services } from "@/data/services";
import { specialists } from "@/data/specialists";
import { site } from "@/data/site";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  : null;

const SYSTEM_PROMPT = `You are the digital Concierge for Maison Aurelle, a quiet luxury beauty and skin atelier founded in Gangnam, Seoul, with a sister atelier in Kyoto.

Tone & Persona:
- Warm, poised, gentle, understated elegance ("luminous restraint").
- Speaks with deep care, quiet confidence, and thoughtful precision.
- Never aggressive, never clinical jargon without warmth.
- Short to medium length paragraphs; poetically clear.

Atelier Knowledge:
- Name: Maison Aurelle
- Philosophy: "An atelier of luminous restraint", "Rested, never changed". We blend Seoul dermatology precision with the peaceful stillness of a Japanese ryokan.
- Address: 12 Apgujeong-ro, Gangnam, Seoul
- Phone: +82 2 555 0148
- Hours: Monday – Friday (09:00 – 20:00), Saturday (09:00 – 18:00), Sunday (By appointment)
- Treatments:
  1. Facial & Skin Rejuvenation ("The Luminous Reset", $180 – $320, 75 mins, zero downtime)
  2. Injectables ("Sculpted Stillness", Dr. Mori micro-droplet technique, $320 – $900, 45–60 mins)
  3. Laser & Skin Resurfacing ("The Lumen Peel", $400 – $750, 60 mins, 3–5 days renewal)
  4. Body Contouring ("Quiet Sculpting", $500 – $1,200, 60–90 mins, non-invasive)
  5. Hair & Scalp ("Rooted Renewal", $160 – $280, 60 mins)
  6. Brows & Lashes ("The Frame", $90 – $220, 45–75 mins)

- Specialists:
  - Dr. Yuna Kang: Medical Director, Dermatology (Yonsei University MD, board-certified).
  - Dr. Haru Mori: Aesthetic Physician, specialist in calligraphic micro-droplet injectables (Keio University MD).
  - Soo-min Lee: Lead Aesthetician (CIDESCO certified, Korean skin-barrier ritual).
  - Aiko Tanaka: Senior Aesthetician (brow architecture, lash mastery).
  - Jia Park: Aesthetic Nurse (Seoul National University RN).
  - Emi Sato: Aesthetic Nurse (Kyoto University RN, body contouring).

- Booking:
  Invite guests to reserve directly through our /booking page or offer to guide their consultation.`;

// Intelligent luxury fallback assistant when OpenAI quota or network is temporarily limited
function generateFallbackConciergeReply(userMessage) {
  const query = userMessage.toLowerCase();

  if (query.includes("book") || query.includes("appointment") || query.includes("reserve") || query.includes("schedule")) {
    return {
      text: "We would be delighted to welcome you to the atelier. You can choose your preferred treatment, specialist, and date anytime on our [Booking Page](/booking). If you need assistance choosing a treatment, I am right here with you. ✦",
      action: { type: "route", href: "/booking" }
    };
  }

  if (query.includes("dr") || query.includes("specialist") || query.includes("doctor") || query.includes("kang") || query.includes("mori") || query.includes("team")) {
    return {
      text: "Our atelier is led by Dr. Yuna Kang (Medical Director, Dermatology) and Dr. Haru Mori (Aesthetic Physician), alongside our master aestheticians Soo-min Lee and Aiko Tanaka, and registered nurses Jia Park and Emi Sato. Each practitioner was chosen as much for their stillness as for their medical mastery. Would you like to explore their profiles at [Our Specialists](/specialists)? ✦",
      action: { type: "route", href: "/specialists" }
    };
  }

  if (query.includes("price") || query.includes("cost") || query.includes("rate") || query.includes("how much") || query.includes("investment")) {
    return {
      text: "Our signature rituals range from $90 for architectural lash & brow sculpting up to $1,200 for bespoke body contouring sessions. Our signature facial, The Luminous Reset, is $180 – $320 (75 minutes). Every consultation begins with a transparent, personalized skin analysis with no unexpected fees. ✦",
      action: { type: "route", href: "/treatments" }
    };
  }

  if (query.includes("facial") || query.includes("skin") || query.includes("luminous") || query.includes("reset") || query.includes("glow")) {
    return {
      text: "Our signature ritual is **The Luminous Reset** — a 75-minute bespoke sequence layering gentle enzymatic renewal, lymphatic drainage, and nutrient infusion under calming LED light. You leave with immediate dewy clarity and zero downtime. ✦",
      action: { type: "route", href: "/treatments/facial-skin-rejuvenation" }
    };
  }

  if (query.includes("inject") || query.includes("botox") || query.includes("filler") || query.includes("wrinkle")) {
    return {
      text: "Under Dr. Haru Mori's micro-droplet philosophy, injectables at Maison Aurelle are placed with calligraphic restraint. The goal is never to freeze or transform, but to restore rested volume where light naturally falls — you, resting at your best. ✦",
      action: { type: "route", href: "/treatments/injectables" }
    };
  }

  if (query.includes("location") || query.includes("where") || query.includes("address") || query.includes("hour") || query.includes("open") || query.includes("phone")) {
    return {
      text: `Maison Aurelle is located at ${site.address}. We are open Monday to Friday from 9:00 to 20:00, Saturday 9:00 to 18:00, and Sunday by appointment. You may reach our private concierge directly at ${site.phone}. ✦`,
      action: { type: "route", href: "/contact" }
    };
  }

  return {
    text: "At Maison Aurelle, we approach skincare and aesthetics as a quiet ritual of refinement. Whether you wish to experience our signature Luminous Reset facial, discuss subtle micro-droplet contouring with Dr. Mori, or find a restorative moment in our Gangnam atelier, I am here to guide you. How may I care for your visit today? ✦"
  };
}

export async function POST(req) {
  try {
    const { messages, userMessage } = await req.json();

    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(Array.isArray(messages)
        ? messages.map((m) => ({
            role: m.from === "bot" ? "assistant" : "user",
            content: m.text,
          }))
        : []),
    ];

    if (userMessage && (!messages || messages[messages.length - 1]?.text !== userMessage)) {
      formattedMessages.push({ role: "user", content: userMessage });
    }

    // Try OpenAI completion
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 450,
        });

        const replyText = completion.choices[0]?.message?.content?.trim();
        if (replyText) {
          return NextResponse.json({
            reply: replyText,
            source: "openai",
          });
        }
      } catch (openaiErr) {
        console.warn("OpenAI API call returned error, utilizing concierge engine:", openaiErr.message);
      }
    }

    // Fallback concierge engine
    const lastPrompt = userMessage || (messages && messages[messages.length - 1]?.text) || "";
    const fallback = generateFallbackConciergeReply(lastPrompt);

    return NextResponse.json({
      reply: fallback.text,
      action: fallback.action || null,
      source: "concierge_engine",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Our concierge is attending to guests in the atelier. Please feel free to explore our treatments or book directly online. ✦",
        source: "fallback",
      },
      { status: 200 }
    );
  }
}

