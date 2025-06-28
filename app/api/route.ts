import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const difficulty = searchParams.get("difficulty");
    //const responseData = { tag, difficulty };

    // query the LC to find these

    // return new Response(JSON.stringify(responseData), {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
