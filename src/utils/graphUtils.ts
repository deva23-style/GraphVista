import { GraphModel, GraphNode, GraphEdge } from '../types/graph';

/**
 * Builds an adjacency list from the graph model.
 * Deterministic Neighbor Ordering Policy:
 * Neighbors are sorted alphabetically by their label (case-insensitive),
 * breaking ties using node ID. This ensures fully predictable academic demonstrations.
 */
export function buildAdjacencyList(graph: GraphModel): Map<string, string[]> {
  const nodeMap = new Map<string, GraphNode>();
  for (const node of graph.nodes) {
    nodeMap.set(node.id, node);
  }

  const adj = new Map<string, string[]>();
  for (const node of graph.nodes) {
    adj.set(node.id, []);
  }

  for (const edge of graph.edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
      continue;
    }

    // Add source -> target
    const sourceNeighbors = adj.get(edge.source) || [];
    if (!sourceNeighbors.includes(edge.target)) {
      sourceNeighbors.push(edge.target);
      adj.set(edge.source, sourceNeighbors);
    }

    // If undirected, add target -> source as well
    if (!graph.directed) {
      const targetNeighbors = adj.get(edge.target) || [];
      if (!targetNeighbors.includes(edge.source)) {
        targetNeighbors.push(edge.source);
        adj.set(edge.target, targetNeighbors);
      }
    }
  }

  // Sort neighbors deterministically by label
  for (const [nodeId, neighbors] of adj.entries()) {
    neighbors.sort((aId, bId) => {
      const nodeA = nodeMap.get(aId);
      const nodeB = nodeMap.get(bId);
      const labelA = nodeA?.label || aId;
      const labelB = nodeB?.label || bId;
      const comp = labelA.localeCompare(labelB, undefined, { sensitivity: 'base' });
      if (comp !== 0) return comp;
      return aId.localeCompare(bId);
    });
  }

  return adj;
}

/**
 * Finds an edge ID connecting node `u` and node `v`.
 */
export function findEdgeId(
  edges: GraphEdge[],
  u: string,
  v: string,
  directed: boolean
): string | null {
  for (const edge of edges) {
    if (edge.source === u && edge.target === v) {
      return edge.id;
    }
    if (!directed && edge.source === v && edge.target === u) {
      return edge.id;
    }
  }
  return null;
}

/**
 * Generates the next recommended node label (A, B, C... Z, AA, AB...)
 */
export function getNextNodeLabel(existingNodes: GraphNode[]): string {
  const existingLabels = new Set(existingNodes.map((n) => n.label.trim().toUpperCase()));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < letters.length; i++) {
    const candidate = letters[i];
    if (!existingLabels.has(candidate)) {
      return candidate;
    }
  }

  // Try 2-letter combos
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters.length; j++) {
      const candidate = `${letters[i]}${letters[j]}`;
      if (!existingLabels.has(candidate)) {
        return candidate;
      }
    }
  }

  return `N${existingNodes.length + 1}`;
}

/**
 * Suggests an initial position for a newly added node so it doesn't overlap existing nodes.
 */
export function getSmartNewNodePosition(
  nodes: GraphNode[],
  canvasWidth = 750,
  canvasHeight = 440
): { x: number; y: number } {
  if (nodes.length === 0) {
    return { x: Math.round(canvasWidth / 2), y: Math.round(canvasHeight / 2) };
  }

  const margin = 50;
  const paddingX = canvasWidth - margin * 2;
  const paddingY = canvasHeight - margin * 2;

  // Attempt to find a location that is far from existing nodes
  let bestX = Math.round(canvasWidth / 2);
  let bestY = Math.round(canvasHeight / 2);
  let maxMinDistance = -1;

  for (let attempt = 0; attempt < 25; attempt++) {
    const candX = margin + Math.floor(Math.random() * paddingX);
    const candY = margin + Math.floor(Math.random() * paddingY);

    let minDist = Infinity;
    for (const node of nodes) {
      const dist = Math.hypot(node.x - candX, node.y - candY);
      if (dist < minDist) {
        minDist = dist;
      }
    }

    if (minDist > maxMinDistance) {
      maxMinDistance = minDist;
      bestX = candX;
      bestY = candY;
    }
  }

  return { x: bestX, y: bestY };
}
