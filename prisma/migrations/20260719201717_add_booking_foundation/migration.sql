-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'CONTACTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('WEBSITE', 'PHONE', 'ADMIN');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "carName" TEXT NOT NULL,
    "carSlug" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "rentalDays" INTEGER NOT NULL,
    "dailyRate" INTEGER NOT NULL,
    "rentalTotal" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "comment" TEXT,
    "consentAcceptedAt" TIMESTAMP(3) NOT NULL,
    "privacyVersion" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "source" "BookingSource" NOT NULL DEFAULT 'WEBSITE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_publicId_key" ON "Booking"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Booking_carId_idx" ON "Booking"("carId");

-- CreateIndex
CREATE INDEX "Booking_cityId_idx" ON "Booking"("cityId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_customerPhone_idx" ON "Booking"("customerPhone");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
