
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
export class Graph<T> {

    #nodes: Map<T, T[]> = new Map();

    constructor( nodes: Map<T, T[]> = new Map() ) {
        this.addAll( nodes );
    }

    /**
     * Returns internal adjacency map (node -> linked nodes)
     * @return {Map<T, T[]>} nodes map
     */
    get nodes(): Map<T, T[]> { return this.#nodes; }

    /**
     * Checks that every edge points to an existing node
     * @return {boolean} true when all referenced nodes exist
     */
    get isComplete(): boolean {
        for ( const [ from, toList ] of this.#nodes ) {
            for ( const to of toList ) {
                const toNode = this.#nodes.get( to );
                if ( !toNode ) return false;
            }
        }
        return true;
    }

    /**
     * Checks that every edge is bidirectional (undirected consistency)
     * @return {boolean} true when each edge has a reverse edge
     */
    get isSymmetric(): boolean {
        for ( const [ from, toList ] of this.#nodes ) {
            for ( const to of toList ) {
                const toNode = this.#nodes.get( to );
                if ( !toNode || !toNode.includes( from ) ) return false;
            }
        }
        return true;
    }

    /**
     * Returns node count
     * @return {number}
     */
    get size(): number {
        return this.#nodes.size;
    }

    /**
     * Returns total edge count (undirected, counted once)
     * @return {number}
     */
    get edgeCount(): number {
        let total = 0;
        for ( const list of this.#nodes.values() ) total += list.length;
        return total / 2;
    }

    /**
     * Verifies whether there is a direct connection between two nodes
     * @param {T} from - source node
     * @param {T} to - target node
     * @return {boolean} true if nodes are directly connected
     */
    isBinded( from: T, to: T ): boolean {
        const node = this.#nodes.get( from );
        if ( !node ) return false;
        return node.includes( to );
    }

    /**
     * Adds an undirected set of edges from "from" to each node in toList
     * @param {T} from - source node
     * @param {T[]} toList - target nodes to connect
     * @return {void}
     */
    add( from: T, toList: T[] ): void {
        const node = this.#createNode( from );

        toList.forEach( to => {
            if ( to === from ) return;
            if ( node.includes( to ) ) return;

            node.push( to );

            const toNode = this.#createNode( to );
            if ( !toNode.includes( from ) ) toNode.push( from );
        });
    }

    /**
     * Adds a single undirected edge
     * @param {T} from
     * @param {T} to
     * @return {void}
     */
    addEdge( from: T, to: T ): void {
        this.add( from, [ to ] );
    }

    /**
     * Bulk-adds multiple nodes and their links from a map
     * @param {Map<T, T[]>} nodes - map of node -> linked nodes
     * @return {void}
     */
    addAll( nodes: Map<T, T[]> ): void {
        nodes.forEach( ( toList, from ) => this.add( from, toList ) );
    }

    /**
     * Removes a node and clears all edges pointing to it
     * @param {T} from - node to remove
     * @return {void}
     */
    remove( from: T ): void {
        this.#removeNode( from );
    }

    /**
     * Clears the entire graph
     * @return {void}
     */
    removeAll(): void {
        this.#nodes.clear();
    }

    /**
     * Checks presence of node
     * @param {T} node
     * @return {boolean}
     */
    has(node: T): boolean {
        return this.#nodes.has(node);
    }

    /**
     * Returns neighbors (adjacent nodes) copy
     * @param {T} node
     * @return {T[]}
     */
    neighbors(node: T): T[] {
        return [ ...(this.#nodes.get(node) ?? []) ];
    }

    /**
     * Returns degree (neighbor count) for node
     * @param {T} node
     * @return {number}
     */
    degree(node: T): number {
        return this.#nodes.get(node)?.length ?? 0;
    }

    /**
     * Removes an undirected edge, keeps nodes intact
     * @param {T} from
     * @param {T} to
     * @return {void}
     */
    removeEdge(from: T, to: T): void {
        const a = this.#nodes.get(from);
        const b = this.#nodes.get(to);
        if (a) this.#nodes.set(from, a.filter(n => n !== to));
        if (b) this.#nodes.set(to, b.filter(n => n !== from));
    }

    /**
     * Returns a cloned adjacency map (deep copy of arrays)
     * @return {Map<T, T[]>}
     */
    toMap(): Map<T, T[]> {
        const clone = new Map<T, T[]>();
        for ( const [k, v] of this.#nodes ) {
            clone.set(k, [...v]);
        }
        return clone;
    }

    /**
     * Ensures a node exists and returns its adjacency list
     * @param {T} from - node key
     * @return {T[]} adjacency list (mutable reference)
     */
    #createNode( from: T ): T[] {
        const isHas = this.#nodes.has( from );
        let node: T[];

        if ( isHas ) {
            node = this.#nodes.get( from )!;
        } else {
            node = [];
            this.#nodes.set( from, node );
        }

        return node;
    }

    /**
     * Removes the node and prunes its references from other adjacency lists
     * @param {T} from - node to delete
     * @return {void}
     */
    #removeNode( from: T ): void {
        const node = this.#nodes.get(from)!;
        if ( !node ) return;

        // Clear self from other nodes
        node.forEach( to => {
            const toNode = this.#nodes.get(to);
            if ( !toNode ) return;
            this.#nodes.set( to, toNode.filter( n => n !== from ) );
        });

        // Clear self from graph
        this.#nodes.delete(from);
    }

}