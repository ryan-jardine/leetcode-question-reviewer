import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const problemData = [
  {
    problem_id: 1,
    tags: ["dp"],
    difficulty: 1,
  },
];

async function main() {
  // Step 1: Seed problems
  const createdProblems = await Promise.all(
    problemData.map((problem) =>
      prisma.problem.create({
        data: problem,
      })
    )
  );

  // Step 2: Seed user and connect to a completed problem
  await prisma.user.create({
    data: {
      email: "ryanjardine43@gmail.com",
      completedProblems: {
        connect: createdProblems.map((p) => ({ id: p.id })),
      },
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed.");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
