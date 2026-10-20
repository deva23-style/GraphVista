import React from 'react';
import { Plus, Link2, Trash2, RotateCcw, ArrowRight, FolderOpen, AlertCircle } from 'lucide-react';
import { EditorMode } from '../types/graph';
import { EXAMPLE_GRAPHS, ExampleGraphItem } from '../data/exampleGraphs';

interface GraphEditorToolbarProps {
  editorMode: EditorMode;
  onToggleMode: () => void;
  onAddNode: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  selectionType: 'node' | 'edge' | null;
  onClearGraph: () => void;
  isDirected: boolean;
  onToggleDirected: () => void;
  onLoadExample: (example: ExampleGraphItem) => void;
  isTraversing: boolean;
}

export const GraphEditorToolbar: React.FC<GraphEditorToolbarProps> = ({
  editorMode,
  onToggleMode,
  onAddNode,
  onDeleteSelected,
  hasSelection,
  selectionType,
  onClearGraph,
  isDirected,
  onToggleDirected,
  onLoadExample,
  isTraversing,
}) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 shadow-xs mb-3 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left Edit Actions */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Add Node Button */}
        <button
          onClick={onAddNode}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 active:scale-95 transition-all cursor-pointer"
          title="Add a new vertex to the graph"
          aria-label="Add Node"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Add Node</span>
        </button>

        {/* Connect Nodes Toggle */}
        <button
          onClick={onToggleMode}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
            editorMode === 'connect'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
          title="Click to toggle edge connection mode"
          aria-label="Connect Nodes Mode"
        >
          <Link2 className="w-4 h-4" />
          <span>{editorMode === 'connect' ? 'Connecting...' : 'Connect'}</span>
        </button>

        {/* Delete Selection */}
        <button
          onClick={onDeleteSelected}
          disabled={!hasSelection}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
            hasSelection
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 cursor-pointer active:scale-95'
              : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
          }`}
          title={
            hasSelection
              ? `Delete selected ${selectionType || 'item'}`
              : 'Select a node or edge first to delete'
          }
          aria-label="Delete Selection"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden xs:inline">
            Delete {selectionType ? (selectionType === 'node' ? 'Node' : 'Edge') : ''}
          </span>
          <span className="xs:hidden">Del</span>
        </button>

        {/* Clear Graph */}
        <button
          onClick={onClearGraph}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          title="Clear all nodes and edges"
          aria-label="Clear Graph"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Right Topologies & Example Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Directed / Undirected Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => {
              if (isDirected) onToggleDirected();
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              !isDirected
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Undirected graph edges (bidirectional traversal)"
          >
            Undirected
          </button>
          <button
            onClick={() => {
              if (!isDirected) onToggleDirected();
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
              isDirected
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Directed graph edges (arrows specify one-way travel)"
          >
            <span>Directed</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Example Graphs Dropdown */}
        <div className="relative">
          <label htmlFor="example-select" className="sr-only">
            Load Predefined Example Graph
          </label>
          <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-700 hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500">
            <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              id="example-select"
              defaultValue=""
              onChange={(e) => {
                const item = EXAMPLE_GRAPHS.find((g) => g.id === e.target.value);
                if (item) {
                  onLoadExample(item);
                  e.target.value = ''; // Reset select
                }
              }}
              className="bg-transparent border-none text-slate-800 font-medium text-xs sm:text-sm focus:outline-hidden cursor-pointer"
            >
              <option value="" disabled>
                Load Example...
              </option>
              {EXAMPLE_GRAPHS.map((eg) => (
                <option key={eg.id} value={eg.id}>
                  {eg.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isTraversing && (
        <div className="w-full text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>Note: Graph is locked during active playback. Editing will pause and reset traversal.</span>
        </div>
      )}
    </div>
  );
};
