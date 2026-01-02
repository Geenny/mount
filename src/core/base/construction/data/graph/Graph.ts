
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