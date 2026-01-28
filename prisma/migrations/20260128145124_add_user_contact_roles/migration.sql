/*
  Warnings:

  - The `role` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEMO', 'USER');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('RECRUITER', 'HIRING_MANAGER', 'REFERRAL', 'OTHER');

-- AlterEnum
ALTER TYPE "JobStatus" ADD VALUE 'GHOSTED';

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "role",
ADD COLUMN     "role" "ContactRole";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
