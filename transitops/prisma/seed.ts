import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("transit123", 12);

  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "Fleet Manager" },
      update: {},
      create: {
        name: "Fleet Manager",
        permissions: JSON.stringify({
          dashboard: "full",
          fleet: "full",
          drivers: "view",
          trips: "view",
          maintenance: "full",
          fuel: "view",
          reports: "full",
          settings: "full",
        }),
      },
    }),
    prisma.role.upsert({
      where: { name: "Dispatcher" },
      update: {},
      create: {
        name: "Dispatcher",
        permissions: JSON.stringify({
          dashboard: "full",
          fleet: "view",
          drivers: "view",
          trips: "full",
          maintenance: "none",
          fuel: "none",
          reports: "view",
          settings: "none",
        }),
      },
    }),
    prisma.role.upsert({
      where: { name: "Safety Officer" },
      update: {},
      create: {
        name: "Safety Officer",
        permissions: JSON.stringify({
          dashboard: "view",
          fleet: "none",
          drivers: "full",
          trips: "view",
          maintenance: "none",
          fuel: "full",
          reports: "view",
          settings: "none",
        }),
      },
    }),
    prisma.role.upsert({
      where: { name: "Financial Analyst" },
      update: {},
      create: {
        name: "Financial Analyst",
        permissions: JSON.stringify({
          dashboard: "view",
          fleet: "view",
          drivers: "none",
          trips: "view",
          maintenance: "view",
          fuel: "full",
          reports: "full",
          settings: "none",
        }),
      },
    }),
  ]);

  const fleetManagerRole = roles[0];
  const dispatcherRole = roles[1];
  const safetyOfficerRole = roles[2];
  const financialAnalystRole = roles[3];

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "fleet@transitops.in" },
      update: {},
      create: {
        email: "fleet@transitops.in",
        passwordHash,
        fullName: "Priya Sharma",
        roleId: fleetManagerRole.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "dispatch@transitops.in" },
      update: {},
      create: {
        email: "dispatch@transitops.in",
        passwordHash,
        fullName: "Raven Singh",
        roleId: dispatcherRole.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "safety@transitops.in" },
      update: {},
      create: {
        email: "safety@transitops.in",
        passwordHash,
        fullName: "Carlos Rodriguez",
        roleId: safetyOfficerRole.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "finance@transitops.in" },
      update: {},
      create: {
        email: "finance@transitops.in",
        passwordHash,
        fullName: "Maya Patel",
        roleId: financialAnalystRole.id,
      },
    }),
  ]);

  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-AB-1234" },
      update: {},
      create: {
        registrationNumber: "MH-12-AB-1234",
        nameModel: "Tata Ace Gold",
        type: "Mini",
        maxLoadCapacity: 1000,
        odometer: 45000,
        acquisitionCost: 650000,
        status: "Available",
        region: "North",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-CD-5678" },
      update: {},
      create: {
        registrationNumber: "MH-12-CD-5678",
        nameModel: "Mahindra Bolero Pickup",
        type: "Van",
        maxLoadCapacity: 1500,
        odometer: 32000,
        acquisitionCost: 850000,
        status: "Available",
        region: "South",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-EF-9012" },
      update: {},
      create: {
        registrationNumber: "MH-12-EF-9012",
        nameModel: "Tata 407",
        type: "Truck",
        maxLoadCapacity: 3000,
        odometer: 78000,
        acquisitionCost: 1200000,
        status: "On Trip",
        region: "East",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-GH-3456" },
      update: {},
      create: {
        registrationNumber: "MH-12-GH-3456",
        nameModel: "Ashok Leyland Dost",
        type: "Mini",
        maxLoadCapacity: 1200,
        odometer: 28000,
        acquisitionCost: 720000,
        status: "Available",
        region: "West",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-IJ-7890" },
      update: {},
      create: {
        registrationNumber: "MH-12-IJ-7890",
        nameModel: "Eicher Pro 1110",
        type: "Truck",
        maxLoadCapacity: 5000,
        odometer: 55000,
        acquisitionCost: 1800000,
        status: "In Shop",
        region: "North",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-KL-1122" },
      update: {},
      create: {
        registrationNumber: "MH-12-KL-1122",
        nameModel: "Force Traveller 3350",
        type: "Van",
        maxLoadCapacity: 1800,
        odometer: 41000,
        acquisitionCost: 950000,
        status: "Available",
        region: "South",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-MN-3344" },
      update: {},
      create: {
        registrationNumber: "MH-12-MN-3344",
        nameModel: "Tata Ultra T.7",
        type: "Truck",
        maxLoadCapacity: 4000,
        odometer: 62000,
        acquisitionCost: 1500000,
        status: "Available",
        region: "East",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-OP-5566" },
      update: {},
      create: {
        registrationNumber: "MH-12-OP-5566",
        nameModel: "Mahindra Furio 7",
        type: "Truck",
        maxLoadCapacity: 3500,
        odometer: 38000,
        acquisitionCost: 1350000,
        status: "On Trip",
        region: "West",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-QR-7788" },
      update: {},
      create: {
        registrationNumber: "MH-12-QR-7788",
        nameModel: "Tata Winger",
        type: "Bus",
        maxLoadCapacity: 2000,
        odometer: 22000,
        acquisitionCost: 1100000,
        status: "Available",
        region: "North",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-ST-9900" },
      update: {},
      create: {
        registrationNumber: "MH-12-ST-9900",
        nameModel: "Honda City",
        type: "Sedan",
        maxLoadCapacity: 500,
        odometer: 18000,
        acquisitionCost: 1200000,
        status: "Retired",
        region: "South",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-UV-1111" },
      update: {},
      create: {
        registrationNumber: "MH-12-UV-1111",
        nameModel: "Toyota Innova Crysta",
        type: "Van",
        maxLoadCapacity: 1200,
        odometer: 35000,
        acquisitionCost: 1800000,
        status: "Available",
        region: "East",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "MH-12-WX-2222" },
      update: {},
      create: {
        registrationNumber: "MH-12-WX-2222",
        nameModel: "BharatBenz 1214R",
        type: "Truck",
        maxLoadCapacity: 4500,
        odometer: 48000,
        acquisitionCost: 1650000,
        status: "Available",
        region: "West",
      },
    }),
  ]);

  const drivers = await Promise.all([
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220200001234" },
      update: {},
      create: {
        name: "Rajesh Kumar",
        licenseNumber: "MH1220200001234",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2028-06-15"),
        contactNumber: "+91-9876543210",
        safetyScore: 92,
        status: "Available",
        safetyEvents: JSON.stringify([]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220190005678" },
      update: {},
      create: {
        name: "Amit Singh",
        licenseNumber: "MH1220190005678",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2027-03-22"),
        contactNumber: "+91-9876543211",
        safetyScore: 88,
        status: "Available",
        safetyEvents: JSON.stringify([]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220210009999" },
      update: {},
      create: {
        name: "Vikram Patel",
        licenseNumber: "MH1220210009999",
        licenseCategory: "HGV",
        licenseExpiry: new Date("2026-11-30"),
        contactNumber: "+91-9876543212",
        safetyScore: 75,
        status: "On Trip",
        safetyEvents: JSON.stringify(["Speeding - 2025-11", "Hard Brake - 2026-01"]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220180004444" },
      update: {},
      create: {
        name: "Suresh Yadav",
        licenseNumber: "MH1220180004444",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2026-07-01"),
        contactNumber: "+91-9876543213",
        safetyScore: 65,
        status: "Available",
        safetyEvents: JSON.stringify(["Hard Brake - 2025-08"]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220220007777" },
      update: {},
      create: {
        name: "Deepak Sharma",
        licenseNumber: "MH1220220007777",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2029-01-15"),
        contactNumber: "+91-9876543214",
        safetyScore: 95,
        status: "Off Duty",
        safetyEvents: JSON.stringify([]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220170003333" },
      update: {},
      create: {
        name: "Mohan Lal",
        licenseNumber: "MH1220170003333",
        licenseCategory: "HGV",
        licenseExpiry: new Date("2025-12-31"),
        contactNumber: "+91-9876543215",
        safetyScore: 45,
        status: "Suspended",
        safetyEvents: JSON.stringify(["Speeding - 2025-05", "Accident - 2025-09", "Signal Jump - 2026-01"]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220230008888" },
      update: {},
      create: {
        name: "Arjun Mehta",
        licenseNumber: "MH1220230008888",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2026-08-20"),
        contactNumber: "+91-9876543216",
        safetyScore: 82,
        status: "Available",
        safetyEvents: JSON.stringify([]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220200002222" },
      update: {},
      create: {
        name: "Harish Chandra",
        licenseNumber: "MH1220200002222",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2027-04-10"),
        contactNumber: "+91-9876543217",
        safetyScore: 90,
        status: "Available",
        safetyEvents: JSON.stringify([]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220190005555" },
      update: {},
      create: {
        name: "Kiran Joshi",
        licenseNumber: "MH1220190005555",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2025-06-30"),
        contactNumber: "+91-9876543218",
        safetyScore: 70,
        status: "Available",
        safetyEvents: JSON.stringify(["Speeding - 2025-03"]),
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "MH1220210001111" },
      update: {},
      create: {
        name: "Ravi Verma",
        licenseNumber: "MH1220210001111",
        licenseCategory: "HGV",
        licenseExpiry: new Date("2024-11-15"),
        contactNumber: "+91-9876543219",
        safetyScore: 55,
        status: "Available",
        safetyEvents: JSON.stringify(["Hard Brake - 2024-10", "Speeding - 2025-01"]),
      },
    }),
  ]);

  const vehicleOnTrip = vehicles.find((v) => v.status === "On Trip")!;
  const vehicleOnTrip2 = vehicles.filter((v) => v.status === "On Trip")[1]!;
  const driverOnTrip = drivers.find((d) => d.status === "On Trip")!;
  const dispatcherUser = users.find((u) => u.email === "dispatch@transitops.in")!;

  const trips = await Promise.all([
    prisma.trip.upsert({
      where: { tripCode: "TRP-00001" },
      update: {},
      create: {
        tripCode: "TRP-00001",
        vehicleId: vehicleOnTrip.id,
        driverId: driverOnTrip.id,
        createdById: dispatcherUser.id,
        source: "Mumbai Warehouse",
        destination: "Pune Distribution Center",
        cargoWeight: 2800,
        plannedDistance: 150,
        status: "Dispatched",
        dispatchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        startOdometer: vehicleOnTrip.odometer,
      },
    }),
    prisma.trip.upsert({
      where: { tripCode: "TRP-00002" },
      update: {},
      create: {
        tripCode: "TRP-00002",
        vehicleId: vehicleOnTrip2.id,
        driverId: drivers.find((d) => d.name === "Amit Singh")!.id,
        createdById: dispatcherUser.id,
        source: "Delhi Hub",
        destination: "Jaipur Depot",
        cargoWeight: 3200,
        plannedDistance: 280,
        status: "Dispatched",
        dispatchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        startOdometer: vehicleOnTrip2.odometer,
      },
    }),
    prisma.trip.upsert({
      where: { tripCode: "TRP-00003" },
      update: {},
      create: {
        tripCode: "TRP-00003",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-AB-1234")!.id,
        driverId: drivers.find((d) => d.name === "Vikram Patel")!.id,
        createdById: dispatcherUser.id,
        source: "Bangalore Central",
        destination: "Chennai Port",
        cargoWeight: 800,
        plannedDistance: 350,
        status: "Draft",
      },
    }),
    prisma.trip.upsert({
      where: { tripCode: "TRP-00004" },
      update: {},
      create: {
        tripCode: "TRP-00004",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-GH-3456")!.id,
        driverId: drivers.find((d) => d.name === "Suresh Yadav")!.id,
        createdById: dispatcherUser.id,
        source: "Hyderabad Yard",
        destination: "Vijayawada Terminal",
        cargoWeight: 1000,
        plannedDistance: 270,
        status: "Completed",
        dispatchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
        actualDistance: 275,
        fuelConsumed: 45,
        startOdometer: 27800,
        endOdometer: 28075,
        revenue: 25000,
      },
    }),
    prisma.trip.upsert({
      where: { tripCode: "TRP-00005" },
      update: {},
      create: {
        tripCode: "TRP-00005",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-QR-7788")!.id,
        driverId: drivers.find((d) => d.name === "Arjun Mehta")!.id,
        createdById: dispatcherUser.id,
        source: "Kolkata Depot",
        destination: "Bhubaneswar Hub",
        cargoWeight: 1500,
        plannedDistance: 420,
        status: "Cancelled",
        dispatchedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        cancelledAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
    }),
    prisma.trip.upsert({
      where: { tripCode: "TRP-00006" },
      update: {},
      create: {
        tripCode: "TRP-00006",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-KL-1122")!.id,
        driverId: drivers.find((d) => d.name === "Deepak Sharma")!.id,
        createdById: dispatcherUser.id,
        source: "Ahmedabad Center",
        destination: "Surat Warehouse",
        cargoWeight: 1600,
        plannedDistance: 265,
        status: "Draft",
      },
    }),
  ]);

  const maintenanceLogs = await Promise.all([
    prisma.maintenanceLog.upsert({
      where: { recordCode: "MNT-00001" },
      update: {},
      create: {
        recordCode: "MNT-00001",
        vehicleId: vehicles.find((v) => v.status === "In Shop")!.id,
        serviceType: "Engine Repair",
        description: "Engine overheating issue - replaced thermostat and coolant",
        cost: 25000,
        status: "Active",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.maintenanceLog.upsert({
      where: { recordCode: "MNT-00002" },
      update: {},
      create: {
        recordCode: "MNT-00002",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-AB-1234")!.id,
        serviceType: "Oil Change",
        description: "Regular service - oil and filter change",
        cost: 4500,
        status: "Active",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.maintenanceLog.upsert({
      where: { recordCode: "MNT-00003" },
      update: {},
      create: {
        recordCode: "MNT-00003",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-CD-5678")!.id,
        serviceType: "Brake Service",
        description: "Front brake pads replacement",
        cost: 8500,
        status: "Closed",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        closedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.maintenanceLog.upsert({
      where: { recordCode: "MNT-00004" },
      update: {},
      create: {
        recordCode: "MNT-00004",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-IJ-7890")!.id,
        serviceType: "Tire Replacement",
        description: "All 4 tires replaced - worn out",
        cost: 32000,
        status: "Closed",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        closedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  const fuelLogs = await Promise.all([
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00001" },
      update: {},
      create: {
        logCode: "FUEL-00001",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-AB-1234")!.id,
        logDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        liters: 45,
        costPerLiter: 98.5,
        totalCost: 4432.5,
        odometerAtFill: 44900,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00002" },
      update: {},
      create: {
        logCode: "FUEL-00002",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-CD-5678")!.id,
        logDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        liters: 60,
        costPerLiter: 98.5,
        totalCost: 5910,
        odometerAtFill: 31800,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00003" },
      update: {},
      create: {
        logCode: "FUEL-00003",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-EF-9012")!.id,
        logDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        liters: 120,
        costPerLiter: 97.0,
        totalCost: 11640,
        odometerAtFill: 77800,
        approvalStatus: "Pending",
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00004" },
      update: {},
      create: {
        logCode: "FUEL-00004",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-GH-3456")!.id,
        logDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        liters: 40,
        costPerLiter: 98.5,
        totalCost: 3940,
        odometerAtFill: 27800,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00005" },
      update: {},
      create: {
        logCode: "FUEL-00005",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-KL-1122")!.id,
        logDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        liters: 80,
        costPerLiter: 97.5,
        totalCost: 7800,
        odometerAtFill: 40800,
        approvalStatus: "Pending",
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00006" },
      update: {},
      create: {
        logCode: "FUEL-00006",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-MN-3344")!.id,
        logDate: new Date(),
        liters: 100,
        costPerLiter: 97.0,
        totalCost: 9700,
        odometerAtFill: 61800,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00007" },
      update: {},
      create: {
        logCode: "FUEL-00007",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-OP-5566")!.id,
        logDate: new Date(),
        liters: 150,
        costPerLiter: 97.0,
        totalCost: 14550,
        odometerAtFill: 37800,
        approvalStatus: "Pending",
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00008" },
      update: {},
      create: {
        logCode: "FUEL-00008",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-QR-7788")!.id,
        logDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        liters: 70,
        costPerLiter: 98.5,
        totalCost: 6895,
        odometerAtFill: 21800,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00009" },
      update: {},
      create: {
        logCode: "FUEL-00009",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-UV-1111")!.id,
        logDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        liters: 50,
        costPerLiter: 99.0,
        totalCost: 4950,
        odometerAtFill: 34800,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00010" },
      update: {},
      create: {
        logCode: "FUEL-00010",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-WX-2222")!.id,
        logDate: new Date(),
        liters: 180,
        costPerLiter: 96.5,
        totalCost: 17370,
        odometerAtFill: 47800,
        approvalStatus: "Pending",
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00011" },
      update: {},
      create: {
        logCode: "FUEL-00011",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-ST-9900")!.id,
        logDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        liters: 35,
        costPerLiter: 100.0,
        totalCost: 3500,
        odometerAtFill: 17900,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
    prisma.fuelLog.upsert({
      where: { logCode: "FUEL-00012" },
      update: {},
      create: {
        logCode: "FUEL-00012",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-IJ-7890")!.id,
        logDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        liters: 90,
        costPerLiter: 97.5,
        totalCost: 8775,
        odometerAtFill: 54800,
        approvalStatus: "Approved",
        approvedById: users[0].id,
      },
    }),
  ]);

  const expenses = await Promise.all([
    prisma.expense.upsert({
      where: { expenseCode: "EXP-00001" },
      update: {},
      create: {
        expenseCode: "EXP-00001",
        tripId: trips.find((t) => t.tripCode === "TRP-00004")!.id,
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-GH-3456")!.id,
        category: "Toll",
        amount: 1250,
        expenseDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        description: "Mumbai-Pune Expressway toll",
        approvalStatus: "Approved",
        approvedById: users[3].id,
      },
    }),
    prisma.expense.upsert({
      where: { expenseCode: "EXP-00002" },
      update: {},
      create: {
        expenseCode: "EXP-00002",
        tripId: trips.find((t) => t.tripCode === "TRP-00004")!.id,
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-GH-3456")!.id,
        category: "Parking",
        amount: 500,
        expenseDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        description: "Parking at Chennai Port",
        approvalStatus: "Approved",
        approvedById: users[3].id,
      },
    }),
    prisma.expense.upsert({
      where: { expenseCode: "EXP-00003" },
      update: {},
      create: {
        expenseCode: "EXP-00003",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-EF-9012")!.id,
        category: "Repair",
        amount: 15000,
        expenseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        description: "Emergency tire repair on highway",
        approvalStatus: "Approved",
        approvedById: users[3].id,
      },
    }),
    prisma.expense.upsert({
      where: { expenseCode: "EXP-00004" },
      update: {},
      create: {
        expenseCode: "EXP-00004",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-AB-1234")!.id,
        category: "Penalty",
        amount: 2000,
        expenseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        description: "Overloading fine at checkpost",
        approvalStatus: "Rejected",
        approvedById: users[3].id,
      },
    }),
    prisma.expense.upsert({
      where: { expenseCode: "EXP-00005" },
      update: {},
      create: {
        expenseCode: "EXP-00005",
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-KL-1122")!.id,
        category: "Miscellaneous",
        amount: 3500,
        expenseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        description: "Driver food and accommodation",
        approvalStatus: "Pending",
      },
    }),
    prisma.expense.upsert({
      where: { expenseCode: "EXP-00006" },
      update: {},
      create: {
        expenseCode: "EXP-00006",
        tripId: trips.find((t) => t.tripCode === "TRP-00001")!.id,
        vehicleId: vehicles.find((v) => v.registrationNumber === "MH-12-EF-9012")!.id,
        category: "Toll",
        amount: 1800,
        expenseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description: "Highway toll charges",
        approvalStatus: "Approved",
        approvedById: users[3].id,
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`📋 Created:`);
  console.log(`   - ${roles.length} roles`);
  console.log(`   - ${users.length} users (password: transit123)`);
  console.log(`   - ${vehicles.length} vehicles`);
  console.log(`   - ${drivers.length} drivers`);
  console.log(`   - ${trips.length} trips`);
  console.log(`   - ${maintenanceLogs.length} maintenance logs`);
  console.log(`   - ${fuelLogs.length} fuel logs`);
  console.log(`   - ${expenses.length} expense records`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });