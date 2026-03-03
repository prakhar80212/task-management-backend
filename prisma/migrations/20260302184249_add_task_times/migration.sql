/*
  Warnings:

  - The values [PENDING,COMPLETED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('Pending', 'InProgress', 'Completed');
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'Pending';
