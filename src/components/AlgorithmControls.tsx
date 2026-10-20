import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { TraversalAlgorithm, PlaybackSpeed, TraversalStep, GraphNode } from '../types/graph';

interface AlgorithmControlsProps {
  algorithm: TraversalAlgorithm;
  onSelectAlgorithm: (algo: TraversalAlgorithm) => void;
  startNodeId: string;
  onSelectStartNode: (nodeId: string) => void;
  nodes: GraphNode[];
  currentStep: TraversalStep | null;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onTogglePlay: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: PlaybackSpeed) => void;
  hasTrace: boolean;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithm,
  onSelectAlgorithm,
  startNodeId,
  onSelectStartNode,
  nodes,
  currentStep,
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onNextStep,
  onPrevStep,
  onReset,
  onChangeSpeed,
  hasTrace,
}) => {
  const isAtStart = currentStepIndex <= 0;
  const isAtEnd = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
  const progressPercent = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-4">
      {/* Top Configuration: Algorithm & Start Node Choice */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        {/* BFS / DFS Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Algorithm:</span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => onSelectAlgorithm('BFS')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                algorithm === 'BFS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Breadth-First Search: Explores level by level using a Queue (FIFO)"
            >
              <span>BFS</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${algorithm === 'BFS' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                Queue
              </span>
            </button>

            <button
              onClick={() => onSelectAlgorithm('DFS')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                algorithm === 'DFS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Depth-First Search: Explores deep branches before backtracking using a Stack (LIFO)"
            >
              <span>DFS</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${algorithm === 'DFS' ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                Stack
              </span>
            </button>
          </div>
        </div>

        {/* Start Node Selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="start-node-select" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Start Node:
          </label>
          {nodes.length > 0 ? (
            <select
              id="start-node-select"
              value={startNodeId}
              onChange={(e) => onSelectStartNode(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  Node {node.label}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded border border-rose-200">
              No nodes in graph
            </span>
          )}
        </div>
      </div>

      {/* Playback Controls & Speed */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Playback Button Group */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Reset */}
          <button
            onClick={onReset}
            disabled={!hasTrace}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center space-x-1"
            title="Reset to beginning of traversal"
            aria-label="Reset Traversal"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-medium hidden sm:inline">Reset</span>
          </button>

          {/* Previous Step */}
          <button
            onClick={onPrevStep}
            disabled={!hasTrace || isAtStart || isPlaying}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center space-x-1"
            title="Step back to previous algorithmic step"
            aria-label="Previous Step"
          >
            <SkipBack className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-medium hidden sm:inline">Prev</span>
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onTogglePlay}
            disabled={!hasTrace || isAtEnd}
            className={`px-4 sm:px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer flex items-center space-x-2 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-300'
                : 'bg-indigo-600 hover:bg-indigo-700 ring-2 ring-indigo-200'
            } disabled:opacity-40 disabled:cursor-not-allowed disabled:ring-0`}
            title={isPlaying ? 'Pause auto-play' : 'Play algorithm step-by-step'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{isAtEnd ? 'Completed' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={onNextStep}
            disabled={!hasTrace || isAtEnd || isPlaying}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center space-x-1"
            title="Step forward to next algorithmic step"
            aria-label="Next Step"
          >
            <span className="text-xs font-medium hidden sm:inline">Next</span>
            <SkipForward className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Speed Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Speed:</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {([0.5, 1, 1.5, 2] as PlaybackSpeed[]).map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                aria-label={`Set speed to ${s}x`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar & Step Counter */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center space-x-1 text-slate-500">
            <span>Execution Timeline</span>
          </span>
          <span className="font-mono text-indigo-600">
            {totalSteps > 0 ? `Step ${currentStepIndex + 1} of ${totalSteps}` : 'No steps'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Step Explanation Callout */}
      {currentStep && (
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-start space-x-2.5">
            <div className="mt-0.5 p-1 rounded-md bg-indigo-100 text-indigo-700 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  {currentStep.action.replace('_', ' ')}
                </span>
                {currentStep.currentNode && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                    Active: Node {nodes.find((n) => n.id === currentStep.currentNode)?.label || currentStep.currentNode}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {currentStep.description}
              </p>
              {currentStep.detail && (
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {currentStep.detail}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
