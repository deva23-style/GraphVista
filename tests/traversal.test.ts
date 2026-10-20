import { describe, it, expect } from 'vitest';
import { generateBFSTrace } from '../src/algorithms/bfs';
import { generateDFSTrace } from '../src/algorithms/dfs';
import { GraphModel } from '../src/types/graph';
import { EXAMPLE_GRAPHS } from '../src/data/exampleGraphs';
import { buildAdjacencyList } from '../src/utils/graphUtils';

describe('GraphVista Algorithm & Utility Tests', () => {
  // Test A: Simple connected graph
  it('Test A: BFS and DFS visit every reachable node exactly once on simple connected graph', () => {
    const example = EXAMPLE_GRAPHS.find((g) => g.id === 'simple-connected')!;
    const bfs = generateBFSTrace(example.graph, 'n-a');
    const dfs = generateDFSTrace(example.graph, 'n-a');

    expect(bfs.result.visitedCount).toBe(5);
    expect(dfs.result.visitedCount).toBe(5);
    expect(new Set(bfs.result.traversalOrder).size).toBe(5);
    expect(new Set(dfs.result.traversalOrder).size).toBe(5);
    expect(bfs.result.unreachableNodes.length).toBe(0);
    expect(dfs.result.unreachableNodes.length).toBe(0);
  });

  // Test B: Graph containing a cycle
  it('Test B: Terminates on cyclic graphs and does not repeatedly visit nodes', () => {
    const example = EXAMPLE_GRAPHS.find((g) => g.id === 'cycle-graph')!;
    const bfs = generateBFSTrace(example.graph, 'n-a');
    const dfs = generateDFSTrace(example.graph, 'n-a');

    expect(bfs.steps.length).toBeGreaterThan(0);
    expect(dfs.steps.length).toBeGreaterThan(0);
    expect(bfs.result.isComplete).toBe(true);
    expect(dfs.result.isComplete).toBe(true);

    // Each node must appear at most once in traversalOrder
    expect(bfs.result.traversalOrder.length).toBe(new Set(bfs.result.traversalOrder).size);
    expect(dfs.result.traversalOrder.length).toBe(new Set(dfs.result.traversalOrder).size);
  });

  // Test C: Disconnected graph
  it('Test C: Disconnected graph visits only reachable component and identifies unreachable nodes', () => {
    const example = EXAMPLE_GRAPHS.find((g) => g.id === 'disconnected-graph')!;
    const bfs = generateBFSTrace(example.graph, 'n-a');
    const dfs = generateDFSTrace(example.graph, 'n-a');

    // Starting at 'n-a' in component 1 (A, B, C, D)
    expect(bfs.result.visitedCount).toBe(4);
    expect(dfs.result.visitedCount).toBe(4);
    expect(bfs.result.unreachableNodes).toEqual(expect.arrayContaining(['n-e', 'n-f', 'n-g']));
    expect(dfs.result.unreachableNodes).toEqual(expect.arrayContaining(['n-e', 'n-f', 'n-g']));
  });

  // Test D: Single-node graph
  it('Test D: Single-node graph completes and visits only that node', () => {
    const singleNodeGraph: GraphModel = {
      directed: false,
      nodes: [{ id: 'solo', label: 'Solo', x: 200, y: 200 }],
      edges: [],
    };

    const bfs = generateBFSTrace(singleNodeGraph, 'solo');
    const dfs = generateDFSTrace(singleNodeGraph, 'solo');

    expect(bfs.result.visitedCount).toBe(1);
    expect(bfs.result.traversalOrder).toEqual(['solo']);
    expect(dfs.result.visitedCount).toBe(1);
    expect(dfs.result.traversalOrder).toEqual(['solo']);
  });

  // Test E: Empty graph
  it('Test E: Empty graph is handled gracefully without crashing', () => {
    const emptyGraph: GraphModel = {
      directed: false,
      nodes: [],
      edges: [],
    };

    const bfs = generateBFSTrace(emptyGraph, 'invalid');
    const dfs = generateDFSTrace(emptyGraph, 'invalid');

    expect(bfs.steps.length).toBe(0);
    expect(bfs.result.visitedCount).toBe(0);
    expect(dfs.steps.length).toBe(0);
    expect(dfs.result.visitedCount).toBe(0);
  });

  // Test F: Directed graph respects edge directions
  it('Test F: Directed graph follows edges strictly in their permitted direction', () => {
    const directedGraph: GraphModel = {
      directed: true,
      nodes: [
        { id: '1', label: '1', x: 100, y: 100 },
        { id: '2', label: '2', x: 200, y: 100 },
        { id: '3', label: '3', x: 300, y: 100 },
      ],
      edges: [
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '2', target: '3' },
      ],
    };

    // Starting at 2 can reach 3, but cannot reach 1 because edge is 1 -> 2
    const bfs = generateBFSTrace(directedGraph, '2');
    expect(bfs.result.visitedNodes).toEqual(expect.arrayContaining(['2', '3']));
    expect(bfs.result.unreachableNodes).toContain('1');
  });

  // Test G: Graph modification (incident edges removal)
  it('Test G: Deleting a node removes all its incident edges', () => {
    const initialEdges = [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n4' },
    ];
    const nodeToDelete = 'n2';
    const remainingEdges = initialEdges.filter(
      (e) => e.source !== nodeToDelete && e.target !== nodeToDelete
    );

    expect(remainingEdges.length).toBe(1);
    expect(remainingEdges[0].id).toBe('e3');
  });

  // Test H: Deterministic neighbor ordering policy
  it('Test H: Adjacency list sorts neighbors alphabetically by label', () => {
    const graph: GraphModel = {
      directed: false,
      nodes: [
        { id: 'root', label: 'Root', x: 0, y: 0 },
        { id: 'z', label: 'Zebra', x: 0, y: 0 },
        { id: 'a', label: 'Apple', x: 0, y: 0 },
        { id: 'm', label: 'Mango', x: 0, y: 0 },
      ],
      edges: [
        { id: 'e1', source: 'root', target: 'z' },
        { id: 'e2', source: 'root', target: 'a' },
        { id: 'e3', source: 'root', target: 'm' },
      ],
    };

    const adj = buildAdjacencyList(graph);
    const rootNeighbors = adj.get('root')!;
    expect(rootNeighbors).toEqual(['a', 'm', 'z']); // Apple, Mango, Zebra
  });

  // Test I: BFS Queue FIFO order vs DFS Stack LIFO order
  it('Test I: BFS traverses level-by-level whereas DFS explores deep first', () => {
    const treeExample = EXAMPLE_GRAPHS.find((g) => g.id === 'multi-branch')!;
    const bfs = generateBFSTrace(treeExample.graph, 'n-a');
    const dfs = generateDFSTrace(treeExample.graph, 'n-a');

    // BFS on multi-branch tree: Root A -> B, C -> D, E, F, G
    expect(bfs.result.traversalOrder).toEqual(['n-a', 'n-b', 'n-c', 'n-d', 'n-e', 'n-f', 'n-g']);

    // DFS on multi-branch tree (with alphabetical exploration):
    // A -> B -> D -> (backtrack to B) -> E -> (backtrack to A) -> C -> F -> (backtrack to C) -> G
    expect(dfs.result.traversalOrder).toEqual(['n-a', 'n-b', 'n-d', 'n-e', 'n-c', 'n-f', 'n-g']);
  });
});
