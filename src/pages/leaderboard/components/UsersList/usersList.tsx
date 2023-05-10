import React from 'react';
import { User } from 'types';
import UsersCard from '../UsersCard/usersCard';

interface UsersListProp {
  users: User[];
}

const UsersList = ({ users }: UsersListProp) => {
  return (
    <div className="users-card">
      {users.map((user) => (
        <UsersCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersList;
