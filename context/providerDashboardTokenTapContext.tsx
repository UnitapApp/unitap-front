import { FC, PropsWithChildren, createContext, useContext } from "react";

export const ProviderDashboardTokenTapContext = createContext<{}>({});

const ProviderDashboardTokenTapProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <ProviderDashboardTokenTapContext.Provider value={{}}>
      {children}
    </ProviderDashboardTokenTapContext.Provider>
  );
};

export const useTokenTapFromContext = () => {
  return useContext(ProviderDashboardTokenTapContext);
};

export default ProviderDashboardTokenTapProvider;
