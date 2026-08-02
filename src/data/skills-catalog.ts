const skillFamilies: Record<string, string[]> = {
  "Programming & data": [
    "Python", "R", "JavaScript", "TypeScript", "Java", "C++", "C#", "MATLAB", "SQL", "NoSQL",
    "Data cleaning", "Data visualisation", "Statistical modelling", "Machine learning", "Deep learning", "Computer vision", "Natural language processing", "MLOps", "Cloud computing", "Version control",
    "API development", "Database design", "Data engineering", "Feature engineering", "Model evaluation", "Reproducible analysis", "High-performance computing", "Linux", "Docker", "Kubernetes",
  ],
  Laboratory: [
    "Cell culture", "Sterile technique", "Microscopy", "Flow cytometry", "PCR", "qPCR", "Western blotting", "ELISA", "DNA extraction", "RNA extraction",
    "Protein purification", "Spectroscopy", "Chromatography", "Mass spectrometry", "Histology", "Immunostaining", "Electrophysiology", "MEA recording", "Patch clamp", "Bioreactor operation",
    "Biomaterial testing", "Tissue processing", "Sample preparation", "Assay development", "Quality control", "Laboratory safety", "Experimental documentation", "Animal handling", "Organoid culture", "Microfluidics",
  ],
  Engineering: [
    "Engineering design", "CAD", "Finite element analysis", "Control systems", "Signal processing", "Embedded systems", "Circuit design", "Sensor integration", "Rapid prototyping", "3D printing",
    "Systems engineering", "Requirements analysis", "Verification", "Validation", "Reliability engineering", "Risk analysis", "Manufacturing", "Process optimisation", "Automation", "Robotics",
    "Thermodynamics", "Fluid mechanics", "Mechanics", "Materials selection", "Life-cycle analysis", "Medical device design", "Human factors", "Technical drawing", "Metrology", "Root-cause analysis",
  ],
  Research: [
    "Experimental design", "Literature review", "Hypothesis development", "Research ethics", "Scientific writing", "Academic presentation", "Data management", "Open science", "Reproducibility", "Statistical inference",
    "Regression analysis", "ANOVA", "Bayesian analysis", "Survey design", "Interview research", "Qualitative analysis", "Clinical research", "Protocol development", "Grant writing", "Peer review",
    "Reference management", "Research planning", "Uncertainty analysis", "Causal inference", "Meta-analysis", "Systematic review", "Evidence synthesis", "Laboratory notebook management", "Research communication", "Scientific illustration",
  ],
  Business: [
    "Project management", "Product management", "Strategy", "Market research", "Financial modelling", "Budgeting", "Operations", "Supply chain", "Business analysis", "Stakeholder management",
    "Roadmapping", "Prioritisation", "Negotiation", "Customer discovery", "Sales", "Marketing", "Pricing", "Entrepreneurship", "Risk management", "Regulatory affairs",
    "Quality management", "Process mapping", "Change management", "Procurement", "Forecasting", "Competitive analysis", "Business development", "Consulting", "Decision analysis", "Portfolio management",
  ],
  "Communication & leadership": [
    "Written communication", "Oral communication", "Presentation", "Teamwork", "Leadership", "Mentoring", "Teaching", "Facilitation", "Conflict resolution", "Cross-cultural communication",
    "Technical communication", "Science communication", "Public speaking", "Active listening", "Feedback", "Collaboration", "Networking", "Time management", "Self-management", "Adaptability",
    "Critical thinking", "Problem solving", "Creativity", "Decision making", "Organisation", "Attention to detail", "Empathy", "Professional ethics", "Remote collaboration", "Meeting management",
  ],
  "Domain knowledge": [
    "Neuroscience", "Neuroanatomy", "Neurophysiology", "Computational neuroscience", "Bioinformatics", "Genomics", "Proteomics", "Molecular biology", "Cell biology", "Biochemistry",
    "Biotechnology", "Tissue engineering", "Regenerative medicine", "Biomaterials", "Biomedical engineering", "Medical imaging", "Biomechanics", "Pharmacology", "Immunology", "Microbiology",
    "Public health", "Epidemiology", "Health economics", "Clinical regulation", "Medical terminology", "Sustainability", "Environmental science", "Economics", "Psychology", "Human-computer interaction",
  ],
  "Digital & design": [
    "UX design", "UI design", "User research", "Interaction design", "Service design", "Information architecture", "Wireframing", "Prototyping", "Usability testing", "Accessibility",
    "Design systems", "Visual design", "Content design", "Product analytics", "A/B testing", "Web development", "Mobile design", "Responsive design", "Design thinking", "Journey mapping",
    "Customer experience", "SEO", "Digital marketing", "Content strategy", "Analytics", "Dashboard design", "Data storytelling", "Technical SEO", "Web accessibility", "Information visualisation",
  ],
  "Policy & compliance": [
    "Policy analysis", "Legal research", "GDPR", "Data protection", "Research governance", "Clinical compliance", "ISO standards", "Good laboratory practice", "Good manufacturing practice", "Quality assurance",
    "Ethics review", "Technology policy", "Environmental policy", "Health policy", "Intellectual property", "Patent research", "Contract review", "Audit preparation", "Documentation control", "Cybersecurity governance",
    "Responsible AI", "AI governance", "Risk compliance", "Safety regulation", "Medical device regulation", "Clinical trial regulation", "Regulatory submissions", "Standards mapping", "Policy writing", "Impact assessment",
  ],
  "Career skills": [
    "CV writing", "Portfolio development", "Interview preparation", "Career planning", "Job search", "Personal branding", "LinkedIn profile writing", "Application writing", "Salary negotiation", "Professional networking",
    "Goal setting", "Skill mapping", "Competency assessment", "Reflective practice", "Learning planning", "Internship search", "Research networking", "Conference participation", "Community building", "Volunteer leadership",
    "Workplace communication", "Professional conduct", "Remote work", "Meeting facilitation", "Career storytelling", "Opportunity evaluation", "Role research", "Company research", "Recruiter communication", "Reference management",
  ],
};

export interface MockSkill {
  id: string;
  name: string;
  category: string;
  isDemo: true;
}

export const mockSkillCatalogue: MockSkill[] = Object.entries(skillFamilies).flatMap(([category, names]) =>
  names.map((name, index) => ({
    id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    name,
    category,
    isDemo: true as const,
  })),
);
