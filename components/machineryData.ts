import { MachineItem } from '../types';
import { IMAGES } from '../images';

// --- Data: Electric Lifting Platforms ---
export const liftingPlatforms: MachineItem[] = [
  {
    id: 1,
    image: IMAGES.fleet.sb7500,
    badge: "Korea Best Seller",
    subTitle: "SB-7500 Table Scissors",
    title: "SB-7500 Electric Lift",
    description: "The market leader in Korea. This advanced Table Scissors lift features a unique 4-section expandable working plate (up to 4-5m span) and robust 10° auto-leveling for ultimate safety on sloped orchard terrain.",
    specs: [
      { label: "Working Height", value: "4.5 Meters" },
      { label: "Max Load", value: "800kg" },
      { label: "Width", value: "1.4m Compact" },
      { label: "Leveling", value: "10° Auto" }
    ],
    features: ["LFP Battery Equipped", "9-Hour Runtime", "Optional Solar Cabin", "Expanded 4-Section Plate"],
    ctaText: "Get SB-7500 Specs"
  },
  {
    id: 2,
    image: IMAGES.fleet.sb3500,
    badge: "Multi-Purpose",
    subTitle: "SB-3500 Crawler",
    title: "SB-3500 Crawler Carrier",
    description: "A versatile electric crawler carrier combining transport, lifting, and dumping capabilities. Features a 3-way expandable cargo box and remote control operation for maximum utility.",
    specs: [
      { label: "Max Load", value: "500kg" },
      { label: "Lift Height", value: "1.4m Max" },
      { label: "Width", value: "1.2m Compact" },
      { label: "Function", value: "Lift & Dump" }
    ],
    features: ["3-Way Expandable Cargo", "Hydraulic Dump Function", "Remote Control System", "Auto-Driving Mode"],
    ctaText: "Get SB-3500 Specs"
  },
  {
    id: 3,
    image: IMAGES.fleet.sb8000n,
    badge: "Boom Specialist",
    subTitle: "SB-8000N Boom Lift",
    title: "SB-8000N Boom Lift",
    description: "An advanced Boom Lifting Type machine offering infinite 360-degree rotation for maximum workability. The 2-step boom operation and 10° auto-leveling ensure efficiency and safety at height.",
    specs: [
      { label: "Working Height", value: "5.5 Meters" },
      { label: "Rotation", value: "360° Infinite" },
      { label: "Width", value: "1.35m" },
      { label: "Leveling", value: "10° Auto" }
    ],
    features: ["2-Step Boom Operation", "Infinite 360° Rotation", "Auto Level Adjustment", "AC Motor System"],
    ctaText: "Get SB-8000N Specs"
  }
];

// --- Data: Electric Transport Vehicles ---
export const transportVehicles: MachineItem[] = [
  {
    id: 4,
    image: IMAGES.fleet.sb9000,
    badge: "Multi-Functional",
    subTitle: "SB-9000 Multi-Purpose",
    title: "SB-9000 Lifter & Fork",
    description: "A revolutionary multi-functional unit featuring a detachable work platform. Seamlessly converts between an Electric Lifter and Fork Lifter. Equipped with advanced tilting and side-shifting for precision in 3-4m orchard rows.",
    specs: [
      { label: "Max Height", value: "4.3m Work" },
      { label: "Max Load", value: "800kg" },
      { label: "Width", value: "1.2m" },
      { label: "Function", value: "Lift & Fork" }
    ],
    features: ["Detachable Work Platform", "Wireless Remote Charging", "6°/12° Tilting System", "Side Shifting Capability"],
    ctaText: "Get SB-9000 Specs"
  },
  {
    id: 5,
    image: IMAGES.fleet.sev500,
    badge: "3-in-1 Utility",
    subTitle: "SEV-500 Electric Carter",
    title: "SEV-500 Electric Carter",
    description: "A versatile 3-in-1 electric carter combining driving, dumping, and lifting capabilities. Equipped with Electric Power Steering (EPS) and a differential lock for superior handling on rough orchard terrain.",
    specs: [
      { label: "Max Load", value: "600kg" },
      { label: "Lift Height", value: "1.52m" },
      { label: "Motor", value: "5.0kW AC" },
      { label: "Function", value: "Drive/Dump/Lift" }
    ],
    features: ["Electric Power Steering (EPS)", "Wireless Remote Control", "Anti-Roll Back System", "Hydraulic Dump & Lift"],
    ctaText: "Get SEV-500 Specs"
  }
];

// --- Data: Autonomous Sprayer ---
export const autonomousSprayerData = {
  image: IMAGES.fleet.autonomousSprayer,
  youtubeId: "tv5FJkGnnRw", // Updated YouTube ID
  title: "Autonomous Driving Sprayer",
  description: "The SB-1000SS establishes a new standard with its RTK GNSS system. This 1,000L Hybrid Sprayer combines electric driving with a 34HP diesel spraying engine, achieving a massive 23,000L daily work capacity."
};