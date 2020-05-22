import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const createAsyncEffectHook = (useEffect) => (fn, input) => {
  const cbQueueRef = useRef([]);
  const [result, setResult] = useState(null);
  const [iterator, setIterator] = useState(null);

  const cleanup = useCallback(() => {
    for (let callback of cbQueueRef.current) {
      callback();
    }
  }, [iterator]);

  const onCleanup = useCallback((fn) => {
    cbQueueRef.current.push(fn);
  }, [true]);

  const next = useCallback((value) => {
    if (result && result.done) {
      return;
    }

    setResult(iterator.next(value));
  }, [result, iterator]);

  const throwback = useCallback((error) => {
    if (result && result.done) {
      return;
    }

    setResult(iterator.throw(error));
  }, [result]);

  useEffect(() => {
    cbQueueRef.current = [];

    const iterator = fn(onCleanup);

    setIterator(iterator);
    setResult(iterator.next());

    return cleanup;
  }, input);

  useEffect(() => {
    if (!result) return;

    let alive = true;

    if (result.value instanceof Promise) {
      result.value.then((value) => {
        if (alive) {
          next(value);
        }
      }).catch((error) => {
        if (alive) {
          throwback(error);
        }
      });
    }
    else {
      next(result.value);
    }

    return () => {
      alive = false;
    };
  }, [result]);
};
export const useAsyncEffect = createAsyncEffectHook(useEffect);
export const useAsyncLayoutEffect = createAsyncEffectHook(useLayoutEffect);

export const useAsyncCallback = (fn, input) => {
  const aliveRef = useRef(true);

  useEffect(() => () => {
    aliveRef.current = false;
  }, [true]);

  return useCallback(async (...args) => {
    const iterator = fn(...args);
    let result = { value: undefined, done: false };

    while (!result.done && aliveRef.current) {
      try {
        if (result.value instanceof Promise) {
          result = iterator.next(await result.value);
        }
        else {
          result = iterator.next(result.value);
        }
      }
      catch (e) {
        if (aliveRef.current) {
          result = iterator.throw(e);
        }
      }
    }

    return result.value;
  }, input);
};
