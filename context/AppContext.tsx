
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialUsers, initialCourses, initialQuizzes } from '../data/initialData';
import { User, Course, Enrollment, Quiz, QuizAttempt, Certificate, Review, Notification, Lesson } from '../types';

interface AppContextType {
  users: User[];
  courses: Course[];
  quizzes: Quiz[];
  enrollments: Enrollment[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  reviews: Review[];
  notifications: Notification[];
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  getCourseById: (courseId: string) => Course | undefined;
  getQuizById: (quizId: string) => Quiz | undefined;
  getUserById: (userId: string) => User | undefined;
  getEnrollment: (userId: string, courseId: string) => Enrollment | undefined;
  getReviewsForCourse: (courseId: string) => Review[];
  enrollInCourse: (userId: string, courseId: string) => void;
  completeLesson: (userId: string, courseId: string, lessonId: string) => void;
  submitQuiz: (attempt: QuizAttempt) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useLocalStorage<User[]>('eduverse_users', initialUsers);
  const [courses, setCourses] = useLocalStorage<Course[]>('eduverse_courses', initialCourses);
  const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>('eduverse_quizzes', initialQuizzes);
  const [enrollments, setEnrollments] = useLocalStorage<Enrollment[]>('eduverse_enrollments', []);
  const [quizAttempts, setQuizAttempts] = useLocalStorage<QuizAttempt[]>('eduverse_quiz_attempts', []);
  const [certificates, setCertificates] = useLocalStorage<Certificate[]>('eduverse_certificates', []);
  const [reviews, setReviews] = useLocalStorage<Review[]>('eduverse_reviews', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('eduverse_notifications', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('eduverse_current_user', null);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const getCourseById = useCallback((courseId: string) => courses.find(c => c.id === courseId), [courses]);
  const getQuizById = useCallback((quizId: string) => quizzes.find(q => q.id === quizId), [quizzes]);
  const getUserById = useCallback((userId: string) => users.find(u => u.id === userId), [users]);
  const getEnrollment = useCallback((userId: string, courseId: string) => enrollments.find(e => e.userId === userId && e.courseId === courseId), [enrollments]);
  const getReviewsForCourse = useCallback((courseId: string) => reviews.filter(r => r.courseId === courseId), [reviews]);

  const enrollInCourse = (userId: string, courseId: string) => {
    if (!getEnrollment(userId, courseId)) {
      setEnrollments([...enrollments, { userId, courseId, progress: 0, completedLessons: [] }]);
      addNotification({ userId, message: `You have enrolled in a new course!`, link: `/courses/${courseId}`, isRead: false });
    }
  };
  
  const completeLesson = (userId: string, courseId: string, lessonId: string) => {
    const enrollment = getEnrollment(userId, courseId);
    const course = getCourseById(courseId);
    if (enrollment && course) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        const newCompletedLessons = [...enrollment.completedLessons, lessonId];
        const newProgress = Math.round((newCompletedLessons.length / course.lessons.length) * 100);
        const updatedEnrollments = enrollments.map(e => 
          (e.userId === userId && e.courseId === courseId) 
          ? { ...e, completedLessons: newCompletedLessons, progress: newProgress } 
          : e
        );
        setEnrollments(updatedEnrollments);

        if (newProgress === 100 && !course.quizId) {
             addCertificate(userId, courseId);
        }
      }
    }
  };

  const addCertificate = (userId: string, courseId: string) => {
      const course = getCourseById(courseId);
      if(course && !certificates.find(c => c.userId === userId && c.courseId === courseId)){
          const newCertificate: Certificate = {
              id: `cert-${Date.now()}`,
              userId,
              courseId,
              issueDate: new Date().toISOString(),
          };
          setCertificates([...certificates, newCertificate]);
          addNotification({ userId, message: `Congratulations! You've earned a certificate for "${course.title}".`, isRead: false });
      }
  };
  
  const submitQuiz = (attempt: QuizAttempt) => {
    // Record the quiz attempt
    setQuizAttempts([...quizAttempts, attempt]);
    
    // Find the course associated with this quiz
    const course = courses.find(c => c.quizId === attempt.quizId);
    
    if (course) {
      const enrollment = getEnrollment(attempt.userId, course.id);
      
      // Check for passing conditions: user is enrolled, has completed all lessons, and passed the quiz
      const hasPassed = attempt.score >= 70; // Passing score is 70%
      const isCourseComplete = enrollment?.progress === 100;

      if (enrollment && isCourseComplete && hasPassed) {
        addCertificate(attempt.userId, course.id);
      }
    }
  };

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        date: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
      const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: Date.now(),
      };
      // FIX: The setter from useLocalStorage does not support a callback function.
      // We need to construct the new array with the current state value.
      setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (notificationId: string) => {
      setNotifications(notifications.map(n => n.id === notificationId ? {...n, isRead: true} : n));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: `user-${Date.now()}`};
    setUsers([...users, newUser]);
  };
  
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {...course, id: `course-${Date.now()}`};
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (courseToUpdate: Course) => {
    setCourses(courses.map(c => c.id === courseToUpdate.id ? courseToUpdate : c));
  };


  const value = {
    users,
    courses,
    quizzes,
    enrollments,
    quizAttempts,
    certificates,
    reviews,
    notifications,
    currentUser,
    login,
    logout,
    getCourseById,
    getQuizById,
    getUserById,
    getEnrollment,
    getReviewsForCourse,
    enrollInCourse,
    completeLesson,
    submitQuiz,
    addReview,
    addNotification,
    markNotificationAsRead,
    addUser,
    addCourse,
    updateCourse,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
