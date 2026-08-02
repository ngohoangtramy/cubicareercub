import type { AvatarConfig, Difficulty, FeedPost, Friend, Guild, Opportunity, OpportunityKind, PlayerState } from "./types";
import { slug } from "./catalog";

const kinds: OpportunityKind[] = ["Hackathon", "Community", "Competition", "Internship", "Project", "Scholarship", "Meetup", "Open Source"];
const kindEmoji: Record<OpportunityKind, string> = {
  Hackathon: "⚡", Community: "🫂", Competition: "🥇", Internship: "💼",
  Project: "🛠️", Scholarship: "🎓", Meetup: "☕", "Open Source": "🌍",
};
const orgs = ["TU Delft", "Google DSC", "Booking.com", "Adyen", "ASML", "Kaggle", "Mozilla", "Ahold Data Lab", "ING Analytics", "Picnic Tech", "OpenUva", "Amsterdam AI", "Hack Junction", "MLH", "Bol.com", "Philips Research"];
const cities = ["Amsterdam", "Delft", "Utrecht", "Rotterdam", "Eindhoven", "Remote", "Berlin", "Leuven", "Zurich", "Online"];
const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const durations = ["1 evening", "48 hours", "1 week", "4 weeks", "3 months", "6 months", "Ongoing"];
const skillPool = ["python", "sql", "machine-learning", "cloud", "docker", "git", "communication", "teamwork", "networking", "deep-learning", "apis", "data-visualization", "product-sense", "leadership", "security", "terraform"];

const titleByKind: Record<OpportunityKind, string[]> = {
  Hackathon: ["AI for Good Hack", "Climate Data Jam", "48h Fintech Sprint", "Campus Build Weekend", "Healthcare Hack", "Mobility Hackathon"],
  Community: ["Google Developer Student Club", "Women in Data", "Cloud Native Students", "PyData Chapter", "AI Reading Group", "Open Source Circle"],
  Competition: ["Kaggle Playground Series", "Case Competition Finals", "CTF Qualifier", "Robotics Challenge", "Analytics Cup", "Trading Simulation"],
  Internship: ["Data Analytics Intern", "ML Engineering Intern", "Cloud Platform Intern", "Product Management Intern", "Research Intern", "Backend Intern"],
  Project: ["Recommendation Engine", "Realtime Dashboard", "Chatbot with RAG", "Portfolio Revamp", "Energy Usage Tracker", "Campus Map API"],
  Scholarship: ["Tech Talent Grant", "Women in STEM Scholarship", "Cloud Certification Voucher", "Summer School Fund", "Research Stipend", "Conference Travel Grant"],
  Meetup: ["AI Meetup Night", "Data Drinks", "DevOps Dinner", "Product Coffee", "Founders Friday", "Career Q&A"],
  "Open Source": ["Good First Issue Sprint", "Docs Improvement Drive", "Hacktoberfest Prep", "Maintainer Mentorship", "Library Translation", "Bug Triage Weekend"],
};

export const opportunities: Opportunity[] = Array.from({ length: 96 }, (_, i) => {
  const kind = kinds[i % kinds.length];
  const titles = titleByKind[kind];
  const title = `${titles[Math.floor(i / kinds.length) % titles.length]}${i > 47 ? " 2026" : ""}`;
  const skills = [skillPool[i % skillPool.length], skillPool[(i * 5 + 3) % skillPool.length], skillPool[(i * 7 + 1) % skillPool.length]];
  return {
    id: slug(`${kind}-${title}-${i}`),
    kind,
    title,
    org: orgs[i % orgs.length],
    location: cities[i % cities.length],
    duration: durations[i % durations.length],
    difficulty: difficulties[i % difficulties.length],
    match: 48 + ((i * 13) % 51),
    xp: 100 + ((i * 37) % 900),
    resumeValue: 5 + ((i * 11) % 45),
    skills: Array.from(new Set(skills)),
    emoji: kindEmoji[kind],
  };
});

