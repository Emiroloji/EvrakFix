export interface CVPersonal {
  fullName: string;
  title: string; // e.g. Yazılım Geliştirici
  email: string;
  phone: string;
  website: string;
  address: string;
  summary: string; // Brief bio summary
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVEducation {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVSkill {
  id: string;
  name: string;
  level: string; // e.g. Başlangıç, Orta, İleri, Uzman
}

export interface CVLanguage {
  id: string;
  name: string;
  level: string; // e.g. A1, A2, B1, B2, C1, C2
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface CVData {
  personal: CVPersonal;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  languages: CVLanguage[];
  projects: CVProject[];
}

export const initialCVData: CVData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: []
};
