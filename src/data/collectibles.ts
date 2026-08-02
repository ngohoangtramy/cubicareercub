import type { Achievement, Building, Cosmetic, Pet, Rarity } from "./types";
import { slug } from "./catalog";

const rarities: Rarity[] = ["common", "rare", "epic", "legendary"];

const achievementSeed: [string, string, string, Rarity, string | undefined][] = [
  ["First Commit", "Push your very first commit to GitHub.", "🌱", "common", "laptop-skin-starter"],
  ["First Project", "Ship a project with a README and a live link.", "🛠️", "common", "laptop-skin-holo"],
  ["First Certification", "Pass any recognised certification exam.", "🎓", "rare", "outfit-lab-coat"],
  ["First Hackathon", "Survive 48 hours and demo something.", "⚡", "rare", "outfit-hacker-hoodie"],
  ["First Portfolio", "Publish a portfolio site on your own domain.", "🖥️", "common", "desk-monitor-arm"],
  ["First Internship", "Sign your first internship contract.", "💼", "epic", "outfit-business-suit"],
  ["30-Day Streak", "Do one meaningful career action, 30 days straight.", "🔥", "epic", "shoes-golden-sneakers"],
  ["100-Day Streak", "A hundred days. You are not the same student.", "🌋", "legendary", "aura-flaming"],
  ["365-Day Streak", "A full year of compounding.", "👑", "legendary", "title-career-master"],
  ["Top 10 Hackathon", "Finish top ten at any hackathon.", "🏅", "epic", "outfit-champion-jacket"],
  ["Hackathon Champion", "Win first place. Legendary status.", "🏆", "legendary", "outfit-champion-jacket"],
  ["Research Published", "Co-author a published paper or preprint.", "📄", "legendary", "accessory-scientist-glasses"],
  ["100 GitHub Commits", "A hundred commits across your repos.", "💯", "rare", "laptop-skin-carbon"],
  ["Open Source Hero", "Merged PRs in three external repositories.", "🦸", "epic", "accessory-developer-cape"],
  ["Community Leader", "Organise an event for 20+ people.", "📣", "epic", "accessory-megaphone"],
  ["Cloud Explorer", "Deploy to production on a cloud provider.", "☁️", "rare", "backpack-cloud"],
  ["Networking Master", "Fifty meaningful professional connections.", "🤝", "epic", "accessory-gold-badge"],
  ["Kaggle Contender", "Submit to a Kaggle competition.", "📈", "rare", "desk-trophy-shelf"],
  ["Data Whisperer", "Complete every data node in your tree.", "🔮", "epic", "pet-owl"],
  ["Deploy Machine", "Ten successful production deploys.", "🚀", "rare", "emote-rocket"],
];

const extraAchievementNames = [
  "Bug Slayer", "Docs Reader", "Early Bird", "Night Owl", "Pair Programmer", "Code Reviewer",
  "Test Writer", "Refactor Monk", "SQL Sniper", "Notebook Novelist", "Dashboard Artist",
  "Model Tuner", "Pipeline Plumber", "Container Captain", "Terraform Tamer", "Linux Native",
  "Security Sentinel", "API Architect", "System Designer", "Interview Ready", "Story Teller",
  "Whiteboard Warrior", "Cold Emailer", "Coffee Chat Champ", "Conference Goer", "Workshop Host",
  "Blog Starter", "Weekly Writer", "Thread Starter", "Mentor Mentee", "Mentor Master",
  "Study Group Founder", "Team Captain", "Demo Day Speaker", "Pitch Perfect", "Scholarship Winner",
  "Grant Getter", "Exchange Student", "Language Learner", "Volunteer", "Club Treasurer",
  "Club President", "Sprint Finisher", "Backlog Groomer", "Roadmap Drafter", "Metric Mover",
  "Experiment Runner", "Causal Detective", "Forecast Fortune", "Optimizer", "Simulation Sage",
  "Big Data Rider", "Stream Processor", "Warehouse Builder", "dbt Believer", "Airflow Ace",
  "GPU Whisperer", "Prompt Engineer", "RAG Ranger", "Eval Enthusiast", "Fine Tuner",
  "Vision Voyager", "Speech Seeker", "Robot Rigger", "Edge Deployer", "Latency Hunter",
  "Cost Cutter", "Uptime Guardian", "On-Call Survivor", "Postmortem Poet", "Runbook Writer",
  "Portfolio Polisher", "Case Study Author", "Video Explainer", "Slide Smith", "Resume Refiner",
  "LinkedIn Lurker", "Referral Receiver", "Offer Holder", "Negotiator", "First Paycheck",
];

