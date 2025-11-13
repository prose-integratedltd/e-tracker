/*
  Warnings:

  - You are about to drop the `JobStatusUpdate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JobStatusUpdate" DROP CONSTRAINT "JobStatusUpdate_jobId_fkey";

-- DropTable
DROP TABLE "JobStatusUpdate";

-- CreateTable
CREATE TABLE "job_status_updates" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "location" JSONB NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_status_updates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_status_updates" ADD CONSTRAINT "job_status_updates_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
