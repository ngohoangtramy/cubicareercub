import type { Course, Degree, Skill } from "./types";

export const universities = [
  "University of Amsterdam",
  "Delft University of Technology",
  "Utrecht University",
  "KU Leuven",
  "ETH Zurich",
  "Technical University of Munich",
  "Trinity College Dublin",
  "University of Copenhagen",
];

const skillSeed: [string, string, string][] = [
  ["Python", "Programming", "The workhorse language of data, automation and ML."],
  ["SQL", "Data", "Query, join and shape relational data at scale."],
  ["Statistics", "Data", "Distributions, inference and experiment design."],
  ["Regression", "Data", "Modelling relationships between variables."],
  ["Data Visualization", "Data", "Turning numbers into arguments people trust."],
  ["Optimization", "Data", "Finding the best decision under constraints."],
  ["Machine Learning", "AI", "Supervised and unsupervised model building."],
  ["Deep Learning", "AI", "Neural networks for perception and language."],
  ["Computer Vision", "AI", "Teaching machines to interpret images."],
  ["NLP", "AI", "Language models, embeddings and text pipelines."],
  ["LLMs", "AI", "Prompting, RAG and evaluation of large models."],
  ["MLOps", "AI", "Shipping and monitoring models in production."],
  ["Feature Engineering", "AI", "Crafting signals that make models sing."],
  ["Experiment Design", "Data", "A/B tests that survive scrutiny."],
  ["Git", "Engineering", "Version control and collaborative workflows."],
  ["Docker", "Engineering", "Reproducible environments in containers."],
  ["Kubernetes", "Engineering", "Orchestrating containers across clusters."],
  ["CI/CD", "Engineering", "Automated build, test and release pipelines."],
  ["Cloud", "Engineering", "Compute, storage and networking as a service."],
  ["AWS", "Engineering", "The most-hired cloud platform."],
  ["Terraform", "Engineering", "Infrastructure described as code."],
  ["Linux", "Engineering", "The shell your servers actually speak."],
  ["Networking", "Engineering", "DNS, load balancers and the path of a packet."],
  ["Security", "Engineering", "Threat modelling and safe defaults."],
  ["APIs", "Engineering", "Designing contracts between systems."],
  ["Testing", "Engineering", "Confidence that survives refactors."],
  ["System Design", "Engineering", "Architecting things that don't fall over."],
  ["Databases", "Engineering", "Schemas, indexes and transactions."],
  ["Data Engineering", "Data", "Pipelines that move data reliably."],
  ["Spark", "Data", "Distributed processing for big datasets."],
  ["Airflow", "Data", "Scheduling and orchestrating workflows."],
  ["dbt", "Data", "Analytics engineering with version-controlled SQL."],
  ["JavaScript", "Programming", "The language of the browser."],
  ["TypeScript", "Programming", "JavaScript with a safety net."],
  ["React", "Programming", "Component-driven user interfaces."],
  ["HTML/CSS", "Programming", "Structure and style of the web."],
  ["Java", "Programming", "Enterprise-grade backend workhorse."],
  ["Go", "Programming", "Fast, simple services and tooling."],
  ["R", "Programming", "Statistical computing and reporting."],
  ["Excel Modelling", "Business", "Financial and operational models."],
  ["Product Sense", "Business", "Knowing which problem is worth solving."],
  ["Roadmapping", "Business", "Sequencing work into a believable plan."],
  ["User Research", "Business", "Learning from people, not opinions."],
  ["Stakeholder Management", "Business", "Aligning people with different incentives."],
  ["Market Analysis", "Business", "Sizing and segmenting opportunity."],
  ["Pricing", "Business", "Capturing value without losing customers."],
  ["Finance", "Business", "Reading and building the numbers."],
  ["Econometrics", "Business", "Causal inference with economic data."],
  ["Strategy", "Business", "Choosing what not to do."],
  ["Agile", "Business", "Iterative delivery that actually iterates."],
  ["Communication", "Human", "Explaining complex work simply."],
  ["Public Speaking", "Human", "Holding a room and a narrative."],
  ["Leadership", "Human", "Getting outcomes through other people."],
  ["Teamwork", "Human", "Being the person others want on the squad."],
  ["Networking", "Human", "Building a career-long circle of allies."],
  ["Mentoring", "Human", "Growing others and yourself."],
  ["Writing", "Human", "Docs, posts and proposals that land."],
  ["Research", "Human", "Rigorous, citable investigation."],
  ["Design Thinking", "Human", "Problem framing before solutioning."],
  ["Portfolio Craft", "Human", "Packaging your work so it sells itself."],
];

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const skills: Skill[] = skillSeed.map(([name, category, description]) => ({
  id: slug(name),
  name,
  category,
  description,
}));

