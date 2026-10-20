import { GraphModel, TraversalStep, TraversalResult } from '../types/graph';
import { buildAdjacencyList, findEdgeId } from '../utils/graphUtils';

/**
 * Computes the complete deterministic step-by-step execution trace for Breadth-First Search (BFS).
 *
 * Deterministic Algorithm Specification:
 * - Data structure: FIFO Queue.
 * - Nodes are marked as "discovered" and added to the queue when first encountered.
 * - When dequeued, the node becomes the active "current node" and is added to the permanent traversalOrder.
 * - Outgoing neighbors are examined in alphabetical order by label (case-insensitive).
 * - Avoids infinite loops on cyclic graphs by checking the discovered/visited set before enqueuing.
 */
export function generateBFSTrace(
  graph: GraphModel,
  startNodeId: string
): { steps: TraversalStep[]; result: TraversalResult } {
  const steps: TraversalStep[] = [];
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(startNodeId);

  // Fallback for empty or invalid start
  if (!startNode || graph.nodes.length === 0) {
    const emptyResult: TraversalResult = {
      algorithm: 'BFS',
      startNode: startNodeId || 'None',
      traversalOrder: [],
      visitedNodes: [],
      unreachableNodes: graph.nodes.map((n) => n.id),
      totalNodes: graph.nodes.length,
      visitedCount: 0,
      stepCount: 0,
      isComplete: false,
    };
    return { steps: [], result: emptyResult };
  }

  const adj = buildAdjacencyList(graph);
  const queue: string[] = [];
  const discovered = new Set<string>();
  const visited = new Set<string>();
  const traversalOrder: string[] = [];
  const treeEdges: string[] = [];

  let stepIndex = 0;

  // Step 0: Initial State & Enqueue Start Node
  discovered.add(startNode.id);
  queue.push(startNode.id);

  steps.push({
    index: stepIndex++,
    action: 'START',
    currentNode: startNode.id,
    activeEdgeId: null,
    visited: Array.from(visited),
    frontier: [...queue],
    traversalOrder: [...traversalOrder],
    treeEdges: [...treeEdges],
    description: `BFS begins at start node "${startNode.label}". It is marked as discovered and enqueued.`,
    detail: `Queue initialized: [${startNode.label}]. The queue ensures level-by-level exploration (FIFO).`,
  });

  // Main BFS loop
  while (queue.length > 0) {
    // Pop front of queue
    const currentId = queue.shift()!;
    const currentNode = nodeMap.get(currentId)!;
    visited.add(currentId);
    traversalOrder.push(currentId);

    steps.push({
      index: stepIndex++,
      action: 'QUEUE_POP',
      currentNode: currentId,
      activeEdgeId: null,
      visited: Array.from(visited),
      frontier: [...queue],
      traversalOrder: [...traversalOrder],
      treeEdges: [...treeEdges],
      description: `Dequeued node "${currentNode.label}". It is now visited and added to the traversal order.`,
      detail: `Traversal order is now: [${traversalOrder.map((id) => nodeMap.get(id)?.label).join(' → ')}]. Next, examining all adjacent neighbors.`,
    });

    const neighbors = adj.get(currentId) || [];

    if (neighbors.length === 0) {
      steps.push({
        index: stepIndex++,
        action: 'PROCESS_NEIGHBOR',
        currentNode: currentId,
        activeEdgeId: null,
        visited: Array.from(visited),
        frontier: [...queue],
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        description: `Node "${currentNode.label}" has no outgoing edges/neighbors to explore.`,
        detail: `Proceeding to the next node in the queue.`,
      });
    }

    for (const neighborId of neighbors) {
      const neighborNode = nodeMap.get(neighborId);
      if (!neighborNode) continue;

      const edgeId = findEdgeId(graph.edges, currentId, neighborId, graph.directed);

      if (!discovered.has(neighborId)) {
        // Unvisited neighbor discovered!
        discovered.add(neighborId);
        queue.push(neighborId);
        if (edgeId && !treeEdges.includes(edgeId)) {
          treeEdges.push(edgeId);
        }

        steps.push({
          index: stepIndex++,
          action: 'DISCOVER_NEIGHBOR',
          currentNode: currentId,
          activeEdgeId: edgeId,
          visited: Array.from(visited),
          frontier: [...queue],
          traversalOrder: [...traversalOrder],
          treeEdges: [...treeEdges],
          description: `Discovered unvisited neighbor "${neighborNode.label}" from "${currentNode.label}". Enqueued "${neighborNode.label}".`,
          detail: `Queue is now: [${queue.map((id) => nodeMap.get(id)?.label).join(', ')}]. Edge (${currentNode.label} → ${neighborNode.label}) added to traversal tree.`,
        });
      } else {
        // Already discovered or visited
        steps.push({
          index: stepIndex++,
          action: 'ALREADY_VISITED',
          currentNode: currentId,
          activeEdgeId: edgeId,
          visited: Array.from(visited),
          frontier: [...queue],
          traversalOrder: [...traversalOrder],
          treeEdges: [...treeEdges],
          description: `Examined neighbor "${neighborNode.label}", but it has already been discovered/visited. Skipping.`,
          detail: `Cycle / cross-edge detected. Graph traversal skips already visited nodes to prevent cycles and redundant visits.`,
        });
      }
    }
  }

  // Traversal Completed
  const unreachableNodes = graph.nodes
    .filter((n) => !visited.has(n.id))
    .map((n) => n.id);

  const unreachableLabels = unreachableNodes
    .map((id) => nodeMap.get(id)?.label)
    .filter(Boolean);

  let completionDesc = `BFS traversal complete! Visited ${visited.size} of ${graph.nodes.length} nodes.`;
  let completionDetail = `Explored all reachable vertices in the connected component of start node "${startNode.label}".`;

  if (unreachableNodes.length > 0) {
    completionDesc += ` (${unreachableNodes.length} node${unreachableNodes.length > 1 ? 's were' : ' was'} unreachable).`;
    completionDetail += ` Unreachable nodes: ${unreachableLabels.join(', ')}. Standard BFS visits only the component reachable from the start node.`;
  }

  steps.push({
    index: stepIndex++,
    action: 'COMPLETE',
    currentNode: null,
    activeEdgeId: null,
    visited: Array.from(visited),
    frontier: [],
    traversalOrder: [...traversalOrder],
    treeEdges: [...treeEdges],
    description: completionDesc,
    detail: completionDetail,
  });

  const result: TraversalResult = {
    algorithm: 'BFS',
    startNode: startNode.id,
    traversalOrder: [...traversalOrder],
    visitedNodes: Array.from(visited),
    unreachableNodes,
    totalNodes: graph.nodes.length,
    visitedCount: visited.size,
    stepCount: steps.length,
    isComplete: true,
  };

  return { steps, result };
}
