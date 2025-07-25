-- AlterEnum
ALTER TYPE "StatusTask" ADD VALUE 'ACTIV';

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "is_notifed" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Accaunt" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accaunt_pkey" PRIMARY KEY ("id")
);
