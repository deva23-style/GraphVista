import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  GitBranch,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TraversalResult, GraphNode } from '../types/graph';

interface TraversalResultsProps {
  result: TraversalResult;
  nodes: GraphNode[];
  onReset: () => void;
  onSwitchAlgorithm: () => void;
}

export const TraversalResults: React.FC<TraversalResultsProps> = ({
  result,
  nodes,
  onReset,
  onSwitchAlgorithm,
}) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const startNodeLabel = nodeMap.get(result.startNode)?.label || result.startNode;
  const isDisconnected = result.unreachableNodes.length > 0;

  return (
    <div className="w-full bg-white border border-emerald-200 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {result.algorithm} Traversal Completed
              </h3>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                Success
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Completed in {result.stepCount} discrete algorithmic steps
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run Again</span>
          </button>
          <button
            onClick={onSwitchAlgorithm}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 active:scale-95 shadow-xs transition-all cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Try {result.algorithm === 'BFS' ? 'DFS' : 'BFS'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Start Vertex
          </span>
          <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
            Node {startNodeLabel}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Nodes Visited
          </span>
          <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">
            {result.visitedCount} / {result.totalNodes} ({Math.round((result.visitedCount / (result.totalNodes || 1)) * 100)}%)
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Reachable Status
          </span>
          <span
            className={`text-base font-extrabold mt-0.5 block ${
              isDisconnected ? 'text-amber-600' : 'text-emerald-700'
            }`}
          >
            {isDisconnected ? `${result.unreachableNodes.length} Unreachable` : 'Fully Reachable'}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Complexity Used
          </span>
          <span className="text-base font-extrabold text-indigo-700 mt-0.5 block">
            O(V + E)
          </span>
        </div>
      </div>

      {/* Traversal Order Output */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>Final Traversal Order</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {result.traversalOrder.map((nodeId, idx) => {
            const label = nodeMap.get(nodeId)?.label || nodeId;
            return (
              <React.Fragment key={nodeId}>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-extrabold text-xs text-slate-800 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-normal">#{idx + 1}</span>
                  <span>{label}</span>
                </span>
                {idx < result.traversalOrder.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Disconnected / Unreachable Warning & Explanation */}
      {isDisconnected && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">
                Disconnected Component Notice ({result.unreachableNodes.length} unreachable nodes)
              </span>
              <p className="mt-1 leading-relaxed text-amber-800">
                The standard graph traversal algorithms (BFS and DFS) begin from a single chosen root
                node and only visit vertices that can be reached via a path of edges from that node.
                Vertices{' '}
                <span className="font-bold">
                  [{result.unreachableNodes.map((id) => nodeMap.get(id)?.label || id).join(', ')}]
                </span>{' '}
                belong to a separate disconnected component (or lack a directed path from the start vertex)
                and therefore were not traversed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
