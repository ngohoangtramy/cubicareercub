import {
  demoCareerNodes,
  demoCourses,
  demoProfile,
  demoRecommendations,
  demoSkills,
  demoVacancies,
  type CareerNode,
  type CourseRecord,
  type EducationProfile,
  type Recommendation,
  type SkillRecord,
  type VacancySummary,
} from "@/data/cubi-demo";

export interface CareerAnalysisBundle {
  profile: EducationProfile;
  courses: CourseRecord[];
  skills: SkillRecord[];
  vacancies: VacancySummary[];
  recommendations: Recommendation[];
  careerNodes: CareerNode[];
  mode: "demo" | "live";
  generatedAt: string;
}

export interface CareerDataSource {
  analyse(profile: EducationProfile): Promise<CareerAnalysisBundle>;
}

export class DemoCareerDataSource implements CareerDataSource {
  async analyse(profile: EducationProfile): Promise<CareerAnalysisBundle> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      profile: { ...demoProfile, ...profile },
      courses: demoCourses,
      skills: demoSkills,
      vacancies: demoVacancies,
      recommendations: demoRecommendations,
      careerNodes: demoCareerNodes,
      mode: "demo",
      generatedAt: new Date().toISOString(),
    };
  }
}

/*
 * Future live implementation boundary.
 * Keep catalogue retrieval, vacancy retrieval, caching, rate limiting and source
 * tracking on a backend/serverless worker. The browser should call only your own API.
 */
export class ApiCareerDataSource implements CareerDataSource {
  constructor(private readonly endpoint = "/api/analysis") {}

  async analyse(profile: EducationProfile): Promise<CareerAnalysisBundle> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error(`Analysis request failed: ${response.status}`);
    return response.json() as Promise<CareerAnalysisBundle>;
  }
}
