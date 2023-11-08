// sleep function just to add some delays
export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
