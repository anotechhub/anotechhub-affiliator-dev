// src/components/AboutUsPage.js
import React from 'react';
import { Home, MessageSquareText, Zap, Languages, Settings } from 'lucide-react';

const Icon = ({ component: Component, className }) => <Component className={className} />;

const AboutUsPage = ({ uiText }) => {
    const features = [
        { icon: Home, title: uiText.feature1Title, desc: uiText.feature1Desc },
        { icon: MessageSquareText, title: uiText.feature2Title, desc: uiText.feature2Desc },
        { icon: Zap, title: uiText.feature3Title, desc: uiText.feature3Desc },
        { icon: Languages, title: uiText.feature4Title, desc: uiText.feature4Desc },
        { icon: Settings, title: uiText.feature5Title, desc: uiText.feature5Desc },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-white">{uiText.aboutTitle}</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{uiText.aboutSubtitle}</p>
            </div>

            <div className="p-8 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-sm">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">{uiText.aboutFeatureTitle}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-custom-teal text-white">
                                    <Icon component={feature.icon} className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;