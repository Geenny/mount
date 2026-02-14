/**
 * Graph data structure (Typed)
 *
 * T - Node type
 *
 * @example
 *
 * const map = new Map<string, string[]>();
 * map.set('A', ['B', 'C']);
 * map.set('B', ['A', 'D', 'E']);
 * map.set('C', ['A', 'D']);
 * map.set('D', ['B', 'C', 'E']);
 * map.set('E', ['B']);               // Not fully connected, but 'E' connects to 'B' and 'D'
 *
 * const graph = new Graph<string>(map);
 * console.log('Graph created:', graph);
 *
 * console.log(graph.isBinded( 'A', 'B' )); // true
 * console.log(graph.isBinded( 'A', 'E' )); // false
 * console.log(graph.isBinded( 'E', 'C' )); // false
 * console.log(graph.isBinded( 'E', 'D' )); // true
 *
 * console.log(graph.isComplete); // true
 */
export declare class Graph<T> {
    #private;
    constructor(nodes?: Map<T, T[]>);
    /**
     * Returns internal adjacency map (node -> linked nodes)
     * @return {Map<T, T[]>} nodes map
     */
    get nodes(): Map<T, T[]>;
    /**
     * Checks that every edge points to an existing node
     * @return {boolean} true when all referenced nodes exist
     */
    get isComplete(): boolean;
    /**
     * Checks that every edge is bidirectional (undirected consistency)
     * @return {boolean} true when each edge has a reverse edge
     */
    get isSymmetric(): boolean;
    /**
     * Returns node count
     * @return {number}
     */
    get size(): number;
    /**
     * Returns total edge count (undirected, counted once)
     * @return {number}
     */
    get edgeCount(): number;
    /**
     * Verifies whether there is a direct connection between two nodes
     * @param {T} from - source node
     * @param {T} to - target node
     * @return {boolean} true if nodes are directly connected
     */
    isBinded(from: T, to: T): boolean;
    /**
     * Adds an undirected set of edges from "from" to each node in toList
     * @param {T} from - source node
     * @param {T[]} toList - target nodes to connect
     * @return {void}
     */
    add(from: T, toList: T[]): void;
    /**
     * Adds a single undirected edge
     * @param {T} from
     * @param {T} to
     * @return {void}
     */
    addEdge(from: T, to: T): void;
    /**
     * Bulk-adds multiple nodes and their links from a map
     * @param {Map<T, T[]>} nodes - map of node -> linked nodes
     * @return {void}
     */
    addAll(nodes: Map<T, T[]>): void;
    /**
     * Removes a node and clears all edges pointing to it
     * @param {T} from - node to remove
     * @return {void}
     */
    remove(from: T): void;
    /**
     * Clears the entire graph
     * @return {void}
     */
    removeAll(): void;
    /**
     * Checks presence of node
     * @param {T} node
     * @return {boolean}
     */
    has(node: T): boolean;
    /**
     * Returns neighbors (adjacent nodes) copy
     * @param {T} node
     * @return {T[]}
     */
    neighbors(node: T): T[];
    /**
     * Returns degree (neighbor count) for node
     * @param {T} node
     * @return {number}
     */
    degree(node: T): number;
    /**
     * Removes an undirected edge, keeps nodes intact
     * @param {T} from
     * @param {T} to
     * @return {void}
     */
    removeEdge(from: T, to: T): void;
    /**
     * Returns a cloned adjacency map (deep copy of arrays)
     * @return {Map<T, T[]>}
     */
    toMap(): Map<T, T[]>;
}
