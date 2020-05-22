import 'babel-polyfill';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { useAsyncCallback, useAsyncEffect, useAsyncLayoutEffect } from '.';

const effectsHooks = {
  useAsyncEffect,
  useAsyncLayoutEffect,
};

describe('react-async-core-hooks', () => {
  describe('useAsyncCallback', () => {
    test('runs async callback', () => {
      return new Promise((done) => {
        const containerEl = document.createElement('div');

        const MyComponent = () => {
          const [state, setState] = useState('foo');

          const cb = useAsyncCallback(function* () {
            expect(containerEl.innerHTML).toEqual('foo');
            setState(yield Promise.resolve('bar'));
            expect(containerEl.innerHTML).toEqual('bar');
            done();
          }, [true]);

          useEffect(cb, [true]);

          return state;
        };

        ReactDOM.render(
          <MyComponent />,
          containerEl,
        );
      });
    });

    test('aborts callback on unmount', () => {
      return new Promise((done) => {
        const containerEl = document.createElement('div');

        const PostCallbackComponent = () => {
          useEffect(() => {
            done();
          }, [true]);

          return null;
        };

        const MyComponent = () => {
          const cb = useAsyncCallback(function* () {
            ReactDOM.render(
              <PostCallbackComponent />,
              containerEl,
            );

            yield Promise.resolve();
            yield Promise.resolve();

            done.fail('Not supposed to be here');
          }, [true]);

          useEffect(() => {
            cb();
          }, [true]);

          return null;
        };

        ReactDOM.render(
          <MyComponent />,
          containerEl,
        );
      });
    });
  });

  ['useAsyncEffect', 'useAsyncLayoutEffect'].forEach((hookName) => {
    const useAsyncEffect = effectsHooks[hookName];

    describe(hookName, () => {
      test('runs async effect', () => {
        return new Promise((done) => {
          const containerEl = document.createElement('div');

          const MyComponent = () => {
            const [state, setState] = useState('foo');

            useAsyncEffect(function* () {
              expect(containerEl.innerHTML).toEqual('foo');
              setState(yield Promise.resolve('bar'));
              expect(containerEl.innerHTML).toEqual('bar');
              done();
            }, [true]);

            return state;
          };

          ReactDOM.render(
            <MyComponent />,
            containerEl,
          );
        });
      });

      test('aborts effect on input change', () => {
        return new Promise((done) => {
          const containerEl = document.createElement('div');

          const MyComponent = () => {
            const [state, setState] = useState('foo');

            useAsyncEffect(function* () {
              if (state == 'bar') {
                expect(containerEl.innerHTML).toEqual('bar');
                done();
              }
              else {
                expect(containerEl.innerHTML).toEqual('foo');
                setState('bar');
                yield Promise.resolve();'';
                done.fail('Not supposed to be here');
              }
            }, [state]);

            return state;
          };

          ReactDOM.render(
            <MyComponent />,
            containerEl,
          );
        });
      });
    });
  });
});
