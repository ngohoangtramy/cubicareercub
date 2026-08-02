export type { Recommendation } from "./guided-actions";
export { dataEngineerRecommendations as demoRecommendations } from "./guided-actions";

export type SkillStatus = "acquired" | "partial" | "developing" | "missing" | "optional" | "verify";
export type SkillCategory =
  | "Technical"
  | "Laboratory"
  | "Research"
  | "Programming & data"
  | "Analytical"
  | "Communication"
  | "Project management"
  | "Domain knowledge"
  | "Transferable";

export interface EducationProfile {
  educationLevel: string;
  country: string;
  institution: string;
  degreeProgramme: string;
  currentYear: string;
  graduationYear: string;
  targetOccupation: string;
  region: string;
  workMode: string;
  experienceLevel: string;
  industries: string[];
}

export interface CourseRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  learningOutcomes: string[];
  topics: string[];
  credits: number;
  academicLevel: string;
  prerequisites: string;
  assessment: string;
  sourceUrl: string;
  retrievedAt: string;
  verified: boolean;
}

export interface SkillRecord {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  currentLevel: number;
  targetLevel: number;
  importance: "High" | "Medium" | "Low";
  vacancyFrequency: number;
  evidence: string[];
  courseIds: string[];
  confidence: number;
  source: string;
  nextAction: string;
  timeRequired: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface VacancySummary {
  id: string;
  title: string;
  employer: string;
  location: string;
  mode: string;
  level: string;
  education: string;
  requiredSkills: string[];
  preferredSkills: string[];
  tools: string[];
  sourceUrl: string;
  postingDate: string;
}


export interface LearningResource {
  title: string;
  provider: string;
  type: "Course" | "Video" | "Practice" | "Programme" | "Certification";
  url: string;
  duration?: string;
}

export interface CareerNode {
  id: string;
  label: string;
  type: "Education" | "Course" | "Skill" | "Project" | "Internship" | "Certification" | "Entry-level role" | "Intermediate role" | "Target occupation";
  state: "completed" | "in-progress" | "recommended" | "locked" | "optional" | "verify";
  x: number;
  y: number;
  route: "primary" | "alternative";
  description: string;
  relevance: string;
  skills: string[];
  prerequisites: string[];
  duration: string;
  resources?: LearningResource[];
}

export interface ActivityRecord {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: "skill" | "evidence" | "action" | "analysis";
}

export type AdditionalEvidenceKind = "project" | "self-study";
export type EvidenceProgress = "planned" | "in-progress" | "completed";

export interface EvidenceSkillImpact {
  skillId: string;
  skillName: string;
  confidence: number;
  levelGain: number;
  reason: string;
}

export interface AdditionalEvidenceRecord {
  id: string;
  kind: AdditionalEvidenceKind;
  title: string;
  description: string;
  provider?: string;
  learningType?: "Course" | "Video" | "Book" | "Bootcamp" | "Workshop" | "Self-study";
  url?: string;
  files: string[];
  progress: EvidenceProgress;
  hours: number;
  masteryLevel: number;
  assessmentScore?: number;
  relevanceScore: number;
  impactScore: number;
  skillImpacts: EvidenceSkillImpact[];
  addedAt: string;
  source: "scanner" | "user";
}

const uvaProgrammeUrl = "https://www.uva.nl/en/programmes/bachelors/business-analytics/business-analytics.html";
const uvaStudyUrl = "https://www.uva.nl/en/programmes/bachelors/business-analytics/study-programme/study-programme.html";

export const demoProfile: EducationProfile = {
  educationLevel: "Bachelor’s student",
  country: "Netherlands",
  institution: "University of Amsterdam",
  degreeProgramme: "Bachelor's Business Analytics",
  currentYear: "2",
  graduationYear: "2028",
  targetOccupation: "Data Engineer",
  region: "Europe",
  workMode: "Hybrid",
  experienceLevel: "Graduate / entry-level",
  industries: ["Software & data", "Business analytics", "Technology"],
};

export const demoCourses: CourseRecord[] = [
  {
    id: "c1",
    name: "Programming for Business Analytics",
    code: "BA-DEMO-101",
    description: "Python fundamentals, data cleaning, reusable functions and reproducible analytical workflows.",
    learningOutcomes: ["Write structured Python", "Clean tabular data", "Document a reproducible analysis"],
    topics: ["Python", "pandas", "data cleaning", "Git"],
    credits: 6,
    academicLevel: "Bachelor — foundation",
    prerequisites: "None recorded",
    assessment: "Demo project and examination",
    sourceUrl: uvaStudyUrl,
    retrievedAt: "2026-07-30",
    verified: false,
  },
  {
    id: "c2",
    name: "Probability and Statistics",
    code: "BA-DEMO-102",
    description: "Probability, estimation, hypothesis testing and interpretation of uncertainty in business data.",
    learningOutcomes: ["Apply probability models", "Test hypotheses", "Explain statistical uncertainty"],
    topics: ["probability", "statistics", "inference", "experimentation"],
    credits: 6,
    academicLevel: "Bachelor — foundation",
    prerequisites: "Secondary-school mathematics",
    assessment: "Demo examination",
    sourceUrl: uvaStudyUrl,
    retrievedAt: "2026-07-30",
    verified: false,
  },
  {
    id: "c3",
    name: "Databases and SQL",
    code: "BA-DEMO-201",
    description: "Relational databases, SQL queries, joins, aggregation and introductory data modelling.",
    learningOutcomes: ["Query relational databases", "Design a simple schema", "Validate query results"],
    topics: ["SQL", "relational databases", "joins", "data modelling"],
    credits: 6,
    academicLevel: "Bachelor — intermediate",
    prerequisites: "Introductory programming",
    assessment: "Demo assignments and examination",
    sourceUrl: uvaStudyUrl,
    retrievedAt: "2026-07-30",
    verified: false,
  },
  {
    id: "c4",
    name: "Operations Research and Optimisation",
    code: "BA-DEMO-202",
    description: "Mathematical optimisation for planning, allocation and business decision problems.",
    learningOutcomes: ["Formulate optimisation models", "Evaluate constraints", "Interpret model output"],
    topics: ["linear optimisation", "decision models", "algorithms", "modelling"],
    credits: 6,
    academicLevel: "Bachelor — intermediate",
    prerequisites: "Calculus and linear algebra",
    assessment: "Demo modelling assignment",
    sourceUrl: uvaStudyUrl,
    retrievedAt: "2026-07-30",
    verified: false,
  },
  {
    id: "c5",
    name: "Machine Learning for Business",
    code: "BA-DEMO-301",
    description: "Supervised learning, model evaluation and responsible use of predictive systems in business settings.",
    learningOutcomes: ["Train baseline models", "Evaluate prediction quality", "Explain limitations"],
    topics: ["machine learning", "feature engineering", "cross-validation", "responsible AI"],
    credits: 6,
    academicLevel: "Bachelor — advanced",
    prerequisites: "Python and statistics",
    assessment: "Demo notebook portfolio",
    sourceUrl: uvaStudyUrl,
    retrievedAt: "2026-07-30",
    verified: false,
  },
  {
    id: "c6",
    name: "Business Analytics Project",
    code: "BA-DEMO-302",
    description: "Team project connecting business requirements, data preparation, analysis and stakeholder communication.",
    learningOutcomes: ["Translate a business question", "Build an analytical workflow", "Present evidence clearly"],
    topics: ["requirements", "teamwork", "analytics", "presentation"],
    credits: 12,
    academicLevel: "Bachelor — advanced",
    prerequisites: "Core Business Analytics modules",
    assessment: "Demo project, report and presentation",
    sourceUrl: uvaStudyUrl,
    retrievedAt: "2026-07-30",
    verified: false,
  },
];

export const demoSkills: SkillRecord[] = [
  {
    id: "s1",
    name: "SQL",
    category: "Programming & data",
    status: "partial",
    currentLevel: 2,
    targetLevel: 4,
    importance: "High",
    vacancyFrequency: 84,
    evidence: ["Databases and SQL includes relational queries, joins and aggregation"],
    courseIds: ["c3"],
    confidence: 88,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Complete advanced SQL practice and build one reporting schema",
    timeRequired: "15–25 hours",
    difficulty: "Intermediate",
  },
  {
    id: "s2",
    name: "Python",
    category: "Programming & data",
    status: "partial",
    currentLevel: 2,
    targetLevel: 4,
    importance: "High",
    vacancyFrequency: 79,
    evidence: ["Programming for Business Analytics uses Python", "Machine Learning for Business uses Python notebooks"],
    courseIds: ["c1", "c5"],
    confidence: 90,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Use Python to extract, transform and validate data from an API",
    timeRequired: "18–30 hours",
    difficulty: "Intermediate",
  },
  {
    id: "s3",
    name: "Data modelling",
    category: "Technical",
    status: "developing",
    currentLevel: 1,
    targetLevel: 4,
    importance: "High",
    vacancyFrequency: 68,
    evidence: ["Databases and SQL introduces relational schemas"],
    courseIds: ["c3"],
    confidence: 73,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Design a star schema for a small analytics warehouse",
    timeRequired: "10–16 hours",
    difficulty: "Intermediate",
  },
  {
    id: "s4",
    name: "ETL and ELT pipelines",
    category: "Programming & data",
    status: "missing",
    currentLevel: 0,
    targetLevel: 4,
    importance: "High",
    vacancyFrequency: 76,
    evidence: ["No direct pipeline-building evidence found in the selected programme"],
    courseIds: [],
    confidence: 92,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Build an automated extract-transform-load pipeline with tests",
    timeRequired: "25–40 hours",
    difficulty: "Intermediate",
  },
  {
    id: "s5",
    name: "Data warehousing",
    category: "Technical",
    status: "missing",
    currentLevel: 0,
    targetLevel: 3,
    importance: "High",
    vacancyFrequency: 61,
    evidence: ["No direct warehouse or dimensional-modelling module detected"],
    courseIds: [],
    confidence: 87,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Load a cleaned dataset into a warehouse and document its model",
    timeRequired: "18–28 hours",
    difficulty: "Intermediate",
  },
  {
    id: "s6",
    name: "Cloud data platforms",
    category: "Technical",
    status: "missing",
    currentLevel: 0,
    targetLevel: 3,
    importance: "Medium",
    vacancyFrequency: 58,
    evidence: ["No direct cloud-platform evidence detected"],
    courseIds: [],
    confidence: 82,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Complete one beginner cloud data-engineering learning path",
    timeRequired: "12–20 hours",
    difficulty: "Intermediate",
  },
  {
    id: "s7",
    name: "Business analysis",
    category: "Analytical",
    status: "acquired",
    currentLevel: 3,
    targetLevel: 3,
    importance: "Medium",
    vacancyFrequency: 42,
    evidence: ["Business Analytics Project connects requirements to analytical delivery", "Operations Research develops decision modelling"],
    courseIds: ["c4", "c6"],
    confidence: 89,
    source: "Demo course catalogue",
    nextAction: "Frame your pipeline project around a clear business decision",
    timeRequired: "3–5 hours",
    difficulty: "Beginner",
  },
  {
    id: "s8",
    name: "Statistics",
    category: "Analytical",
    status: "acquired",
    currentLevel: 3,
    targetLevel: 3,
    importance: "Medium",
    vacancyFrequency: 45,
    evidence: ["Probability and Statistics covers inference and uncertainty", "Machine Learning uses model evaluation"],
    courseIds: ["c2", "c5"],
    confidence: 91,
    source: "Demo course catalogue",
    nextAction: "Use data-quality checks and summary statistics in your portfolio",
    timeRequired: "4–6 hours",
    difficulty: "Beginner",
  },
  {
    id: "s9",
    name: "Git and testing",
    category: "Programming & data",
    status: "developing",
    currentLevel: 1,
    targetLevel: 3,
    importance: "Medium",
    vacancyFrequency: 52,
    evidence: ["Programming course suggests reproducible workflows, but testing evidence is limited"],
    courseIds: ["c1"],
    confidence: 66,
    source: "Demo course catalogue + 22 representative data-engineering vacancies",
    nextAction: "Add version control, unit tests and a clear README to the pipeline project",
    timeRequired: "8–12 hours",
    difficulty: "Intermediate",
  },
];

export const demoVacancies: VacancySummary[] = [
  {
    id: "v1",
    title: "Junior Data Engineer",
    employer: "Northstar Analytics",
    location: "Amsterdam, Netherlands",
    mode: "Hybrid",
    level: "Graduate",
    education: "BSc in Business Analytics, Computer Science, Data Science or related field",
    requiredSkills: ["SQL", "Python", "ETL pipelines", "data modelling"],
    preferredSkills: ["Cloud platforms", "Docker", "workflow orchestration"],
    tools: ["Python", "PostgreSQL", "Airflow", "Docker"],
    sourceUrl: "https://example.com/jobs/data-engineer-1",
    postingDate: "2026-07-26",
  },
  {
    id: "v2",
    title: "Graduate Analytics Engineer",
    employer: "Canal Data Works",
    location: "Rotterdam, Netherlands",
    mode: "Hybrid",
    level: "Graduate",
    education: "Quantitative bachelor’s degree",
    requiredSkills: ["SQL", "data modelling", "Git", "business analysis"],
    preferredSkills: ["dbt", "cloud warehouse", "Python"],
    tools: ["SQL", "dbt", "BigQuery", "Git"],
    sourceUrl: "https://example.com/jobs/analytics-engineer-1",
    postingDate: "2026-07-25",
  },
  {
    id: "v3",
    title: "Data Platform Intern",
    employer: "Tulip Commerce",
    location: "Utrecht, Netherlands",
    mode: "On-site",
    level: "Internship",
    education: "Current bachelor’s or master’s student",
    requiredSkills: ["Python", "SQL", "problem solving"],
    preferredSkills: ["APIs", "Docker", "cloud basics"],
    tools: ["Python", "SQL", "Azure"],
    sourceUrl: "https://example.com/jobs/data-platform-intern",
    postingDate: "2026-07-23",
  },
  {
    id: "v4",
    title: "Business Intelligence Developer",
    employer: "Delta Retail Group",
    location: "Remote — Europe",
    mode: "Remote",
    level: "Entry-level",
    education: "Business analytics or technical degree",
    requiredSkills: ["SQL", "data warehousing", "data quality"],
    preferredSkills: ["Power BI", "Python", "cloud warehouse"],
    tools: ["SQL", "Power BI", "Snowflake"],
    sourceUrl: "https://example.com/jobs/bi-developer",
    postingDate: "2026-07-22",
  },
];

export const demoCareerNodes: CareerNode[] = [
  {
    id: "n1",
    label: "Business Analytics BSc",
    type: "Education",
    state: "in-progress",
    x: 60,
    y: 220,
    route: "primary",
    description: "Your selected bachelor’s programme at the University of Amsterdam.",
    relevance: "Builds quantitative analysis, programming and business problem-framing skills that transfer well to data engineering.",
    skills: ["Statistics", "Python", "Optimisation", "Business analysis"],
    prerequisites: [],
    duration: "Current programme",
    resources: [
      { title: "Bachelor's Business Analytics", provider: "University of Amsterdam", type: "Programme", url: uvaProgrammeUrl, duration: "3 years" },
      { title: "View the study programme", provider: "University of Amsterdam", type: "Course", url: uvaStudyUrl },
    ],
  },
  {
    id: "n2",
    label: "SQL & data modelling",
    type: "Course",
    state: "in-progress",
    x: 270,
    y: 120,
    route: "primary",
    description: "Move from basic queries to joins, window functions, schemas and reliable data models.",
    relevance: "SQL and data modelling are central to building trustworthy analytics datasets.",
    skills: ["SQL", "Relational databases", "Data modelling"],
    prerequisites: ["Basic database concepts"],
    duration: "2–4 weeks",
    resources: [
      { title: "Interactive SQL lessons", provider: "SQLBolt", type: "Practice", url: "https://sqlbolt.com/", duration: "Self-paced" },
      { title: "Intro to SQL", provider: "Kaggle Learn", type: "Course", url: "https://www.kaggle.com/learn/intro-to-sql", duration: "Short course" },
    ],
  },
  {
    id: "n3",
    label: "Python & ETL foundations",
    type: "Course",
    state: "recommended",
    x: 270,
    y: 300,
    route: "primary",
    description: "Learn to ingest data, handle schema changes, transform records and validate pipeline output.",
    relevance: "This bridges the gap between analytical notebooks and production-style data workflows.",
    skills: ["Python", "ETL", "APIs", "Testing"],
    prerequisites: ["Basic Python"],
    duration: "3–5 weeks",
    resources: [
      { title: "Data Engineering Course for Beginners", provider: "freeCodeCamp", type: "Video", url: "https://www.youtube.com/watch?v=PHsC_t0j1dU", duration: "Full course" },
      { title: "Data loading with Python", provider: "freeCodeCamp", type: "Video", url: "https://www.youtube.com/watch?v=T23Bs75F7ZQ", duration: "Full course" },
      { title: "Introduction to data engineering on Azure", provider: "Microsoft Learn", type: "Course", url: "https://learn.microsoft.com/en-us/training/modules/introduction-to-data-engineering-azure/", duration: "Beginner module" },
    ],
  },
  {
    id: "n4",
    label: "Pipeline portfolio project",
    type: "Project",
    state: "locked",
    x: 500,
    y: 210,
    route: "primary",
    description: "Build a documented pipeline that ingests an API, validates data and loads an analytics-ready model.",
    relevance: "A complete project proves that you can connect Python, SQL, data quality and documentation.",
    skills: ["ETL", "Data quality", "Docker", "Documentation"],
    prerequisites: ["SQL foundations", "Python and ETL foundations"],
    duration: "30–45 hours",
    resources: [
      { title: "Data Engineering Zoomcamp", provider: "DataTalks.Club", type: "Course", url: "https://datatalks.club/docs/courses/data-engineering-zoomcamp/", duration: "Self-paced" },
    ],
  },
  {
    id: "n5",
    label: "Data or analytics internship",
    type: "Internship",
    state: "locked",
    x: 730,
    y: 210,
    route: "primary",
    description: "Apply your pipeline and analytical skills in a team handling real data systems.",
    relevance: "Professional experience adds production context, feedback and references.",
    skills: ["Requirements", "Teamwork", "Data quality", "Delivery"],
    prerequisites: ["Portfolio project", "Updated CV and GitHub"],
    duration: "8–24 weeks",
  },
  {
    id: "n6",
    label: "Data Engineer",
    type: "Target occupation",
    state: "locked",
    x: 960,
    y: 210,
    route: "primary",
    description: "Build and maintain reliable systems that collect, transform and deliver data for analytics products.",
    relevance: "This is the selected career goal used for the skill-gap and action-plan views.",
    skills: ["SQL", "Python", "Data pipelines", "Data modelling", "Cloud platforms"],
    prerequisites: ["Degree or equivalent evidence", "Strong pipeline portfolio", "Practical data experience"],
    duration: "Target role",
    resources: [
      { title: "Data Engineer career path", provider: "Microsoft Learn", type: "Course", url: "https://learn.microsoft.com/en-us/training/career-paths/data-engineer", duration: "Self-paced" },
      { title: "IBM Data Engineering Professional Certificate", provider: "IBM on Coursera", type: "Certification", url: "https://www.coursera.org/professional-certificates/ibm-data-engineer", duration: "Multi-course" },
    ],
  },
  {
    id: "n7",
    label: "Business Analyst role",
    type: "Entry-level role",
    state: "optional",
    x: 470,
    y: 390,
    route: "alternative",
    description: "An alternative first role using your business analytics degree while you deepen technical data-platform skills.",
    relevance: "Develops stakeholder, requirements and analytical delivery experience that can support a later move into data engineering.",
    skills: ["Business analysis", "SQL", "Stakeholder communication"],
    prerequisites: ["Business Analytics degree", "Analytical portfolio"],
    duration: "1–2 years",
  },
  {
    id: "n8",
    label: "Analytics Engineer",
    type: "Intermediate role",
    state: "locked",
    x: 720,
    y: 390,
    route: "alternative",
    description: "Transform warehouse data into tested, documented datasets for analysts and decision-makers.",
    relevance: "Analytics engineering is a strong bridge from business analytics into broader data-engineering responsibilities.",
    skills: ["Advanced SQL", "Data modelling", "Testing", "Documentation"],
    prerequisites: ["Strong SQL", "Business or data analyst experience"],
    duration: "1–3 years",
    resources: [
      { title: "Data Engineering Zoomcamp", provider: "DataTalks.Club", type: "Course", url: "https://datatalks.club/docs/courses/data-engineering-zoomcamp/", duration: "Self-paced" },
    ],
  },
];

export const demoAdditionalEvidence: AdditionalEvidenceRecord[] = [];

export const demoActivity: ActivityRecord[] = [
  { id: "a1", date: "2026-07-30", title: "Data Engineer career map created", detail: "Demo analysis connects the UvA Business Analytics bachelor to an entry-level Data Engineer route.", type: "analysis" },
  { id: "a2", date: "2026-07-30", title: "SQL marked in progress", detail: "Course evidence was found, but advanced modelling practice is still recommended.", type: "skill" },
  { id: "a3", date: "2026-07-30", title: "Pipeline foundation recommended", detail: "Python ingestion, ETL and testing were added to the action plan.", type: "action" },
];

export const skillStatusLabel: Record<SkillStatus, string> = {
  acquired: "Acquired",
  partial: "Partially developed",
  developing: "In progress",
  missing: "Missing",
  optional: "Optional",
  verify: "Needs verification",
};
