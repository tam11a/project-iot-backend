/*
  Warnings:

  - Added the required column `status` to the `switch_state` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SwitchStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "remote_action" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "switch_state" ADD COLUMN     "status" "SwitchStatus" NOT NULL;
