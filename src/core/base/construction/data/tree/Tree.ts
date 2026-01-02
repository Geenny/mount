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
export class Tree<T> {
  #children: Map<T, T[]> = new Map();
  #parent: Map<T, T | null> = new Map();

  constructor(root?: T) {
    if (root !== undefined) {
      this.#ensureNode(root);
      this.#parent.set(root, null);
    }
  }

  /**
   * Returns the root node (first node with null parent) if any
   * @return {T | undefined}
   */
  get root(): T | undefined {
    for (const [node, parent] of this.#parent.entries()) {
      if (parent === null) return node;
    }
    return undefined;
  }

  /**
   * Returns direct parent of a node (null for root, undefined if node missing)
   * @param {T} node
   * @return {T | null | undefined}
   */
  getParent(node: T): T | null | undefined {
    return this.#parent.get(node);
  }

  /**
   * Returns direct children of a node (empty array if none)
   * @param {T} node
   * @return {T[]}
   */
  getChildren(node: T): T[] {
    return this.#children.get(node) ?? [];
  }

  /**
   * Checks presence of a node in the tree
   * @param {T} node
   * @return {boolean}
   */
  has(node: T): boolean {
    return this.#parent.has(node);
  }

  /**
   * Adds a single child under the given parent (reparents if child already had a parent)
   * Prevents cycles (throws on attempt)
   * @param {T} parent
   * @param {T} child
   * @return {void}
   */
  addChild(parent: T, child: T): void {
    if (parent === child) return;
    if (this.isAncestor(child, parent)) {
      throw new Error('Cannot create cycle in Tree');
    }

    this.#ensureNode(parent);
    this.#ensureNode(child);

    const prevParent = this.#parent.get(child);
    if (prevParent !== undefined && prevParent !== null) {
      this.#detachChild(prevParent, child);
    }

    this.#parent.set(child, parent);
    const list = this.#children.get(parent)!;
    if (!list.includes(child)) list.push(child);
  }

  /**
   * Adds multiple children to a parent
   * @param {T} parent
   * @param {T[]} children
   * @return {void}
   */
  addChildren(parent: T, children: T[]): void {
    children.forEach(child => this.addChild(parent, child));
  }

  /**
   * Checks direct relation parent->child
   * @param {T} parent
   * @param {T} child
   * @return {boolean}
   */
  isParentOf(parent: T, child: T): boolean {
    return this.#parent.get(child) === parent;
  }

  /**
   * Checks if potential ancestor is in the chain of parents for node
   * @param {T} ancestor
   * @param {T} node
   * @return {boolean}
   */
  isAncestor(ancestor: T, node: T): boolean {
    let current = this.#parent.get(node);
    while (current !== undefined && current !== null) {
      if (current === ancestor) return true;
      current = this.#parent.get(current);
    }
    return false;
  }

  /**
   * Checks if node is a descendant of ancestor
   * @param {T} node
   * @param {T} ancestor
   * @return {boolean}
   */
  isDescendant(node: T, ancestor: T): boolean {
    return this.isAncestor(ancestor, node);
  }

  /**
   * Returns path from node to root (inclusive), or empty if node missing
   * @param {T} node
   * @return {T[]}
   */
  pathToRoot(node: T): T[] {
    if (!this.#parent.has(node)) return [];
    const path: T[] = [node];
    let current = this.#parent.get(node);
    while (current !== undefined && current !== null) {
      path.push(current);
      current = this.#parent.get(current);
    }
    return path;
  }

  /**
   * Removes a node and its entire subtree
   * @param {T} node
   * @return {void}
   */
  remove(node: T): void {
    if (!this.#parent.has(node)) return;
    const parent = this.#parent.get(node);
    if (parent !== undefined && parent !== null) {
      this.#detachChild(parent, node);
    }
    this.#removeSubtree(node);
  }

  /**
   * Clears the whole tree
   * @return {void}
   */
  removeAll(): void {
    this.#children.clear();
    this.#parent.clear();
  }

  // Ensures internal maps contain the node
  #ensureNode(node: T): void {
    if (!this.#children.has(node)) this.#children.set(node, []);
    if (!this.#parent.has(node)) this.#parent.set(node, null);
  }

  // Detaches child from parent list
  #detachChild(parent: T, child: T): void {
    const list = this.#children.get(parent);
    if (!list) return;
    this.#children.set(parent, list.filter(n => n !== child));
  }

  // Recursively removes subtree rooted at node
  #removeSubtree(node: T): void {
    const kids = this.#children.get(node) ?? [];
    kids.forEach(k => this.#removeSubtree(k));
    this.#children.delete(node);
    this.#parent.delete(node);
  }
}
