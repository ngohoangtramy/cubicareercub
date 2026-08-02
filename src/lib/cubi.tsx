import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  demoActivity,
  demoAdditionalEvidence,
  demoCareerNodes,
  demoCourses,
  demoProfile,
  demoRecommendations,
  demoSkills,
  demoVacancies,
  type ActivityRecord,
  type AdditionalEvidenceRecord,
  type CareerNode,
  type CourseRecord,
  type EducationProfile,
  type Recommendation,
  type SkillRecord,
  type VacancySummary,
} from "@/data/cubi-demo";
import { createCareerRecommendations, type StepStatus } from "@/data/guided-actions";
import { careerPositionByTitle } from "@/data/career-positions";

interface CubiState {
  profile: EducationProfile;
  courses: CourseRecord[];
  skills: SkillRecord[];
  vacancies: VacancySummary[];
  recommendations: Recommendation[];
  careerNodes: CareerNode[];
  activity: ActivityRecord[];
  additionalEvidence: AdditionalEvidenceRecord[];
  analysisCompleted: boolean;
  lastAnalysedAt: string | null;
}

interface CubiContextValue extends CubiState {
  readiness: number;
  saveProfile: (profile: EducationProfile) => void;
  completeAnalysis: () => void;
  updateSkillStatus: (id: string, status: SkillRecord["status"]) => void;
  updateRecommendation: (id: string, status: Recommendation["status"]) => void;
  updateRecommendationStep: (recommendationId: string, stepId: string, status: StepStatus) => void;
  addRecommendationEvidence: (recommendationId: string, evidence: string) => void;
  toggleCourseVerified: (id: string) => void;
  updateCourse: (id: string, changes: Partial<CourseRecord>) => void;
  addEvidence: (skillId: string, evidence: string) => void;
  addAdditionalEvidence: (record: AdditionalEvidenceRecord) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "cubi-career-platform-v5";

const initialState: CubiState = {
  profile: demoProfile,
  courses: demoCourses,
  skills: demoSkills,
  vacancies: demoVacancies,
  recommendations: demoRecommendations,
  careerNodes: demoCareerNodes,
  activity: demoActivity,
  additionalEvidence: demoAdditionalEvidence,
  analysisCompleted: false,
  lastAnalysedAt: null,
};

const CubiContext = createContext<CubiContextValue | null>(null);

function syncCareerNodeProgress(
  nodes: CareerNode[],
  recommendationId: string,
  status: Recommendation["status"],
): CareerNode[] {
  const directNodeMap: Record<string, string> = {
    r1: "n2",
    "de-sql": "n2",
    r2: "n3",
    "de-python": "n3",
    r3: "n4",
    "de-project": "n4",
    r4: "n5",
    "de-internship": "n5",
  };
  const directNodeId = directNodeMap[recommendationId];

  return nodes.map((node) => {
    if (node.id === directNodeId) {
      return {
        ...node,
        state:
          status === "completed"
            ? "completed"
            : status === "in-progress"
              ? "in-progress"
              : node.id === "n2" || node.id === "n3"
                ? "recommended"
                : "locked",
      };
    }
    if ((recommendationId === "r3" || recommendationId === "de-project") && status === "completed" && node.id === "n5") {
      return { ...node, state: "recommended" };
    }
    if ((recommendationId === "r4" || recommendationId === "de-internship") && status === "completed" && node.id === "n6") {
      return { ...node, state: "recommended" };
    }
    return node;
  });
}

function loadState(): CubiState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<CubiState>;
    return {
      ...initialState,
      ...parsed,
      profile: { ...initialState.profile, ...(parsed.profile ?? {}) },
    };
  } catch {
    return initialState;
  }
}

function statusForLevel(currentLevel: number, targetLevel: number): SkillRecord["status"] {
  if (currentLevel >= targetLevel) return "acquired";
  if (currentLevel >= Math.max(1, targetLevel - 1)) return "partial";
  if (currentLevel > 0) return "developing";
  return "missing";
}

