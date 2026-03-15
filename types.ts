import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Product {
  name: string;
  tagline: string;
  features: string[];
  image: string;
  highlight?: boolean;
}

export interface ServicePoint {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface MachineSpec {
  label: string;
  value: string;
}

export interface MachineItem {
  id: number;
  image: string;
  images?: string[];
  badge?: string;
  subTitle: string;
  title: string;
  description: string;
  specs: MachineSpec[];
  features: string[];
  ctaText: string;
}
