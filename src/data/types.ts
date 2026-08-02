export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  degreeId: string;
  year: number;
  ects: number;
  skills: string[];
}

export interface Degree {
  id: string;
  name: string;
  faculty: string;
  coreSkills: string[];
}

export interface Career {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  requiredSkills: string[];
  tree: SkillNode[];
}

export interface SkillNode {
  id: string;
  skillId: string;
  tier: number;
  lane: number;
  requires: string[];
  xp: number;
  projects: string[];
  resources: string[];
  certifications: string[];
  quests: string[];
}

export type QuestKind = "main" | "side" | "project" | "certification" | "community" | "epic" | "daily" | "weekly";

export interface Quest {
  id: string;
  kind: QuestKind;
  title: string;
  description: string;
  xp: number;
  hours: number;
  difficulty: Difficulty;
  resumeImpact: number;
  skills: string[];
  dependencies: string[];
  reward?: string;
  semester?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlocksCosmetic?: string;
  xp: number;
}

export interface Cosmetic {
  id: string;
  name: string;
  slot: "outfit" | "shoes" | "backpack" | "accessory" | "laptop" | "pet" | "desk" | "plant" | "background" | "emote" | "title" | "aura";
  rarity: Rarity;
  emoji: string;
  unlockedBy: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  emoji: string;
  rarity: Rarity;
  personality: string;
}

export interface Building {
  id: string;
  name: string;
  emoji: string;
  levelRequired: number;
  description: string;
}

export type OpportunityKind =
  | "Hackathon"
  | "Community"
  | "Competition"
  | "Internship"
  | "Project"
  | "Scholarship"
  | "Meetup"
  | "Open Source";

export interface Opportunity {
  id: string;
  kind: OpportunityKind;
  title: string;
  org: string;
  location: string;
  duration: string;
  difficulty: Difficulty;
  match: number;
  xp: number;
  resumeValue: number;
  skills: string[];
  emoji: string;
}

export interface Friend {
  id: string;
  name: string;
  title: string;
  level: number;
  xp: number;
  resumeScore: number;
  streak: number;
  online: boolean;
  avatar: AvatarConfig;
  quest: string;
  achievements: string[];
  guildId: string;
}

export interface Guild {
  id: string;
  name: string;
  emblem: string;
  university: string;
  members: number;
  xp: number;
  challenge: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  kind: string;
  text: string;
  emoji: string;
  time: string;
  likes: number;
  celebrates: number;
  comments: { author: string; text: string }[];
}

export interface AvatarConfig {
  name: string;
  hair: string;
  hairColor: string;
  eyes: string;
  skin: string;
  face: string;
  outfit: string;
  shoes: string;
  backpack: string;
  accessory: string;
  pet: string;
  mentor: string;
}

export interface PlayerState {
  created: boolean;
  avatar: AvatarConfig;
  university: string;
  degreeId: string;
  year: number;
  careerId: string;
  xp: number;
  coins: number;
  streak: number;
  freezeTokens: number;
  completedQuests: string[];
  unlockedNodes: string[];
  achievements: string[];
  inventory: string[];
  savedOpportunities: string[];
  dailyDone: string[];
  lastUnlock: string;
}