import { useState } from "react";
import Header from "./components/layout/Header";
import type { ResumeType } from "./components/layout/ResumeTypeSelector";
import { ResumePage } from "./components/resume/ResumePage";
import GenericTemplate from "./components/resume/templates/GenericTemplate";
import type { BaseResumeData } from "./components/resume/types/base";
import { getInitialResumeData } from "./hooks/useResumeForm";
import type { ResumeSubmitPayload } from "./hooks/useResumeForm";


function App() {
  const [currentType, setCurrentType] = useState<ResumeType>('general');

  const handleSave = async ({ formData, data, imageFile }: ResumeSubmitPayload<BaseResumeData>) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.warn('VITE_API_BASE_URL no definido. No se puede enviar al backend.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/resumes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al guardar: ${response.status}`);
      }

      console.log('✅ Resume guardado:', data, 'imagen:', imageFile?.name);
    } catch (error) {
      console.error('❌ Error al guardar el resume:', error);
    }
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
