import React from 'react';
import { useApp } from '../../context/AppContext';

const UserSelection: React.FC = () => {
  const { users, login } = useApp();

  return (
    <div className="min-h-screen bg-light-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-dark-text mb-2">Welcome to EduVerse</h1>
        <p className="text-lg text-medium-text mb-8">Select a user to log in</p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-md">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => login(user.id)}
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-brand-secondary hover:shadow-lg transition-all duration-200"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-4 border-2 border-brand-secondary" />
              <div className="text-left">
                <p className="font-semibold text-dark-text">{user.name}</p>
                <p className="text-sm text-medium-text capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelection;