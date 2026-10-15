// Types for Geology Quest: Basin to Bit

export interface PlayerProfile {
  name: string;
  title: string;
  organization: string;
  cpf: string;
  doj: string;
  email: string;
  altEmail?: string;
  phone: string;
  linkedin: string;
  location: string;
  photo?: string;
  fieldPhoto?: string;
  artwork?: string;
  summary: string;
}

export interface PlayerStats {
  level: number;
  currentXP: number;
  maxXP: number;
  stamina: number;
  coffeeBoost: number;
  zeroLtiDays?: number;
  prospectsDefended?: number;
}

export interface Role {
  id: string;
  role: string;
  company: string;
  group?: string;
  period: string;
  location: string;
  badge: string;
  room?: string;
  arsenal?: string[];
  highlights: string[];
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  date: string;
  badge: string;
  xp: number;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  score: string;
  honors?: string;
}

export interface ResearchThesis {
  title: string;
  type: string;
  institution: string;
  period: string;
  skills?: string[];
  description: string;
}

export interface Fieldwork {
  area: string;
  title: string;
  mentors: string;
  highlights: string;
}

export interface Certification {
  name: string;
  issuer: string;
  grade?: string;
  topics?: string;
}

export interface Extracurricular {
  role: string;
  event: string;
  period: string;
  description: string;
}

export interface SkillsMatrix {
  subsurface: string[];
  wellsite: string[];
  unconventional: string[];
  programming: string[];
  design: string[];
}

export interface CareerData {
  player: PlayerProfile;
  stats: PlayerStats;
  roles: Role[];
  achievements: Achievement[];
  education: Education[];
  researchTheses: ResearchThesis[];
  fieldwork: Fieldwork[];
  skills: SkillsMatrix;
  certifications: Certification[];
  extracurriculars: Extracurricular[];
}

export type OutfitType = 'scholar' | 'lab' | 'rig';
export type DirectionType = 'down' | 'up' | 'left' | 'right';
export type LightingMode = 'day' | 'sunset' | 'night';

export interface Hotspot {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  specialType?: string;
  customData?: any;
}

export interface PropItem {
  id: string;
  spriteKey: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSolid: boolean;
}

export interface RockOutcrop {
  name: string;
  x: number;
  y: number;
  type: string;
}
