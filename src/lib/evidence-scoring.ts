import type {
  AdditionalEvidenceRecord,
  EvidenceProgress,
  EvidenceSkillImpact,
  SkillRecord,
} from "@/data/cubi-demo";

const readableExtensions = new Set([
  "txt",
  "md",
  "markdown",
  "csv",
  "json",
  "js",
  "jsx",
  "ts",
  "tsx",
  "py",
  "r",
  "sql",
  "html",
  "css",
  "scss",
  "yaml",
  "yml",
  "xml",
  "toml",
  "ipynb",
]);

const keywordRules: Array<{ skill: string; keywords: string[] }> = [
  { skill: "SQL", keywords: ["sql", "postgres", "postgresql", "mysql", "sqlite", "query", "database", "join", "window function"] },
  { skill: "Python", keywords: ["python", ".py", "pandas", "numpy", "fastapi", "flask", "django", "jupyter", "ipynb"] },
  { skill: "Data modelling", keywords: ["data model", "schema", "star schema", "dimensional", "entity relationship", "erd", "normalization", "normalisation"] },
  { skill: "ETL and ELT pipelines", keywords: ["etl", "elt", "pipeline", "extract", "transform", "load", "ingestion", "batch processing", "dataflow"] },
  { skill: "Data warehousing", keywords: ["warehouse", "data mart", "bigquery", "snowflake", "redshift", "databricks", "lakehouse"] },
  { skill: "Cloud data platforms", keywords: ["azure", "aws", "gcp", "cloud", "s3", "blob storage", "bigquery", "data factory", "glue"] },
  { skill: "Business analysis", keywords: ["business requirement", "stakeholder", "kpi", "dashboard", "reporting", "business analysis", "user story"] },
  { skill: "Statistics", keywords: ["statistics", "regression", "hypothesis", "probability", "confidence interval", "a/b test", "experiment"] },
  { skill: "Git and testing", keywords: ["git", "github", "gitlab", "test", "pytest", "unit test", "integration test", "ci/cd", "docker", "version control"] },
];

function roundFive(value: number) {
  return Math.max(0, Math.min(100, Math.round(value / 5) * 5));
}

function normalise(text: string) {
  return text.toLowerCase().replace(/[_-]+/g, " ");
}

function safeWebUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

function extensionOf(name: string) {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) ?? "" : "";
}

async function readFileText(file: File) {
  if (!readableExtensions.has(extensionOf(file.name))) return "";
  try {
    return await file.slice(0, 220_000).text();
  } catch {
    return "";
  }
}

function skillPriority(skill: SkillRecord) {
  const importance = skill.importance === "High" ? 95 : skill.importance === "Medium" ? 72 : 52;
  return (importance + skill.vacancyFrequency) / 2;
}

function findSkill(skills: SkillRecord[], name: string) {
  return skills.find((skill) => normalise(skill.name) === normalise(name));
}

