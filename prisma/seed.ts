import { ProblemDifficulty } from "@/interfaces/difficulty";
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();
const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const LIMIT = 50;

async function fetchProblems(skip: number) {
  const query = `
    query problemsetQuestionListV2($limit: Int, $skip: Int) {
      problemsetQuestionListV2(limit: $limit, skip: $skip) {
        questions {
          questionFrontendId
          titleSlug
          difficulty
          topicTags {
            name
          }
        }
        hasMore
      }
    }
  `;

  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        limit: LIMIT,
        skip,
      },
    }),
  });

  const json = await res.json();
  return json.data.problemsetQuestionListV2;
}

function difficultyToNumber(difficulty: string): number {
  switch (difficulty) {
    case "EASY":
      return ProblemDifficulty.Easy;
    case "MEDIUM":
      return ProblemDifficulty.Medium;
    case "HARD":
      return ProblemDifficulty.Hard;
    default:
      return 0;
  }
}

async function main() {
  let skip = 0;
  let hasMore = true;
  let totalInserted = 0;

  while (hasMore) {
    const { questions, hasMore: nextPage } = await fetchProblems(skip);

    for (const q of questions) {
      await prisma.problem.upsert({
        where: { problem_id: parseInt(q.questionFrontendId) },
        update: {
          tags: q.topicTags.map((tag: any) => tag.name),
          difficulty: difficultyToNumber(q.difficulty),
        },
        create: {
          problem_id: parseInt(q.questionFrontendId),
          tags: q.topicTags.map((tag: any) => tag.name),
          difficulty: difficultyToNumber(q.difficulty),
        },
      });

      totalInserted++;
    }

    console.log(`Inserted ${totalInserted} problems so far...`);
    skip += LIMIT;
    hasMore = nextPage;
  }

  console.log(`✅ Seeded ${totalInserted} LeetCode problems`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Failed:", e);
    return prisma.$disconnect();
  });
