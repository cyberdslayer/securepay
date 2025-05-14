-- AlterTable
ALTER TABLE "User" ADD COLUMN     "srpSalt" TEXT,
ADD COLUMN     "srpVerifier" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
