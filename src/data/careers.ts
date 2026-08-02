import type { Career, Quest, SkillNode } from "./types";

type NodeSeed = [skillId: string, tier: number, lane: number, requires: string[]];

function buildTree(seeds: NodeSeed[]): SkillNode[] {
  return seeds.map(([skillId, tier, lane, requires]) => ({
    id: skillId,
    skillId,
    tier,
    lane,
    requires,
    xp: 100 + tier * 75,
    projects: nodeProjects[skillId] ?? ["Build a small showcase project and publish the write-up."],
    resources: nodeResources[skillId] ?? ["Official documentation", "One free university course", "A weekend YouTube crash course"],
    certifications: nodeCerts[skillId] ?? [],
    quests: nodeQuests[skillId] ?? ["Ship something public using this skill"],
  }));
}

const nodeProjects: Record<string, string[]> = {
  python: ["Scrape and clean a dataset you actually care about", "Automate one boring weekly task"],
  statistics: ["Run an A/B test on a campus poll", "Reproduce a paper's summary statistics"],
  sql: ["Model a 5-table analytics warehouse", "Answer 20 business questions from one schema"],
  "machine-learning": ["Movie recommendation engine", "Churn prediction on a public dataset"],
  "deep-learning": ["Image classifier for campus objects", "Fine-tune a small transformer"],
  "computer-vision": ["Real-time webcam object detector"],
  mlops: ["Wrap a model in an API and monitor drift"],
  docker: ["Containerise your portfolio and ship it"],
  cloud: ["Deploy an app on free-tier cloud with CI"],
  aws: ["Serverless image pipeline with S3 + Lambda"],
  kubernetes: ["Run a 3-service app on a local cluster"],
  git: ["Portfolio website with clean commit history"],
  llms: ["RAG assistant over your lecture notes"],
  "product-sense": ["Teardown of an app you use daily"],
  "user-research": ["Interview 5 students and synthesise findings"],
  roadmapping: ["Write a 1-page PRD and 2-quarter roadmap"],
  terraform: ["Provision a VPC and database as code"],
  networking: ["Map and document a small network topology"],
  security: ["Threat-model your own side project"],
  "system-design": ["Design a URL shortener for 10M users"],
  linux: ["Set up a hardened personal VPS"],
  "ci-cd": ["Full test + deploy pipeline on every push"],
  "market-analysis": ["Size a market for a student startup idea"],
  strategy: ["Competitive landscape brief for one product"],
  "stakeholder-management": ["Run a mock cross-team prioritisation session"],
  "data-visualization": ["Interactive dashboard on open city data"],
};

const nodeResources: Record<string, string[]> = {
  python: ["Automate the Boring Stuff", "CS50P", "Real Python tutorials"],
  "machine-learning": ["Andrew Ng ML Specialization", "Kaggle Learn", "StatQuest"],
  "deep-learning": ["fast.ai Practical Deep Learning", "Karpathy's Zero to Hero"],
  cloud: ["AWS Skill Builder", "Cloud Resume Challenge"],
  llms: ["Prompt engineering guide", "RAG from scratch series"],
};

const nodeCerts: Record<string, string[]> = {
  cloud: ["AWS Cloud Practitioner"],
  aws: ["AWS Solutions Architect Associate", "AWS Machine Learning Specialty"],
  kubernetes: ["Certified Kubernetes Administrator"],
  git: ["GitHub Foundations"],
  "machine-learning": ["TensorFlow Developer Certificate"],
  security: ["CompTIA Security+"],
  agile: ["Professional Scrum Master I"],
  "data-visualization": ["Tableau Desktop Specialist"],
};

const nodeQuests: Record<string, string[]> = {
  git: ["Make 5 commits in one week", "Open your first pull request"],
  cloud: ["Deploy one app publicly", "Pass a cloud fundamentals exam"],
  "machine-learning": ["Enter a Kaggle competition", "Publish a model write-up"],
};

