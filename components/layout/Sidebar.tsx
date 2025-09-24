import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { View, UserRole } from '../../types.ts';

// Icons for the sidebar
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const VideoCameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg>;

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View, courseId?: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { currentUser } = useApp();

  const getLabel = (view: View) => {
    if (view === 'my-courses') {
      return currentUser?.role === UserRole.ADMIN ? 'Manage Courses' : 'My Courses';
    }
    return view.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // FIX: Explicitly type navItems to ensure the `view` property is of type `View`, not inferred as a generic `string`.
  const navItems: { view: View; label: string; icon: JSX.Element; roles: UserRole[] }[] = [
    // Student links
    { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon />, roles: [UserRole.STUDENT] },
    { view: 'courses', label: 'All Courses', icon: <BookOpenIcon />, roles: [UserRole.STUDENT] },

    // Instructor and Admin links
    { view: 'my-courses', label: currentUser?.role === UserRole.ADMIN ? 'Manage Courses' : 'My Courses', icon: <VideoCameraIcon />, roles: [UserRole.INSTRUCTOR, UserRole.ADMIN] },
    { view: 'course-builder', label: 'Create Course', icon: <PlusCircleIcon />, roles: [UserRole.INSTRUCTOR, UserRole.ADMIN] },

    // Admin links
    { view: 'user-management', label: 'User Management', icon: <UsersIcon />, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-dark-text">EduVerse</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map(({ view, label, icon }) => (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view, null)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-lg transition-colors duration-200 ${
              activeView === view
                ? 'bg-brand-accent text-white shadow-md'
                : 'text-medium-text hover:bg-gray-100 hover:text-dark-text'
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;