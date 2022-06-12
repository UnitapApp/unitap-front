import React, { PropsWithChildren, useEffect, useState } from 'react';
import { FAST_INTERVAL, MEDIUM_INTERVAL, SLOW_INTERVAL } from '../constants/intervals';

const RefreshContext = React.createContext({ slowRefresh: 0, mediumRefresh: 0, fastRefresh: 0 });

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [slowRefresh, setSlowRefresh] = useState(0);
  const [fastRefresh, setFastRefresh] = useState(0);
  const [mediumRefresh, setMediumRefresh] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      setFastRefresh((prev) => prev + 1);
    }, FAST_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setMediumRefresh((prev) => prev + 1);
    }, MEDIUM_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlowRefresh((prev) => prev + 1);
    }, SLOW_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshContext.Provider value={{ slowRefresh, mediumRefresh, fastRefresh }}>{children}</RefreshContext.Provider>
  );
};

export { RefreshContext, RefreshContextProvider };
