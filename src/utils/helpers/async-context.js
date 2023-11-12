// Import AsyncLocalStorage from async_hooks
import asyncHooks from "async_hooks";

const store = new Map();

const asyncHook = asyncHooks
	.createHook({
		init: (asyncId, _, triggerAsyncId) => {
			if (store.has(triggerAsyncId)) {
				store.set(asyncId, store.get(triggerAsyncId));
			}
		},
		destroy: (asyncId) => {
			if (store.has(asyncId)) {
				store.delete(asyncId);
			}
		},
	})
	.enable();

const createRequestContext = (data, name) => {
	store.set("connection", data);
	return data;
};

const getRequestContext = (name) => {
	return store.get("connection");
};

export { createRequestContext, getRequestContext };