export const achievements: Achievement[] = [
  ...achievementSeed.map(([name, description, icon, rarity, unlocksCosmetic]) => ({
    id: slug(name),
    name,
    description,
    icon,
    rarity,
    unlocksCosmetic,
    xp: { common: 50, rare: 150, epic: 350, legendary: 800 }[rarity],
  })),
  ...extraAchievementNames.map((name, i) => {
    const rarity = rarities[i % 4];
    return {
      id: slug(name),
      name,
      description: `${name}: a milestone earned through consistent real-world career work.`,
      icon: ["🎯", "✨", "🧩", "🛡️", "🎒", "📌", "🧠", "⚙️"][i % 8],
      rarity,
      xp: { common: 50, rare: 150, epic: 350, legendary: 800 }[rarity],
    };
  }),
];

export const achievementById = (id: string) => achievements.find((a) => a.id === id);

const cosmeticSeed: [string, Cosmetic["slot"], Rarity, string, string][] = [
  ["Starter Tee", "outfit", "common", "👕", "Created your character"],
  ["Lab Coat", "outfit", "rare", "🥼", "First Certification"],
  ["Hacker Hoodie", "outfit", "rare", "🧥", "First Hackathon"],
  ["Business Suit", "outfit", "epic", "🤵", "First Internship"],
  ["Champion Jacket", "outfit", "legendary", "🏆", "Winning a hackathon"],
  ["Legendary Hoodie", "outfit", "legendary", "🌟", "Epic quest: Win a Hackathon"],
  ["Golden Sneakers", "shoes", "epic", "👟", "30-day streak"],
  ["Cloud Backpack", "backpack", "rare", "🎒", "Cloud certification"],
  ["Scientist Glasses", "accessory", "legendary", "🥽", "Research publication"],
  ["Developer Cape", "accessory", "epic", "🦸", "Open source contributor"],
  ["Flaming Aura", "aura", "legendary", "🔥", "100-day streak"],
  ["Career Master", "title", "legendary", "👑", "365-day streak"],
];

const cosmeticSlots: Cosmetic["slot"][] = ["outfit", "shoes", "backpack", "accessory", "laptop", "desk", "plant", "background", "emote", "title"];
const cosmeticAdjectives = ["Neon", "Retro", "Aurora", "Midnight", "Pixel", "Solar", "Frost", "Cosmic", "Velvet", "Chrome", "Sakura", "Lava", "Mint", "Onyx", "Prism", "Nimbus", "Ember", "Quartz", "Zenith", "Echo"];
const cosmeticNouns: Record<string, string[]> = {
  outfit: ["Jacket", "Hoodie", "Blazer"],
  shoes: ["Runners", "Boots", "Sliders"],
  backpack: ["Pack", "Satchel", "Rucksack"],
  accessory: ["Headset", "Watch", "Scarf"],
  laptop: ["Skin", "Sticker Set", "Shell"],
  desk: ["Lamp", "Mat", "Figurine"],
  plant: ["Monstera", "Cactus", "Bonsai"],
  background: ["Skyline", "Nebula", "Campus"],
  emote: ["Wave", "Dab", "Salute"],
  title: ["Explorer", "Builder", "Strategist"],
};
const cosmeticEmoji: Record<string, string> = {
  outfit: "🧥", shoes: "👟", backpack: "🎒", accessory: "🕶️", laptop: "💻",
  desk: "🛋️", plant: "🪴", background: "🌌", emote: "👋", title: "🏷️",
};

export const cosmetics: Cosmetic[] = [
  ...cosmeticSeed.map(([name, slotName, rarity, emoji, unlockedBy]) => ({
    id: `${slotName}-${slug(name)}`,
    name,
    slot: slotName,
    rarity,
    emoji,
    unlockedBy,
  })),
  ...Array.from({ length: 190 }, (_, i) => {
    const slotName = cosmeticSlots[i % cosmeticSlots.length];
    const adj = cosmeticAdjectives[Math.floor(i / cosmeticSlots.length) % cosmeticAdjectives.length];
    const noun = cosmeticNouns[slotName][i % 3];
    const rarity = rarities[(i * 3) % 4];
    return {
      id: `${slotName}-${slug(`${adj}-${noun}-${i}`)}`,
      name: `${adj} ${noun}`,
      slot: slotName,
      rarity,
      emoji: cosmeticEmoji[slotName],
      unlockedBy: ["Weekly challenge reward", "Achievement unlock", "Streak milestone", "Guild competition", "Level-up reward"][i % 5],
    };
  }),
];

