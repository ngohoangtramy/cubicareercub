export interface EuropeanUniversity {
  id: string;
  name: string;
  country: string;
  city: string;
  website?: string;
  isDemo: true;
}

export interface StudyProgramme {
  id: string;
  universityId: string;
  name: string;
  degreeLevel: "Bachelor" | "Master" | "PhD";
  field: string;
  duration: string;
  language: string;
  description: string;
  skills: string[];
  sourceUrl?: string;
  verified?: boolean;
  isDemo: true;
}

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const institutionSeeds: Array<[country: string, city: string, name: string]> = [
  ["Netherlands", "Amsterdam", "University of Amsterdam"],
  ["Netherlands", "Delft", "Delft University of Technology"],
  ["Netherlands", "Eindhoven", "Eindhoven University of Technology"],
  ["Netherlands", "Utrecht", "Utrecht University"],
  ["Netherlands", "Rotterdam", "Erasmus University Rotterdam"],
  ["Netherlands", "Leiden", "Leiden University"],
  ["Netherlands", "Groningen", "University of Groningen"],
  ["Netherlands", "Nijmegen", "Radboud University"],
  ["Belgium", "Leuven", "KU Leuven"],
  ["Belgium", "Ghent", "Ghent University"],
  ["Belgium", "Brussels", "Vrije Universiteit Brussel"],
  ["Belgium", "Brussels", "Université libre de Bruxelles"],
  ["Belgium", "Louvain-la-Neuve", "UCLouvain"],
  ["Belgium", "Antwerp", "University of Antwerp"],
  ["Germany", "Munich", "Technical University of Munich"],
  ["Germany", "Munich", "Ludwig Maximilian University of Munich"],
  ["Germany", "Heidelberg", "Heidelberg University"],
  ["Germany", "Aachen", "RWTH Aachen University"],
  ["Germany", "Berlin", "Humboldt University of Berlin"],
  ["Germany", "Berlin", "Technical University of Berlin"],
  ["Germany", "Dresden", "TU Dresden"],
  ["Germany", "Freiburg", "University of Freiburg"],
  ["Switzerland", "Zurich", "ETH Zurich"],
  ["Switzerland", "Zurich", "University of Zurich"],
  ["Switzerland", "Lausanne", "EPFL"],
  ["Switzerland", "Lausanne", "University of Lausanne"],
  ["Switzerland", "Basel", "University of Basel"],
  ["Switzerland", "Bern", "University of Bern"],
  ["France", "Paris", "Sorbonne University"],
  ["France", "Paris", "Université Paris-Saclay"],
  ["France", "Paris", "Université Paris Cité"],
  ["France", "Lyon", "Claude Bernard University Lyon 1"],
  ["France", "Grenoble", "Grenoble Alpes University"],
  ["France", "Strasbourg", "University of Strasbourg"],
  ["France", "Toulouse", "University of Toulouse"],
  ["United Kingdom", "Oxford", "University of Oxford"],
  ["United Kingdom", "Cambridge", "University of Cambridge"],
  ["United Kingdom", "London", "Imperial College London"],
  ["United Kingdom", "London", "University College London"],
  ["United Kingdom", "Edinburgh", "University of Edinburgh"],
  ["United Kingdom", "Manchester", "University of Manchester"],
  ["United Kingdom", "Bristol", "University of Bristol"],
  ["United Kingdom", "London", "King's College London"],
  ["Ireland", "Dublin", "Trinity College Dublin"],
  ["Ireland", "Dublin", "University College Dublin"],
  ["Ireland", "Cork", "University College Cork"],
  ["Ireland", "Galway", "University of Galway"],
  ["Denmark", "Copenhagen", "University of Copenhagen"],
  ["Denmark", "Lyngby", "Technical University of Denmark"],
  ["Denmark", "Aarhus", "Aarhus University"],
  ["Denmark", "Aalborg", "Aalborg University"],
  ["Sweden", "Stockholm", "Karolinska Institute"],
  ["Sweden", "Stockholm", "KTH Royal Institute of Technology"],
  ["Sweden", "Lund", "Lund University"],
  ["Sweden", "Uppsala", "Uppsala University"],
  ["Sweden", "Gothenburg", "Chalmers University of Technology"],
  ["Norway", "Oslo", "University of Oslo"],
  ["Norway", "Trondheim", "Norwegian University of Science and Technology"],
  ["Norway", "Bergen", "University of Bergen"],
  ["Norway", "Tromsø", "UiT The Arctic University of Norway"],
  ["Finland", "Helsinki", "University of Helsinki"],
  ["Finland", "Espoo", "Aalto University"],
  ["Finland", "Turku", "University of Turku"],
  ["Finland", "Tampere", "Tampere University"],
  ["Austria", "Vienna", "University of Vienna"],
  ["Austria", "Vienna", "TU Wien"],
  ["Austria", "Graz", "Graz University of Technology"],
  ["Austria", "Innsbruck", "University of Innsbruck"],
  ["Italy", "Milan", "Politecnico di Milano"],
  ["Italy", "Bologna", "University of Bologna"],
  ["Italy", "Rome", "Sapienza University of Rome"],
  ["Italy", "Padua", "University of Padua"],
  ["Italy", "Turin", "Politecnico di Torino"],
  ["Italy", "Pisa", "University of Pisa"],
  ["Spain", "Barcelona", "University of Barcelona"],
  ["Spain", "Barcelona", "Autonomous University of Barcelona"],
  ["Spain", "Madrid", "Complutense University of Madrid"],
  ["Spain", "Madrid", "Technical University of Madrid"],
  ["Spain", "Valencia", "University of Valencia"],
  ["Spain", "Bilbao", "University of the Basque Country"],
  ["Portugal", "Lisbon", "University of Lisbon"],
  ["Portugal", "Lisbon", "NOVA University Lisbon"],
  ["Portugal", "Porto", "University of Porto"],
  ["Portugal", "Coimbra", "University of Coimbra"],
  ["Poland", "Warsaw", "University of Warsaw"],
  ["Poland", "Warsaw", "Warsaw University of Technology"],
  ["Poland", "Kraków", "Jagiellonian University"],
  ["Poland", "Wrocław", "Wrocław University of Science and Technology"],
  ["Czech Republic", "Prague", "Charles University"],
  ["Czech Republic", "Prague", "Czech Technical University in Prague"],
  ["Czech Republic", "Brno", "Masaryk University"],
  ["Czech Republic", "Brno", "Brno University of Technology"],
  ["Greece", "Athens", "National and Kapodistrian University of Athens"],
  ["Greece", "Athens", "National Technical University of Athens"],
  ["Greece", "Thessaloniki", "Aristotle University of Thessaloniki"],
  ["Greece", "Patras", "University of Patras"],
  ["Hungary", "Budapest", "Eötvös Loránd University"],
  ["Hungary", "Budapest", "Budapest University of Technology and Economics"],
  ["Hungary", "Szeged", "University of Szeged"],
  ["Hungary", "Debrecen", "University of Debrecen"],
  ["Romania", "Bucharest", "University of Bucharest"],
  ["Romania", "Bucharest", "Politehnica University of Bucharest"],
  ["Romania", "Cluj-Napoca", "Babeș-Bolyai University"],
  ["Romania", "Iași", "Alexandru Ioan Cuza University"],
  ["Estonia", "Tartu", "University of Tartu"],
  ["Estonia", "Tallinn", "Tallinn University of Technology"],
  ["Estonia", "Tallinn", "Tallinn University"],
  ["Latvia", "Riga", "University of Latvia"],
  ["Latvia", "Riga", "Riga Technical University"],
  ["Latvia", "Riga", "Riga Stradiņš University"],
  ["Lithuania", "Vilnius", "Vilnius University"],
  ["Lithuania", "Kaunas", "Kaunas University of Technology"],
  ["Lithuania", "Vilnius", "Vilnius Gediminas Technical University"],
  ["Slovenia", "Ljubljana", "University of Ljubljana"],
  ["Slovenia", "Maribor", "University of Maribor"],
  ["Slovenia", "Koper", "University of Primorska"],
  ["Croatia", "Zagreb", "University of Zagreb"],
  ["Croatia", "Split", "University of Split"],
  ["Croatia", "Rijeka", "University of Rijeka"],
  ["Slovakia", "Bratislava", "Comenius University Bratislava"],
  ["Slovakia", "Bratislava", "Slovak University of Technology in Bratislava"],
  ["Slovakia", "Košice", "Technical University of Košice"],
  ["Iceland", "Reykjavík", "University of Iceland"],
  ["Iceland", "Reykjavík", "Reykjavík University"],
  ["Luxembourg", "Esch-sur-Alzette", "University of Luxembourg"],
];

