/**
 * A minimal todo list.
 *
 * Wraps the storage module so callers work with todo semantics (add, complete,
 * remove) rather than raw records.
 */

import { insert, find, update, all, clear } from './db.js';

export class TodoList {
  /**
   * Add a new todo item.
   *
   * @param {string} title - what to do
   * @returns {number} the new item's id
   * @throws {Error} when the title is empty
   */
  add(title) {
    if (!title || title.trim() === '') {
      throw new Error('title must not be empty');
    }
    return insert({ title: title.trim(), done: false, createdAt: Date.now() });
  }

  /**
   * Mark an item as done.
   *
   * @param {number} id - the item's id
   * @returns {object|undefined} the updated item, or undefined if not found
   */
  complete(id) {
    return update(id, { done: true });
  }

  /**
   * Look up a single item.
   *
   * @param {number} id - the item's id
   * @returns {object|undefined}
   */
  get(id) {
    return find(id);
  }

  /** @returns {object[]} every item, in insertion order */
  all() {
    return all();
  }

  /** Remove every item. Used by tests. */
  reset() {
    clear();
  }
}