function applyEvidenceToSkills(skills: SkillRecord[], record: AdditionalEvidenceRecord) {
  return skills.map((skill) => {
    const impact = record.skillImpacts.find((item) => item.skillId === skill.id);
    if (!impact) return skill;
    const currentLevel = Math.min(5, skill.currentLevel + impact.levelGain);
    const evidence = `${record.title}: ${impact.reason}`;
    return {
      ...skill,
      currentLevel,
      status: statusForLevel(currentLevel, skill.targetLevel),
      confidence: Math.min(99, skill.confidence + Math.max(4, Math.round(impact.confidence / 12))),
      evidence: skill.evidence.includes(evidence) ? skill.evidence : [...skill.evidence, evidence],
    };
  });
}

function applyEvidenceToCareerNodes(nodes: CareerNode[], record: AdditionalEvidenceRecord) {
  const skillNames = record.skillImpacts.map((item) => item.skillName.toLowerCase());
  const supportsSql = skillNames.some((name) => name.includes("sql") || name.includes("data modelling"));
  const supportsPipeline = skillNames.some((name) => name.includes("python") || name.includes("etl") || name.includes("testing"));
  const strongCompletion = record.progress === "completed" && record.impactScore >= 65;

  return nodes.map((node) => {
    if (record.kind === "self-study" && node.id === "n2" && supportsSql) {
      return { ...node, state: strongCompletion ? "completed" : "in-progress" };
    }
    if (record.kind === "self-study" && node.id === "n3" && supportsPipeline) {
      return { ...node, state: strongCompletion ? "completed" : "in-progress" };
    }
    if (record.kind === "project" && node.id === "n4" && record.relevanceScore >= 45) {
      return { ...node, state: strongCompletion ? "completed" : "in-progress" };
    }
    if (record.kind === "project" && strongCompletion && node.id === "n5") {
      return { ...node, state: "recommended" };
    }
    return node;
  });
}

