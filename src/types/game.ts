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

export interface OperationsTallyRow {
  id: string;
  basin: string;
  roleScope: string;
  software: string;
  outcome: string;
  category?: 'interpretation' | 'wellsite' | 'ai_data';
}

export interface TechnicalReport {
  id: string;
  title: string;
  category: 'interpretation' | 'wellsite' | 'ai_data';
  institution: string;
  period: string;
  summary: string;
}

export interface SpecializedTraining {
  id: string;
  title: string;
  issuer: string;
  category: 'interpretation' | 'wellsite' | 'ai_data';
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  bullets: string[];
}

export type PortraitExpressionId =
  | 'wicked_smirk'
  | 'caffeine_overdrive'
  | 'loupe_cyclops'
  | 'blowout_sweat'
  | 'helium_chipmunk'
  | 'matrix_hacker'
  | 'centre_back'
  | 'kimberlite_eureka'
  | 'shift_zombie'
  | 'deal_with_it';

export interface PortraitExpression {
  id: PortraitExpressionId;
  name: string;
  quote: string;
  triggerText: string;
  sound: {
    freq: number;
    type: OscillatorType;
    duration: number;
  };
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
  operationsTally?: OperationsTallyRow[];
  technicalReports?: TechnicalReport[];
  specializedTraining?: SpecializedTraining[];
  customSections?: CustomSection[];
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
