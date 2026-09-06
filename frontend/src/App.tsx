import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Header from "./components/layout/Header";
import type { ResumeType } from "./components/layout/ResumeTypeSelector";
import { ResumePage } from "./components/resume/ResumePage";
import DeveloperTemplate from "./components/resume/templates/DeveloperTemplate";
import GenericTemplate from "./components/resume/templates/GenericTemplate";
import type { AnyResumeData, DeveloperResumeData } from "./components/resume/types";
import type { ResumeSubmitPayload } from "./hooks/useResumeForm";
import { getInitialResumeData, useResumeForm } from "./hooks/useResumeForm";

function App() {
  const { t, i18n } = useTranslation();
  const [currentType, setCurrentType] = useState<ResumeType>('general');

  const handleSave = async ({ formData, data, imageFile }: ResumeSubmitPayload<AnyResumeData>) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.warn(t('resume.errors.apiUrlNotSet', 'VITE_API_BASE_URL no definido. No se puede enviar al backend.'));
      return;
    }

    formData.set('lang', i18n.resolvedLanguage || 'es');
    formData.set('resume_type', currentType);

    try {
      const response = await fetch(`${baseUrl}/api/v1/create_resume`, {
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

      const result = await response.json();
      const downloadUrl = result?.download_url;

      if (downloadUrl) {
        window.open(new URL(downloadUrl, baseUrl).href, '_blank', 'noopener,noreferrer');
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

  const initialData = getInitialResumeData(currentType);

  const form = useResumeForm<AnyResumeData>({
    initialData,
    onSubmit: handleSave,
    storageKey: `resume-${currentType}`,
  });

  return (
    <>
      <Header currentType={currentType} onSelectType={setCurrentType} />
      <main className="flex-1 py-8 px-4">
        <ResumePage onSave={form.handleSubmit} onReset={form.reset} canSave={form.isDirty}>
          {currentType === 'developer' ? (
            <DeveloperTemplate
              data={form.data as DeveloperResumeData}
              updateField={form.updateField}
              updateNestedField={form.updateNestedField}
              addItem={form.addItem}
              removeItem={form.removeItem}
              setImageFile={form.setImageFile}
              imagePreviewUrl={form.imagePreviewUrl}
            />
          ) : (
            <GenericTemplate
              data={form.data}
              updateField={form.updateField}
              updateNestedField={form.updateNestedField}
              addItem={form.addItem}
              removeItem={form.removeItem}
              setImageFile={form.setImageFile}
              imagePreviewUrl={form.imagePreviewUrl}
            />
          )}
        </ResumePage>
      </main>
    </>
  )
}

export default App