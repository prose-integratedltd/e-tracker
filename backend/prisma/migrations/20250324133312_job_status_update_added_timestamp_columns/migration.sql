/*
  Warnings:

  - Added the required column `updatedAt` to the `job_status_updates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_status_updates" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