export const guilds: Guild[] = [
  { id: "uva-ai", name: "UvA AI Guild", emblem: "🧠", university: "University of Amsterdam", members: 148, xp: 284500, challenge: "Collectively ship 50 deployed projects this month" },
  { id: "delft-cloud", name: "Delft Cloud Collective", emblem: "☁️", university: "Delft University of Technology", members: 96, xp: 201300, challenge: "Earn 25 cloud certifications before June" },
  { id: "utrecht-product", name: "Utrecht Product Circle", emblem: "🧭", university: "Utrecht University", members: 74, xp: 158900, challenge: "Publish 40 product teardowns" },
  { id: "leuven-research", name: "Leuven Research Order", emblem: "🔬", university: "KU Leuven", members: 61, xp: 132400, challenge: "Submit 10 workshop papers" },
];

const avatarFor = (over: Partial<AvatarConfig>): AvatarConfig => ({
  name: "Player",
  hair: "wave",
  hairColor: "#2b2b3a",
  eyes: "happy",
  skin: "#e6b98f",
  face: "smile",
  outfit: "hoodie",
  shoes: "sneakers",
  backpack: "classic",
  accessory: "headphones",
  pet: "fox",
  mentor: "fox",
  ...over,
});

export const friends: Friend[] = [
  { id: "f-mila", name: "Mila Jansen", title: "Level 14 Data Ranger", level: 14, xp: 12400, resumeScore: 74, streak: 46, online: true, quest: "AWS Cloud Practitioner", achievements: ["first-certification", "cloud-explorer", "30-day-streak"], guildId: "uva-ai", avatar: avatarFor({ name: "Mila", hair: "bun", hairColor: "#7a3b1f", skin: "#f0c9a6", outfit: "labcoat", accessory: "glasses", pet: "owl" }) },
  { id: "f-omar", name: "Omar Haddad", title: "Level 19 Cloud Knight", level: 19, xp: 21800, resumeScore: 82, streak: 112, online: true, quest: "Kubernetes deep dive", achievements: ["100-day-streak", "deploy-machine", "cloud-explorer"], guildId: "delft-cloud", avatar: avatarFor({ name: "Omar", hair: "fade", hairColor: "#1b1b22", skin: "#a9714b", outfit: "jacket", accessory: "cap", pet: "dragon" }) },
  { id: "f-sanne", name: "Sanne de Vries", title: "Level 11 Product Scout", level: 11, xp: 8600, resumeScore: 66, streak: 21, online: false, quest: "Write first PRD", achievements: ["first-portfolio", "community-leader"], guildId: "utrecht-product", avatar: avatarFor({ name: "Sanne", hair: "long", hairColor: "#d9a441", skin: "#f5d6bd", outfit: "blazer", accessory: "earrings", pet: "cat" }) },
  { id: "f-tim", name: "Tim Okafor", title: "Level 22 Hack Champion", level: 22, xp: 29500, resumeScore: 88, streak: 74, online: true, quest: "Win Amsterdam AI Hack", achievements: ["hackathon-champion", "open-source-hero", "top-10-hackathon"], guildId: "uva-ai", avatar: avatarFor({ name: "Tim", hair: "curls", hairColor: "#14141c", skin: "#6b4630", outfit: "champion", accessory: "cape", pet: "robot" }) },
  { id: "f-lea", name: "Lea Fischer", title: "Level 9 Research Apprentice", level: 9, xp: 6100, resumeScore: 58, streak: 12, online: false, quest: "Reproduce a paper", achievements: ["first-commit", "docs-reader"], guildId: "leuven-research", avatar: avatarFor({ name: "Lea", hair: "short", hairColor: "#3b2f2f", skin: "#eec3a0", outfit: "labcoat", accessory: "glasses", pet: "axolotl" }) },
  { id: "f-nikhil", name: "Nikhil Rao", title: "Level 16 ML Adept", level: 16, xp: 15900, resumeScore: 77, streak: 58, online: true, quest: "Fine-tune a small LLM", achievements: ["kaggle-contender", "data-whisperer"], guildId: "uva-ai", avatar: avatarFor({ name: "Nikhil", hair: "wave", hairColor: "#101018", skin: "#c98d5f", outfit: "hoodie", accessory: "headphones", pet: "slime" }) },
];

export const friendById = (id: string) => friends.find((f) => f.id === id);

