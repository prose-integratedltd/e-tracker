-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_emailTemplateId_fkey";

-- AlterTable
ALTER TABLE "email_templates" ADD COLUMN     "attachments" TEXT[];
