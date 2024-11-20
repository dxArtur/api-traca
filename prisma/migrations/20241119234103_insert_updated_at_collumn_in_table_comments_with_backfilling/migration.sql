/*
  Warnings:

  - Added the required column `updatedAt` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments"
ADD COLUMN "updatedAt" TIMESTAMP;

UPDATE "comments"
SET "updatedAt" = "createdAt";
