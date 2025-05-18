-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL,
    "accountUid" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "Token_pkey" PRIMARY KEY ("token")
);
