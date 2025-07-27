// src/components/OutputSection.js
import React from 'react';
import { KeyRound, FileText, Bot, AlertTriangle } from 'lucide-react';
import ScriptCard from './ScriptCard';
import CarouselSlideCard from './CarouselSlideCard';
import ThreadCard from './ThreadCard';

const OutputSection = ({ isLoading, generatedContent, error, setError, outputType, uiText, showInitialSetup, setCurrentPage, ...props }) => {
    if (showInitialSetup && generatedContent.length === 0 && !isLoading) {
        return (
            <div className="lg:col-span-8">
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-8 text-center">
                    <KeyRound className="w-16 h-16 text-gray-300 dark:text-slate-600" />
                    <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">{uiText.initialSetupTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 max-w-sm mx-auto mt-1">{uiText.initialSetupSubtitle}</p>
                    <button onClick={() => setCurrentPage('settings')} className="mt-6 inline-flex items-center justify-center gap-2 bg-custom-teal hover:bg-custom-teal-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all">{uiText.goToSettings}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-8">
            <div className="h-full">
                {isLoading ? ( 
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-8">
                        <Bot className="w-16 h-16 text-custom-teal animate-bounce" />
                        <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">{uiText.aiIsWorking}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Please wait a moment.</p>
                    </div>
                ) : error && error.message ? ( 
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-dashed border-rose-300 dark:border-rose-700 p-8 text-center">
                        <AlertTriangle className="w-16 h-16 text-rose-400" />
                        <p className="mt-4 text-lg font-semibold text-rose-700 dark:text-rose-300">{error.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md">{error.message}</p>
                        <button onClick={() => setError({ title: '', message: '' })} className="mt-4 bg-rose-500 text-white font-bold py-2 px-4 rounded-lg">{uiText.tryAgain}</button>
                    </div>
                ) : generatedContent.length === 0 ? ( 
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-8 text-center">
                        <FileText className="w-16 h-16 text-gray-300 dark:text-slate-600" />
                        <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">{uiText.outputPlaceholderTitle}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{uiText.outputPlaceholderSubtitle}</p>
                    </div>
                ) : ( 
                    <div className="space-y-6">
                        {outputType === 'affiliator' && props.contentType === 'single' && generatedContent.map((script, index) => (<ScriptCard key={index} script={script} index={index} openRegenModal={props.openRegenModal} uiText={uiText} hookType={props.hookType} />))}
                        {outputType === 'affiliator' && props.contentType === 'carousel' && generatedContent.map((slide, index) => (<CarouselSlideCard key={index} slide={slide} index={index} openRegenModal={props.openRegenModal} uiText={uiText} />))}
                        {outputType === 'threads' && generatedContent.map((thread, index) => (<ThreadCard key={index} thread={thread} index={index} openRegenModal={props.openRegenModal} uiText={uiText} />))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutputSection;