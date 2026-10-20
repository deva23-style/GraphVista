import React from 'react';
import { Network, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
            <Network className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800 text-sm">GraphVista</span>
          <span className="text-slate-400">— Graph Traversal Visualizer</span>
        </div>

        <div className="flex items-center space-x-1">
          <span>Engineered for Computer Science & Algorithm Education</span>
        </div>

        <div className="text-slate-400">
          <span>100% Client-Side • Deterministic Execution</span>
        </div>
      </div>
    </footer>
  );
};
