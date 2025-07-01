import prisma from "@/lib/prisma";
import {
  LEETCODE_API_ADDRESS,
  LEETCODE_COOKIE,
  LEETCODE_FULL_QUERY,
  LEETCODE_QUESTION_ACCEPTED_STATUS,
  LEETCODE_QUESTIONID_QUERY,
  LEETCODE_REFERER,
} from "@/constants";
import { NextRequest } from "next/server";

const LIMIT = 20;

export async function GET(req: NextRequest) {
  try {
    const userId = validateRequest(req);

    // get already completed problems from local DB
    const completed = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        completedProblems: {
          select: { problem_id: true },
        },
      },
    });

    // store the unique ids
    const alreadySolved = new Set(
      completed?.completedProblems.map((p) => p.problem_id) ?? []
    );

    // data from leetcode needs to be batched in groups of 20
    let offset = 0;
    let hasNext = true;
    const newlyAcceptedProblemIds: number[] = [];
    const seenTitleSlugs = new Set<string>();

    while (hasNext) {
      const query = LEETCODE_FULL_QUERY;

      const res = await fetch(`${LEETCODE_API_ADDRESS}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: LEETCODE_COOKIE,
          Referer: LEETCODE_REFERER,
          "x-csrftoken": LEETCODE_REFERER,
        },
        body: JSON.stringify({
          query,
          variables: {
            offset,
            limit: LIMIT,
          },
        }),
      });

      const json = await res.json();
      const submissions = json.data.submissionList.submissions;

      // Extract new accepted problems
      for (const sub of submissions) {
        if (
          sub.status === LEETCODE_QUESTION_ACCEPTED_STATUS &&
          !seenTitleSlugs.has(sub.titleSlug)
        ) {
          seenTitleSlugs.add(sub.titleSlug);

          const frontendId = await getFrontendQuestionId(sub.titleSlug);

          if (
            frontendId !== null &&
            !alreadySolved.has(frontendId) &&
            !newlyAcceptedProblemIds.includes(frontendId)
          ) {
            newlyAcceptedProblemIds.push(frontendId);
          }
        }
      }

      hasNext = json.data.submissionList.hasNext;
      offset += LIMIT;
    }

    // we need to insert all the new values into the database
    console.log("NEW IDS: ", newlyAcceptedProblemIds);
    return new Response(JSON.stringify({ newlyAcceptedProblemIds }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Sync failed", { status: 500 });
  }
}

async function getFrontendQuestionId(
  titleSlug: string
): Promise<number | null> {
  const query = LEETCODE_QUESTIONID_QUERY;

  const res = await fetch(`${LEETCODE_API_ADDRESS}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: LEETCODE_COOKIE,
      Referer: LEETCODE_REFERER,
      "x-csrftoken": LEETCODE_REFERER,
    },
    body: JSON.stringify({
      query,
      variables: { titleSlug },
    }),
  });

  const json = await res.json();
  return json?.data?.question?.questionId ?? null;
}

const validateRequest = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const userIdRaw = searchParams.get("userId");

  const userId = userIdRaw !== null ? parseInt(userIdRaw, 10) : null;

  if (userId === null || isNaN(userId)) {
    throw new Error("Invalid userId provided");
  }

  return userId;
};
