import { Graph } from 'core/base/construction/data/graph/Graph';
import { Tree } from 'core/base/construction/data/tree/Tree';

/**
 * Core data structures tests: Graph and Tree
 */

describe('Graph', () => {
  test('constructs from map and reports completeness', () => {
    const map = new Map<string, string[]>([
      ['A', ['B', 'C']],
      ['B', ['A', 'D']],
      ['C', ['A']],
      ['D', ['B']],
    ]);

    const graph = new Graph<string>(map);

    expect(graph.isComplete).toBe(true);
    expect(graph.isBinded('A', 'B')).toBe(true);
    expect(graph.isBinded('B', 'A')).toBe(true);
    expect(graph.isBinded('A', 'D')).toBe(false);
  });

  test('add creates symmetric connections and skips duplicates/self', () => {
    const graph = new Graph<string>();

    graph.add('X', ['Y', 'Z', 'X']);
    graph.add('X', ['Y']); // duplicate should be ignored

    expect(graph.isBinded('X', 'Y')).toBe(true);
    expect(graph.isBinded('Y', 'X')).toBe(true);
    expect(graph.isBinded('X', 'Z')).toBe(true);
    expect(graph.isBinded('Z', 'X')).toBe(true);
  });

  test('remove prunes node and references, removeAll clears graph', () => {
    const map = new Map<string, string[]>([
      ['A', ['B']],
      ['B', ['A', 'C']],
      ['C', ['B']],
    ]);
    const graph = new Graph<string>(map);

    graph.remove('B');

    expect(graph.isBinded('A', 'B')).toBe(false);
    expect(graph.isBinded('C', 'B')).toBe(false);
    expect(graph.isComplete).toBe(true);

    graph.removeAll();
    expect(graph.nodes.size).toBe(0);
  });
});

describe('Tree', () => {
  test('creates root and adds children', () => {
    const tree = new Tree<string>('root');
    tree.addChild('root', 'A');
    tree.addChildren('A', ['B', 'C']);

    expect(tree.root).toBe('root');
    expect(tree.getParent('A')).toBe('root');
    expect(tree.getChildren('A')).toEqual(expect.arrayContaining(['B', 'C']));
    expect(tree.isAncestor('root', 'C')).toBe(true);
    expect(tree.isDescendant('C', 'root')).toBe(true);
  });

  test('reparents child and prevents cycles', () => {
    const tree = new Tree<string>('root');
    tree.addChildren('root', ['A', 'B']);
    tree.addChild('A', 'C');

    // reparent C under B
    tree.addChild('B', 'C');
    expect(tree.getParent('C')).toBe('B');
    expect(tree.getChildren('A')).not.toContain('C');

    expect(() => tree.addChild('C', 'root')).toThrow();
  });

  test('pathToRoot and remove subtree', () => {
    const tree = new Tree<string>('root');
    tree.addChild('root', 'A');
    tree.addChild('A', 'B');
    tree.addChild('B', 'C');

    expect(tree.pathToRoot('C')).toEqual(['C', 'B', 'A', 'root']);

    tree.remove('B');
    expect(tree.getParent('B')).toBeUndefined();
    expect(tree.getParent('C')).toBeUndefined();
    expect(tree.getChildren('A')).toHaveLength(0);

    tree.removeAll();
    expect(tree.root).toBeUndefined();
  });
});
