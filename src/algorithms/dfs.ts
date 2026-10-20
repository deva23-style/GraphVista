import { GraphModel, TraversalStep, TraversalResult } from '../types/graph';
import { buildAdjacencyList, findEdgeId } from '../utils/graphUtils';

/**
 * Computes the complete deterministic step-by-step execution trace for Depth-First Search (DFS).
 *
 * Deterministic Algorithm Specification:
 * - Data structure: Explicit LIFO Stack (representing the recursion call stack).
 * - Neighbor ordering policy: Alphabetical by label.
 * - Stack push order: To explore neighbors in alphabetical order (e.g., node 'A' before 'B'),
 *   unvisited neighbors are pushed onto the stack in REVERSE alphabetical order, ensuring that
 *   the alphabetically first neighbor resides at the top of the stack and is popped next.
 * - Marking policy: Nodes are officially marked visited when popped from the stack and
 *   processed for expansion.
 * - Backtracking: Explicitly recorded when returning to earlier stack frames after a dead-end
 *   or when all adjacent branches have been fully explored.
 */
export function generateDFSTrace(
  graph: GraphModel,
  startNodeId: string
): { steps: TraversalStep[]; result: TraversalResult } {
  const steps: TraversalStep[] = [];
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(startNodeId);

  // Fallback for empty or invalid start
  if (!startNode || graph.nodes.length === 0) {
    const emptyResult: TraversalResult = {
      algorithm: 'DFS',
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
  // Stack items: { nodeId: string; parentId: string | null }
  interface StackItem {
    nodeId: string;
    parentId: string | null;
  }

  const stack: StackItem[] = [];
  const visited = new Set<string>();
  const traversalOrder: string[] = [];
  const treeEdges: string[] = [];

  let stepIndex = 0;
  let previousVisitedNodeId: string | null = null;

  // Step 0: Initial State & Push Start Node
  stack.push({ nodeId: startNode.id, parentId: null });

  steps.push({
    index: stepIndex++,
    action: 'START',
    currentNode: startNode.id,
    activeEdgeId: null,
    visited: Array.from(visited),
    frontier: stack.map((s) => s.nodeId),
    traversalOrder: [...traversalOrder],
    treeEdges: [...treeEdges],
    description: `DFS begins at start node "${startNode.label}". It is pushed onto the call stack.`,
    detail: `Stack initialized: [${startNode.label}]. DFS uses a LIFO stack to explore deep branches before backtracking.`,
  });

  // Main DFS loop
  while (stack.length > 0) {
    const topItem = stack.pop()!;
    const currentId = topItem.nodeId;
    const currentNode = nodeMap.get(currentId)!;
    const parentId = topItem.parentId;

    // Check if already visited (could happen with multiple pushes in cyclic/dense graphs)
    if (visited.has(currentId)) {
      steps.push({
        index: stepIndex++,
        action: 'ALREADY_VISITED',
        currentNode: currentId,
        activeEdgeId: parentId ? findEdgeId(graph.edges, parentId, currentId, graph.directed) : null,
        visited: Array.from(visited),
        frontier: stack.map((s) => s.nodeId),
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        description: `Popped node "${currentNode.label}" from stack, but it was already visited via another path. Discarding.`,
        detail: `Prevents infinite loops and duplicate processing on cyclic paths.`,
      });
      continue;
    }

    // Check for backtracking indicator if we are jumping from a dead-end branch
    if (previousVisitedNodeId && parentId !== previousVisitedNodeId) {
      const prevNode = nodeMap.get(previousVisitedNodeId);
      const parentNode = parentId ? nodeMap.get(parentId) : null;
      steps.push({
        index: stepIndex++,
        action: 'BACKTRACK',
        currentNode: currentId,
        activeEdgeId: null,
        visited: Array.from(visited),
        frontier: stack.map((s) => s.nodeId),
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        backtrackingFrom: previousVisitedNodeId,
        backtrackingTo: parentId || currentId,
        description: `Backtracking: No further unvisited branches from "${prevNode?.label}". Returning to stack frame for "${currentNode.label}".`,
        detail: parentNode
          ? `DFS retreats back up the search tree to branch out from "${parentNode.label}".`
          : `Stack pops next branch to resume exploration.`,
      });
    }

    // Mark current as visited and add to traversalOrder
    visited.add(currentId);
    traversalOrder.push(currentId);
    previousVisitedNodeId = currentId;

    if (parentId) {
      const edgeId = findEdgeId(graph.edges, parentId, currentId, graph.directed);
      if (edgeId && !treeEdges.includes(edgeId)) {
        treeEdges.push(edgeId);
      }
    }

    steps.push({
      index: stepIndex++,
      action: 'STACK_POP',
      currentNode: currentId,
      activeEdgeId: parentId ? findEdgeId(graph.edges, parentId, currentId, graph.directed) : null,
      visited: Array.from(visited),
      frontier: stack.map((s) => s.nodeId),
      traversalOrder: [...traversalOrder],
      treeEdges: [...treeEdges],
      description: `Visiting node "${currentNode.label}". Marked as visited and added to traversal sequence.`,
      detail: `Traversal order: [${traversalOrder.map((id) => nodeMap.get(id)?.label).join(' → ')}]. Next, discovering unvisited neighbors.`,
    });

    const allNeighbors = adj.get(currentId) || [];
    const unvisitedNeighbors = allNeighbors.filter((id) => !visited.has(id));

    if (unvisitedNeighbors.length === 0) {
      steps.push({
        index: stepIndex++,
        action: 'PROCESS_NEIGHBOR',
        currentNode: currentId,
        activeEdgeId: null,
        visited: Array.from(visited),
        frontier: stack.map((s) => s.nodeId),
        traversalOrder: [...traversalOrder],
        treeEdges: [...treeEdges],
        description: `Node "${currentNode.label}" has no remaining unvisited neighbors (dead end / leaf).`,
        detail: `DFS will backtrack to the most recent node on the stack with unexplored neighbors.`,
      });
    } else {
      // To process in alphabetical order (e.g. A then B), push onto stack in REVERSE order
      // so the first alphabetical neighbor sits on top of the stack.
      const reversedNeighbors = [...unvisitedNeighbors].reverse();

      for (const neighborId of reversedNeighbors) {
        const neighborNode = nodeMap.get(neighborId);
        if (!neighborNode) continue;

        stack.push({ nodeId: neighborId, parentId: currentId });
        const edgeId = findEdgeId(graph.edges, currentId, neighborId, graph.directed);

        steps.push({
          index: stepIndex++,
          action: 'DISCOVER_NEIGHBOR',
          currentNode: currentId,
          activeEdgeId: edgeId,
          visited: Array.from(visited),
          frontier: stack.map((s) => s.nodeId),
          traversalOrder: [...traversalOrder],
          treeEdges: [...treeEdges],
          description: `Discovered unvisited neighbor "${neighborNode.label}" from "${currentNode.label}". Pushed to stack.`,
          detail: `Pushed "${neighborNode.label}" onto stack (Stack Top: "${neighborNode.label}").`,
        });
      }
    }
  }

  // Traversal Finished
  const unreachableNodes = graph.nodes
    .filter((n) => !visited.has(n.id))
    .map((n) => n.id);

  const unreachableLabels = unreachableNodes
    .map((id) => nodeMap.get(id)?.label)
    .filter(Boolean);

  let completionDesc = `DFS traversal complete! Visited ${visited.size} of ${graph.nodes.length} nodes.`;
  let completionDetail = `Explored all reachable paths in the component of start node "${startNode.label}". Stack is now empty.`;

  if (unreachableNodes.length > 0) {
    completionDesc += ` (${unreachableNodes.length} node${unreachableNodes.length > 1 ? 's were' : ' was'} unreachable).`;
    completionDetail += ` Unreachable nodes: ${unreachableLabels.join(', ')}. Standard DFS only visits vertices connected by reachable paths from the start.`;
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
    algorithm: 'DFS',
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
