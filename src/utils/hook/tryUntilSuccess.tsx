const tryUntilSuccess = (updater: () => Promise<void>) => {
  const fn = async () => {
    try {
      await updater();
    } catch (e) {
      fn();
    }
  };
  fn();
};

export default tryUntilSuccess;
