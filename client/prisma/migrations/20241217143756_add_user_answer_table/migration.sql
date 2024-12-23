-- CreateTable
CREATE TABLE "mockInterview" (
    "id" SERIAL NOT NULL,
    "jsonMockResp" TEXT NOT NULL,
    "jobPosition" TEXT NOT NULL,
    "jobDesc" TEXT NOT NULL,
    "jobExperience" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TEXT,
    "mockId" TEXT NOT NULL,

    CONSTRAINT "mockInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" SERIAL NOT NULL,
    "mockIdRef" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mockInterview_mockId_key" ON "mockInterview"("mockId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswer_mockIdRef_key" ON "UserAnswer"("mockIdRef");
