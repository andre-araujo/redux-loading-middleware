# Redux Loading Middleware.

A redux middleware to handle global loading fully compatible with [redux](https://github.com/reactjs/redux) and [redux-zero](https://github.com/concretesolutions/redux-zero)

## Usage

Redux loading middleware set a loading state for every unresolved action that returns a promise, after promise resolution, it set's loadings state to false.
Also it chains action unresolved promises that runs within 200ms threshold, and set loading to false only when every promise is done.

### Install

`npm install redux-loading-middleware --save`

### Add to your redux project

```javascript
import { createStore, applyMiddleware } from 'redux';
import loadingMiddleware from 'redux-loading-middleware';
import todos from './reducers';

const initialState = {
  todos: [],
  loading: false
};

const store = createStore(
  todos,
  initialState,
  applyMiddleware(loadingMiddleware)
);

export default store;

```

### Add to your redux-zero project

```javascript
import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware"
import loadingMiddleware from 'redux-loading-middleware';

const initialState = {
  todos: [],
  loading: false
};

const middlewares = applyMiddleware(loadingMiddleware);
const store = createStore(initialState, middlewares);

export default store;

```
