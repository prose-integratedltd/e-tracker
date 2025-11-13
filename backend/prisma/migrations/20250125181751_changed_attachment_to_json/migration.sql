/*
  Warnings:

  - Changed the type of `attachments` on the `email_templates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "email_templates" DROP COLUMN "attachments",
ADD COLUMN     "attachments" JSONB NOT NULL;
