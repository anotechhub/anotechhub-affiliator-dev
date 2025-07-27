// src/components/CarouselSlideCard.js
import React, { useState } from 'react';
import { Copy, Check, Edit } from 'lucide-react';

const CarouselSlideCard = ({ slide, index, openRegenModal, uiText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Slide ${slide.slide_number}: ${slide.title}\n\n${slide.content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-sm p-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-custom-teal text-white font-bold text-sm">{slide.slide_number}</span>
          <h3 className="font-bold text-lg text-custom-teal dark:text-custom-teal-light">{slide.title}</h3>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={handleCopy} className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-colors ${isCopied ? 'text-green-600 bg-green-100 dark:bg-green-900/50' : 'text-gray-500 dark:text-gray-400 hover:text-custom-teal dark:hover:text-custom-teal-light hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                {isCopied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                <span className="hidden sm:inline">{isCopied ? uiText.copied : uiText.copy}</span>
            </button>
            <button onClick={() => openRegenModal(slide, index, 'carousel')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-custom-teal dark:hover:text-custom-teal-light p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <Edit className="w-4 h-4"/>
                <span className="hidden sm:inline">{uiText.editAndRegenerate}</span>
            </button>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{slide.content}</p>
    </div>
  );
};

export default CarouselSlideCard;