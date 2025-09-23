
import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
// FIX: Import centralized View type.
import { UserRole, View } from '../../types.ts';

// FIX: Removed local 'View' type definition. The centralized 'View' type is now imported from '../../types.ts'.

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View, courseId?: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const { currentUser } = useApp();

    const NavItem = ({ view, label, icon }: { view: View, label: string, icon: JSX.Element }) => (
        <button
          onClick={() => setActiveView(view)}
          className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            activeView === view ? 'bg-brand-secondary text-white' : 'text-gray-300 hover:bg-brand-secondary hover:text-white'
          }`}
        >
          {icon}
          <span className="ml-3">{label}</span>
        </button>
      );

    const studentNav = [
        { view: 'dashboard' as View, label: 'Dashboard', icon: <HomeIcon /> },
        { view: 'courses' as View, label: 'All Courses', icon: <BookOpenIcon /> },
    ];
    
    const instructorNav = [
        { view: 'my-courses' as View, label: 'My Courses', icon: <CollectionIcon /> },
        { view: 'course-builder' as View, label: 'Create Course', icon: <PlusCircleIcon /> },
    ];

    const adminNav = [
        { view: 'my-courses' as View, label: 'Manage Courses', icon: <CollectionIcon /> },
        { view: 'course-builder' as View, label: 'Create Course', icon: <PlusCircleIcon /> },
        { view: 'user-management' as View, label: 'User Management', icon: <UsersIcon /> },
    ];
    
    return (
        <aside className="w-64 flex-shrink-0 bg-brand-primary p-4 hidden md:flex md:flex-col">
          <div className="text-2xl font-bold text-white mb-8 text-center py-4">Edu<span className="text-brand-accent">Verse</span></div>
          <nav className="space-y-2">
            {currentUser?.role === UserRole.STUDENT && studentNav.map(item => <NavItem key={item.view} {...item} />)}
            {currentUser?.role === UserRole.INSTRUCTOR && instructorNav.map(item => <NavItem key={item.view} {...item} />)}
            {currentUser?.role === UserRole.ADMIN && adminNav.map(item => <NavItem key={item.view} {...item} />)}
          </nav>
        </aside>
    );
};

// SVG Icons
const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BookOpenIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const CollectionIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2" /></svg>;
const PlusCircleIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UsersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;

export default Sidebar;