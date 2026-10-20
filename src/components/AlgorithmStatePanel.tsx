import React from 'react';
import {
  Layers,
  ListOrdered,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CornerDownRight,
  Activity,
} from 'lucide-react';
import { TraversalAlgorithm, TraversalStep, GraphNode } from '../types/graph';

interface AlgorithmStatePanelProps {
  algorithm: TraversalAlgorithm;
  currentStep: TraversalStep | null;
  nodes: GraphNode[];
}

export const AlgorithmStatePanel: React.FC<AlgorithmStatePanelProps> = ({
  algorithm,
  currentStep,
  nodes,
}) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const getNodeLabel = (id: string) => {
    return nodeMap.get(id)?.label || id;
  };

  const frontier = currentStep?.frontier || [];
  const visited = currentStep?.visited || [];
  const traversalOrder = currentStep?.traversalOrder || [];
  const currentNode = currentStep?.currentNode ? nodeMap.get(currentStep.currentNode) : null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Live Algorithm State</h2>
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {algorithm === 'BFS' ? 'Queue (FIFO)' : 'Stack (LIFO)'}
        </span>
      </div>

      {/* 1. Current Node & Active Event */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          Active Processing Node
        </span>
        {currentNode ? (
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-900 font-extrabold text-sm flex items-center justify-center shadow-xs">
              {currentNode.label}
            </span>
            <div>
              <span className="text-sm font-bold text-slate-900">Node &quot;{currentNode.label}&quot;</span>
              <p className="text-xs text-slate-500">Currently expanding neighbors</p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic py-1">
            {currentStep?.action === 'COMPLETE' ? 'Traversal finished (No active node)' : 'Waiting to start...'}
          </div>
        )}
      </div>

      {/* 2. Frontier Structure: Queue (BFS) or Stack (DFS) */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{algorithm === 'BFS' ? 'BFS Queue (Front → Rear)' : 'DFS Call Stack (Top → Bottom)'}</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {frontier.length} {frontier.length === 1 ? 'element' : 'elements'}
          </span>
        </div>

        {frontier.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {frontier.map((nodeId, idx) => {
              const label = getNodeLabel(nodeId);
              const isFront = idx === 0;
              const isTop = idx === frontier.length - 1;

              return (
                <div
                  key={`${nodeId}-${idx}`}
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    algorithm === 'BFS' && isFront
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-200'
                      : algorithm === 'DFS' && isTop
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  <span>{label}</span>
                  {algorithm === 'BFS' && isFront && (
                    <span className="ml-1 text-[9px] uppercase px-1 py-0.2 rounded bg-indigo-800 text-white font-semibold">
                      Front
                    </span>
                  )}
                  {algorithm === 'DFS' && isTop && (
                    <span className="ml-1 text-[9px] uppercase px-1 py-0.2 rounded bg-indigo-800 text-white font-semibold">
                      Top
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-1">
            {currentStep?.action === 'COMPLETE' ? 'Empty (all reachable items processed)' : 'Empty'}
          </p>
        )}
      </div>

      {/* 3. Visited Set */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Visited Set ({visited.length}/{nodes.length})</span>
          </span>
        </div>

        {visited.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {visited.map((nodeId) => (
              <span
                key={nodeId}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"
              >
                {getNodeLabel(nodeId)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-1">No nodes marked visited yet</p>
        )}
      </div>

      {/* 4. Traversal Sequence Order */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
            <span>Traversal Sequence</span>
          </span>
        </div>

        {traversalOrder.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1">
            {traversalOrder.map((nodeId, idx) => (
              <React.Fragment key={nodeId}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white border border-slate-300 text-xs font-extrabold text-slate-800 shadow-2xs">
                  {getNodeLabel(nodeId)}
                </span>
                {idx < traversalOrder.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-1">Traversal not started</p>
        )}
      </div>

      {/* 5. Backtracking Alert (for DFS) */}
      {algorithm === 'DFS' && currentStep?.action === 'BACKTRACK' && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
          <CornerDownRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Backtracking Active</span>
            <span>
              Retreating from node &quot;{getNodeLabel(currentStep.backtrackingFrom || '')}&quot; to examine remaining stack paths.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
