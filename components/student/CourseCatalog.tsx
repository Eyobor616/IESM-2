import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Course, View, UserRole } from '../../types.ts';

interface CourseCatalogProps {
  navigateTo: (view: View, courseId?: string | null) => void;
  filter?: 'mine';
}

const CourseCard = ({ course, onClick, onEdit }: { course: Course; onClick: () => void, onEdit?: (e: React.MouseEvent) => void }) => (
    <div onClick={onClick} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-brand-secondary hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col relative">
        {onEdit && (
            <button
                onClick={onEdit}
                className="absolute top-2 right-2 z-10 bg-brand-secondary text-white px-3 py-1 text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
                Edit
            </button>
        )}
        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-dark-text mb-1 truncate">{course.title}</h3>
            <p className="text-sm text-medium-text mb-3">{course.category}</p>
        </div>
    </div>
);

const CourseCatalog: React.FC<CourseCatalogProps> = ({ navigateTo, filter }) => {
  const { courses, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(courses.map(c => c.category))], [courses]);

  const filteredCourses = useMemo(() => {
    let result = courses;

    if (filter === 'mine' && currentUser) {
      if (currentUser.role === UserRole.ADMIN) {
        // Admins see all courses in their "Manage Courses" view
      } else {
        // Instructors only see courses they are assigned to
        result = result.filter(c => c.instructorIds.includes(currentUser.id));
      }
    }

    if (searchTerm) {
      result = result.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory);
    }

    return result;
  }, [courses, filter, currentUser, searchTerm, selectedCategory]);
  
  const isManagementView = filter === 'mine' && (currentUser?.role === UserRole.INSTRUCTOR || currentUser?.role === UserRole.ADMIN);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-text">
          {isManagementView
            ? (currentUser?.role === UserRole.ADMIN ? 'Manage All Courses' : 'My Courses')
            : 'Explore Courses'}
        </h1>
        {isManagementView && (
             <button onClick={() => navigateTo('course-builder')} className="px-4 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Create New Course
             </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-medium-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
          </div>
          <div>
              <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-auto bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
          </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => navigateTo('course-detail', course.id)}
              onEdit={isManagementView ? (e) => {
                e.stopPropagation();
                navigateTo('course-builder', course.id);
              } : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-medium-text">No courses found.</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;