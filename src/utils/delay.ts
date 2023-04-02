export function delay(ms?: number, callback?: Function) {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback?.();
      resolve(null);
    }, ms || 1000);
  });
}
