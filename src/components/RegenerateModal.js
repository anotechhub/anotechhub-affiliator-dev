import React, { useState, useEffect } from 'react';
import { X, Wand2 } from 'lucide-react';

const RegenerateModal = ({ isOpen, onClose, content, onRegenerate, contentType, uiText }) => {
    const [instructions, setInstructions] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [newVersion, setNewVersion] = useState(null);
    const [error, setError] = useState('');

    // Reset state setiap kali modal dibuka
    useEffect(() => {
        if (isOpen) {
            setInstructions('');
            setNewVersion(null);
            setIsRegenerating(false);
            setError('');
        }
    }, [isOpen]);
    
    const handleRegenerateClick = async () => {
        setIsRegenerating(true);
        setError('');
        try {
            const result = await onRegenerate(instructions);
            if (!result) {
                throw new Error("AI did not return a valid response.");
            }
            setNewVersion(result);
        } catch (e) {
            setError(e.message || "An unknown error occurred during regeneration.");
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleAccept = () => {
        if (newVersion) {
            onRegenerate(instructions, newVersion);
        }
        onClose();
    };

    if (!isOpen || !content) return null;
    
    // Helper function untuk merender konten berdasarkan tipenya
    const renderContent = (data) => {
        if (!data) return null;
        switch(contentType) {
            case 'single':
                return (
                    <>
                        <p className="font-bold">{data.title}</p>
                        <p><strong>Problem:</strong> {data.problem}</p>
                        <p><strong>Story:</strong> {data.story}</p>
                        <p><strong>CTA:</strong> {data.cta}</p>
                    </>
                );
            case 'carousel':
                return (
                    <>
                        <p className="font-bold">{data.title}</p>
                        <p>{data.content}</p>
                    </>
                );
            case 'thread':
                return <p>{data.content}</p>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{uiText.editAndRegenerateModalTitle}</h3>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Versi Asli */}
                        <div>
                            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{uiText.originalVersion}</h4>
                            <div className="bg-gray-100 dark:bg-slate-900/50 p-4 rounded-lg text-sm space-y-2 text-gray-600 dark:text-gray-400">
                                {renderContent(content)}
                            </div>
                        </div>

                        {/* Kolom Versi Baru */}
                        <div>
                            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{uiText.newVersion}</h4>
                            <div className="bg-gray-100 dark:bg-slate-900/50 p-4 rounded-lg text-sm min-h-[150px] flex items-center justify-center">
                                {isRegenerating ? (
                                    <div className="text-center">
                                        <div className="mx-auto w-6 h-6 border-2 border-custom-teal border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs mt-2">{uiText.aiIsWorking}</p>
                                    </div>
                                ) : newVersion ? (
                                    <div className="space-y-2 text-gray-800 dark:text-gray-200">
                                        {renderContent(newVersion)}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">{uiText.newVersionPlaceholder}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Input Instruksi Revisi */}
                    <div className="mt-4">
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{uiText.revisionInstructions}</label>
                        <textarea 
                            id="instructions" 
                            value={instructions} 
                            onChange={e => setInstructions(e.target.value)} 
                            rows="3" 
                            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 focus:ring-2 ring-custom-teal" 
                            placeholder={uiText.revisionPlaceholder}
                        ></textarea>
                    </div>

                    {/* Menampilkan Pesan Error */}
                    {error && (
                        <div className="mt-4 text-center p-2 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 border-t pt-4 dark:border-slate-700">
                    <button 
                        onClick={handleRegenerateClick} 
                        disabled={isRegenerating || !instructions} 
                        className="w-full flex items-center justify-center gap-2 bg-custom-teal hover:bg-custom-teal-dark text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all disabled:bg-teal-400 disabled:cursor-not-allowed"
                    >
                        <Wand2 className="w-5 h-5"/>
                        {uiText.regenerate}
                    </button>
                    <button 
                        onClick={handleAccept} 
                        disabled={!newVersion || isRegenerating} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                        {uiText.useThisVersion}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegenerateModal;