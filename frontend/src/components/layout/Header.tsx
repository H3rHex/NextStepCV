import type React from "react";
import { Heading } from "../common/text/Heading";
import { Text } from "../common/text/Text";
import LanguageSelector from "./LanguageSelector";

function Header():React.JSX.Element {
    return (
        <header className="flex flex-row justify-between items-center px-10 py-5 gap-10 bg-gray-400 rounded-b-lg shadow-md">
            <div>
                <Heading as="h3">NextStepCV</Heading>
                <Text><a className="hover:text-amber-50" href="https://github.com/H3rHex" target="_blank" rel="noopener noreferrer">by H3rHex</a></Text>
            </div>
            <LanguageSelector/>
        </header>
    );
}

export default Header;
