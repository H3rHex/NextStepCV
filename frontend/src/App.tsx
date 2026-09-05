import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Header from "./components/layout/Header";
import type { ResumeType } from "./components/layout/ResumeTypeSelector";
import { ResumePage } from "./components/resume/ResumePage";
import GenericTemplate from "./components/resume/templates/GenericTemplate";
import type { BaseResumeData } from "./components/resume/types/base";
import type { ResumeSubmitPayload } from "./hooks/useResumeForm";
import { getInitialResumeData } from "./hooks/useResumeForm";

function App() {
  const { t } = useTranslation();
  const [currentType, setCurrentType] = useState<ResumeType>('general');

  const handleSave = async ({ formData, data, imageFile }: ResumeSubmitPayload<BaseResumeData>) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.warn(t('resume.errors.apiUrlNotSet', 'VITE_API_BASE_URL no definido. No se puede enviar al backend.'));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/resumes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          t('resume.errors.saveFailed', {
            status: response.status,
            defaultValue: `Error al guardar: {{status}}`
          })
        );
      }

      console.log(
        t('resume.success.saved', {
          imageName: imageFile?.name || t('common.none', 'ninguna'),
          defaultValue: 'Resume guardado. Imagen: {{imageName}}'
        }),
        data
      );
    } catch (error) {
      console.error(t('resume.errors.saveCatch', 'Error al guardar el resume:'), error);
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
