-- CreateTable
CREATE TABLE "Rsvp" (
    "id" UUID NOT NULL,
    "dateTimeCreated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mealOption" TEXT NOT NULL,
    "dateTimeCreated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rsvpId" UUID NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Guest_email_idx" ON "Guest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_firstName_lastName_key" ON "Guest"("firstName", "lastName");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "Rsvp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
