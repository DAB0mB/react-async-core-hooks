type ArgsOf<Fn> = Fn extends (...args: infer R) => any ? R : any[];
export function useAsyncEffect(handler: (onCleanup: (handler: () => void) => void) => Generator<any, any, any>): void;
export function useAsyncLayoutEffect(handler: (onCleanup: (handler: () => void) => void) => Generator<any, any, any>): void;
export function useAsyncCallback<Result, Handler extends (...args: any[]) => Generator<any, any, any>>(handler: Handler): (...args: ArgsOf<Handler>) => Promise<Result>;
