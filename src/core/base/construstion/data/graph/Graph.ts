export class Graph<T> {

    #nodes: Map<T, T[]> = new Map();

    constructor( nodes: Map<T, T[]> = new Map() ) {
        this.addAll( nodes );
    }

    get nodes(): Map<T, T[]> { return this.#nodes; }

    get isComplete(): boolean {
        for ( const [ from, toList ] of this.#nodes ) {
            for ( const to of toList ) {
                const toNode = this.#nodes.get( to );
                if ( !toNode ) return false;
            }
        }
        return true;
    }

    isBinded( from: T, to: T ): boolean {
        const node = this.#nodes.get( from );
        if ( !node ) return false;
        return node.includes( to );
    }

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

    addAll( nodes: Map<T, T[]> ): void {
        nodes.forEach( ( toList, from ) => this.add( from, toList ) );
    }

    remove( from: T ): void {
        this.#removeNode( from );
    }

    removeAll(): void {
        this.#nodes.clear();
    }

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

    #addNode( from: T, to: T ): void {

    }

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