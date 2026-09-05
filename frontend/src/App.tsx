import { useState } from "react";
import Header from "./components/layout/Header";
import type { ResumeType } from "./components/layout/ResumeTypeSelector";
import { ResumePage } from "./components/resume/ResumePage";
import GenericTemplate from "./components/resume/templates/GenericTemplate";
import type { BaseResumeData } from "./components/resume/types/base";


const mockData: BaseResumeData = {
  personalInfo: {
    firstName: "Alex",
    lastName: "García",
    title: "Senior Full Stack Developer",
    email: "alex.garcia@example.com",
    phone: "+34 600 123 456",
    location: "Madrid, España",
    summary: "Desarrollador apasionado por la creación de interfaces limpias, escalables y orientadas a la experiencia de usuario óptima.",
  },
  experience: [
    {
      id: "1",
      company: "TechCorp",
      role: "Senior Developer",
      startDate: "2022-01",
      endDate: "present",
      highlights: ["Lideré migración a React", "Mentoring junior devs"]
    },
    {
      id: "2",
      company: "StartupXYZ",
      role: "Frontend Developer",
      startDate: "2020-06",
      endDate: "2022-01",
      highlights: ["Implementé diseño system", "Optimicé bundle 40%"]
    },
  ],
  education: [
    {
      id: "1",
      institution: "Universidad Politécnica",
      degree: "Ingeniería Informática",
      fieldOfStudy: "Software",
      startDate: "2016-09",
      endDate: "2020-06"
    },
  ],
  languages: [
    { language: "Español", proficiency: "native" },
    { language: "Inglés", proficiency: "c1" },
  ],
};

function App() {
  const [currentType, setCurrentType] = useState<ResumeType>('developer');
  
  return (
    <>
      <Header currentType={currentType} onSelectType={setCurrentType} />
      <main className="flex-1 py-8 px-4">
        <ResumePage>
          <GenericTemplate data={mockData} />
        </ResumePage>
      </main>
    </>
  )
}

export default App
