# simple-todo-app

A minimal todo application used as a code review fixture.

## Usage

```js
import { TodoList } from './src/todo.js';

const list = new TodoList();
list.add('Buy milk');
list.complete(1);
console.log(list.all());
```

## Structure

- `src/todo.js` - the todo list itself
- `src/db.js` - in-memory storage