function relevanceFromSkills(skills: SkillRecord[], impacts: EvidenceSkillImpact[]) {
  if (!impacts.length) return 25;
  const scores = impacts.map((impact) => {
    const skill = skills.find((item) => item.id === impact.skillId);
    return skill ? skillPriority(skill) : 45;
  });
  return roundFive(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

export async function scanProjectEvidence({
  files,
  title,
  description,
  skills,
}: {
  files: File[];
  title: string;
  description: string;
  skills: SkillRecord[];
}): Promise<AdditionalEvidenceRecord> {
  const readableText = await Promise.all(files.slice(0, 30).map(readFileText));
  const corpus = normalise(`${title}\n${description}\n${files.map((file) => file.name).join("\n")}\n${readableText.join("\n")}`);
  const impacts: EvidenceSkillImpact[] = [];

  for (const rule of keywordRules) {
    const matched = rule.keywords.filter((keyword) => corpus.includes(normalise(keyword)));
    if (!matched.length) continue;
    const skill = findSkill(skills, rule.skill);
    if (!skill) continue;
    const confidence = roundFive(Math.min(95, 50 + matched.length * 10 + (description.trim().length > 60 ? 10 : 0)));
    const levelGain = matched.length >= 4 || (matched.length >= 2 && readableText.some((text) => text.length > 500)) ? 2 : 1;
    impacts.push({
      skillId: skill.id,
      skillName: skill.name,
      confidence,
      levelGain,
      reason: `Detected ${matched.slice(0, 4).join(", ")} in the project files or description.`,
    });
  }

  const relevanceScore = relevanceFromSkills(skills, impacts);
  const readableCount = readableText.filter(Boolean).length;
  const impactScore = roundFive(
    25 + impacts.length * 7 + readableCount * 4 + (description.trim().length > 80 ? 10 : 0) + (files.length > 3 ? 5 : 0),
  );

  return {
    id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "project",
    title: title.trim() || files[0]?.name.replace(/\.[^.]+$/, "") || "Uploaded project",
    description: description.trim() || "Project evidence uploaded for skill review.",
    files: files.map((file) => file.name),
    progress: "completed",
    hours: 0,
    masteryLevel: Math.max(1, Math.min(5, impacts.length >= 4 ? 4 : impacts.length >= 2 ? 3 : 2)),
    relevanceScore,
    impactScore,
    skillImpacts: impacts,
    addedAt: new Date().toISOString(),
    source: "scanner",
  };
}

export function scoreManualLearning({
  title,
  provider,
  learningType,
  url,
  progress,
  hours,
  masteryLevel,
  assessmentScore,
  skillIds,
  skills,
}: {
  title: string;
  provider: string;
  learningType: AdditionalEvidenceRecord["learningType"];
  url?: string;
  progress: EvidenceProgress;
  hours: number;
  masteryLevel: number;
  assessmentScore?: number;
  skillIds: string[];
  skills: SkillRecord[];
}): AdditionalEvidenceRecord {
  const progressFactor = progress === "completed" ? 1 : progress === "in-progress" ? 0.62 : 0.28;
  const hoursFactor = Math.min(1, Math.max(0.2, hours / 40));
  const scoreFactor = assessmentScore === undefined ? masteryLevel / 5 : Math.max(0.2, assessmentScore / 100);

  const impacts: EvidenceSkillImpact[] = skillIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill): skill is SkillRecord => Boolean(skill))
    .map((skill) => ({
      skillId: skill.id,
      skillName: skill.name,
      confidence: roundFive(45 + masteryLevel * 8 + (assessmentScore !== undefined ? 10 : 0) + (progress === "completed" ? 10 : 0)),
      levelGain: progress === "planned" ? 0 : progress === "completed" && masteryLevel >= 4 && hours >= 20 ? 2 : 1,
      reason: `${title} was linked manually with mastery ${masteryLevel}/5${assessmentScore !== undefined ? ` and an assessment score of ${assessmentScore}%` : ""}.`,
    }));

  const relevanceScore = relevanceFromSkills(skills, impacts);
  const impactScore = roundFive(relevanceScore * progressFactor * (0.45 + 0.3 * hoursFactor + 0.25 * scoreFactor));

  return {
    id: `learning-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "self-study",
    title: title.trim(),
    description: `${learningType ?? "Self-study"}${provider.trim() ? ` from ${provider.trim()}` : ""}.`,
    provider: provider.trim() || undefined,
    learningType,
    url: safeWebUrl(url),
    files: [],
    progress,
    hours: Math.max(0, hours),
    masteryLevel: Math.max(1, Math.min(5, masteryLevel)),
    assessmentScore,
    relevanceScore,
    impactScore,
    skillImpacts: impacts,
    addedAt: new Date().toISOString(),
    source: "user",
  };
}

export function rescoreProjectEvidence(
  record: AdditionalEvidenceRecord,
  impacts: EvidenceSkillImpact[],
  skills: SkillRecord[],
) {
  const ratio = record.skillImpacts.length ? impacts.length / record.skillImpacts.length : 0;
  return {
    ...record,
    skillImpacts: impacts,
    relevanceScore: relevanceFromSkills(skills, impacts),
    impactScore: impacts.length ? roundFive(record.impactScore * (0.55 + 0.45 * ratio)) : 0,
  };
}

export function scoreRecommendation(
  skillNames: string[],
  skills: SkillRecord[],
) {
  const matched = skills.filter((skill) => skillNames.some((name) => normalise(name).includes(normalise(skill.name)) || normalise(skill.name).includes(normalise(name))));
  if (!matched.length) return { relevance: 55, impact: 45 };
  const relevance = roundFive(matched.reduce((sum, skill) => sum + skillPriority(skill), 0) / matched.length);
  const gap = matched.reduce((sum, skill) => sum + Math.max(0, skill.targetLevel - skill.currentLevel), 0) / matched.length;
  return { relevance, impact: roundFive(35 + gap * 13 + matched.length * 4) };
}