export const europeanUniversities: EuropeanUniversity[] = institutionSeeds.map(
  ([country, city, name]) => ({
    id: slug(name),
    name,
    country,
    city,
    website: name === "University of Amsterdam" ? "https://www.uva.nl/en" : undefined,
    isDemo: true,
  }),
);

interface ProgrammeTemplate {
  name: string;
  field: string;
  degreeLevel: "Bachelor" | "Master" | "PhD";
  duration: string;
  skills: string[];
  sourceUrl?: string;
  verified?: boolean;
}

const programmeTemplates: ProgrammeTemplate[] = [
  { name: "Computer Science", field: "Computer Science", degreeLevel: "Bachelor", duration: "3 years", skills: ["Programming", "Algorithms", "Software engineering", "Databases"] },
  { name: "Artificial Intelligence", field: "Artificial Intelligence", degreeLevel: "Master", duration: "2 years", skills: ["Machine learning", "Python", "Data analysis", "AI ethics"] },
  { name: "Data Science", field: "Data Science", degreeLevel: "Master", duration: "2 years", skills: ["Statistics", "Python", "SQL", "Data visualisation"] },
  { name: "Business Analytics", field: "Business Analytics", degreeLevel: "Bachelor", duration: "3 years", skills: ["Business analysis", "Python", "Statistics", "Optimisation"] },
  { name: "Biomedical Engineering", field: "Biomedical Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Medical devices", "Signal processing", "Biomechanics", "Research"] },
  { name: "Bioengineering", field: "Bioengineering", degreeLevel: "Bachelor", duration: "3 years", skills: ["Biology", "Engineering design", "Laboratory work", "Data analysis"] },
  { name: "Biotechnology", field: "Biotechnology", degreeLevel: "Master", duration: "2 years", skills: ["Cell biology", "Bioprocessing", "Molecular biology", "Laboratory methods"] },
  { name: "Neuroscience", field: "Neuroscience", degreeLevel: "Master", duration: "2 years", skills: ["Neurobiology", "Experimental design", "Statistics", "Scientific writing"] },
  { name: "Life Sciences", field: "Life Sciences", degreeLevel: "Bachelor", duration: "3 years", skills: ["Biology", "Chemistry", "Laboratory work", "Research"] },
  { name: "Molecular Biology", field: "Biology", degreeLevel: "Master", duration: "2 years", skills: ["Molecular biology", "Genetics", "Cell culture", "Microscopy"] },
  { name: "Chemical Engineering", field: "Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Process design", "Thermodynamics", "Modelling", "Safety"] },
  { name: "Mechanical Engineering", field: "Engineering", degreeLevel: "Bachelor", duration: "3 years", skills: ["Mechanics", "CAD", "Manufacturing", "Engineering design"] },
  { name: "Electrical Engineering", field: "Engineering", degreeLevel: "Bachelor", duration: "3 years", skills: ["Electronics", "Control systems", "Programming", "Signal processing"] },
  { name: "Robotics", field: "Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Control systems", "Embedded systems", "Programming", "Computer vision"] },
  { name: "Physics", field: "Physics", degreeLevel: "Bachelor", duration: "3 years", skills: ["Mathematics", "Modelling", "Experimentation", "Data analysis"] },
  { name: "Mathematics", field: "Mathematics", degreeLevel: "Bachelor", duration: "3 years", skills: ["Calculus", "Linear algebra", "Probability", "Logical reasoning"] },
  { name: "Chemistry", field: "Chemistry", degreeLevel: "Bachelor", duration: "3 years", skills: ["Analytical chemistry", "Laboratory safety", "Spectroscopy", "Scientific reporting"] },
  { name: "Psychology", field: "Psychology", degreeLevel: "Bachelor", duration: "3 years", skills: ["Research methods", "Statistics", "Communication", "Behavioural science"] },
  { name: "Economics", field: "Economics", degreeLevel: "Bachelor", duration: "3 years", skills: ["Econometrics", "Statistics", "Policy analysis", "Data interpretation"] },
  { name: "Business Administration", field: "Business", degreeLevel: "Bachelor", duration: "3 years", skills: ["Strategy", "Finance", "Marketing", "Project management"] },
  { name: "Innovation Management", field: "Business", degreeLevel: "Master", duration: "1–2 years", skills: ["Innovation", "Product management", "Entrepreneurship", "Market research"] },
  { name: "Sustainable Engineering", field: "Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Sustainability", "Systems thinking", "Life-cycle analysis", "Design"] },
  { name: "Public Health", field: "Medicine", degreeLevel: "Master", duration: "2 years", skills: ["Epidemiology", "Statistics", "Health policy", "Research"] },
  { name: "Human-Computer Interaction", field: "Design", degreeLevel: "Master", duration: "2 years", skills: ["User research", "UX design", "Prototyping", "Accessibility"] },
  { name: "Law", field: "Law", degreeLevel: "Bachelor", duration: "3 years", skills: ["Legal research", "Critical reasoning", "Writing", "Negotiation"] },
  { name: "Social Sciences", field: "Social Sciences", degreeLevel: "Bachelor", duration: "3 years", skills: ["Research methods", "Policy analysis", "Writing", "Communication"] },
  { name: "Computational Biology", field: "Bioinformatics", degreeLevel: "Master", duration: "2 years", skills: ["Python", "Genomics", "Statistics", "Data analysis"] },
  { name: "Medical Technology", field: "Biomedical Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Medical devices", "Regulation", "Product development", "Clinical evaluation"] },
  { name: "Regenerative Medicine", field: "Life Sciences", degreeLevel: "Master", duration: "2 years", skills: ["Stem cells", "Tissue engineering", "Cell culture", "Translational research"] },
  { name: "Finance", field: "Business", degreeLevel: "Master", duration: "1–2 years", skills: ["Financial modelling", "Accounting", "Risk analysis", "Excel"] },
  { name: "Architecture", field: "Design", degreeLevel: "Master", duration: "2 years", skills: ["Design", "CAD", "Sustainability", "Project development"] },
];