export const feed: FeedPost[] = [
  { id: "p1", authorId: "f-mila", kind: "Certification", text: "Passed AWS Cloud Practitioner on the first try. The Cloud Backpack is MINE.", emoji: "☁️", time: "12m ago", likes: 34, celebrates: 21, comments: [{ author: "Omar", text: "Welcome to the cloud side 👏" }] },
  { id: "p2", authorId: "f-tim", kind: "Hackathon", text: "We took 1st place at Amsterdam AI Hack with a real-time sign language translator.", emoji: "🏆", time: "2h ago", likes: 128, celebrates: 96, comments: [{ author: "Mila", text: "Absolutely deserved." }, { author: "Sanne", text: "Demo link please!" }] },
  { id: "p3", authorId: "f-sanne", kind: "Portfolio", text: "Rebuilt my portfolio in a weekend. Three case studies, one very tired brain.", emoji: "🖥️", time: "5h ago", likes: 52, celebrates: 18, comments: [] },
  { id: "p4", authorId: "f-omar", kind: "Streak", text: "100-day career streak unlocked. Flaming Aura equipped permanently.", emoji: "🔥", time: "1d ago", likes: 210, celebrates: 154, comments: [{ author: "Nikhil", text: "Teach me your ways." }] },
  { id: "p5", authorId: "f-nikhil", kind: "Community", text: "Joined PyData Amsterdam. First meetup Thursday — who else is coming?", emoji: "🫂", time: "1d ago", likes: 41, celebrates: 12, comments: [{ author: "Lea", text: "Me! Save me a seat." }] },
  { id: "p6", authorId: "f-lea", kind: "Project", text: "My first open source PR just got merged into a docs repo. Small, but it counts.", emoji: "🌍", time: "2d ago", likes: 88, celebrates: 44, comments: [{ author: "Tim", text: "That's how it starts." }] },
];

export const events = [
  { id: "e1", title: "Amsterdam AI Meetup", when: "Tonight · 19:00", where: "Startup Village", emoji: "🧠" },
];

export const weeklyChallenges = [
  { id: "w1", title: "Ship It Week", emoji: "🚀", description: "Deploy any project publicly before Sunday midnight.", progress: 62, participants: 4820, xp: 400 },
  { id: "w2", title: "Commit Streak", emoji: "🌱", description: "Push code on five separate days this week.", progress: 40, participants: 3110, xp: 300 },
  { id: "w3", title: "Reach Out", emoji: "🫱", description: "Message one professional in your dream career.", progress: 18, participants: 1975, xp: 250 },
  { id: "w4", title: "Read the Docs", emoji: "📚", description: "Finish one official documentation deep dive.", progress: 75, participants: 2640, xp: 200 },
  { id: "w5", title: "Guild Sprint", emoji: "⚔️", description: "Contribute 500 XP toward your guild's weekly total.", progress: 55, participants: 5290, xp: 500 },
  { id: "w6", title: "Portfolio Polish", emoji: "✨", description: "Add or rewrite one case study on your portfolio.", progress: 28, participants: 1480, xp: 350 },
];

const _legacyEvents = [
  { id: "e1", title: "Amsterdam AI Meetup", when: "Tonight · 19:00", where: "Startup Village", emoji: "🧠" },
  { id: "e2", title: "GDSC Intro Workshop", when: "Thu · 16:00", where: "Science Park", emoji: "🫂" },
  { id: "e3", title: "48h Fintech Sprint", when: "Sat · 09:00", where: "Adyen HQ", emoji: "⚡" },
  { id: "e4", title: "Kaggle Study Session", when: "Sun · 14:00", where: "Online", emoji: "📈" },
];

export const resumeStats = [
  { key: "Programming", value: 72 },
  { key: "Machine Learning", value: 58 },
  { key: "Cloud", value: 34 },
  { key: "Research", value: 46 },
  { key: "Leadership", value: 41 },
  { key: "Communication", value: 63 },
  { key: "Innovation", value: 55 },
  { key: "Networking", value: 38 },
  { key: "Portfolio", value: 67 },
];

export interface DemoStudent {
  id: string;
  label: string;
  blurb: string;
  state: PlayerState;
}

