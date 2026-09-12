import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRIORITIES, isPriority, comparePriority, sortByPriority } from './priority.js';

test('isPriority accepts every declared level', () => {
  for (const level of PRIORITIES) {
    assert.equal(isPriority(level), true);
  }
});

test('isPriority rejects anything else', () => {
  for (const value of ['urgent', 'HIGH', '', null, undefined, 0, {}]) {
    assert.equal(isPriority(value), false);
  }
});

test('comparePriority ranks high above low', () => {
  assert.ok(comparePriority('high', 'low') < 0);
  assert.ok(comparePriority('low', 'high') > 0);
  assert.equal(comparePriority('medium', 'medium'), 0);
});

test('comparePriority throws on an unknown level', () => {
  assert.throws(() => comparePriority('urgent', 'low'), TypeError);
});

test('sortByPriority orders highest first', () => {
  const sorted = sortByPriority([
    { id: 1, priority: 'low' },
    { id: 2, priority: 'high' },
    { id: 3, priority: 'medium' }
  ]);
  assert.deepEqual(sorted.map((i) => i.id), [2, 3, 1]);
});

test('sortByPriority puts items without a priority last', () => {
  const sorted = sortByPriority([
    { id: 1 },
    { id: 2, priority: 'low' },
    { id: 3, priority: 'high' }
  ]);
  assert.deepEqual(sorted.map((i) => i.id), [3, 2, 1]);
});

test('sortByPriority does not modify its input', () => {
  const input = [{ id: 1, priority: 'low' }, { id: 2, priority: 'high' }];
  sortByPriority(input);
  assert.deepEqual(input.map((i) => i.id), [1, 2]);
});

test('sortByPriority handles an empty array', () => {
  assert.deepEqual(sortByPriority([]), []);
});
