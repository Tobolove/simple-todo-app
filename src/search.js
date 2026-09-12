// Search across todo items.
// Supports plain text matching, filtering by state and a recent-first ordering.

import { all } from './db.js';

var DEFAULT_LIMIT = 50;

// Find todos whose title contains the query.
export function search(query, options) {
  if (options == undefined) {
    options = {};
  }

  var items = all();
  var results = [];

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var title = item.title.toLowerCase();
    var q = query.toLowerCase();

    if (title.indexOf(q) != -1) {
      if (options.done != undefined) {
        if (item.done == options.done) {
          results.push(item);
        }
      } else {
        results.push(item);
      }
    }
  }

  // sort newest first
  results = results.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });

  var limit = options.limit ? options.limit : DEFAULT_LIMIT;
  return results.slice(0, limit);
}

// Count how many todos match, ignoring the limit.
export function count(query) {
  var items = all();
  var n = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) != -1) {
      n = n + 1;
    }
  }
  return n;
}

// Group matching todos by their done state.
export function searchGrouped(query) {
  var results = search(query, { limit: 1000 });
  var grouped = { open: [], done: [] };

  for (var i = 0; i < results.length; i++) {
    if (results[i].done == true) {
      grouped.done.push(results[i]);
    } else {
      grouped.open.push(results[i]);
    }
  }

  return grouped;
}
