import { useTranslation } from "react-i18next";

const languages = [
    { code: "es", label: "ES", name: "Español"},
    { code: "en", label: "EN", name: "English"},
];

function LanguageSelector() {
    const { i18n } = useTranslation();

    const currentLanguageCode = i18n.language ? i18n.language.slice(0, 2) : "es";

    const handleChange = (code:string) => {
        i18n.changeLanguage(code);
        localStorage.setItem("language", code);
    };

    return (
        <div className="flex items-center gap-2" role="group" aria-label="Language Selector">
            {languages.map(({ code, label, name }) => {
                const isSelected = currentLanguageCode === code;

                return (
                    <button
                        key={code}
                        onClick={() => handleChange(code)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold cursor-pointer rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected
                                ? "bg-gray-200 hover:bg-blue-300"
                                : "bg-gray-400  hover:bg-gray-200"
                            }`}
                        aria-pressed={isSelected}
                        aria-label={name}
                        title={name}
                    >
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default LanguageSelector;