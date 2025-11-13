/*
  Warnings:

  - You are about to drop the column `description` on the `job_status_updates` table. All the data in the column will be lost.
  - Added the required column `subtitle` to the `job_status_updates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `job_status_updates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_status_updates" DROP COLUMN "description",
ADD COLUMN     "subtitle" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
