import { GraphModel } from '../types/graph';

export interface ExampleGraphItem {
  id: string;
  name: string;
  description: string;
  graph: GraphModel;
  recommendedStartId: string;
}

export const EXAMPLE_GRAPHS: ExampleGraphItem[] = [
  {
    id: 'simple-connected',
    name: '1. Simple Connected Graph',
    description: 'A 5-node connected graph showing fundamental level-by-level (BFS) vs branch exploration (DFS).',
    recommendedStartId: 'n-a',
    graph: {
      directed: false,
      nodes: [
        { id: 'n-a', label: 'A', x: 380, y: 70 },
        { id: 'n-b', label: 'B', x: 230, y: 190 },
        { id: 'n-c', label: 'C', x: 530, y: 190 },
        { id: 'n-d', label: 'D', x: 180, y: 340 },
        { id: 'n-e', label: 'E', x: 340, y: 340 },
      ],
      edges: [
        { id: 'e-ab', source: 'n-a', target: 'n-b' },
        { id: 'e-ac', source: 'n-a', target: 'n-c' },
        { id: 'e-bd', source: 'n-b', target: 'n-d' },
        { id: 'e-be', source: 'n-b', target: 'n-e' },
        { id: 'e-ce', source: 'n-c', target: 'n-e' },
      ],
    },
  },
  {
    id: 'multi-branch',
    name: '2. Multi-Branch Tree',
    description: 'Hierarchical tree structure with multiple branches highlighting BFS breadth queue vs DFS deep stack progression.',
    recommendedStartId: 'n-a',
    graph: {
      directed: false,
      nodes: [
        { id: 'n-a', label: 'A', x: 380, y: 60 },
        { id: 'n-b', label: 'B', x: 200, y: 180 },
        { id: 'n-c', label: 'C', x: 560, y: 180 },
        { id: 'n-d', label: 'D', x: 120, y: 330 },
        { id: 'n-e', label: 'E', x: 280, y: 330 },
        { id: 'n-f', label: 'F', x: 480, y: 330 },
        { id: 'n-g', label: 'G', x: 640, y: 330 },
      ],
      edges: [
        { id: 'e-ab', source: 'n-a', target: 'n-b' },
        { id: 'e-ac', source: 'n-a', target: 'n-c' },
        { id: 'e-bd', source: 'n-b', target: 'n-d' },
        { id: 'e-be', source: 'n-b', target: 'n-e' },
        { id: 'e-cf', source: 'n-c', target: 'n-f' },
        { id: 'e-cg', source: 'n-c', target: 'n-g' },
      ],
    },
  },
  {
    id: 'cycle-graph',
    name: '3. Graph with Cycles',
    description: 'A cyclic graph with cross-links demonstrating cycle detection and preventing infinite loops.',
    recommendedStartId: 'n-a',
    graph: {
      directed: false,
      nodes: [
        { id: 'n-a', label: 'A', x: 380, y: 70 },
        { id: 'n-b', label: 'B', x: 190, y: 180 },
        { id: 'n-c', label: 'C', x: 570, y: 180 },
        { id: 'n-d', label: 'D', x: 260, y: 340 },
        { id: 'n-e', label: 'E', x: 500, y: 340 },
        { id: 'n-f', label: 'F', x: 380, y: 230 },
      ],
      edges: [
        { id: 'e-ab', source: 'n-a', target: 'n-b' },
        { id: 'e-ac', source: 'n-a', target: 'n-c' },
        { id: 'e-bd', source: 'n-b', target: 'n-d' },
        { id: 'e-de', source: 'n-d', target: 'n-e' },
        { id: 'e-ec', source: 'n-e', target: 'n-c' },
        { id: 'e-bf', source: 'n-b', target: 'n-f' },
        { id: 'e-fc', source: 'n-f', target: 'n-c' },
      ],
    },
  },
  {
    id: 'disconnected-graph',
    name: '4. Disconnected Graph',
    description: 'Two separate components (A-B-C-D and E-F-G). Shows that standard traversal only reaches connected vertices.',
    recommendedStartId: 'n-a',
    graph: {
      directed: false,
      nodes: [
        // Component 1
        { id: 'n-a', label: 'A', x: 200, y: 100 },
        { id: 'n-b', label: 'B', x: 100, y: 250 },
        { id: 'n-c', label: 'C', x: 300, y: 250 },
        { id: 'n-d', label: 'D', x: 200, y: 360 },
        // Component 2 (Isolated)
        { id: 'n-e', label: 'E', x: 580, y: 100 },
        { id: 'n-f', label: 'F', x: 490, y: 280 },
        { id: 'n-g', label: 'G', x: 670, y: 280 },
      ],
      edges: [
        // Component 1 edges
        { id: 'e-ab', source: 'n-a', target: 'n-b' },
        { id: 'e-ac', source: 'n-a', target: 'n-c' },
        { id: 'e-bd', source: 'n-b', target: 'n-d' },
        { id: 'e-cd', source: 'n-c', target: 'n-d' },
        // Component 2 edges
        { id: 'e-ef', source: 'n-e', target: 'n-f' },
        { id: 'e-eg', source: 'n-e', target: 'n-g' },
        { id: 'e-fg', source: 'n-f', target: 'n-g' },
      ],
    },
  },
  {
    id: 'directed-graph',
    name: '5. Directed Graph (DAG)',
    description: 'Directed graph with arrowheads. Edges can only be traversed along their designated direction.',
    recommendedStartId: 'n-a',
    graph: {
      directed: true,
      nodes: [
        { id: 'n-a', label: 'A', x: 140, y: 210 },
        { id: 'n-b', label: 'B', x: 320, y: 90 },
        { id: 'n-c', label: 'C', x: 320, y: 320 },
        { id: 'n-d', label: 'D', x: 490, y: 90 },
        { id: 'n-e', label: 'E', x: 490, y: 320 },
        { id: 'n-f', label: 'F', x: 660, y: 210 },
      ],
      edges: [
        { id: 'e-ab', source: 'n-a', target: 'n-b' },
        { id: 'e-ac', source: 'n-a', target: 'n-c' },
        { id: 'e-bd', source: 'n-b', target: 'n-d' },
        { id: 'e-bc', source: 'n-b', target: 'n-c' },
        { id: 'e-ce', source: 'n-c', target: 'n-e' },
        { id: 'e-df', source: 'n-d', target: 'n-f' },
        { id: 'e-ef', source: 'n-e', target: 'n-f' },
      ],
    },
  },
  {
    id: 'star-graph',
    name: '6. Star & Hub Graph',
    description: 'Hub node connected to multiple satellites, contrasting BFS immediate fan-out vs DFS deep branch visit.',
    recommendedStartId: 'n-center',
    graph: {
      directed: false,
      nodes: [
        { id: 'n-center', label: 'Hub', x: 380, y: 210 },
        { id: 'n-a', label: 'A', x: 380, y: 60 },
        { id: 'n-b', label: 'B', x: 560, y: 130 },
        { id: 'n-c', label: 'C', x: 530, y: 330 },
        { id: 'n-d', label: 'D', x: 230, y: 330 },
        { id: 'n-e', label: 'E', x: 200, y: 130 },
      ],
      edges: [
        { id: 'e-ha', source: 'n-center', target: 'n-a' },
        { id: 'e-hb', source: 'n-center', target: 'n-b' },
        { id: 'e-hc', source: 'n-center', target: 'n-c' },
        { id: 'e-hd', source: 'n-center', target: 'n-d' },
        { id: 'e-he', source: 'n-center', target: 'n-e' },
        { id: 'e-ab', source: 'n-a', target: 'n-b' },
        { id: 'e-cd', source: 'n-c', target: 'n-d' },
      ],
    },
  },
];
