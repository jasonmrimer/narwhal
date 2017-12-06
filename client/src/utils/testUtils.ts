export function forIt(wait: number = 0): Promise<{}> {
    return new Promise((resolve) => {
      setTimeout(resolve, wait);
    });
  }
