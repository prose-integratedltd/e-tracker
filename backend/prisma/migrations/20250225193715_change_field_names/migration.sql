/*
  Warnings:

  - You are about to drop the column `subtitle` on the `job_status_updates` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `job_status_updates` table. All the data in the column will be lost.
  - Added the required column `header` to the `job_status_updates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_status_updates" DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "header" TEXT NOT NULL;
