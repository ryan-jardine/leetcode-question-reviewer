import { LEETCODE_API_ADDRESS } from "@/constants";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const credentials = validateRequest(req);

    // find the users solved problems in db
    const completedProblemIds = await prisma.user.findUnique({
      where: { id: credentials.userId },
      select: {
        completedProblems: {
          where: {
            tags: { has: credentials.tag },
          },
          select: { problem_id: true },
        },
      },
    });

    const possibleProblemIds =
      completedProblemIds?.completedProblems.map((p) => p.problem_id) ?? [];

    // we now need to choose a random one to give the user for practice
    const randomIndex = Math.floor(Math.random() * possibleProblemIds.length);
    const randomProblem = possibleProblemIds[randomIndex];

    return Response.json({ randomProblem }, { status: 200 });
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
