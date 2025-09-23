
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Notification } from '../../types.ts';

const Header: React.FC = () => {
  const { currentUser, logout, notifications, markNotificationAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userNotifications = currentUser ? notifications.filter(n => n.userId === currentUser.id) : [];
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    // Future: Handle navigation if notification.link exists
    setShowNotifications(false);
  };

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-medium-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="Search for courses..." 
            className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
      </div>

      {/* Right side icons and user menu */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-medium-text hover:text-dark-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 font-semibold border-b border-gray-200 text-dark-text">Notifications</div>
              <div className="max-h-80 overflow-y-auto">
                {userNotifications.length > 0 ? (
                  userNotifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className="flex items-start p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>}
                      <p className={`text-sm ${n.isRead ? 'text-medium-text' : 'text-dark-text'}`}>{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-medium-text">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-brand-secondary" />
            <span className="hidden md:inline font-semibold text-dark-text">{currentUser.name}</span>
            <svg className={`w-4 h-4 text-medium-text transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          {showUserMenu && (
             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-brand-accent hover:text-white rounded-lg"
                >
                  Logout
                </button>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;