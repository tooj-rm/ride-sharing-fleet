-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('available', 'on_trip', 'offline');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('requested', 'accepted', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Driver" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" "DriverStatus" NOT NULL,
    "currentRide" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" VARCHAR(50) NOT NULL,
    "riderId" VARCHAR(50) NOT NULL,
    "pickupLat" DOUBLE PRECISION NOT NULL,
    "pickupLng" DOUBLE PRECISION NOT NULL,
    "dropOfLat" DOUBLE PRECISION NOT NULL,
    "dropOfLng" DOUBLE PRECISION NOT NULL,
    "status" "RideStatus" NOT NULL,
    "driverId" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);
