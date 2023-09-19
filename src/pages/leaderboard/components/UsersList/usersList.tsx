import { User } from 'types';
import UsersCard from '../UsersCard/usersCard';
import Icon from 'components/basic/Icon/Icon';

interface UsersListProp {
	users: User[];
	currentUser: (User & { rank: number }) | null;
	page: number;
	next: number | null;
	previous: number | null;
}

const UsersList = ({ users, currentUser, page, next, previous }: UsersListProp) => {
	let period = { first: users[0].id, last: users[users.length - 1].id };

	return (
		<div className="users-card">
			{!!currentUser && currentUser.rank < (previous ?? -1) && (
				<div className="pt-4">
					<UsersCard index={-1} key={currentUser.id} user={currentUser} currentUser={currentUser} />
					<Icon className="pt-3" iconSrc="assets/images/leaderboard/space.svg" width="28px" height="28px" />
				</div>
			)}
			{users.map((user, index) => (
				<UsersCard index={(page - 1) * 10 + index + 1} key={index} user={user} currentUser={currentUser} />
			))}
			{!!currentUser && currentUser.rank > (next ?? Infinity) && (
				<div className="pt-4">
					<Icon iconSrc="assets/images/leaderboard/space.svg" width="28px" height="28px" />
					<UsersCard index={-1} key={currentUser.id} user={currentUser} currentUser={currentUser} />
				</div>
			)}
		</div>
	);
};

export default UsersList;
