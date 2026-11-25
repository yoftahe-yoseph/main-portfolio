import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import {
  buildPortfolioSystemInstruction,
  classifyGeminiError,
  resolveChatModel,
  sanitizeChatHistory,
  validateChatMessage,
} from '@/lib/chat-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY to enable the portfolio assistant.',
        },
        { status: 503 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const payload = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
    const validation = validateChatMessage(payload.message);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const history = sanitizeChatHistory(payload.history);
    const { model, label } = resolveChatModel(payload.mode);
    const systemInstruction = buildPortfolioSystemInstruction();

    const chat = ai.chats.create({
      model,
      history,
      config: {
        systemInstruction,
      },
    });

    const stream = await chat.sendMessageStream({
      message: validation.value,
    });

    // Pull the first chunk before returning HTTP 200 so upstream API errors
    // (invalid key, quota, unavailable model) surface with proper HTTP status codes.
    const iterator = stream[Symbol.asyncIterator]();
    const firstResult = await iterator.next();

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          if (!firstResult.done) {
            const firstText = firstResult.value?.text ?? '';
            if (firstText) {
              controller.enqueue(encoder.encode(firstText));
            }
          }

          while (true) {
            const next = await iterator.next();
            if (next.done) break;
            const text = next.value?.text ?? '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (streamErr) {
          controller.error(streamErr);
        }
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Chat-Model-Label': label,
      },
    });
  } catch (err) {
    console.error('Gemini chat route error:', err);
    const classified = classifyGeminiError(err);
    return NextResponse.json(
      { error: classified.message, code: classified.code },
      { status: classified.status }
    );
  }
}
