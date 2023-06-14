import React from 'react';
import { User } from 'types';
import UsersCard from '../UsersCard/usersCard';
import Icon from 'components/basic/Icon/Icon';

interface UsersListProp {
  users: User[];
  currentUser: User;
}

const UsersList = ({ users, currentUser }: UsersListProp) => {
  let period = { first: users[0].id, last: users[users.length - 1].id };
  return (
    <div className="users-card">
      {currentUser.id < period.first && (
        <div className="pt-4">
          <UsersCard key={currentUser.id} user={currentUser} currentUser={currentUser} />
          <Icon className="pt-3" iconSrc="assets/images/leaderboard/space.svg" width="28px" height="28px" />
        </div>
      )}
      {users.map((user) => (
        <UsersCard key={user.id} user={user} currentUser={currentUser} />
      ))}
      {currentUser.id > period.last && (
        <div className="pt-4">
          <Icon iconSrc="assets/images/leaderboard/space.svg" width="28px" height="28px" />
          <UsersCard key={currentUser.id} user={currentUser} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

export default UsersList;