const curatedProgrammes: Record<string, ProgrammeTemplate[]> = {
  "university-of-amsterdam": [
    {
      name: "Bachelor's Business Analytics",
      field: "Business Analytics",
      degreeLevel: "Bachelor",
      duration: "3 years",
      skills: ["Business analysis", "Python", "Statistics", "Optimisation", "Machine learning"],
      sourceUrl: "https://www.uva.nl/en/programmes/bachelors/business-analytics/business-analytics.html",
      verified: true,
    },
  ],
  "ku-leuven": [
    { name: "Bachelor of Engineering Technology — Bioengineering", field: "Bioengineering", degreeLevel: "Bachelor", duration: "3 years", skills: ["Bioengineering", "Laboratory work", "Programming", "Engineering design"] },
    { name: "Biomedical Engineering", field: "Biomedical Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Medical devices", "Biomechanics", "Signal processing", "Research"] },
  ],
  "eth-zurich": [
    { name: "Biomedical Engineering", field: "Biomedical Engineering", degreeLevel: "Master", duration: "2 years", skills: ["Bioimaging", "Biomechanics", "Neural engineering", "Data analysis"] },
    { name: "Neural Systems and Computation", field: "Neuroscience", degreeLevel: "Master", duration: "2 years", skills: ["Neuroscience", "Modelling", "Machine learning", "Experimental methods"] },
  ],
  "university-of-zurich": [
    { name: "Interdisciplinary Brain Sciences", field: "Neuroscience", degreeLevel: "Master", duration: "2 years", skills: ["Neuroscience", "Experimental design", "Statistics", "Scientific communication"] },
  ],
  epfl: [
    { name: "Neuro-X", field: "Neuroscience", degreeLevel: "Master", duration: "2 years", skills: ["Neuroengineering", "Data science", "Imaging", "Experimental methods"] },
  ],
};

