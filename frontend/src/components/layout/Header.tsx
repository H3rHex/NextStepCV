import type React from "react";
import { Heading } from "../common/text/Heading";
import { Text } from "../common/text/Text";
import LanguageSelector from "./LanguageSelector";
import type { ResumeType } from "./ResumeTypeSelector";
import { ResumeTypeSelector } from "./ResumeTypeSelector";

interface HeaderProps {
    currentType: ResumeType;
    onSelectType: (type: ResumeType) => void;
}

function Header({ currentType, onSelectType }: HeaderProps): React.JSX.Element {
    return (
        <header className="flex flex-row items-start px-6 sm:px-10 py-5 bg-gray-400 rounded-b-lg shadow-md w-full">
            <div className="flex-1 flex justify-start">
                <div>
                    <Heading as="h3">NextStepCV</Heading>
                    <Text>
                        <a
                            className="hover:text-amber-50 transition-colors cursor-pointer"
                            href="https://github.com/H3rHex"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            by H3rHex
                        </a>
                    </Text>
                </div>
            </div>

            <div className="shrink-0 flex justify-center">
                <ResumeTypeSelector currentType={currentType} onSelectType={onSelectType} />
            </div>

            <div className="flex-1 flex justify-end">
                <LanguageSelector />
            </div>
        </header>
    );
}

export default Header;