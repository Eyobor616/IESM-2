import React from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

type View = 'dashboard' | 'courses' | 'course-detail' | 'user-management' | 'course-builder' | 'my-courses';

interface DashboardProps {
  navigateTo: (view: View, courseId?: string | null) => void;
}

const CourseCard = ({ course, progress, onClick }: { course: Course; progress?: number; onClick: () => void }) => (
    <div onClick={onClick} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-brand-secondary hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col">
        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-dark-text mb-1 truncate">{course.title}</h3>
            <p className="text-sm text-medium-text mb-3">{course.category}</p>
            {progress !== undefined && (
                <div className="mt-auto">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-brand-secondary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-right text-medium-text">{progress}% Complete</p>
                </div>
            )}
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  const { currentUser, courses, enrollments } = useApp();

  if (!currentUser) return null;

  const enrolledCourses = enrollments
    .filter(e => e.userId === currentUser.id)
    .map(e => ({
      course: courses.find(c => c.id === e.courseId),
      progress: e.progress,
    }))
    .filter(ec => ec.course);
  
  const enrolledCourseIds = new Set(enrolledCourses.map(ec => ec.course!.id));
  const recommendedCourses = courses.filter(c => !enrolledCourseIds.has(c.id)).slice(0, 4);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-dark-text">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-dark-text">My Learning</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.map(({ course, progress }) => 
                course && <CourseCard key={course.id} course={course} progress={progress} onClick={() => navigateTo('course-detail', course.id)} />
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <p className="text-medium-text">You are not enrolled in any courses yet.</p>
            <button onClick={() => navigateTo('courses')} className="mt-4 px-4 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Explore Courses
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-dark-text">Recommended for You</h2>
        {recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedCourses.map(course => 
              <CourseCard key={course.id} course={course} onClick={() => navigateTo('course-detail', course.id)} />
            )}
          </div>
        ) : (
          <p className="text-medium-text">No recommendations available at this time.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;