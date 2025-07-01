import { LEETCODE_API_ADDRESS } from "@/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // query
    const query =
      'query submissionList($offset: Int!, $limit: Int!) {\n  submissionList(offset: $offset, limit: $limit) {\n    hasNext\n    submissions {\n      id\n      title\n      titleSlug\n      status\n      lang\n      timestamp\n    }\n  }\n}"';

    const res = await fetch(LEETCODE_API_ADDRESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
