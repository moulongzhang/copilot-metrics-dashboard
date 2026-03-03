import { NextRequest } from "next/server";
import { getOrCreateSession } from "@/lib/copilot-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId: existingSessionId } = body as {
      message: string;
      sessionId?: string;
    };

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { session, sessionId } = await getOrCreateSession(existingSessionId);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send session ID first
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "session", sessionId })}\n\n`
          )
        );

        const unsubDelta = session.on(
          "assistant.message_delta",
          (event) => {
            try {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "delta", content: event.data.deltaContent })}\n\n`
                )
              );
            } catch {
              // Stream may have been closed
            }
          }
        );

        const unsubIdle = session.on("session.idle", () => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
            );
            controller.close();
          } catch {
            // Stream may have been closed
          }
          unsubDelta();
          unsubIdle();
        });

        await session.send({ prompt: message });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
