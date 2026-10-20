import React from 'react';
import { Network, BookOpen, Cpu, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Network className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">GraphVista</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                Visualizer
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Graph Traversal Visualizer — See Algorithms in Action</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-3 text-sm font-medium" aria-label="Main Navigation">
          <a
            href="#visualizer"
            className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center space-x-1"
          >
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Visualizer</span>
          </a>
          <a
            href="#complexity"
            className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors hidden md:flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Complexity</span>
          </a>
          <a
            href="#learn"
            className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center space-x-1"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Learn Guide</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
