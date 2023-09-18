import { getRaffleConstraintsVerifications } from 'api';
import { ClaimAndEnrollButton } from 'components/basic/Button/button';
import Icon from 'components/basic/Icon/Icon';
import Tooltip from 'components/basic/Tooltip';
import { PrizeTapContext } from 'hooks/prizeTap/prizeTapContext';
import { UserProfileContext } from 'hooks/useUserProfile';
import { FC, useContext, useEffect, useState } from 'react';
import { Permission, Prize } from 'types';

const tokenImgLink = (tokenUri: string) =>
	tokenUri
		? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${Number(tokenUri.split('/')[3]) + 1}.png`
		: undefined;

const RafflePermissions: FC<{ raffle: Prize }> = ({ raffle }) => {
	const { userToken } = useContext(UserProfileContext);
	const [loading, setLoading] = useState(false);
	const { openEnrollModal } = useContext(PrizeTapContext);

	const [permissions, SetPermissions] = useState<(Permission & { isVerified: boolean })[]>([]);

	useEffect(() => {
		setLoading(true);
		if (!userToken) {
			setLoading(false);
			return;
		}

		getRaffleConstraintsVerifications(raffle.pk, userToken)
			.then((res) => {
				SetPermissions(res.constraints);
			})
			.catch(() => {
				SetPermissions(raffle.constraints.map((constraint) => ({ ...constraint, isVerified: false })));
			})
			.finally(() => setLoading(false));
	}, [userToken, raffle.constraints, raffle.pk, SetPermissions]);

	return (
		<div className="w-full">
			<div className="mb-20 text-center relative">
				<div className="bg-[url('/assets/images/prize-tap/nft-cover.svg')] bg-cover rounded-lg w-64 h-40 mx-auto" />
				<img
					src={raffle.imageUrl ?? tokenImgLink(raffle.tokenUri)}
					className="absolute left-1/2 -translate-x-1/2 top-5"
					alt={raffle.name}
					width={168}
				/>
			</div>

			{loading ? (
				<div className="relative animate-pulse mt-10">
					<div className="flex overflow-y-hidden overflow-x-auto items-center text-xs gap-2">
						{Array.from(new Array(5)).map((_, index) => (
							<div
								key={index}
								className="relative inline-block border-gray70 bg-gray50 border px-2 py-2 rounded-lg flex-1 w-20 h-7"
							/>
						))}
					</div>

					<div className="mt-5 text-center relative py-3 bg-gray50 border-gray70 border-2 border-solid w-full h-14 rounded-xl"></div>
				</div>
			) : (
				<>
					<div className={`flex items-center flex-wrap text-xs gap-2 text-white`}>
						{permissions.map((permission, key) => (
							<Tooltip
								className={
									'border-gray70 bg-gray50 hover:bg-gray10 transition-colors border px-2 py-2 rounded-lg ' +
									(permission.isVerified ? 'text-space-green' : 'text-warn')
								}
								data-testid={`token-verification-modal-${raffle.pk}-${permission.name}`}
								key={key}
								text={permission.description}
							>
								<div className="flex items-center gap-1">
									<img
										src={
											permission.isVerified
												? '/assets/images/token-tap/check.svg'
												: '/assets/images/token-tap/not-verified.svg'
										}
									/>
									{permission.title}
								</div>
							</Tooltip>
						))}
					</div>

					{permissions.some((item) => !item.isVerified) ? (
						<button
							disabled
							className="mt-5 text-center text-warn py-3 bg-[#392821] border-warn border-2 border-solid w-full rounded-xl"
						>
							Complete requirements first!
						</button>
					) : (
						<ClaimAndEnrollButton
							height="48px"
							fontSize="14px"
							disabled={new Date(raffle.startAt) > new Date()}
							className="!w-full mt-5"
							onClick={() => openEnrollModal(raffle, 'Enroll')}
						>
							<div className="relative w-full">
								<p> Enroll</p>{' '}
							</div>
						</ClaimAndEnrollButton>
					)}
				</>
			)}
		</div>
	);
};

export default RafflePermissions;
