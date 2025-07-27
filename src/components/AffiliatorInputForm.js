// src/components/AffiliatorInputForm.js
import React from 'react';
import { Bot, RotateCcw, FileDown, ChevronDown } from 'lucide-react';
import { hookTitleMappings } from '../config';

const SelectWrapper = ({children}) => ( <div className="relative">{React.cloneElement(children, { className: `${children.props.className} appearance-none` })}<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /></div>);

const AffiliatorInputForm = ({ onGenerate, onReset, isLoading, openThankYouModal, ...props }) => {
    const { productName, setProductName, productDesc, setProductDesc, languageStyle, setLanguageStyle, hookType, setHookType, scriptCount, setScriptCount, carouselSlideCount, setCarouselSlideCount, targetAudience, setTargetAudience, generatedContent, contentType, setContentType, uiText, language } = props;
    const inputStyle = "w-full p-3 bg-white/60 dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 ring-custom-teal focus:border-custom-teal outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500";
    const labelStyle = "block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300";
    const languageStyleOptions = { en: ["Storytelling", "Persuasive", "Informative", "Education"], id: ["Storytelling", "Persuasif", "Informatif", "Edukasi"] };
    const hookOptions = Object.keys(hookTitleMappings); // Cukup ambil keys-nya
    const audienceOptions = { en: ["Students", "Young Professionals", "Parents", "Gamers", "Tech Enthusiasts", "Fashion & Beauty", "Fitness & Health", "General"], id: ["Pelajar & Mahasiswa", "Profesional Muda", "Orang Tua", "Gamers", "Penggemar Teknologi", "Fashion & Kecantikan", "Kebugaran & Kesehatan", "Umum"] };

    const handlePdfDownload = () => {
        // ... (logika PDF download tidak berubah)
        if (!window.jspdf) { alert("PDF library is not loaded yet."); return; }
        const { jsPDF } = window.jspdf; const pdf = new jsPDF('p', 'pt', 'a4');
        // ... (sisa logika)
        pdf.save('anotechhub_scripts.pdf'); openThankYouModal();
    };
    
    return (
        <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-sm">
                <div className="space-y-4">
                    {/* ... (input fields lain tidak berubah) ... */}
                    <div><label className={labelStyle}>{uiText.contentType}</label><div className="flex gap-2 rounded-lg bg-gray-200/80 dark:bg-slate-800/80 p-1"><button onClick={() => setContentType('single')} className={`w-full p-2 rounded-md text-sm font-semibold transition-all ${contentType === 'single' ? 'bg-custom-teal text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>{uiText.singlePost}</button><button onClick={() => setContentType('carousel')} className={`w-full p-2 rounded-md text-sm font-semibold transition-all ${contentType === 'carousel' ? 'bg-custom-teal text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>{uiText.carousel}</button></div></div>
                    <div><label htmlFor="product-name" className={labelStyle}>{uiText.productName}</label><input type="text" id="product-name" className={inputStyle} placeholder={uiText.productNamePlaceholder} value={productName} onChange={(e) => setProductName(e.target.value)} /></div>
                    <div><label htmlFor="product-desc" className={labelStyle}>{uiText.productDesc}</label><textarea id="product-desc" rows="4" className={inputStyle} placeholder={uiText.productDescPlaceholder} value={productDesc} onChange={(e) => setProductDesc(e.target.value)}></textarea></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label htmlFor="style" className={labelStyle}>{uiText.languageStyle}</label><SelectWrapper><select id="style" className={inputStyle} value={languageStyle} onChange={(e) => setLanguageStyle(e.target.value)}>{languageStyleOptions[language].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></SelectWrapper></div>
                        <div><label htmlFor="audience" className={labelStyle}>{uiText.targetAudience}</label><SelectWrapper><select id="audience" className={inputStyle} value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>{audienceOptions[language].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></SelectWrapper></div>
                    </div>

                    {/* ===== KODE PERBAIKAN DI BAWAH INI ===== */}
                    <div>
                        <label htmlFor="hook-type" className={labelStyle}>{uiText.hookType}</label>
                        <SelectWrapper>
                            <select id="hook-type" className={inputStyle} value={hookType} onChange={(e) => setHookType(e.target.value)}>
                                {hookOptions.map(opt => (
                                    <option key={opt} value={opt}>
                                        {hookTitleMappings[opt][language]} 
                                    </option>
                                ))}
                            </select>
                        </SelectWrapper>
                    </div>
                    {/* ===== AKHIR DARI KODE PERBAIKAN ===== */}
                    
                    {contentType === 'single' ? (<div><label htmlFor="count" className={labelStyle}>{uiText.numberOfScripts}</label><SelectWrapper><select id="count" className={inputStyle} value={scriptCount} onChange={(e) => setScriptCount(parseInt(e.target.value))}><option>1</option><option>2</option><option>3</option></select></SelectWrapper></div>) : (<div><label htmlFor="slide-count" className={labelStyle}>{uiText.numberOfSlides}</label><SelectWrapper><select id="slide-count" className={inputStyle} value={carouselSlideCount} onChange={(e) => setCarouselSlideCount(parseInt(e.target.value))}><option>2</option><option>3</option><option>4</option><option>5</option></select></SelectWrapper></div>)}
                </div>
            </div>
            {/* ... (tombol generate tidak berubah) ... */}
            <div className="flex gap-2">
                <button onClick={onGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-custom-teal hover:bg-custom-teal-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:bg-teal-400 disabled:cursor-not-allowed disabled:transform-none">{isLoading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>{uiText.generatingButton}</span></>) : (<><Bot className="w-5 h-5" /><span>{uiText.generateButton}</span></>)}</button>
                {generatedContent.length > 0 && !isLoading && (<button onClick={onReset} className="p-3 flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-md transition-colors"><RotateCcw className="w-5 h-5"/></button>)}
            </div>
            {generatedContent.length > 0 && (<div className="flex flex-col sm:flex-row items-center gap-3"><button onClick={handlePdfDownload} className="w-full flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200/80 text-rose-600 font-semibold py-2.5 px-4 rounded-lg transition-colors"><FileDown className="w-4 h-4" />{uiText.saveAsPdf}</button></div>)}
        </div>
    );
};

export default AffiliatorInputForm;