const baseState = (over: Partial<PlayerState>): PlayerState => ({
  created: true,
  avatar: avatarFor({}),
  university: "University of Amsterdam",
  degreeId: "business-analytics",
  year: 2,
  careerId: "machine-learning-engineer",
  xp: 4200,
  coins: 850,
  streak: 23,
  freezeTokens: 2,
  completedQuests: ["q-git", "q-gdsc", "q-portfolio"],
  unlockedNodes: ["python", "git", "statistics", "sql"],
  achievements: ["first-commit", "first-project", "first-portfolio"],
  inventory: ["outfit-starter-tee", "laptop-skin-starter", "backpack-cloud"],
  savedOpportunities: [],
  dailyDone: [],
  lastUnlock: "Laptop Skin: Holo",
  ...over,
});

export const demoStudents: DemoStudent[] = [
  {
    id: "demo-ayla",
    label: "Ayla · Business Analytics → Data Scientist",
    blurb: "Year 2, strong stats foundation, allergic to Docker (for now).",
    state: baseState({
      avatar: avatarFor({ name: "Ayla", hair: "bun", hairColor: "#4a2b1a", skin: "#e8c19b", outfit: "blazer", accessory: "glasses", pet: "owl", mentor: "owl" }),
      degreeId: "business-analytics",
      careerId: "data-scientist",
      xp: 5400,
      streak: 31,
      completedQuests: ["q-git", "q-gdsc", "q-portfolio", "q-recsys"],
      unlockedNodes: ["python", "sql", "statistics", "data-visualization", "regression"],
      achievements: ["first-commit", "first-project", "first-portfolio", "30-day-streak", "kaggle-contender"],
      inventory: ["outfit-starter-tee", "outfit-lab-coat", "shoes-golden-sneakers", "laptop-skin-holo"],
      lastUnlock: "Golden Sneakers",
    }),
  },
  {
    id: "demo-jonas",
    label: "Jonas · Computer Science → Cloud Engineer",
    blurb: "Year 3, terminal wizard, two deploys away from a certification.",
    state: baseState({
      avatar: avatarFor({ name: "Jonas", hair: "fade", hairColor: "#1a1a20", skin: "#c48b60", outfit: "jacket", accessory: "cap", pet: "robot", mentor: "robot" }),
      degreeId: "computer-science",
      careerId: "cloud-engineer",
      year: 3,
      xp: 9800,
      streak: 64,
      coins: 1420,
      completedQuests: ["q-git", "q-docker", "q-api", "q-hack1", "q-gh-cert"],
      unlockedNodes: ["linux", "git", "networking", "docker", "ci-cd", "cloud"],
      achievements: ["first-commit", "first-hackathon", "cloud-explorer", "deploy-machine", "30-day-streak"],
      inventory: ["outfit-hacker-hoodie", "backpack-cloud", "laptop-skin-carbon", "desk-neon-lamp-5"],
      lastUnlock: "Cloud Backpack",
    }),
  },
  {
    id: "demo-priya",
    label: "Priya · Economics → Product Manager",
    blurb: "Year 2, runs three student clubs, learning SQL out of spite.",
    state: baseState({
      avatar: avatarFor({ name: "Priya", hair: "long", hairColor: "#20140f", skin: "#b57a52", outfit: "blazer", accessory: "earrings", pet: "cat", mentor: "cat" }),
      degreeId: "economics",
      careerId: "product-manager",
      xp: 3600,
      streak: 12,
      completedQuests: ["q-gdsc", "q-meetup", "q-portfolio"],
      unlockedNodes: ["communication", "product-sense", "user-research"],
      achievements: ["first-portfolio", "community-leader", "networking-master"],
      inventory: ["outfit-starter-tee", "title-career-master", "background-aurora-skyline-7"],
      lastUnlock: "Community Leader badge",
    }),
  },
];

export const comingSoon = [
  { title: "LinkedIn Sync", icon: "🔗" },
  { title: "GitHub Sync", icon: "🐙" },
  { title: "Resume Upload", icon: "📄" },
  { title: "Transcript Import", icon: "🧾" },
  { title: "AI Mock Interviews", icon: "🎙️" },
  { title: "Live Job Market Analysis", icon: "📊" },
  { title: "Mentor Matching", icon: "🧑‍🏫" },
  { title: "Hackathon Team Formation", icon: "👥" },
  { title: "AI Portfolio Review", icon: "🔍" },
  { title: "Course Scraper", icon: "🕸️" },
  { title: "Calendar Integration", icon: "📅" },
  { title: "AI Weekly Planner", icon: "🗓️" },
];