import { useState } from "react";
import Header from "./components/layout/Header";
import type { ResumeType } from "./components/layout/ResumeTypeSelector";
import { ResumePage } from "./components/resume/ResumePage";
import GenericTemplate from "./components/resume/templates/GenericTemplate";
import type { BaseResumeData } from "./components/resume/types/base";
import { getInitialResumeData } from "./hooks/useResumeForm";


function App() {
  const [currentType, setCurrentType] = useState<ResumeType>('general');

  const handleSave = async (data: BaseResumeData) => {
    console.log('📤 Enviando al servidor:', data);
    alert('¡Guardado! Revisa la consola para ver los datos que se enviarían al servidor.');
  };

  const initialData = currentType === 'general'
    ? getInitialResumeData('general')
    : getInitialResumeData('developer');

  return (
    <>
      <Header currentType={currentType} onSelectType={setCurrentType} />
      <main className="flex-1 py-8 px-4">
        <ResumePage>
          <GenericTemplate
            initialData={initialData}
            onSave={handleSave}
            storageKey={`resume-${currentType}`}
          />
        </ResumePage>
      </main>
    </>
  )
}

export default App
