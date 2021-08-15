const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const timeout = (target, ms) => {
    console.log('aaa', target, ms);
    return Promise.race([
        target,
        (async () => {
          await sleep(ms);
          // TODO: Figure out how to print function name
          throw new Error(`Function has timed out with the limit of ${ms} milliseconds.`);
        })(),
    ]);
};