function hash(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

export const europeanProgrammes: StudyProgramme[] = europeanUniversities.flatMap((university) => {
  const curated = curatedProgrammes[university.id] ?? [];
  const selected: ProgrammeTemplate[] = [...curated];
  const start = hash(university.id) % programmeTemplates.length;

  for (let index = 0; selected.length < 7; index += 1) {
    const template = programmeTemplates[(start + index * 7) % programmeTemplates.length];
    if (!selected.some((item) => item.name === template.name)) selected.push(template);
  }

  return selected.map((template, index) => ({
    id: `${university.id}-${slug(template.name)}-${index}`,
    universityId: university.id,
    name: template.name,
    degreeLevel: template.degreeLevel,
    field: template.field,
    duration: template.duration,
    language: "English / local language",
    description: `Demo ${template.degreeLevel.toLowerCase()} programme in ${template.field}. Verify details on the university website.`,
    skills: template.skills,
    sourceUrl: template.sourceUrl,
    verified: template.verified ?? false,
    isDemo: true,
  }));
});

export const europeanCountries = Array.from(new Set(europeanUniversities.map((item) => item.country))).sort();
export const programmeFields = Array.from(new Set(europeanProgrammes.map((item) => item.field))).sort();

export const universityByName = (name: string) => europeanUniversities.find((item) => item.name === name);
export const programmesForUniversity = (universityName: string) => {
  const university = universityByName(universityName);
  return university ? europeanProgrammes.filter((item) => item.universityId === university.id) : [];
};