export const careers: Career[] = [
  {
    id: "machine-learning-engineer",
    name: "Machine Learning Engineer",
    emoji: "🤖",
    tagline: "Turn models into products people rely on.",
    requiredSkills: ["python", "statistics", "sql", "machine-learning", "deep-learning", "docker", "cloud", "git", "mlops", "llms"],
    tree: buildTree([
      ["python", 0, 1, []],
      ["git", 0, 3, []],
      ["statistics", 1, 0, ["python"]],
      ["sql", 1, 2, ["python"]],
      ["docker", 1, 4, ["git"]],
      ["machine-learning", 2, 1, ["statistics", "sql"]],
      ["cloud", 2, 3, ["docker"]],
      ["deep-learning", 3, 0, ["machine-learning"]],
      ["llms", 3, 2, ["machine-learning"]],
      ["mlops", 3, 4, ["cloud", "machine-learning"]],
      ["computer-vision", 4, 1, ["deep-learning"]],
      ["kubernetes", 4, 3, ["mlops"]],
    ]),
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    emoji: "📊",
    tagline: "Find the story hiding inside the data.",
    requiredSkills: ["python", "sql", "statistics", "regression", "data-visualization", "machine-learning", "experiment-design", "communication"],
    tree: buildTree([
      ["python", 0, 1, []],
      ["sql", 0, 3, []],
      ["statistics", 1, 0, ["python"]],
      ["data-visualization", 1, 2, ["sql"]],
      ["regression", 2, 1, ["statistics"]],
      ["experiment-design", 2, 3, ["statistics"]],
      ["machine-learning", 3, 1, ["regression"]],
      ["communication", 3, 3, ["data-visualization"]],
      ["deep-learning", 4, 0, ["machine-learning"]],
      ["mlops", 4, 2, ["machine-learning"]],
      ["cloud", 4, 4, ["mlops"]],
    ]),
  },
  {
    id: "cloud-engineer",
    name: "Cloud Engineer",
    emoji: "☁️",
    tagline: "Build the invisible infrastructure everything runs on.",
    requiredSkills: ["linux", "git", "networking", "docker", "cloud", "aws", "terraform", "ci-cd", "kubernetes", "security"],
    tree: buildTree([
      ["linux", 0, 1, []],
      ["git", 0, 3, []],
      ["networking", 1, 0, ["linux"]],
      ["docker", 1, 2, ["linux"]],
      ["ci-cd", 1, 4, ["git"]],
      ["cloud", 2, 1, ["networking", "docker"]],
      ["security", 2, 3, ["networking"]],
      ["aws", 3, 0, ["cloud"]],
      ["terraform", 3, 2, ["cloud"]],
      ["kubernetes", 3, 4, ["docker", "ci-cd"]],
      ["system-design", 4, 2, ["aws", "kubernetes"]],
    ]),
  },
  {
    id: "product-manager",
    name: "Product Manager",
    emoji: "🧭",
    tagline: "Decide what gets built, and why it matters.",
    requiredSkills: ["product-sense", "user-research", "roadmapping", "sql", "data-visualization", "stakeholder-management", "communication", "strategy"],
    tree: buildTree([
      ["communication", 0, 1, []],
      ["product-sense", 0, 3, []],
      ["user-research", 1, 0, ["communication"]],
      ["roadmapping", 1, 2, ["product-sense"]],
      ["agile", 1, 4, ["product-sense"]],
      ["sql", 2, 1, ["roadmapping"]],
      ["stakeholder-management", 2, 3, ["agile"]],
      ["data-visualization", 3, 1, ["sql"]],
      ["market-analysis", 3, 3, ["stakeholder-management"]],
      ["pricing", 4, 2, ["market-analysis"]],
      ["strategy", 4, 4, ["market-analysis"]],
    ]),
  },
];

export const careerById = (id: string) => careers.find((c) => c.id === id) ?? careers[0];

