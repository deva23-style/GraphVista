import React from 'react';
import { ArrowDown, GitBranch, Layers, CheckCircle2 } from 'lucide-react';

export const Introduction: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Academic Computer Science Visualizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Explore Graphs. <span className="text-indigo-600">Understand Algorithms.</span>
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Visualize Breadth-First Search (BFS) and Depth-First Search (DFS) step by step.
              Build custom graphs, inspect live queues and stacks, observe backtracking, and master algorithmic complexity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="#visualizer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Launch Visualizer</span>
              <ArrowDown className="w-4 h-4" />
            </a>
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deterministic</span>
              </span>
              <span className="flex items-center space-x-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span>Directed / Undirected</span>
              </span>
              <span className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Live State</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
