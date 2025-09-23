
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
// FIX: Import centralized View type.
import { UserRole, View } from '../../types.ts';

// FIX: Removed local 'View' type definition. The centralized 'View' type is now imported from '../../types.ts'.

interface CourseCatalogProps {
  navigateTo: (view: View, courseId?: string | null) => void;
  filter?: 'mine';
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ navigateTo, filter }) => {
  const { courses, currentUser, getUserById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = useMemo(() => ['All', ...new Set(courses.map(c => c.category))], [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesFilter = !filter || (currentUser && course.instructorIds.includes(currentUser.id));
      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [courses, searchTerm, selectedCategory, filter, currentUser]);

  const canEdit = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.INSTRUCTOR;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dark-text">{filter === 'mine' ? 'My Courses' : 'Course Catalog'}</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-dark-text"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-dark-text"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-brand-secondary hover:shadow-xl transition-all duration-300 group flex flex-col">
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover cursor-pointer group-hover:opacity-80 transition-opacity" onClick={() => navigateTo('course-detail', course.id)} />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-dark-text mb-1 truncate cursor-pointer" onClick={() => navigateTo('course-detail', course.id)}>{course.title}</h3>
                <p className="text-sm text-medium-text mb-2">by {course.instructorIds.map(id => getUserById(id)?.name).join(', ')}</p>
                <p className="text-sm text-medium-text line-clamp-2 flex-grow">{course.description}</p>
                 {filter === 'mine' && canEdit && (
                  <button 
                    onClick={() => navigateTo('course-builder', course.id)}
                    className="mt-4 w-full text-center px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Edit Course
                  </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-medium-text py-10">No courses found that match your criteria.</p>
      )}
    </div>
  );
};

export default CourseCatalog;