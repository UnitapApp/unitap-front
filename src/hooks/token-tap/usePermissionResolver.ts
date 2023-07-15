import { UserProfileContext } from 'hooks/useUserProfile';
import { useContext } from 'react';
import { Permission } from 'types';

export const usePermissionResolver = () => {
	const { userProfile } = useContext(UserProfileContext);

	return (permission: Permission) => {
		if ((permission.name as any) === 'BrightID Meet') {
			return userProfile?.isMeetVerified;
		}

		if ((permission.name as string) === 'BrightID Aura Verification') {
			return userProfile?.isAuraVerified;
		}

		return false;
	};
};

export default usePermissionResolver;