export const quests: Quest[] = [
  { id: "q-main", kind: "main", title: "Become a Machine Learning Engineer", description: "The long campaign. Every completed quest pushes this bar forward.", xp: 5000, hours: 400, difficulty: "Expert", resumeImpact: 100, skills: [], dependencies: [] },
  { id: "q-git", kind: "side", title: "Learn Git properly", description: "Branches, rebases, pull requests. Stop fearing merge conflicts.", xp: 120, hours: 6, difficulty: "Beginner", resumeImpact: 12, skills: ["git"], dependencies: [], semester: 1 },
  { id: "q-portfolio", kind: "project", title: "Build your portfolio website", description: "One page, three projects, a real domain. Your permanent home base.", xp: 250, hours: 14, difficulty: "Beginner", resumeImpact: 30, skills: ["html-css", "react", "portfolio-craft"], dependencies: ["q-git"], semester: 1 },
  { id: "q-gh-cert", kind: "certification", title: "GitHub Foundations certification", description: "A cheap, fast credential that proves you can collaborate.", xp: 300, hours: 10, difficulty: "Beginner", resumeImpact: 22, skills: ["git", "ci-cd"], dependencies: ["q-git"], semester: 1 },
  { id: "q-gdsc", kind: "community", title: "Join Google Developer Student Club", description: "Show up twice. Volunteer once. Your network compounds from here.", xp: 100, hours: 4, difficulty: "Beginner", resumeImpact: 10, skills: ["networking", "teamwork"], dependencies: [], semester: 1 },
  { id: "q-docker", kind: "side", title: "Containerise an app with Docker", description: "If it runs on your machine, make it run on everyone's.", xp: 220, hours: 12, difficulty: "Intermediate", resumeImpact: 20, skills: ["docker", "linux"], dependencies: ["q-git"], semester: 2 },
  { id: "q-api", kind: "project", title: "Deploy a REST API", description: "Endpoints, tests, a live URL and a README that explains it.", xp: 320, hours: 20, difficulty: "Intermediate", resumeImpact: 28, skills: ["apis", "docker", "testing"], dependencies: ["q-docker"], semester: 2 },
  { id: "q-hack1", kind: "side", title: "Survive a beginner hackathon", description: "48 hours, one demo, zero sleep. Finishing is winning.", xp: 400, hours: 48, difficulty: "Intermediate", resumeImpact: 35, skills: ["teamwork", "communication"], dependencies: [], semester: 2 },
  { id: "q-aws", kind: "certification", title: "AWS Cloud Practitioner", description: "The credential recruiters actually recognise at entry level.", xp: 350, hours: 25, difficulty: "Intermediate", resumeImpact: 40, skills: ["cloud", "aws"], dependencies: ["q-docker"], semester: 3 },
  { id: "q-recsys", kind: "project", title: "Movie recommendation engine", description: "Collaborative filtering, an evaluation section, and a live demo.", xp: 250, hours: 30, difficulty: "Intermediate", resumeImpact: 32, skills: ["machine-learning", "python"], dependencies: [], semester: 3 },
  { id: "q-kaggle", kind: "side", title: "Finish a Kaggle competition", description: "Top 50% is a great first result. Write up what you learned.", xp: 300, hours: 25, difficulty: "Advanced", resumeImpact: 30, skills: ["machine-learning", "feature-engineering"], dependencies: ["q-recsys"], semester: 3 },
  { id: "q-meetup", kind: "community", title: "Attend an AI meetup", description: "Ask one question out loud. Collect two LinkedIn connections.", xp: 150, hours: 3, difficulty: "Beginner", resumeImpact: 8, skills: ["networking"], dependencies: [], semester: 3 },
  { id: "q-capstone", kind: "project", title: "Capstone: end-to-end ML product", description: "Data in, model trained, API served, monitored, documented.", xp: 600, hours: 80, difficulty: "Advanced", resumeImpact: 55, skills: ["mlops", "cloud", "machine-learning"], dependencies: ["q-api", "q-aws"], semester: 4 },
  { id: "q-internship", kind: "main", title: "Land a summer internship", description: "The single highest-impact line on a student CV.", xp: 900, hours: 60, difficulty: "Advanced", resumeImpact: 80, skills: ["communication", "teamwork"], dependencies: ["q-portfolio"], semester: 4 },
  { id: "q-interview", kind: "side", title: "Interview preparation grind", description: "20 practice problems, 3 mock interviews, one story bank.", xp: 280, hours: 30, difficulty: "Advanced", resumeImpact: 35, skills: ["communication", "system-design"], dependencies: [], semester: 4 },
  { id: "q-epic", kind: "epic", title: "Win a hackathon", description: "The boss fight of your second year.", xp: 1200, hours: 60, difficulty: "Expert", resumeImpact: 70, skills: ["teamwork", "leadership"], dependencies: ["q-hack1"], reward: "Legendary Hoodie", semester: 4 },
];

