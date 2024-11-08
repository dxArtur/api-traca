/*
  Warnings:

  - You are about to drop the column `userId` on the `ratings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorId,bookId]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_fkey";

-- DropIndex
DROP INDEX "ratings_userId_bookId_key";

-- AlterTable
ALTER TABLE "ratings" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_authorId_bookId_key" ON "ratings"("authorId", "bookId");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