export const cosmeticById = (id: string) => cosmetics.find((c) => c.id === id);

const petSpecies = ["Robot", "Fox", "Owl", "Dragon", "Cat", "Axolotl", "Penguin", "Slime", "Turtle", "Raccoon"];
const petEmoji: Record<string, string> = {
  Robot: "🤖", Fox: "🦊", Owl: "🦉", Dragon: "🐉", Cat: "🐱",
  Axolotl: "🦎", Penguin: "🐧", Slime: "🫧", Turtle: "🐢", Raccoon: "🦝",
};
const petPrefix = ["Byte", "Pixel", "Nimbus", "Cosmo", "Quill", "Echo", "Sprocket", "Juno", "Kelp", "Vega"];
const personalities = ["Encouraging", "Sarcastic", "Zen", "Hyperactive", "Analytical"];

export const pets: Pet[] = Array.from({ length: 50 }, (_, i) => {
  const species = petSpecies[i % petSpecies.length];
  const name = `${petPrefix[Math.floor(i / petSpecies.length) % petPrefix.length]} the ${species}`;
  return {
    id: slug(`pet-${name}-${i}`),
    name,
    species,
    emoji: petEmoji[species],
    rarity: rarities[(i * 2) % 4],
    personality: personalities[i % personalities.length],
  };
});

export const mentorOptions = [
  { id: "robot", name: "Byte", emoji: "🤖", vibe: "Analytical and relentlessly on-schedule." },
  { id: "fox", name: "Vega", emoji: "🦊", vibe: "Clever, a little smug, great at shortcuts." },
  { id: "owl", name: "Quill", emoji: "🦉", vibe: "Calm, wise, quietly disappointed when you skip a day." },
  { id: "dragon", name: "Ember", emoji: "🐉", vibe: "Loud hype machine. Celebrates everything." },
  { id: "cat", name: "Nimbus", emoji: "🐱", vibe: "Supportive, but only on its own terms." },
];

export const buildings: Building[] = [
  ["Small Tent", "⛺", 1, "Every legend starts with questionable housing."],
  ["Campfire", "🔥", 2, "Your first streak keeps it burning."],
  ["Study Shack", "🛖", 3, "A desk, a lamp, and unreasonable ambition."],
  ["Cosy House", "🏠", 5, "Unlocked by your first shipped project."],
  ["Community Hall", "🏛️", 7, "Built when you joined your first community."],
  ["Workshop", "🧰", 9, "Where side projects get finished, occasionally."],
  ["Office", "🏢", 12, "Certifications on the wall, coffee in the machine."],
  ["Server Room", "🖧", 14, "Your first cloud deployment lives here."],
  ["Research Lab", "🔬", 16, "Papers, whiteboards, suspicious amounts of tea."],
  ["Data Observatory", "🔭", 18, "For staring into very large datasets."],
  ["Hackathon Arena", "⚔️", 20, "Unlocked by surviving 48 hours."],
  ["Innovation Center", "🏙️", 24, "Where your ideas get other people excited."],
  ["Launch Pad", "🚀", 27, "Something you built is going live today."],
  ["Startup Headquarters", "🏗️", 30, "Three founders, one whiteboard, infinite optimism."],
  ["Mentor Lodge", "🏡", 33, "You're the one giving advice now."],
  ["Guild Hall", "🛡️", 36, "Your guild's trophies, publicly displayed."],
  ["Conference Stage", "🎤", 40, "You're speaking, not attending."],
  ["Open Source Foundry", "⚒️", 44, "Maintainer status achieved."],
  ["Dream Company Tower", "🏦", 50, "The final boss building. You work here now."],
  ["Legacy Garden", "🌳", 60, "Built by everyone you mentored."],
].map(([name, emoji, levelRequired, description]) => ({
  id: slug(name as string),
  name: name as string,
  emoji: emoji as string,
  levelRequired: levelRequired as number,
  description: description as string,
}));

export const streakRewards = [
  { days: 7, reward: "Accessory: Aurora Headset", emoji: "🎧" },
  { days: 30, reward: "Pet companion of your choice", emoji: "🐉" },
  { days: 60, reward: "Animated profile background", emoji: "🌌" },
  { days: 100, reward: "Legendary Flaming Aura", emoji: "🔥" },
  { days: 365, reward: "Exclusive title: Career Master", emoji: "👑" },
];