export const skillById = (id: string) => skills.find((s) => s.id === id);
export const skillName = (id: string) => skillById(id)?.name ?? id;

const degreeSeed: [string, string, string[]][] = [
  ["Business Analytics", "Economics & Business", ["python", "sql", "statistics", "regression", "data-visualization", "optimization", "excel-modelling", "communication"]],
  ["Computer Science", "Science", ["python", "java", "git", "databases", "system-design", "testing", "linux", "apis"]],
  ["Economics", "Economics & Business", ["econometrics", "statistics", "finance", "market-analysis", "writing", "r"]],
  ["Artificial Intelligence", "Science", ["python", "machine-learning", "deep-learning", "nlp", "statistics", "research"]],
  ["Data Science", "Science", ["python", "sql", "machine-learning", "data-visualization", "statistics", "spark"]],
  ["Information Science", "Science", ["databases", "apis", "sql", "user-research", "communication"]],
  ["Software Engineering", "Engineering", ["git", "testing", "ci-cd", "system-design", "typescript", "apis"]],
  ["Industrial Engineering", "Engineering", ["optimization", "excel-modelling", "agile", "statistics"]],
  ["Electrical Engineering", "Engineering", ["python", "linux", "networking", "research"]],
  ["Mathematics", "Science", ["statistics", "optimization", "regression", "research"]],
  ["Physics", "Science", ["python", "research", "statistics", "writing"]],
  ["Psychology", "Social Sciences", ["research", "experiment-design", "communication", "user-research"]],
  ["Communication Science", "Social Sciences", ["writing", "public-speaking", "market-analysis", "user-research"]],
  ["Marketing", "Economics & Business", ["market-analysis", "pricing", "writing", "data-visualization"]],
  ["Finance", "Economics & Business", ["finance", "excel-modelling", "statistics", "strategy"]],
  ["Business Administration", "Economics & Business", ["strategy", "stakeholder-management", "finance", "agile"]],
  ["Human-Computer Interaction", "Science", ["design-thinking", "user-research", "html-css", "react"]],
  ["Bioinformatics", "Science", ["python", "statistics", "research", "databases"]],
  ["Cybersecurity", "Engineering", ["security", "linux", "networking", "python"]],
  ["Sustainability Science", "Social Sciences", ["research", "statistics", "writing", "strategy"]],
];

export const degrees: Degree[] = degreeSeed.map(([name, faculty, coreSkills]) => ({
  id: slug(name),
  name,
  faculty,
  coreSkills,
}));

const courseTemplates = [
  "Foundations of {d}",
  "Programming for {d}",
  "Statistics I",
  "Statistics II",
  "Research Methods",
  "Data Management & SQL",
  "Applied {d} Lab",
  "Modelling & Optimization",
  "Machine Learning Basics",
  "Advanced {d} Seminar",
  "Professional Skills",
  "Capstone Project",
  "Ethics & Society",
  "Quantitative Analysis",
  "Systems & Architecture",
];

export const courses: Course[] = degrees.flatMap((degree, di) =>
  courseTemplates.map((tpl, ci) => {
    const pool = degree.coreSkills;
    const picked = [pool[ci % pool.length], pool[(ci + 2) % pool.length]].filter(Boolean);
    return {
      id: `${degree.id}-c${ci + 1}`,
      code: `${degree.name.slice(0, 3).toUpperCase()}${100 + di * 7 + ci}`,
      name: tpl.replace("{d}", degree.name),
      degreeId: degree.id,
      year: Math.min(3, Math.floor(ci / 5) + 1),
      ects: [5, 6, 7.5][ci % 3] as number,
      skills: Array.from(new Set(picked)),
    };
  }),
);

export const coursesForDegree = (degreeId: string) => courses.filter((c) => c.degreeId === degreeId);

/** Skills a student is assumed to hold given degree + year of study. */
export function currentSkillProfile(degreeId: string, year: number) {
  const owned = new Map<string, number>();
  coursesForDegree(degreeId)
    .filter((c) => c.year <= year)
    .forEach((c) => c.skills.forEach((s) => owned.set(s, (owned.get(s) ?? 0) + 1)));
  return Array.from(owned.entries())
    .map(([id, count]) => ({ id, level: Math.min(5, count) }))
    .sort((a, b) => b.level - a.level);
}