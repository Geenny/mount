/**
 * Tree data structure (typed, parent->children)
 *
 * T - node type
 *
 * @example
 * const tree = new Tree<string>('root');
 * tree.addChild('root', 'A');
 * tree.addChildren('A', ['B', 'C']);
 * tree.isAncestor('root', 'C'); // true
 */
export declare class Tree<T> {
    #private;
    constructor(root?: T);
    /**
     * Returns the root node (first node with null parent) if any
     * @return {T | undefined}
     */
    get root(): T | undefined;
    /**
     * Returns direct parent of a node (null for root, undefined if node missing)
     * @param {T} node
     * @return {T | null | undefined}
     */
    getParent(node: T): T | null | undefined;
    /**
     * Returns direct children of a node (empty array if none)
     * @param {T} node
     * @return {T[]}
     */
    getChildren(node: T): T[];
    /**
     * Checks presence of a node in the tree
     * @param {T} node
     * @return {boolean}
     */
    has(node: T): boolean;
    /**
     * Adds a single child under the given parent (reparents if child already had a parent)
     * Prevents cycles (throws on attempt)
     * @param {T} parent
     * @param {T} child
     * @return {void}
     */
    addChild(parent: T, child: T): void;
    /**
     * Adds multiple children to a parent
     * @param {T} parent
     * @param {T[]} children
     * @return {void}
     */
    addChildren(parent: T, children: T[]): void;
    /**
     * Checks direct relation parent->child
     * @param {T} parent
     * @param {T} child
     * @return {boolean}
     */
    isParentOf(parent: T, child: T): boolean;
    /**
     * Checks if potential ancestor is in the chain of parents for node
     * @param {T} ancestor
     * @param {T} node
     * @return {boolean}
     */
    isAncestor(ancestor: T, node: T): boolean;
    /**
     * Checks if node is a descendant of ancestor
     * @param {T} node
     * @param {T} ancestor
     * @return {boolean}
     */
    isDescendant(node: T, ancestor: T): boolean;
    /**
     * Returns path from node to root (inclusive), or empty if node missing
     * @param {T} node
     * @return {T[]}
     */
    pathToRoot(node: T): T[];
    /**
     * Removes a node and its entire subtree
     * @param {T} node
     * @return {void}
     */
    remove(node: T): void;
    /**
     * Clears the whole tree
     * @return {void}
     */
    removeAll(): void;
}
