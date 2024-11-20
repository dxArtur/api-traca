/*
  Warnings:

  - Added the required column `hostId` to the `book_clubs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "book_clubs" ADD COLUMN     "hostId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "book_clubs" ADD CONSTRAINT "book_clubs_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
