export interface Experience {
  company: string;
  role: string;
  period: string;
  projects: ExperienceProject[];
}

export type ExperienceStageKey =
  | 'problem'
  | 'decision'
  | 'implementation'
  | 'verification'
  | 'result'
  | 'extension';

export interface ExperienceStage {
  key: ExperienceStageKey;
  label: string;
  detail: string[];
}

export interface ExperienceProject {
  title: string;
  description: string;
  stages: ExperienceStage[];
  links?: ProjectLink[];
}

export interface PersonalProject {
  title: string;
  role: string;
  period: string;
  description: string;
  stages: ExperienceStage[];
  links?: ProjectLink[];
}

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface PersonalInfo {
  name: string;
  birthDate: string;
  position: string;
  email: string;
  phone?: string;
  github: string;
  blog?: string;
  skills: string[];
  introduction?: string;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  period: string;
  status: string;
}

export interface Activity {
  organization: string;
  title: string;
  period: string;
  description: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}
