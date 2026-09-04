import { useState } from "react";
import Header from "./components/layout/Header";
import type { ResumeType } from "./components/layout/ResumeTypeSelector";
import { ResumePage } from "./components/resume/ResumePage";

function App() {
  const [currentType, setCurrentType] = useState<ResumeType>('developer');
  
  return (
    <>
      <Header currentType={currentType} onSelectType={setCurrentType} />
      <main className="flex-1 py-8 px-4">
        <ResumePage>
        </ResumePage>
      </main>
    </>
  )
}

export default App
