// src/App.js
import React, { useState, useEffect } from 'react';
import { FileText, Settings, Sun, Moon, User, Bot, Home } from 'lucide-react';
import { getCookie, setCookie } from './utils/cookieHelper';
import { uiTextConfig, systemPrompts } from './config';

// Import Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNavBar from './components/BottomNavBar';
import GeneratorPage from './components/GeneratorPage';
import SettingsPage from './components/SettingsPage';
import ThankYouModal from './components/ThankYouModal';
import NotificationModal from './components/NotificationModal';
import RegenerateModal from './components/RegenerateModal';

// Hapus ApiKeyAppliedModal karena tidak terdefinisi di PDF, jika ada silakan buat file terpisah.
// import ApiKeyAppliedModal from './components/ApiKeyAppliedModal'; 

export default function App() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('id');
  const [currentPage, setCurrentPage] = useState('generator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ title: '', message: '' });
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  // const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false); // Tidak terpakai
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, message: '' });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [regenModalData, setRegenModalData] = useState({ content: null, index: -1, type: '' });
  
  // Form State
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [languageStyle, setLanguageStyle] = useState('Storytelling');
  const [hookType, setHookType] = useState('Problem Call Out');
  const [contentType, setContentType] = useState('single');
  const [scriptCount, setScriptCount] = useState(1);
  const [carouselSlideCount, setCarouselSlideCount] = useState(5);
  const [targetAudience, setTargetAudience] = useState('Profesional Muda');
  
  // Settings State
  const [systemPrompt, setSystemPrompt] = useState(systemPrompts.id);
  const [savedSystemPrompt, setSavedSystemPrompt] = useState(systemPrompts.id);
  const [apiMode, setApiMode] = useState('default');
  const [userApiKey, setUserApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [showInitialSetup, setShowInitialSetup] = useState(false);

  const uiText = uiTextConfig[language];

  // Effects
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setSystemPrompt(systemPrompts[language]);
    setSavedSystemPrompt(systemPrompts[language]);
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
    // ✅ MODIFIKASI KUNCI API DI SINI
    const defaultKey = process.env.REACT_APP_DEFAULT_API_KEY;
    const activeApiKey = apiMode === 'custom' && savedApiKey ? savedApiKey : defaultKey;
    // 

    if (!activeApiKey) {
        throw new Error("API Key is not configured. Please set it in Netlify environment variables or in the app settings.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { 
            responseMimeType: "application/json",
            responseSchema: schema 
        }
    };
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

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
  };

  const handleGenerate = async () => {
    if (!productName.trim() || !productDesc.trim()) {
      setError({ title: uiText.errorValidationTitle, message: uiText.errorValidationMessage });
      return;
    }
    setIsLoading(true);
    setGeneratedContent([]);
    setError({ title: '', message: '' });

    const basePromptInfo = `\nProduct Name: "${productName}"\nDescription: "${productDesc}"\nLanguage Style: ${languageStyle}\nTarget Audience: ${targetAudience}\nHook Type to use: "${hookType}". Respond in ${language === 'id' ? 'Indonesian' : 'English'}.`;
    
    let userPrompt, schema;
    if (contentType === 'single') {
        userPrompt = `Create ${scriptCount} promotional scripts for the following product:${basePromptInfo}`;
        schema = { type: "OBJECT", properties: { scripts: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, problem: { type: "STRING" }, story: { type: "STRING" }, cta: { type: "STRING" } }, required: ["title", "problem", "story", "cta"] } } }, required: ["scripts"] };
    } else {
        userPrompt = `Create content for ${carouselSlideCount} Instagram carousel slides about the following product. Each slide should be a short, engaging point with its own title. The overall structure should follow the requested hook type.${basePromptInfo}`;
        schema = { type: "OBJECT", properties: { slides: { type: "ARRAY", items: { type: "OBJECT", properties: { slide_number: { type: "NUMBER" }, title: { type: "STRING" }, content: { type: "STRING" } }, required: ["slide_number", "title", "content"] } } }, required: ["slides"] };
    }

    const finalPrompt = `${savedSystemPrompt}\n\n${userPrompt}`;

    try {
        const parsedJson = await getApiResponse(finalPrompt, schema);
        if (contentType === 'single') {
            setGeneratedContent(parsedJson.scripts || []);
            if (!parsedJson.scripts || parsedJson.scripts.length === 0) {
                setError({ title: uiText.errorTitle, message: "The AI returned an empty script list. Try adjusting your inputs." });
            }
        } else {
            setGeneratedContent(parsedJson.slides || []);
            if (!parsedJson.slides || parsedJson.slides.length === 0) {
                setError({ title: uiText.errorTitle, message: "The AI returned an empty slide list. Try adjusting your inputs." });
            }
        }
    } catch (e) {
        console.error(e);
        setError({ title: uiText.errorTitle, message: `An error occurred while communicating with the AI: ${e.message}` });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setProductName('');
    setProductDesc('');
    setGeneratedContent([]);
    setError({ title: '', message: '' });
  };
  
  const showNotification = (message) => {
    setNotification({ isOpen: true, message });
  };
  
  const handleSaveApiSettings = () => {
    if (apiMode === 'custom') {
        setCookie('anotechhub_apikey', userApiKey, 365);
        setSavedApiKey(userApiKey);
        if (userApiKey) showNotification(uiText.apiKeyAppliedMessage);
    } else {
        setCookie('anotechhub_apikey', '', -1); // Expire cookie
        setSavedApiKey('');
        setUserApiKey('');
    }
    setCookie('anotechhub_visited', 'true', 365);
    setShowInitialSetup(false);
    showNotification(uiText.settingsSavedMessage);
  };
  
  const openRegenModal = (content, index, type) => {
    setRegenModalData({ content, index, type });
    setIsRegenModalOpen(true);
  };

  const handleModalRegenerate = async (instructions, updatedContent = null) => {
    const { content, index, type } = regenModalData;
    if (updatedContent) {
        setGeneratedContent(prev => prev.map((item, i) => i === index ? updatedContent : item));
        return;
    }
    // ... (rest of the function from the PDF)
  };


  const renderPage = () => {
    const generatorProps = {
      isLoading, generatedContent, error, setError, productName, setProductName,
      productDesc, setProductDesc, languageStyle, setLanguageStyle, hookType, setHookType,
      scriptCount, setScriptCount, carouselSlideCount, setCarouselSlideCount,
      targetAudience, setTargetAudience, contentType, setContentType, onGenerate: handleGenerate,
      onReset: handleReset, openThankYouModal: () => setIsThankYouModalOpen(true),
      openRegenModal, uiText, showInitialSetup, setShowInitialSetup, setCurrentPage
    };

    switch (currentPage) {
      case 'generator':
        return <GeneratorPage {...generatorProps} />;
      case 'settings':
        return <SettingsPage 
                  systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt}
                  savedSystemPrompt={savedSystemPrompt} onSaveSystemPrompt={() => {
                      setSavedSystemPrompt(systemPrompt);
                      showNotification(uiText.settingsSavedMessage);
                  }}
                  apiMode={apiMode} setApiMode={setApiMode}
                  userApiKey={userApiKey} setUserApiKey={setUserApiKey}
                  onSaveApiSettings={handleSaveApiSettings} uiText={uiText}
                  setCurrentPage={setCurrentPage}
                />;
      default:
        return <GeneratorPage {...generatorProps} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col ${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-slate-900 text-gray-200'} transition-colors duration-300`}>
      <style>{`
        .bg-custom-teal { background-color: #01a1a8; }
        .hover\\:bg-custom-teal-dark:hover { background-color: #018a90; }
        .text-custom-teal { color: #01a1a8; }
        .dark .dark\\:text-custom-teal-light { color: #5dd4d9; }
        .ring-custom-teal:focus { --tw-ring-color: #01a1a8; }
        .border-custom-teal:focus { border-color: #01a1a8; }
        .bg-custom-teal-active { background-color: #01a1a8 !important; }
      `}</style>
      <Header 
        theme={theme} setTheme={setTheme} 
        language={language} setLanguage={setLanguage}
        uiText={uiText} onLogoClick={() => setCurrentPage('generator')}
        onUserClick={() => setIsMobileSidebarOpen(true)}
      />
      <div className="flex flex-1">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            {renderPage()}
        </main>
        <Sidebar 
            currentPage={currentPage} setCurrentPage={setCurrentPage}
            uiText={uiText} isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      <BottomNavBar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        uiText={uiText} 
      />
      {/* Modals */}
      <ThankYouModal isOpen={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} uiText={uiText} />
      {/* <ApiKeyAppliedModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} uiText={uiText} /> */}
      <NotificationModal isOpen={notification.isOpen} onClose={() => setNotification({ isOpen: false, message: '' })} message={notification.message} />
      <RegenerateModal 
        isOpen={isRegenModalOpen} 
        onClose={() => setIsRegenModalOpen(false)}
        content={regenModalData.content}
        onRegenerate={handleModalRegenerate}
        contentType={regenModalData.type}
        uiText={uiText}
      />
    </div>
  );
}