export function CubiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CubiState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated && typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const readiness = useMemo(() => {
    const weighted = state.skills.reduce((sum, skill) => {
      const importance = skill.importance === "High" ? 1.4 : skill.importance === "Medium" ? 1 : 0.7;
      return sum + Math.min(skill.currentLevel / Math.max(skill.targetLevel, 1), 1) * importance;
    }, 0);
    const max = state.skills.reduce(
      (sum, skill) => sum + (skill.importance === "High" ? 1.4 : skill.importance === "Medium" ? 1 : 0.7),
      0,
    );
    return Math.round((weighted / max) * 100);
  }, [state.skills]);

  const addActivity = (entry: Omit<ActivityRecord, "id" | "date">) => {
    const record: ActivityRecord = {
      id: `activity-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      ...entry,
    };
    return record;
  };

  const value: CubiContextValue = {
    ...state,
    readiness,
    saveProfile: (profile) =>
      setState((current) => {
        const careerChanged = profile.targetOccupation !== current.profile.targetOccupation;
        const career = careerPositionByTitle(profile.targetOccupation);
        return {
          ...current,
          profile,
          recommendations: careerChanged
            ? createCareerRecommendations(profile.targetOccupation, [
                ...(career?.requiredSkills ?? []),
                ...(career?.preferredSkills ?? []),
              ])
            : current.recommendations,
        };
      }),
    completeAnalysis: () =>
      setState((current) => ({
        ...current,
        analysisCompleted: true,
        lastAnalysedAt: new Date().toISOString(),
        activity: [
          addActivity({ title: "Career analysis refreshed", detail: "Demo data was recalculated from the current profile.", type: "analysis" }),
          ...current.activity,
        ],
      })),
    updateSkillStatus: (id, status) =>
      setState((current) => ({
        ...current,
        skills: current.skills.map((skill) => (skill.id === id ? { ...skill, status } : skill)),
        activity: [
          addActivity({ title: "Skill status updated", detail: `${current.skills.find((s) => s.id === id)?.name ?? "Skill"} marked ${status}.`, type: "skill" }),
          ...current.activity,
        ],
      })),
    updateRecommendation: (id, status) =>
      setState((current) => ({
        ...current,
        recommendations: current.recommendations.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                steps:
                  status === "completed"
                    ? item.steps.map((step) => ({ ...step, status: "completed" as const }))
                    : item.steps,
              }
            : item,
        ),
        careerNodes: syncCareerNodeProgress(current.careerNodes, id, status),
        activity: [
          addActivity({ title: "Action plan updated", detail: `${current.recommendations.find((r) => r.id === id)?.title ?? "Action"} marked ${status}.`, type: "action" }),
          ...current.activity,
        ],
      })),
    updateRecommendationStep: (recommendationId, stepId, status) =>
      setState((current) => {
        const recommendation = current.recommendations.find((item) => item.id === recommendationId);
        const step = recommendation?.steps.find((item) => item.id === stepId);
        let resultingStatus: Recommendation["status"] = recommendation?.status ?? "not-started";
        const recommendations = current.recommendations.map((item) => {
          if (item.id !== recommendationId) return item;
          const steps = item.steps.map((currentStep) =>
            currentStep.id === stepId ? { ...currentStep, status } : currentStep,
          );
          const completedCount = steps.filter((currentStep) => currentStep.status === "completed").length;
          resultingStatus =
            completedCount === steps.length
              ? "completed"
              : steps.some((currentStep) => currentStep.status !== "not-started")
                ? "in-progress"
                : "not-started";
          return { ...item, steps, status: resultingStatus };
        });
        return {
          ...current,
          recommendations,
          careerNodes: syncCareerNodeProgress(current.careerNodes, recommendationId, resultingStatus),
          activity: [
            addActivity({
              title: status === "completed" ? "Guided step completed" : "Guided step updated",
              detail: `${step?.title ?? "Step"} marked ${status}.`,
              type: "action",
            }),
            ...current.activity,
          ],
        };
      }),
    addRecommendationEvidence: (recommendationId, evidence) =>
      setState((current) => ({
        ...current,
        recommendations: current.recommendations.map((item) =>
          item.id === recommendationId ? { ...item, evidence: [...item.evidence, evidence] } : item,
        ),
        activity: [
          addActivity({ title: "Goal evidence added", detail: evidence, type: "evidence" }),
          ...current.activity,
        ],
      })),
    toggleCourseVerified: (id) =>
      setState((current) => ({
        ...current,
        courses: current.courses.map((course) => (course.id === id ? { ...course, verified: !course.verified } : course)),
      })),
    updateCourse: (id, changes) =>
      setState((current) => ({
        ...current,
        courses: current.courses.map((course) => (course.id === id ? { ...course, ...changes, verified: true } : course)),
        activity: [
          addActivity({ title: "Course record corrected", detail: `${current.courses.find((course) => course.id === id)?.name ?? "Course"} was updated by the user.`, type: "evidence" }),
          ...current.activity,
        ],
      })),
    addEvidence: (skillId, evidence) =>
      setState((current) => ({
        ...current,
        skills: current.skills.map((skill) =>
          skill.id === skillId ? { ...skill, evidence: [...skill.evidence, evidence], confidence: Math.min(99, skill.confidence + 5) } : skill,
        ),
        activity: [
          addActivity({ title: "Evidence added", detail: evidence, type: "evidence" }),
          ...current.activity,
        ],
      })),
    addAdditionalEvidence: (record) =>
      setState((current) => ({
        ...current,
        additionalEvidence: [record, ...current.additionalEvidence.filter((item) => item.id !== record.id)],
        skills: applyEvidenceToSkills(current.skills, record),
        careerNodes: applyEvidenceToCareerNodes(current.careerNodes, record),
        activity: [
          addActivity({
            title: record.kind === "project" ? "Project evidence scanned" : "Self-study evidence added",
            detail: `${record.title} scored ${record.relevanceScore}% relevance and ${record.impactScore}% estimated skill impact.`,
            type: "evidence",
          }),
          ...current.activity,
        ],
      })),
    resetDemo: () => {
      if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    },
  };

  return <CubiContext.Provider value={value}>{children}</CubiContext.Provider>;
}

export function useCubi() {
  const context = useContext(CubiContext);
  if (!context) throw new Error("useCubi must be used within CubiProvider");
  return context;
}
