import { LEETCODE_API_ADDRESS } from "@/constants";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const credentials = validateRequest(req);

    // find the already solved problems in db
    const user = await prisma.user.findFirst({
      where: {
        id: credentials.userId,
      },
      select: {
        completed_problem_ids: true,
      },
    });

    // store all the users submissions and filter down to requested
    const completedQuestionIds = user?.completed_problem_ids ?? [];

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

const validateRequest = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const difficulty = searchParams.get("difficulty");
  const userIdRaw = searchParams.get("userId");

  const userId = userIdRaw !== null ? parseInt(userIdRaw, 10) : null;

  if (userId === null || isNaN(userId)) {
    throw new Error("Invalid userId provided");
  }

  return { tag, difficulty, userId };
};
