// src/App.js
import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from './utils/cookieHelper';
import { uiTextConfig, systemPrompts } from './config';

// Import all components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNavBar from './components/BottomNavBar';
import Footer from './components/Footer';
import AffiliatorPage from './components/AffiliatorPage';
import ThreadsMatePage from './components/ThreadsMatePage';
import AboutUsPage from './components/AboutUsPage';
import SettingsPage from './components/SettingsPage';
import ThankYouModal from './components/ThankYouModal';
import ApiKeyAppliedModal from './components/ApiKeyAppliedModal';
import NotificationModal from './components/NotificationModal';
import RegenerateModal from './components/RegenerateModal';

export default function App() {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('id');
    const [currentPage, setCurrentPage] = useState('affiliator');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ title: '', message: '' });
    const [generatedContent, setGeneratedContent] = useState([]);
    const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
    const [notification, setNotification] = useState({ isOpen: false, message: '' });
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [regenModalData, setRegenModalData] = useState({ content: null, index: -1, type: '' });
    
    // State for Affiliator
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [languageStyle, setLanguageStyle] = useState('Storytelling');
    const [hookType, setHookType] = useState('Problem Call Out');
    const [contentType, setContentType] = useState('single');
    const [scriptCount, setScriptCount] = useState(1);
    const [carouselSlideCount, setCarouselSlideCount] = useState(5);
    const [targetAudience, setTargetAudience] = useState('Profesional Muda');
    
    // State for ThreadsMate
    const [mainIdea, setMainIdea] = useState('');
    const [threadsHookType, setThreadsHookType] = useState('Problem Call Out');
    const [threadsDeliveryStyle, setThreadsDeliveryStyle] = useState('Santai');
    const [threadsCount, setThreadsCount] = useState(5);
    const [threadsTargetAudience, setThreadsTargetAudience] = useState('Profesional Muda');
    const [threadsLanguageStyle, setThreadsLanguageStyle] = useState('Informatif');

    // System Prompts State
    const [affiliatorSystemPrompt, setAffiliatorSystemPrompt] = useState(systemPrompts.affiliator.id);
    const [savedAffiliatorSystemPrompt, setSavedAffiliatorSystemPrompt] = useState(systemPrompts.affiliator.id);
    const [threadsSystemPrompt, setThreadsSystemPrompt] = useState(systemPrompts.threadsMate.id);
    const [savedThreadsSystemPrompt, setSavedThreadsSystemPrompt] = useState(systemPrompts.threadsMate.id);

    // Common State
    const [apiMode, setApiMode] = useState('default');
    const [userApiKey, setUserApiKey] = useState('');
    const [savedApiKey, setSavedApiKey] = useState('');
    const [showInitialSetup, setShowInitialSetup] = useState(false);

    const uiText = uiTextConfig[language];

    useEffect(() => { document.documentElement.classList.remove('light', 'dark'); document.documentElement.classList.add(theme); }, [theme]);
    useEffect(() => { const script = document.createElement('script'); script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; script.async = true; document.body.appendChild(script); return () => document.body.removeChild(script); }, []);
    
    useEffect(() => {
        const lang = language;
        setAffiliatorSystemPrompt(systemPrompts.affiliator[lang]);
        setSavedAffiliatorSystemPrompt(systemPrompts.affiliator[lang]);
        setThreadsSystemPrompt(systemPrompts.threadsMate[lang]);
        setSavedThreadsSystemPrompt(systemPrompts.threadsMate[lang]);
    }, [language]);
    
    useEffect(() => {
        const keyFromCookie = getCookie('anotechhub_apikey');
        const hasVisited = getCookie('anotechhub_visited');
        if (keyFromCookie) {
            setApiMode('custom');
            setUserApiKey(keyFromCookie);
            setSavedApiKey(keyFromCookie);
            setShowInitialSetup(false);
        } else if (!hasVisited) {
            setShowInitialSetup(true);
        }
    }, []);

    const getApiResponse = async (prompt, schema) => {
        // PERUBAHAN API KEY - MENGGUNAKAN ENV VARIABLE
        const defaultKeyFromEnv = process.env.REACT_APP_DEFAULT_API_KEY;
        const activeApiKey = apiMode === 'custom' && savedApiKey ? savedApiKey : defaultKeyFromEnv;
        
        if (!activeApiKey || activeApiKey === 'YOUR_DEFAULT_GEMINI_API_KEY') {
            setError({ title: uiText.errorTitle, message: uiText.errorSetApiKey });
            throw new Error(uiText.errorSetApiKey);
        }
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`API Error: ${response.status}. ${errorBody}`);
        }
        const result = await response.json();
        if (!result.candidates?.[0]?.content?.parts?.[0]) {
            console.error("Unexpected API response structure:", result);
            throw new Error("Unexpected response structure from AI.");
        }
        return JSON.parse(result.candidates[0].content.parts[0].text);
    }

    const handleAffiliatorGenerate = async () => {
        if (!productName.trim() || !productDesc.trim()) {
            setError({ title: uiText.errorValidationTitle, message: uiText.errorValidationMessage });
            return;
        }
        setIsLoading(true); setGeneratedContent([]); setError({ title: '', message: '' });
        
        let userPrompt, schema;
        const basePromptInfo = `\nProduct Name: "${productName}"\nDescription: "${productDesc}"\nLanguage Style: ${languageStyle}\nTarget Audience: ${targetAudience}\nHook Type to use: "${hookType}". Respond in ${language === 'id' ? 'Indonesian' : 'English'}.`;
        
        if (contentType === 'single') {
            userPrompt = `Create ${scriptCount} promotional scripts for the following product:${basePromptInfo}`;
            schema = { type: "OBJECT", properties: { scripts: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, problem: { type: "STRING" }, story: { type: "STRING" }, cta: { type: "STRING" } }, required: ["title", "problem", "story", "cta"] } } }, required: ["scripts"] };
        } else {
            userPrompt = `Create content for ${carouselSlideCount} Instagram carousel slides about the following product. Each slide should be a short, engaging point with its own title. The overall structure should follow the requested hook type.${basePromptInfo}`;
            schema = { type: "OBJECT", properties: { slides: { type: "ARRAY", items: { type: "OBJECT", properties: { slide_number: { type: "NUMBER" }, title: { type: "STRING" }, content: { type: "STRING" } }, required: ["slide_number", "title", "content"] } } }, required: ["slides"] };
        }
        
        const finalPrompt = `${savedAffiliatorSystemPrompt}\n\n${userPrompt}`;
        
        try {
            const parsedJson = await getApiResponse(finalPrompt, schema);
            if (contentType === 'single') {
                setGeneratedContent(parsedJson.scripts || []);
                if (!parsedJson.scripts || parsedJson.scripts.length === 0) setError({ title: uiText.errorTitle, message: "The AI returned an empty script list. Try adjusting your inputs." });
            } else {
                setGeneratedContent(parsedJson.slides || []);
                if (!parsedJson.slides || parsedJson.slides.length === 0) setError({ title: uiText.errorTitle, message: "The AI returned an empty slide list. Try adjusting your inputs." });
            }
        } catch (e) { console.error(e); if (!error.message) setError({ title: uiText.errorTitle, message: `An error occurred while communicating with the AI: ${e.message}` });
        } finally { setIsLoading(false); }
    };
    
    const handleThreadsGenerate = async () => {
        if (!mainIdea.trim()) {
            setError({ title: uiText.errorValidationTitle, message: uiText.errorValidationMessage });
            return;
        }
        setIsLoading(true); setGeneratedContent([]); setError({ title: '', message: '' });

        const basePromptInfo = `\nMain Content Idea: "${mainIdea}"\nLanguage Style: ${threadsLanguageStyle}\nTarget Audience: ${threadsTargetAudience}\nHook Type to use: "${threadsHookType}"\nDelivery Style: ${threadsDeliveryStyle}. Create a series of ${threadsCount} threads. Respond in ${language === 'id' ? 'Indonesian' : 'English'}.`;
        const userPrompt = `Create a Threads series based on the following information:${basePromptInfo}`;
        const schema = { type: "OBJECT", properties: { threads: { type: "ARRAY", items: { type: "OBJECT", properties: { thread_number: { type: "NUMBER" }, content: { type: "STRING" } }, required: ["thread_number", "content"] } } }, required: ["threads"] };
        const finalPrompt = `${savedThreadsSystemPrompt}\n\n${userPrompt}`;

        try {
            const parsedJson = await getApiResponse(finalPrompt, schema);
            setGeneratedContent(parsedJson.threads || []);
            if (!parsedJson.threads || parsedJson.threads.length === 0) {
                setError({ title: uiText.errorTitle, message: "The AI returned an empty threads list. Try adjusting your inputs." });
            }
        } catch (e) {
            console.error(e);
            if (!error.message) setError({ title: uiText.errorTitle, message: `An error occurred while communicating with the AI: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const openRegenModal = (content, index, type) => { setRegenModalData({ content, index, type }); setIsRegenModalOpen(true); };

    const handleModalRegenerate = async (instructions, updatedContent = null) => {
        const { content, index, type } = regenModalData;
        if (updatedContent) { 
            setGeneratedContent(prev => prev.map((item, i) => i === index ? { ...item, ...updatedContent } : item)); 
            return;
        }
        
        let originalText, schema, regenPrompt;
        const commonPrompt = `Revise the following text based on the given instructions.\n\nInstructions: "${instructions}"\n\nOriginal Text:\n`;
        const responseFormatPrompt = `\n\nProvide only the result in the exact same JSON format as the original. Respond in ${language === 'id' ? 'Indonesian' : 'English'}.`;

        switch(type) {
            case 'single':
                originalText = `Title: ${content.title}\nProblem: ${content.problem}\nStory: ${content.story}\nCTA: ${content.cta}`;
                schema = { type: "OBJECT", properties: { title: { type: "STRING" }, problem: { type: "STRING" }, story: { type: "STRING" }, cta: { type: "STRING" } }, required: ["title", "problem", "story", "cta"] };
                break;
            case 'carousel':
                originalText = `Title: ${content.title}\nContent: ${content.content}`;
                schema = { type: "OBJECT", properties: { title: { type: "STRING" }, content: { type: "STRING" } }, required: ["title", "content"] };
                break;
            case 'thread':
                originalText = `Content: ${content.content}`;
                schema = { type: "OBJECT", properties: { content: { type: "STRING" } }, required: ["content"] };
                break;
            default: return null;
        }

        regenPrompt = `${commonPrompt}${originalText}${responseFormatPrompt}`;
        
        try {
            const parsedJson = await getApiResponse(regenPrompt, schema);
            return parsedJson;
        } catch(e) { console.error("Failed to regenerate:", e); alert(`Failed to regenerate: ${e.message}`); return null; }
    };
    
    const showNotification = (message) => { setNotification({ isOpen: true, message }); };

    const handleSaveApiSettings = () => {
        if (apiMode === 'custom') {
            setCookie('anotechhub_apikey', userApiKey, 365); setSavedApiKey(userApiKey);
            if(userApiKey) showNotification(uiText.apiKeyAppliedMessage);
        } else {
            setCookie('anotechhub_apikey', '', -1); setSavedApiKey(''); setUserApiKey('');
            showNotification(uiText.settingsSavedMessage);
        }
        setCookie('anotechhub_visited', 'true', 365); setShowInitialSetup(false);
    };
    const handleReset = () => { setProductName(''); setProductDesc(''); setMainIdea(''); setGeneratedContent([]); setError({ title: '', message: '' }); };

    const renderPage = () => {
        const commonProps = { isLoading, generatedContent, error, setError, onReset: handleReset, openThankYouModal: () => setIsThankYouModalOpen(true), openRegenModal, uiText, showInitialSetup, setCurrentPage, language };
        const affiliatorProps = { ...commonProps, productName, setProductName, productDesc, setProductDesc, languageStyle, setLanguageStyle, hookType, setHookType, scriptCount, setScriptCount, carouselSlideCount, setCarouselSlideCount, targetAudience, setTargetAudience, contentType, setContentType, onGenerate: handleAffiliatorGenerate };
        const threadsMateProps = { ...commonProps, mainIdea, setMainIdea, hookType: threadsHookType, setHookType: setThreadsHookType, deliveryStyle: threadsDeliveryStyle, setDeliveryStyle: setThreadsDeliveryStyle, threadCount: threadsCount, setThreadCount: setThreadsCount, targetAudience: threadsTargetAudience, setTargetAudience: setThreadsTargetAudience, languageStyle: threadsLanguageStyle, setLanguageStyle: setThreadsLanguageStyle, onGenerate: handleThreadsGenerate };
        const settingsProps = {
            apiMode, setApiMode, userApiKey, setUserApiKey, onSaveApiSettings: handleSaveApiSettings, uiText, setCurrentPage,
            affiliatorSystemPrompt, setAffiliatorSystemPrompt, savedAffiliatorSystemPrompt,
            onSaveAffiliatorSystemPrompt: () => { setSavedAffiliatorSystemPrompt(affiliatorSystemPrompt); showNotification(uiText.settingsSavedMessage); },
            threadsSystemPrompt, setThreadsSystemPrompt, savedThreadsSystemPrompt,
            onSaveThreadsSystemPrompt: () => { setSavedThreadsSystemPrompt(threadsSystemPrompt); showNotification(uiText.settingsSavedMessage); }
        };
        const aboutProps = { uiText };
        
        switch (currentPage) {
            case 'affiliator': return <AffiliatorPage {...affiliatorProps} />;
            case 'threadsMate': return <ThreadsMatePage {...threadsMateProps} />;
            case 'about': return <AboutUsPage {...aboutProps} />;
            case 'settings': return <SettingsPage {...settingsProps} />;
            default: return <AffiliatorPage {...affiliatorProps} />;
        }
    };

    return (
        <div className={`min-h-screen font-sans flex flex-col ${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-slate-900 text-gray-200'} transition-colors duration-300`}>
            <style>{`.bg-custom-teal { background-color: #01a1a8; } .hover\\:bg-custom-teal-dark:hover { background-color: #018a90; } .text-custom-teal { color: #01a1a8; } .dark .dark\\:text-custom-teal-light { color: #5dd4d9; } .ring-custom-teal:focus { --tw-ring-color: #01a1a8; } .border-custom-teal:focus { border-color: #01a1a8; } .bg-custom-teal-active { background-color: #01a1a8 !important; }`}</style>
            <Header theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} uiText={uiText} onLogoClick={() => setCurrentPage('affiliator')} onUserClick={() => setIsMobileSidebarOpen(true)} />
            <div className="flex flex-1">
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">{renderPage()}</main>
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} uiText={uiText} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
            </div>
            <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} uiText={uiText} />
            <Footer />
            <ThankYouModal isOpen={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} uiText={uiText} />
            <ApiKeyAppliedModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} uiText={uiText} />
            <NotificationModal isOpen={notification.isOpen} onClose={() => setNotification({ isOpen: false, message: '' })} message={notification.message} />
            <RegenerateModal isOpen={isRegenModalOpen} onClose={() => setIsRegenModalOpen(false)} content={regenModalData.content} onRegenerate={handleModalRegenerate} contentType={regenModalData.type} uiText={uiText} />
        </div>
    );
}