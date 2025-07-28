// src/components/ScriptCard.js
import React, { useState } from 'react';
import { Copy, Check, Edit } from 'lucide-react';
import { hookTitleMappings } from '../config';

const ScriptCard = ({ script, index, openRegenModal, uiText, hookType, language }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        const textToCopy = `Title: ${script.title}\n\nProblem: ${script.problem}\n\nStory: ${script.story}\n\nCTA: ${script.cta}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-sm p-6 transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg mb-4 text-custom-teal dark:text-custom-teal-light pr-4">{script.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handleCopy} className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-colors ${isCopied ? 'text-green-600 bg-green-100 dark:bg-green-900/50' : 'text-gray-500 dark:text-gray-400 hover:text-custom-teal dark:hover:text-custom-teal-light hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                        {isCopied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                    </button>
                    <button onClick={() => openRegenModal(script, index, 'single')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-custom-teal dark:hover:text-custom-teal-light p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        <Edit className="w-4 h-4"/>
                    </button>
                </div>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-lg border-l-4 border-rose-400">
                    <p className="font-semibold text-rose-800 dark:text-rose-300">{uiText.hookStyleTitle}: {hookTitleMappings[hookType]?.[language] || hookType}</p>
                    <p className="mt-1 text-sm">{script.problem}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-400">
                    <p className="font-semibold text-blue-800 dark:text-blue-300">{uiText.storytellingBody}</p>
                    <p className="mt-1 text-sm leading-relaxed">{script.story}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border-l-4 border-emerald-500">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-400">{uiText.callToAction}</p>
                    <p className="mt-1 text-sm">{script.cta}</p>
                </div>
            </div>
        </div>
    );
};

export default ScriptCard;