
import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.tsx';
// FIX: Import centralized View type and combine type imports from ./types.ts.
import { UserRole, View, Course, Lesson, Quiz } from './types.ts';
import Sidebar from './components/layout/Sidebar.tsx';
import Header from './components/layout/Header.tsx';
import UserSelection from './components/auth/UserSelection.tsx';
import Dashboard from './components/student/Dashboard.tsx';
import CourseCatalog from './components/student/CourseCatalog.tsx';
import CourseDetail from './components/student/CourseDetail.tsx';
import UserManagement from './components/admin/UserManagement.tsx';
import CourseBuilder from './components/instructor/CourseBuilder.tsx';
import LessonView from './components/student/LessonView.tsx';
import QuizView from './components/student/QuizView.tsx';

// FIX: Removed local 'View' type definition. The centralized 'View' type is now imported from './types.ts'.

const App: React.FC = () => {
  const { currentUser, getCourseById, getQuizById } = useApp();
  
  const getInitialView = (): View => {
    if (currentUser?.role === UserRole.STUDENT) return 'dashboard';
    if (currentUser?.role === UserRole.INSTRUCTOR || currentUser?.role === UserRole.ADMIN) return 'my-courses';
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState<View>(getInitialView());
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    setActiveView(getInitialView());
    setActiveCourseId(null);
    setActiveLesson(null);
    setActiveQuiz(null);
  }, [currentUser]);


  const navigateTo = (view: View, courseId: string | null = null) => {
    setActiveView(view);
    setActiveCourseId(courseId);
    setActiveLesson(null);
    setActiveQuiz(null);
  };

  const openLesson = (lesson: Lesson, courseId: string) => {
    setActiveView('lesson-view');
    setActiveLesson(lesson);
    setActiveCourseId(courseId);
  }

  const openQuiz = (quiz: Quiz, courseId: string) => {
    setActiveView('quiz-view');
    setActiveQuiz(quiz);
    setActiveCourseId(courseId);
  }

  const renderContent = () => {
    const course = activeCourseId ? getCourseById(activeCourseId) : null;
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'courses':
        return <CourseCatalog navigateTo={navigateTo} />;
      case 'course-detail':
        if (course) {
          return <CourseDetail course={course} navigateTo={navigateTo} openLesson={openLesson} openQuiz={openQuiz}/>;
        }
        return <div>Course not found.</div>;
      case 'lesson-view':
        if (course && activeLesson) {
          return <LessonView course={course} lesson={activeLesson} onBack={() => navigateTo('course-detail', course.id)} />;
        }
        return <div>Lesson not found.</div>;
      case 'quiz-view':
         if (course && activeQuiz) {
          return <QuizView course={course} quiz={activeQuiz} onBack={() => navigateTo('course-detail', course.id)} />;
        }
        return <div>Quiz not found.</div>;
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