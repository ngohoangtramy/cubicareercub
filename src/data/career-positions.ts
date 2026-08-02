export interface CareerPosition {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  relatedProgrammes: string[];
  isDemo: true;
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const positionGroups: Record<string, string[]> = {
  "Biotechnology & life sciences": [
    "Bioengineer", "Biomedical Engineer", "Biotechnology Researcher", "Tissue Engineer", "Research Scientist",
    "Laboratory Technician", "Clinical Research Associate", "Bioprocess Engineer", "Quality Control Scientist", "Regulatory Affairs Specialist",
    "Pharmaceutical Scientist", "Molecular Biologist", "Geneticist", "Cell Culture Scientist", "Neuroscientist",
    "Neurotechnology Research Engineer", "Computational Neuroscientist", "Bioinformatics Scientist", "Medical Device Engineer", "Biomaterials Engineer",
  ],
  "Software & data": [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full-Stack Developer", "Mobile App Developer",
    "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Researcher", "Cloud Engineer",
    "Cybersecurity Analyst", "DevOps Engineer", "Data Engineer", "MLOps Engineer", "Solutions Architect",
    "QA Engineer", "Database Administrator", "Site Reliability Engineer", "Computer Vision Engineer", "NLP Engineer",
  ],
  Engineering: [
    "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer", "Civil Engineer", "Robotics Engineer",
    "Automation Engineer", "Systems Engineer", "Process Engineer", "Manufacturing Engineer", "Sustainability Engineer",
    "Aerospace Engineer", "Materials Engineer", "Embedded Systems Engineer", "Control Engineer", "Energy Engineer",
    "Environmental Engineer", "Industrial Engineer", "Mechatronics Engineer", "Validation Engineer", "Field Service Engineer",
  ],
  "Product & design": [
    "Product Manager", "Technical Product Manager", "UX Designer", "UI Designer", "UX Researcher",
    "Service Designer", "Product Designer", "Interaction Designer", "Design Engineer", "Product Operations Manager",
  ],
  "Business & consulting": [
    "Business Analyst", "Strategy Consultant", "Management Consultant", "Financial Analyst", "Marketing Specialist",
    "Operations Manager", "Project Manager", "Product Marketing Manager", "Human Resources Specialist", "Entrepreneur",
    "Supply Chain Analyst", "Business Development Manager", "Sales Operations Analyst", "Risk Analyst", "Sustainability Consultant",
  ],
  "Healthcare & clinical": [
    "Clinical Data Manager", "Health Data Analyst", "Clinical Engineer", "Medical Science Liaison", "Public Health Analyst",
    "Epidemiologist", "Clinical Trial Manager", "Healthcare Consultant", "Rehabilitation Engineer", "Digital Health Specialist",
  ],
  "Research & education": [
    "Research Assistant", "Research Engineer", "Doctoral Researcher", "Scientific Programmer", "University Lecturer",
    "Science Communicator", "Research Data Manager", "Laboratory Manager", "Technology Transfer Officer", "Research Project Coordinator",
  ],
  "Policy & society": [
    "Policy Analyst", "Economic Analyst", "Environmental Policy Advisor", "Technology Policy Researcher", "International Development Officer",
    "Urban Planner", "Social Researcher", "Government Affairs Specialist", "Nonprofit Programme Manager", "Legal Researcher",
  ],
};

const categorySkills: Record<string, { required: string[]; preferred: string[]; programmes: string[] }> = {
  "Biotechnology & life sciences": {
    required: ["Experimental design", "Data analysis", "Scientific writing", "Laboratory methods", "Research ethics"],
    preferred: ["Python", "Cell culture", "Statistics", "Regulatory knowledge"],
    programmes: ["Bioengineering", "Biomedical Engineering", "Biotechnology", "Neuroscience", "Life Sciences"],
  },
  "Software & data": {
    required: ["Programming", "Git", "Testing", "Problem solving", "Data structures"],
    preferred: ["Cloud platforms", "Docker", "SQL", "System design"],
    programmes: ["Computer Science", "Artificial Intelligence", "Data Science", "Software Engineering"],
  },
  Engineering: {
    required: ["Engineering design", "Modelling", "Technical documentation", "Problem solving", "Project work"],
    preferred: ["CAD", "Programming", "Simulation", "Standards and safety"],
    programmes: ["Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Robotics"],
  },
  "Product & design": {
    required: ["User research", "Communication", "Product thinking", "Prototyping", "Prioritisation"],
    preferred: ["Analytics", "Accessibility", "Roadmapping", "Stakeholder management"],
    programmes: ["Human-Computer Interaction", "Design", "Business Administration", "Computer Science"],
  },
  "Business & consulting": {
    required: ["Communication", "Analysis", "Presentation", "Project management", "Business strategy"],
    preferred: ["Excel", "SQL", "Financial modelling", "Market research"],
    programmes: ["Business Administration", "Economics", "Finance", "Innovation Management"],
  },
  "Healthcare & clinical": {
    required: ["Clinical research", "Data quality", "Communication", "Ethics", "Documentation"],
    preferred: ["Statistics", "Regulation", "Health informatics", "Project management"],
    programmes: ["Public Health", "Biomedical Engineering", "Medicine", "Life Sciences"],
  },
  "Research & education": {
    required: ["Research methods", "Scientific writing", "Data analysis", "Critical thinking", "Presentation"],
    preferred: ["Teaching", "Grant writing", "Programming", "Open science"],
    programmes: ["Neuroscience", "Life Sciences", "Physics", "Social Sciences"],
  },
  "Policy & society": {
    required: ["Policy analysis", "Research", "Writing", "Stakeholder engagement", "Critical reasoning"],
    preferred: ["Statistics", "Economics", "Public speaking", "Project management"],
    programmes: ["Social Sciences", "Economics", "Law", "Public Health"],
  },
};

const curatedPositions: Record<string, Partial<CareerPosition>> = {
  "Data Engineer": {
    description: "Build reliable pipelines and data platforms for analytics products.",
    requiredSkills: ["SQL", "Python", "Data modelling", "ETL/ELT pipelines", "Databases", "Git"],
    preferredSkills: ["Cloud platforms", "Docker", "Apache Spark", "Workflow orchestration", "Data warehousing"],
    relatedProgrammes: ["Business Analytics", "Data Science", "Computer Science", "Econometrics", "Information Systems"],
  },
};

export const careerPositions: CareerPosition[] = Object.entries(positionGroups).flatMap(([category, titles]) =>
  titles.map((title) => {
    const skills = categorySkills[category];
    const curated = curatedPositions[title] ?? {};
    return {
      id: slug(title),
      title,
      category,
      description: curated.description ?? `Build experience and skills for work as a ${title}.`,
      requiredSkills: curated.requiredSkills ?? skills.required,
      preferredSkills: curated.preferredSkills ?? skills.preferred,
      relatedProgrammes: curated.relatedProgrammes ?? skills.programmes,
      isDemo: true as const,
    };
  }),
);

export const careerCategories = Object.keys(positionGroups);
export const careerPositionTitles = careerPositions.map((item) => item.title);
export const careerPositionByTitle = (title: string) => careerPositions.find((item) => item.title === title);
