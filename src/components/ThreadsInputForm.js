// src/components/ThreadsInputForm.js
import React from 'react';
import { Bot, RotateCcw, ChevronDown } from 'lucide-react';
import { hookTitleMappings } from '../config';

const SelectWrapper = ({children}) => ( <div className="relative">{React.cloneElement(children, { className: `${children.props.className} appearance-none` })}<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>);

const ThreadsInputForm = ({ onGenerate, onReset, isLoading, ...props }) => {
    const { mainIdea, setMainIdea, hookType, setHookType, deliveryStyle, setDeliveryStyle, threadCount, setThreadCount, targetAudience, setTargetAudience, languageStyle, setLanguageStyle, generatedContent, uiText, language, contentTheme, setContentTheme } = props;
    const inputStyle = "w-full p-3 bg-white/60 dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 ring-custom-teal focus:border-custom-teal outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500";
    const labelStyle = "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";
    const hookOptions = Object.keys(hookTitleMappings);
    const deliveryStyleOptions = { en: ["Casual", "Formal", "Funny", "Professional"], id: ["Santai", "Formal", "Lucu", "Profesional"] };
    const audienceOptions = { en: ["Students", "Young Professionals", "Parents", "Gamers", "Tech Enthusiasts", "Fashion & Beauty", "Fitness & Health", "General"], id: ["Pelajar & Mahasiswa", "Profesional Muda", "Orang Tua", "Gamers", "Penggemar Teknologi", "Fashion & Kecantikan", "Kebugaran & Kesehatan", "Umum"] };
    const languageStyleOptions = { en: ["Storytelling", "Persuasive", "Informative", "Education"], id: ["Storytelling", "Persuasif", "Informatif", "Edukasi"] };
    const themeOptions = {
        en: ["Technology & AI", "Lifestyle", "Cooking & Recipes", "Health & Fitness", "Finance & Investment", "Travel", "Education", "Marketing", "Personal Development", "Gaming"],
        id: ["Teknologi & AI", "Gaya Hidup", "Memasak & Resep", "Kesehatan & Kebugaran", "Keuangan & Investasi", "Perjalanan", "Pendidikan", "Pemasaran", "Pengembangan Diri", "Gaming"]
    };

    return (
        <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="threads-theme" className={labelStyle}>{uiText.contentTheme}</label>
                        <SelectWrapper>
                            <select id="threads-theme" className={inputStyle} value={contentTheme} onChange={(e) => setContentTheme(e.target.value)}>
                                {themeOptions[language].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </SelectWrapper>
                    </div>
                    <div><label htmlFor="main-idea" className={labelStyle}>{uiText.mainContentIdea}</label><textarea id="main-idea" rows="4" className={inputStyle} placeholder={uiText.mainContentIdeaPlaceholder} value={mainIdea} onChange={(e) => setMainIdea(e.target.value)}></textarea></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="threads-hook-type" className={labelStyle}>{uiText.hookType}</label>
                            <SelectWrapper>
                                <select id="threads-hook-type" className={inputStyle} value={hookType} onChange={(e) => setHookType(e.target.value)}>
                                    {hookOptions.map(opt => (
                                        <option key={opt} value={opt}>
                                            {hookTitleMappings[opt][language]}
                                        </option>
                                    ))}
                                </select>
                            </SelectWrapper>
                        </div>
                        <div><label htmlFor="threads-delivery-style" className={labelStyle}>{uiText.deliveryStyle}</label><SelectWrapper><select id="threads-delivery-style" className={inputStyle} value={deliveryStyle} onChange={(e) => setDeliveryStyle(e.target.value)}>{deliveryStyleOptions[language].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></SelectWrapper></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label htmlFor="threads-audience" className={labelStyle}>{uiText.targetAudience}</label><SelectWrapper><select id="threads-audience" className={inputStyle} value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>{audienceOptions[language].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></SelectWrapper></div>
                        <div><label htmlFor="threads-lang-style" className={labelStyle}>{uiText.languageStyle}</label><SelectWrapper><select id="threads-lang-style" className={inputStyle} value={languageStyle} onChange={(e) => setLanguageStyle(e.target.value)}>{languageStyleOptions[language].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></SelectWrapper></div>
                    </div>
                    <div><label htmlFor="threads-count" className={labelStyle}>{uiText.numberOfThreads}</label><SelectWrapper><select id="threads-count" className={inputStyle} value={threadCount} onChange={(e) => setThreadCount(parseInt(e.target.value))}>{[...Array(9)].map((_, i) => <option key={i + 2} value={i + 2}>{i + 2}</option>)}</select></SelectWrapper></div>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-custom-teal hover:bg-custom-teal-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:bg-teal-400 disabled:cursor-not-allowed disabled:transform-none">{isLoading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>{uiText.generatingButton}</span></>) : (<><Bot className="w-5 h-5" /><span>{uiText.generateButton}</span></>)}</button>
                {generatedContent.length > 0 && !isLoading && (<button onClick={onReset} className="p-3 flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-md transition-colors"><RotateCcw className="w-5 h-5"/></button>)}
            </div>
        </div>
    );
};