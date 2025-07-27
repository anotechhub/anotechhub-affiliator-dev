// src/components/BottomNavBar.js
import React from 'react';
import { Home, Settings } from 'lucide-react'; // <-- KODE PERBAIKAN DI SINI

const Icon = ({ component: Component, className }) => <Component className={className} />;

const BottomNavBar = ({ currentPage, setCurrentPage, uiText }) => {
  const navItems = [
    { id: 'generator', label: uiText.generator, icon: Home },
    { id: 'settings', label: uiText.settings, icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-slate-800 shadow-t-md p-2 flex justify-around items-center z-20 lg:hidden">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id)}
          className={`flex flex-col items-center justify-center gap-1 w-full rounded-lg py-1 transition-colors ${currentPage === item.id ? 'text-custom-teal' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <Icon component={item.icon} className="w-6 h-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavBar;