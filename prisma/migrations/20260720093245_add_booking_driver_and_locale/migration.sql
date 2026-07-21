-- CreateEnum
CREATE TYPE "BookingLocale" AS ENUM ('RU', 'EN', 'UK', 'HE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingLocale" "BookingLocale" NOT NULL DEFAULT 'RU',
ADD COLUMN     "withDriver" BOOLEAN NOT NULL DEFAULT false;
