import React, { useRef, useState, useCallback, useMemo } from 'react';
import { GraphModel, GraphNode, GraphEdge, EditorMode, TraversalStep } from '../types/graph';
import { Star } from 'lucide-react';

interface GraphCanvasProps {
  graph: GraphModel;
  currentStep: TraversalStep | null;
  startNodeId: string;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  editorMode: EditorMode;
  connectSourceId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onSelectEdge: (edgeId: string | null) => void;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onConnectNodes: (sourceId: string, targetId: string) => void;
  onCanvasDoubleClick?: (x: number, y: number) => void;
  onNotify: (message: string, type: 'info' | 'warning' | 'error') => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
const NODE_RADIUS = 24;

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  currentStep,
  startNodeId,
  selectedNodeId,
  selectedEdgeId,
  editorMode,
  connectSourceId,
  onSelectNode,
  onSelectEdge,
  onNodeMove,
  onConnectNodes,
  onCanvasDoubleClick,
  onNotify,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

  // Map of nodes for fast O(1) lookup
  const nodeMap = useMemo(() => {
    return new Map(graph.nodes.map((n) => [n.id, n]));
  }, [graph.nodes]);

  // Convert screen coordinates to SVG viewBox coordinates
  const screenToSVG = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const svg = svgRef.current;
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgPt = pt.matrixTransform(ctm.inverse());
        return {
          x: Math.round(svgPt.x),
          y: Math.round(svgPt.y),
        };
      }
      // Fallback using getBoundingClientRect
      const rect = svg.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      return {
        x: Math.round((clientX - rect.left) * scaleX),
        y: Math.round((clientY - rect.top) * scaleY),
      };
    },
    []
  );

  // Handle pointer down on a node (mouse or touch)
  const handleNodePointerDown = (e: React.PointerEvent<SVGGElement>, node: GraphNode) => {
    e.stopPropagation();
    e.preventDefault();

    if (editorMode === 'connect') {
      if (!connectSourceId) {
        onSelectNode(node.id);
      } else {
        if (connectSourceId === node.id) {
          onNotify('Self-loops are not supported. Connect to a different node.', 'warning');
          return;
        }
        onConnectNodes(connectSourceId, node.id);
      }
      return;
    }

    // Normal select & drag mode
    onSelectNode(node.id);
    onSelectEdge(null);

    const svgCoord = screenToSVG(e.clientX, e.clientY);
    dragOffsetRef.current = {
      offsetX: svgCoord.x - node.x,
      offsetY: svgCoord.y - node.y,
    };
    setDraggingNodeId(node.id);

    // Capture pointer to this element to keep receiving moves even if mouse moves outside
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  // Handle pointer move during drag
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingNodeId) return;
    const svgCoord = screenToSVG(e.clientX, e.clientY);
    const newX = Math.max(NODE_RADIUS + 10, Math.min(CANVAS_WIDTH - NODE_RADIUS - 10, svgCoord.x - dragOffsetRef.current.offsetX));
    const newY = Math.max(NODE_RADIUS + 10, Math.min(CANVAS_HEIGHT - NODE_RADIUS - 10, svgCoord.y - dragOffsetRef.current.offsetY));
    onNodeMove(draggingNodeId, newX, newY);
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
    }
  };

  // Handle canvas background click
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only deselect if clicked directly on the svg background
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      onSelectNode(null);
      onSelectEdge(null);
    }
  };

  // Handle canvas double click to add node
  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (onCanvasDoubleClick) {
      const coord = screenToSVG(e.clientX, e.clientY);
      onCanvasDoubleClick(coord.x, coord.y);
    }
  };

  // Check state of a node in current traversal step
  const getNodeVisualState = (nodeId: string) => {
    if (!currentStep) {
      return {
        isCurrent: false,
        isVisited: false,
        isFrontier: false,
      };
    }
    const isCurrent = currentStep.currentNode === nodeId;
    const isVisited = currentStep.visited.includes(nodeId);
    const isFrontier = currentStep.frontier.includes(nodeId);

    return { isCurrent, isVisited, isFrontier };
  };

  // Detect bidirectional edges in directed graphs to apply subtle curve
  const edgeDirectionPairs = useMemo(() => {
    const set = new Set<string>();
    if (!graph.directed) return set;
    for (const e of graph.edges) {
      const rev = `${e.target}->${e.source}`;
      if (graph.edges.some((other) => other.source === e.target && other.target === e.source)) {
        set.add(`${e.source}->${e.target}`);
      }
    }
    return set;
  }, [graph.edges, graph.directed]);

  return (
    <div className="relative w-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Canvas Top Bar / Mode Indicator */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700">Workspace Canvas</span>
          <span className="text-slate-400">|</span>
          <span>{graph.nodes.length} Vertices, {graph.edges.length} Edges</span>
          <span className="text-slate-400">|</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-slate-200/70 text-slate-700">
            {graph.directed ? 'Directed (→)' : 'Undirected (—)'}
          </span>
        </div>

        {editorMode === 'connect' && (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>
              {connectSourceId
                ? `Selected "${nodeMap.get(connectSourceId)?.label}": Click target node to connect`
                : 'Click any node to start edge'}
            </span>
          </div>
        )}
      </div>

      {/* Main SVG Area */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] min-h-[300px] max-h-[580px] bg-slate-50/50">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full select-none touch-none cursor-default"
          onClick={handleCanvasClick}
          onDoubleClick={handleDoubleClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          aria-label="Interactive Graph Canvas"
          role="region"
        >
          {/* SVG Definitions for Arrowheads */}
          <defs>
            {/* Standard edge marker */}
            <marker
              id="arrowhead-neutral"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#94A3B8" />
            </marker>

            {/* Traversal active marker */}
            <marker
              id="arrowhead-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#4F46E5" />
            </marker>

            {/* Tree marker */}
            <marker
              id="arrowhead-tree"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#10B981" />
            </marker>

            {/* Selected marker */}
            <marker
              id="arrowhead-selected"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#EF4444" />
            </marker>
          </defs>

          {/* Grid pattern for subtle SaaS design */}
          <g opacity="0.4" pointerEvents="none">
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={(i + 1) * 50}
                x2={CANVAS_WIDTH}
                y2={(i + 1) * 50}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={(i + 1) * 50}
                y1="0"
                x2={(i + 1) * 50}
                y2={CANVAS_HEIGHT}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
              />
            ))}
          </g>

          {/* Render Edges */}
          <g className="edges-group">
            {graph.edges.map((edge) => {
              const sourceNode = nodeMap.get(edge.source);
              const targetNode = nodeMap.get(edge.target);
              if (!sourceNode || !targetNode) return null;

              const isSelected = selectedEdgeId === edge.id;
              const isActiveEdge = currentStep?.activeEdgeId === edge.id;
              const isTreeEdge = currentStep?.treeEdges?.includes(edge.id);

              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const dist = Math.hypot(dx, dy) || 1;
              const ux = dx / dist;
              const uy = dy / dist;

              // Node radius offsets
              const startX = sourceNode.x + ux * NODE_RADIUS;
              const startY = sourceNode.y + uy * NODE_RADIUS;
              // Stop exactly at target radius + slight padding for arrowhead
              const endX = targetNode.x - ux * (NODE_RADIUS + (graph.directed ? 6 : 0));
              const endY = targetNode.y - uy * (NODE_RADIUS + (graph.directed ? 6 : 0));

              // If bidirectional directed edge, apply curvature so opposing arrows don't collide
              const isBidirectional = graph.directed && edgeDirectionPairs.has(`${edge.source}->${edge.target}`);

              let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
              if (isBidirectional) {
                // Perpendicular offset for curved arc
                const perpX = -uy * 28;
                const perpY = ux * 28;
                const midX = (startX + endX) / 2 + perpX;
                const midY = (startY + endY) / 2 + perpY;
                pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
              }

              // Marker assignment
              let markerEnd = '';
              if (graph.directed) {
                if (isActiveEdge) markerEnd = 'url(#arrowhead-active)';
                else if (isSelected) markerEnd = 'url(#arrowhead-selected)';
                else if (isTreeEdge) markerEnd = 'url(#arrowhead-tree)';
                else markerEnd = 'url(#arrowhead-neutral)';
              }

              // Edge color & thickness
              let strokeColor = '#CBD5E1';
              let strokeWidth = 2.2;

              if (isActiveEdge) {
                strokeColor = '#4F46E5';
                strokeWidth = 4;
              } else if (isSelected) {
                strokeColor = '#EF4444';
                strokeWidth = 3.5;
              } else if (isTreeEdge) {
                strokeColor = '#10B981';
                strokeWidth = 3;
              }

              return (
                <g
                  key={edge.id}
                  className="edge-element cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEdge(edge.id);
                    onSelectNode(null);
                  }}
                >
                  {/* Invisible thicker stroke to make clicking easy */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={16}
                    className="cursor-pointer"
                  />
                  {/* Visible edge line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    markerEnd={markerEnd}
                    className="transition-colors duration-200"
                  />
                </g>
              );
            })}
          </g>

          {/* Render Nodes */}
          <g className="nodes-group">
            {graph.nodes.map((node) => {
              const { isCurrent, isVisited, isFrontier } = getNodeVisualState(node.id);
              const isSelected = selectedNodeId === node.id;
              const isConnectSource = connectSourceId === node.id;
              const isStart = startNodeId === node.id;

              // Color styles based on algorithm state
              let fillColor = '#FFFFFF';
              let strokeColor = '#94A3B8';
              let textColor = '#0F172A';

              if (isCurrent) {
                fillColor = '#FEF3C7'; // Amber-100
                strokeColor = '#F59E0B'; // Amber-500
                textColor = '#92400E';
              } else if (isVisited) {
                fillColor = '#DCFCE7'; // Emerald-100
                strokeColor = '#16A34A'; // Emerald-600
                textColor = '#166534';
              } else if (isFrontier) {
                fillColor = '#E0F2FE'; // Sky-100
                strokeColor = '#0284C7'; // Sky-600
                textColor = '#0369A1';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="node-element cursor-grab active:cursor-grabbing transition-transform duration-75"
                  onPointerDown={(e) => handleNodePointerDown(e, node)}
                >
                  {/* Current Node Pulsing Outer Ring */}
                  {isCurrent && (
                    <circle
                      r={NODE_RADIUS + 8}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Connect Mode Selected Source Ring */}
                  {isConnectSource && (
                    <circle
                      r={NODE_RADIUS + 7}
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="animate-spin origin-center"
                    />
                  )}

                  {/* Selected Node Ring */}
                  {isSelected && (
                    <circle
                      r={NODE_RADIUS + 5}
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={NODE_RADIUS}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected || isCurrent ? 3 : 2.2}
                    className="transition-colors duration-200 shadow-sm"
                  />

                  {/* Node Label Text */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                    className="pointer-events-none select-none"
                  >
                    {node.label}
                  </text>

                  {/* Start Node Indicator Star Badge */}
                  {isStart && (
                    <g transform={`translate(${NODE_RADIUS - 8}, ${-NODE_RADIUS + 6})`}>
                      <circle r="7.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontWeight="800"
                        className="pointer-events-none"
                      >
                        S
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Empty Graph Overlay Message */}
        {graph.nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/80 backdrop-blur-xs">
            <p className="font-semibold text-slate-800 text-base">The graph is currently empty</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Click &quot;Add Node&quot; in the toolbar above, load an example graph, or double-click anywhere on the canvas to place vertices.
            </p>
          </div>
        )}
      </div>

      {/* Visual State Legend */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700">Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-400"></span>
            <span className="text-slate-600">Unvisited</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-100 border-2 border-sky-600"></span>
            <span className="text-slate-600">Frontier / Queue</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-100 border-2 border-amber-500 ring-2 ring-amber-300"></span>
            <span className="text-slate-600">Current Node</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 border-2 border-emerald-600"></span>
            <span className="text-slate-600">Visited</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-1 bg-emerald-500 rounded"></span>
            <span className="text-slate-600">Tree Edge</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <span className="hidden sm:inline">Tip: Drag nodes to position • Double-click empty canvas to add</span>
        </div>
      </div>
    </div>
  );
};
