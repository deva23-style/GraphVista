import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  GraphModel,
  GraphNode,
  GraphEdge,
  TraversalAlgorithm,
  PlaybackSpeed,
  TraversalStep,
  TraversalResult,
  EditorMode,
} from './types/graph';
import { EXAMPLE_GRAPHS, ExampleGraphItem } from './data/exampleGraphs';
import { generateBFSTrace } from './algorithms/bfs';
import { generateDFSTrace } from './algorithms/dfs';
import { getNextNodeLabel, getSmartNewNodePosition } from './utils/graphUtils';
import { Header } from './components/Header';
import { Introduction } from './components/Introduction';
import { GraphCanvas } from './components/GraphCanvas';
import { GraphEditorToolbar } from './components/GraphEditorToolbar';
import { AlgorithmControls } from './components/AlgorithmControls';
import { AlgorithmStatePanel } from './components/AlgorithmStatePanel';
import { TraversalResults } from './components/TraversalResults';
import { ComplexityCard } from './components/ComplexityCard';
import { LearningGuide } from './components/LearningGuide';
import { Footer } from './components/Footer';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  // --- Graph State ---
  const [graph, setGraph] = useState<GraphModel>(() => {
    const initial = EXAMPLE_GRAPHS[0];
    return JSON.parse(JSON.stringify(initial.graph));
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('select');
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);

  // --- Algorithm & Traversal Execution State ---
  const [algorithm, setAlgorithm] = useState<TraversalAlgorithm>('BFS');
  const [startNodeId, setStartNodeId] = useState<string>(() => {
    return EXAMPLE_GRAPHS[0].recommendedStartId || EXAMPLE_GRAPHS[0].graph.nodes[0]?.id || '';
  });

  const [steps, setSteps] = useState<TraversalStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [traversalResult, setTraversalResult] = useState<TraversalResult | null>(null);

  // --- Notification / Toast System ---
  const [notification, setNotification] = useState<{
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    id: number;
  } | null>(null);
  const notifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = useCallback((message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current);
    const id = Date.now();
    setNotification({ message, type, id });
    notifyTimeoutRef.current = setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  }, []);

  // Ensure startNodeId is always valid when nodes change
  useEffect(() => {
    if (graph.nodes.length === 0) {
      setStartNodeId('');
    } else if (!graph.nodes.some((n) => n.id === startNodeId)) {
      setStartNodeId(graph.nodes[0].id);
    }
  }, [graph.nodes, startNodeId]);

  // Compute and regenerate traversal trace deterministically
  const regenerateTrace = useCallback(() => {
    setIsPlaying(false);
    if (graph.nodes.length === 0 || !startNodeId) {
      setSteps([]);
      setCurrentStepIndex(0);
      setTraversalResult(null);
      return;
    }

    if (algorithm === 'BFS') {
      const { steps: newSteps, result } = generateBFSTrace(graph, startNodeId);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setTraversalResult(result);
    } else {
      const { steps: newSteps, result } = generateDFSTrace(graph, startNodeId);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setTraversalResult(result);
    }
  }, [graph, startNodeId, algorithm]);

  // Auto-regenerate trace when algorithm, startNode, or graph topology changes
  useEffect(() => {
    regenerateTrace();
  }, [regenerateTrace]);

  // --- Animation / Playback Timer Engine ---
  useEffect(() => {
    if (!isPlaying) return;

    if (steps.length === 0 || currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    // Interval delays mapped to playback speeds
    const delayMap: Record<PlaybackSpeed, number> = {
      0.5: 1400,
      1: 800,
      1.5: 500,
      2: 300,
    };

    const timer = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= steps.length - 1) {
          setIsPlaying(false);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, delayMap[speed]);

    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Current active step
  const currentStep = useMemo(() => {
    if (steps.length === 0) return null;
    return steps[currentStepIndex] || null;
  }, [steps, currentStepIndex]);

  // --- Playback Control Handlers ---
  const handleTogglePlay = () => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      // If at end, replay from beginning
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsPlaying(false);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setIsPlaying(false);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // --- Graph Editing Actions ---
  const handleAddNode = (customX?: number, customY?: number) => {
    setIsPlaying(false);
    const label = getNextNodeLabel(graph.nodes);
    const pos =
      customX !== undefined && customY !== undefined
        ? { x: customX, y: customY }
        : getSmartNewNodePosition(graph.nodes);

    const newNode: GraphNode = {
      id: `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      label,
      x: pos.x,
      y: pos.y,
    };

    setGraph((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));

    setSelectedNodeId(newNode.id);
    setSelectedEdgeId(null);
    showNotification(`Added Node "${label}"`, 'success');
  };

  const handleToggleMode = () => {
    if (editorMode === 'select') {
      setEditorMode('connect');
      setConnectSourceId(null);
      showNotification('Connect Mode active: Click two nodes to connect them with an edge', 'info');
    } else {
      setEditorMode('select');
      setConnectSourceId(null);
    }
  };

  const handleSelectNode = (nodeId: string | null) => {
    if (editorMode === 'connect') {
      if (!connectSourceId) {
        setConnectSourceId(nodeId);
      } else if (nodeId) {
        if (connectSourceId === nodeId) {
          showNotification('Self-loops are not supported.', 'warning');
          return;
        }
        handleConnectNodes(connectSourceId, nodeId);
      }
      return;
    }

    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  };

  const handleSelectEdge = (edgeId: string | null) => {
    if (editorMode === 'connect') return;
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
  };

  const handleConnectNodes = (sourceId: string, targetId: string) => {
    setIsPlaying(false);

    // Prevent duplicate edges
    const exists = graph.edges.some((e) => {
      if (graph.directed) {
        return e.source === sourceId && e.target === targetId;
      }
      return (
        (e.source === sourceId && e.target === targetId) ||
        (e.source === targetId && e.target === sourceId)
      );
    });

    if (exists) {
      showNotification('An edge already exists between these two vertices.', 'warning');
      setConnectSourceId(null);
      return;
    }

    const newEdge: GraphEdge = {
      id: `edge-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      source: sourceId,
      target: targetId,
    };

    setGraph((prev) => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }));

    setConnectSourceId(null);
    const sourceNode = graph.nodes.find((n) => n.id === sourceId);
    const targetNode = graph.nodes.find((n) => n.id === targetId);
    showNotification(
      `Connected Node "${sourceNode?.label}" ${graph.directed ? '→' : '—'} "${targetNode?.label}"`,
      'success'
    );
  };

  const handleDeleteSelected = () => {
    setIsPlaying(false);

    if (selectedNodeId) {
      const nodeToDelete = graph.nodes.find((n) => n.id === selectedNodeId);
      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((n) => n.id !== selectedNodeId),
        // Crucial requirement: automatically remove incident edges
        edges: prev.edges.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
        ),
      }));
      setSelectedNodeId(null);
      showNotification(`Deleted Node "${nodeToDelete?.label || ''}" and its connected edges`, 'info');
    } else if (selectedEdgeId) {
      setGraph((prev) => ({
        ...prev,
        edges: prev.edges.filter((e) => e.id !== selectedEdgeId),
      }));
      setSelectedEdgeId(null);
      showNotification('Deleted selected edge', 'info');
    }
  };

  const handleNodeMove = (nodeId: string, x: number, y: number) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
    }));
  };

  const handleClearGraph = () => {
    if (graph.nodes.length === 0) return;
    if (window.confirm('Clear all nodes and edges from workspace?')) {
      setIsPlaying(false);
      setGraph({
        nodes: [],
        edges: [],
        directed: graph.directed,
      });
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setConnectSourceId(null);
      showNotification('Graph cleared', 'info');
    }
  };

  const handleToggleDirected = () => {
    setIsPlaying(false);
    setGraph((prev) => ({
      ...prev,
      directed: !prev.directed,
    }));
    showNotification(
      `Switched graph mode to ${!graph.directed ? 'Directed (arrows)' : 'Undirected (bidirectional)'}`,
      'info'
    );
  };

  const handleLoadExample = (exampleItem: ExampleGraphItem) => {
    setIsPlaying(false);
    setGraph(JSON.parse(JSON.stringify(exampleItem.graph)));
    setStartNodeId(exampleItem.recommendedStartId);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setConnectSourceId(null);
    showNotification(`Loaded example: "${exampleItem.name}"`, 'success');
  };

  // Keyboard shortcut listener for Backspace/Delete to delete selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        (selectedNodeId || selectedEdgeId) &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const isCompleted = steps.length > 0 && currentStepIndex === steps.length - 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header />

      {/* Hero / Introduction */}
      <Introduction />

      {/* Main Visualizer Container */}
      <main id="visualizer" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Editor Toolbar */}
        <GraphEditorToolbar
          editorMode={editorMode}
          onToggleMode={handleToggleMode}
          onAddNode={() => handleAddNode()}
          onDeleteSelected={handleDeleteSelected}
          hasSelection={Boolean(selectedNodeId || selectedEdgeId)}
          selectionType={selectedNodeId ? 'node' : selectedEdgeId ? 'edge' : null}
          onClearGraph={handleClearGraph}
          isDirected={graph.directed}
          onToggleDirected={handleToggleDirected}
          onLoadExample={handleLoadExample}
          isTraversing={isPlaying}
        />

        {/* Workspace: 2-Column Desktop Grid / 1-Column Mobile Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* Left Column: Graph Canvas (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <GraphCanvas
              graph={graph}
              currentStep={currentStep}
              startNodeId={startNodeId}
              selectedNodeId={selectedNodeId}
              selectedEdgeId={selectedEdgeId}
              editorMode={editorMode}
              connectSourceId={connectSourceId}
              onSelectNode={handleSelectNode}
              onSelectEdge={handleSelectEdge}
              onNodeMove={handleNodeMove}
              onConnectNodes={handleConnectNodes}
              onCanvasDoubleClick={(x, y) => handleAddNode(x, y)}
              onNotify={(msg, type) => showNotification(msg, type)}
            />

            {/* Traversal Controls directly underneath graph */}
            <AlgorithmControls
              algorithm={algorithm}
              onSelectAlgorithm={(algo) => {
                setAlgorithm(algo);
                showNotification(`Switched algorithm to ${algo}`, 'info');
              }}
              startNodeId={startNodeId}
              onSelectStartNode={(id) => {
                setStartNodeId(id);
                const node = graph.nodes.find((n) => n.id === id);
                showNotification(`Start vertex set to "${node?.label}"`, 'info');
              }}
              nodes={graph.nodes}
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onTogglePlay={handleTogglePlay}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onReset={handleResetPlayback}
              onChangeSpeed={(s) => setSpeed(s)}
              hasTrace={steps.length > 0}
            />
          </div>

          {/* Right Column: Live Algorithm State Panel (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <AlgorithmStatePanel
              algorithm={algorithm}
              currentStep={currentStep}
              nodes={graph.nodes}
            />
          </div>
        </div>

        {/* Traversal Results Card (when completed) */}
        {isCompleted && traversalResult && (
          <TraversalResults
            result={traversalResult}
            nodes={graph.nodes}
            onReset={handleResetPlayback}
            onSwitchAlgorithm={() => {
              setAlgorithm(algorithm === 'BFS' ? 'DFS' : 'BFS');
            }}
          />
        )}

        {/* Complexity Analysis Section */}
        <ComplexityCard />

        {/* Educational Learning Guide */}
        <LearningGuide />
      </main>

      {/* Floating Notification Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center space-x-2.5 transition-all animate-bounce-in ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : notification.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-700'
              : notification.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : notification.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
