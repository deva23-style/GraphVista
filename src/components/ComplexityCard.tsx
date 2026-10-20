import React from 'react';
import { Sparkles, Clock, HardDrive, HelpCircle } from 'lucide-react';

export const ComplexityCard: React.FC = () => {
  return (
    <section id="complexity" className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Algorithmic Complexity Analysis</h2>
            <p className="text-xs text-slate-500">Theoretical runtime & memory bounds for BFS and DFS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* BFS Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>Breadth-First Search (BFS)</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 text-indigo-700">
              Queue Based
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <Clock className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">Time Complexity: O(V + E)</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  With an adjacency list representation, each reachable vertex <code className="text-indigo-600 font-mono">V</code> is enqueued and dequeued once, and every incident edge <code className="text-indigo-600 font-mono">E</code> is inspected at most twice (or once for directed graphs).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <HardDrive className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">Auxiliary Space Complexity: O(V)</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Requires a visited set of size <code className="text-indigo-600 font-mono">O(V)</code> and a FIFO queue holding up to <code className="text-indigo-600 font-mono">O(V)</code> vertices (bounded by the maximum width of the graph).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DFS Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Depth-First Search (DFS)</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-700">
              Stack Based
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <Clock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">Time Complexity: O(V + E)</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Each reachable vertex is visited once, and each outgoing edge is examined when expanding neighbors. Total work is linear with respect to vertices plus edges.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <HardDrive className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">Auxiliary Space Complexity: O(V)</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Stores visited status for <code className="text-emerald-600 font-mono">O(V)</code> vertices and maintains the call stack of maximum depth <code className="text-emerald-600 font-mono">O(V)</code> (e.g. in a degenerate line graph).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adjacency List vs Adjacency Matrix Note */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-950 flex items-start space-x-2.5">
        <HelpCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <span className="font-bold block">Representation Matters: Adjacency List vs Adjacency Matrix</span>
          <p className="text-indigo-900 leading-relaxed">
            The <code className="font-semibold text-indigo-800">O(V + E)</code> time bound applies specifically to graphs stored using an <span className="font-semibold">Adjacency List</span>, where iterating through neighbors takes time proportional to the node&apos;s degree. If an <span className="font-semibold">Adjacency Matrix</span> is used instead, checking for neighbors requires scanning an entire row of size <code className="font-semibold text-indigo-800">V</code> for every vertex, resulting in <code className="font-semibold text-indigo-800">O(V²)</code> time complexity even for sparse graphs.
          </p>
        </div>
      </div>
    </section>
  );
};
