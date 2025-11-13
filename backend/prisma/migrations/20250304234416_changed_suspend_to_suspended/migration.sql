/*
  Warnings:

  - You are about to drop the column `suspend` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "suspend",
ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false;
