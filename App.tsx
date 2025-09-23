
import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.tsx';
import { UserRole } from './types.ts';
import Sidebar from './components/layout/Sidebar.tsx';
import Header from './components/layout/Header.tsx';
import UserSelection from './components/auth/UserSelection.tsx';
import Dashboard from './components/student/Dashboard.tsx';
import CourseCatalog from './components/student/CourseCatalog.tsx';
import CourseDetail from './components/student/CourseDetail.tsx';
import UserManagement from './components/admin/UserManagement.tsx';
import CourseBuilder from './components/instructor/CourseBuilder.tsx';

type View = 'dashboard' | 'courses' | 'course-detail' | 'user-management' | 'course-builder' | 'my-courses';

const App: React.FC = () => {
  const { currentUser } = useApp();
  
  // Set initial view based on role
  const getInitialView = (): View => {
    if (currentUser?.role === UserRole.STUDENT) {
      return 'dashboard';
    } else if (currentUser?.role === UserRole.INSTRUCTOR || currentUser?.role === UserRole.ADMIN) {
      return 'my-courses';
    }
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState<View>(getInitialView());
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  useEffect(() => {
    setActiveView(getInitialView());
    setActiveCourseId(null);
  }, [currentUser]);


  const navigateTo = (view: View, courseId: string | null = null) => {
    setActiveView(view);
    setActiveCourseId(courseId);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'courses':
        return <CourseCatalog navigateTo={navigateTo} />;
      case 'course-detail':
        if (activeCourseId) {
          return <CourseDetail courseId={activeCourseId} navigateTo={navigateTo} />;
        }
        return <div>Course not found. Please go back to the course catalog.</div>;
      case 'my-courses':
          return <CourseCatalog navigateTo={navigateTo} filter="mine" />;
      case 'course-builder':
          return <CourseBuilder courseId={activeCourseId} onSave={() => navigateTo('my-courses')} />;
      case 'user-management':
          return <UserManagement />;
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  if (!currentUser) {
    return <UserSelection />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar activeView={activeView} setActiveView={navigateTo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-light-bg">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;