/**
 * GraphVista - Graph Model and Traversal Types
 */

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

export type TraversalAlgorithm = 'BFS' | 'DFS';

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;

export type StepActionType =
  | 'INITIALIZE'
  | 'START'
  | 'VISIT_NODE'
  | 'DISCOVER_NEIGHBOR'
  | 'PROCESS_NEIGHBOR'
  | 'ALREADY_VISITED'
  | 'BACKTRACK'
  | 'QUEUE_POP'
  | 'STACK_POP'
  | 'COMPLETE';

export interface TraversalStep {
  index: number;
  action: StepActionType;
  currentNode: string | null;
  activeEdgeId: string | null;
  /** Nodes that have been fully visited/processed */
  visited: string[];
  /** Nodes currently in queue (BFS) or stack (DFS) */
  frontier: string[];
  /** Sequence in which nodes were visited */
  traversalOrder: string[];
  /** Human-readable explanation of this specific algorithmic step */
  description: string;
  /** Additional academic / algorithmic detail */
  detail?: string;
  /** Edge IDs that form the spanning/discovery tree so far */
  treeEdges: string[];
  /** Information specifically for DFS backtracking */
  backtrackingFrom?: string;
  backtrackingTo?: string;
}

export interface TraversalResult {
  algorithm: TraversalAlgorithm;
  startNode: string;
  traversalOrder: string[];
  visitedNodes: string[];
  unreachableNodes: string[];
  totalNodes: number;
  visitedCount: number;
  stepCount: number;
  isComplete: boolean;
}

export type EditorMode = 'select' | 'connect';
