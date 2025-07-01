/*
  Warnings:

  - You are about to drop the column `completed_problem_ids` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "completed_problem_ids",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "tags" TEXT[],
    "difficulty" INTEGER NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompletedProblems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompletedProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompletedProblems_B_index" ON "_CompletedProblems"("B");

-- AddForeignKey
ALTER TABLE "_CompletedProblems" ADD CONSTRAINT "_CompletedProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompletedProblems" ADD CONSTRAINT "_CompletedProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
