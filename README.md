# react-async-core-hooks

A set of hooks that provide an async version of core React hooks. With the native React API you would have to check if the effect or the component are still mounted after each and every Promise resolution. Example:

```js
useEffect(() => {
    let mounted = true;

    fetch().then((res) => {
        if (!mounted) return;

        return res.json();
    }).then((json) => {
        if (!mounted) return;

        setJson(json);
    });

    return () => {
        mounted = false;
    };
}, input);
```

This package takes a unique approach by using generators to determine whether the execution should continue or abort.

### Usage

**useAsyncEffect**

```js
useAsyncEffect(function* (onCleanup) {
    const res = yield fetch();
    const json = yield res.json();

    setJson(json);
}, input);
```

**useAsyncLayoutEffect**

```js
useAsyncLayoutEffect(function* (onCleanup) {
    const res = yield fetch();
    const json = yield res.json();

    setJson(json);
}, input);
```

**useAsyncCallback**

```js
const fetchJson = useAsyncCallback(function* () {
    const res = yield fetch();
    const json = yield res.json();

    setJson(json);
}, input);
```

### Download

The source is available via GitHub or via the NPM registry:

    yarn add react-async-core-hooks

### License

MIT