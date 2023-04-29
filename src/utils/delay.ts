export function delay(ms?: number, callback?: () => void) {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback?.();
      resolve(null);
    }, ms || 1000);
  });
}