export const questById = (id: string) => quests.find((q) => q.id === id);

export const dailyQuests: Quest[] = [
  { id: "d-commit", kind: "daily", title: "Push one GitHub commit", description: "Even a README fix counts. Keep the graph green.", xp: 40, hours: 0.5, difficulty: "Beginner", resumeImpact: 2, skills: ["git"], dependencies: [] },
  { id: "d-docs", kind: "daily", title: "Read documentation for 20 minutes", description: "Pick the tool you pretend to understand.", xp: 30, hours: 0.3, difficulty: "Beginner", resumeImpact: 1, skills: ["research"], dependencies: [] },
  { id: "d-lesson", kind: "daily", title: "Finish one course lesson", description: "One chapter of your active certification.", xp: 50, hours: 0.7, difficulty: "Beginner", resumeImpact: 2, skills: ["python"], dependencies: [] },
  { id: "d-portfolio", kind: "daily", title: "Improve your portfolio", description: "Better screenshot, sharper sentence, faster load.", xp: 45, hours: 0.5, difficulty: "Beginner", resumeImpact: 3, skills: ["portfolio-craft"], dependencies: [] },
  { id: "d-interview", kind: "daily", title: "Practice one interview question", description: "Say the answer out loud. Time yourself.", xp: 45, hours: 0.4, difficulty: "Beginner", resumeImpact: 3, skills: ["communication"], dependencies: [] },
];

export const weeklyChallenges: Quest[] = [
  { id: "w-deploy", kind: "weekly", title: "Deploy your first website", description: "Live URL by Sunday. No excuses, free tiers exist.", xp: 300, hours: 6, difficulty: "Intermediate", resumeImpact: 15, skills: ["cloud", "html-css"], dependencies: [], reward: "Cloud Backpack" },
  { id: "w-community", kind: "weekly", title: "Join one community", description: "Discord, guild or student club — introduce yourself.", xp: 180, hours: 2, difficulty: "Beginner", resumeImpact: 8, skills: ["networking"], dependencies: [], reward: "200 coins" },
  { id: "w-kaggle", kind: "weekly", title: "Finish one Kaggle notebook", description: "EDA, a baseline model, and a conclusion.", xp: 260, hours: 5, difficulty: "Intermediate", resumeImpact: 12, skills: ["machine-learning"], dependencies: [], reward: "Neon Desk Lamp" },
  { id: "w-network", kind: "weekly", title: "Attend one networking event", description: "Three conversations, one follow-up message.", xp: 200, hours: 3, difficulty: "Beginner", resumeImpact: 10, skills: ["networking"], dependencies: [], reward: "Limited Aurora Background" },
  { id: "w-commits", kind: "weekly", title: "Complete five Git commits", description: "Consistency beats intensity, every single week.", xp: 150, hours: 3, difficulty: "Beginner", resumeImpact: 6, skills: ["git"], dependencies: [], reward: "150 coins" },
];

export const roadmapSemesters = [1, 2, 3, 4].map((n) => ({
  semester: n,
  title: ["Foundations", "Build & Ship", "Prove It", "Go Pro"][n - 1],
  subtitle: [
    "Tools, habits and your first public artefacts.",
    "Real projects, real deployments, first hackathon.",
    "Cloud credentials and competitive results.",
    "Capstone, internship and interview readiness.",
  ][n - 1],
  quests: quests.filter((q) => q.semester === n),
}));