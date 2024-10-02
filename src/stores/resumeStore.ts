import { makeAutoObservable } from 'mobx';

export interface IWorkExperience {
  startDate: string;
  endDate: string;
  company: string;
  position: string;
  responsibilities: string;
}

interface Education {
  level: string;
  institution: string;
  faculty: string;
  specialization: string;
  graduationYear: string;
}

class ResumeStore {
  // Basic Info
  photo: string = '';
  lastName: string = '';
  firstName: string = '';
  middleName: string = '';
  city: string = '';
  birthDate: string = '';
  gender: string = '';
  citizenship: string = '';
  desiredPosition: string = '';
  salary: string = '';
  currency: string = '';
  aboutMe: string = '';

  // Work Experience
  hasWorkExperience: boolean = false;
  workExperiences: IWorkExperience[] = [];

  // Education
  educationLevel: string = '';
  nativeLanguage: string = '';
  foreignLanguages: { language: string; level: string }[] = [];
  educations: Education[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setHasWorkExperience(value: boolean) {
    this.hasWorkExperience = value;
  }

  updateBasicInfo(field: string, value: string | Date) {
    if (field === 'birthDate' && value instanceof Date) {
      this.birthDate = value.toISOString().split('T')[0];
    } else {
      (this as any)[field] = value;
    }
  }

  updateWorkExperience(index: number, field: keyof IWorkExperience, value: string) {
    if (index >= 0 && index < this.workExperiences.length) {
      this.workExperiences[index] = {
        ...this.workExperiences[index],
        [field]: value
      };
    }
  }

  addWorkExperience(experience: IWorkExperience) {
    this.workExperiences.push(experience);
  }

  updateEducation(field: string, value: string) {
    (this as any)[field] = value;
  }

  addForeignLanguage(language: { language: string; level: string }) {
    this.foreignLanguages.push(language);
  }

  removeForeignLanguage(index: number) {
    this.foreignLanguages.splice(index, 1);
  }

  addEducation(education: Education) {
    this.educations.push(education);
  }

  updateEducationField(index: number, field: keyof Education, value: string) {
    if (index >= 0 && index < this.educations.length) {
      this.educations[index] = {
        ...this.educations[index],
        [field]: value
      };
    }
  }

  setEducationLevel(level: string) {
    this.educationLevel = level;
  }
}

export const resumeStore = new ResumeStore();
