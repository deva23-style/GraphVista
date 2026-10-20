import React from 'react';
import { BookOpen, HelpCircle, Layers, Check, GitCommit, Compass, ShieldAlert } from 'lucide-react';

export const LearningGuide: React.FC = () => {
  return (
    <section id="learn" className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs mb-8">
      {/* Section Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Graph Traversal Masterclass
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Foundations of Graph Theory, Breadth-First Search, and Depth-First Search
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>BFS vs DFS: Side-by-Side Comparison</span>
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-indigo-700">Breadth-First Search (BFS)</th>
                <th className="py-3 px-4 text-emerald-700">Depth-First Search (DFS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Primary Data Structure</td>
                <td className="py-3 px-4 font-mono font-medium text-indigo-600">Queue (FIFO)</td>
                <td className="py-3 px-4 font-mono font-medium text-emerald-600">Stack (LIFO) or Recursion</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Exploration Strategy</td>
                <td className="py-3 px-4">Level by level (broad wave)</td>
                <td className="py-3 px-4">Branch by branch (deep plunge, then backtrack)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Shortest Path (Unweighted)</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold flex items-center space-x-1">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Guaranteed minimum edge count</span>
                </td>
                <td className="py-3 px-4 text-slate-500">Does not guarantee shortest path</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Time Complexity (Adj. List)</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">O(V + E)</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">O(V + E)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Auxiliary Space Complexity</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">O(V)</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">O(V)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Backtracking Mechanism</td>
                <td className="py-3 px-4 text-slate-500">None (nodes visited in queue order)</td>
                <td className="py-3 px-4 font-semibold text-amber-700">Active (retreats from dead ends)</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-semibold text-slate-900">Real-World Applications</td>
                <td className="py-3 px-4 text-xs text-slate-600">
                  GPS routing (fewest transfers), social network friend hops (degree of separation), web crawling.
                </td>
                <td className="py-3 px-4 text-xs text-slate-600">
                  Maze solving, topological sorting (build pipelines), cycle detection, sudoku & game puzzle solving.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Concept Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Concept 1 */}
        <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>1. What is a Graph? (V & E)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A graph <code className="font-mono font-bold">G = (V, E)</code> consists of a set of vertices
            (or nodes, <code className="font-mono">V</code>) and a collection of edges
            (<code className="font-mono">E</code>) connecting pairs of vertices. In an <span className="font-semibold text-slate-800">undirected graph</span>,
            edges are bidirectional highways. In a <span className="font-semibold text-slate-800">directed graph (digraph)</span>,
            edges have a specific orientation (arrows) and can only be traversed forward.
          </p>
        </div>

        {/* Concept 2 */}
        <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>2. Why Visited Tracking is Essential</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike trees which are naturally acyclic, graphs frequently contain cycles (e.g. A → B → C → A).
            Without a <span className="font-semibold text-slate-800">visited set</span>, any traversal
            would oscillate endlessly in an infinite loop. Recording visited nodes guarantees that every
            reachable vertex is processed exactly once, ensuring algorithm termination.
          </p>
        </div>

        {/* Concept 3 */}
        <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
            <GitCommit className="w-4 h-4 text-amber-600" />
            <span>3. Neighbor Ordering Policy</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A graph mathematically defines adjacent neighbors as an unordered set. However, computer implementations
            must inspect neighbors in some concrete sequence (e.g., insertion order or alphabetical label order).
            GraphVista enforces an <span className="font-semibold text-slate-800">alphabetical ordering policy</span>{' '}
            so that academic demonstrations and unit tests are 100% deterministic and reproducible.
          </p>
        </div>

        {/* Concept 4 */}
        <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>4. Disconnected Components & Reachability</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When a graph is not fully connected, a single run of BFS or DFS from a chosen start vertex
            will explore only the vertices in that start vertex&apos;s connected component. Disconnected
            vertices remain unvisited. To traverse an entire disconnected graph, an outer loop iterating
            over all unvisited vertices is required.
          </p>
        </div>
      </div>
    </section>
  );
};
