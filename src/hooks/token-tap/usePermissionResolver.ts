import { UserProfileContext } from 'hooks/useUserProfile';
import { useCallback, useContext } from 'react';
import { Permission } from 'types';

export const usePermissionResolver = () => {
	const { userProfile } = useContext(UserProfileContext);

	return useCallback(
		(permission: Permission) => {
			if ((permission.name as any) === 'BrightIDMeetVerification') {
				return userProfile?.isMeetVerified;
			}

			if ((permission.name as string) === 'BrightID Aura Verification') {
				return userProfile?.isAuraVerified;
			}

			return false;
		},
		[userProfile],
	);
};

export default usePermissionResolver;
