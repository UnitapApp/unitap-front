import { FC, PropsWithChildren, ReactNode } from "react";

const ProfileEditLayout: FC<
  PropsWithChildren & { socialAccounts: ReactNode }
> = ({ children, socialAccounts }) => {
  return (
    <>
      {children}
      {socialAccounts}
    </>
  );
};

export default ProfileEditLayout;
