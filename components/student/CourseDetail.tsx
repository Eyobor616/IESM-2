
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
// FIX: Import centralized View type.
import { Course, Lesson, Quiz, View } from '../../types.ts';

// FIX: Removed local 'View' type definition. The centralized 'View' type is now imported from '../../types.ts'.

interface CourseDetailProps {
  course: Course;
  navigateTo: (view: View, courseId?: string | null) => void;
  openLesson: (lesson: Lesson, courseId: string) => void;
  openQuiz: (quiz: Quiz, courseId: string) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, navigateTo, openLesson, openQuiz }) => {
  const { 
    getUserById, 
    currentUser, 
    getEnrollment, 
    enrollInCourse,
    getQuizById,
    getReviewsForCourse,
    addReview
  } = useApp();
  
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  if (!currentUser) return null;
  
  const enrollment = getEnrollment(currentUser.id, course.id);
  const quiz = course.quizId ? getQuizById(course.quizId) : undefined;
  const reviews = getReviewsForCourse(course.id);
  
  const instructorNames = course.instructorIds.map(id => getUserById(id)?.name).join(', ');

  const handleEnroll = () => {
    enrollInCourse(currentUser.id, course.id);
  };
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating > 0 && reviewComment) {
      addReview({
        courseId: course.id,
        userId: currentUser.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewRating(0);
      setReviewComment("");
    }
  };

  const isCourseCompleted = enrollment?.progress === 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8">
              <img src={course.thumbnailUrl} alt={course.title} className="w-full md:w-1/3 h-auto object-cover rounded-lg" />
              <div className="flex-1">
                  <p className="text-brand-secondary font-semibold">{course.category}</p>
                  <h1 className="text-4xl font-bold text-dark-text mt-2 mb-3">{course.title}</h1>
                  <p className="text-medium-text mb-4">{course.description}</p>
                  <p className="text-sm text-medium-text mb-4">Created by <span className="font-semibold text-dark-text">{instructorNames}</span></p>
                  {enrollment ? (
                      <div>
                          <p className="font-semibold text-dark-text">Your Progress:</p>
                          <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                              <div className="bg-green-500 h-4 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                          </div>
                          <p className="text-sm text-right mt-1 text-medium-text">{enrollment.progress}% Complete</p>
                      </div>
                  ) : (
                      <button onClick={handleEnroll} className="px-8 py-3 bg-brand-accent text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                          Enroll Now
                      </button>
                  )}
              </div>
          </div>
      </div>
      
      {/* Course Content & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {/* Lessons */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-dark-text mb-4">Course Content</h2>
                <ul className="space-y-3">
                    {course.lessons.map((lesson, index) => {
                        const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                        return (
                            <li key={lesson.id} onClick={() => enrollment && openLesson(lesson, course.id)} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${enrollment ? 'cursor-pointer hover:bg-gray-100 hover:border-brand-secondary' : 'bg-gray-50 opacity-70'}`}>
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-medium-text'}`}>
                                      {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-dark-text">{lesson.title}</p>
                                        <p className="text-sm text-medium-text">{lesson.durationMinutes} mins</p>
                                    </div>
                                </div>
                                {!enrollment && <span className="text-sm text-medium-text">Enroll to view</span>}
                            </li>
                        )
                    })}
                </ul>
            </div>
            {/* Quiz */}
            {quiz && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-dark-text mb-4">Final Quiz</h2>
                    <p className="text-medium-text mb-4">{quiz.title}</p>
                    <button onClick={() => enrollment && openQuiz(quiz, course.id)} disabled={!enrollment || !isCourseCompleted} className="px-6 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {isCourseCompleted ? 'Start Quiz' : 'Complete all lessons to start quiz'}
                    </button>
                </div>
            )}
        </div>

        {/* Reviews */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-dark-text mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {reviews.map(review => (
                             <div key={review.id} className="border-b pb-3 last:border-b-0">
                                <div className="flex items-center mb-1">
                                    <p className="font-semibold text-dark-text mr-2">{getUserById(review.userId)?.name}</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}
                                    </div>
                                </div>
                                <p className="text-sm text-medium-text">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-medium-text">No reviews yet.</p>}
            </div>
             {enrollment && isCourseCompleted && (
                 <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-dark-text mb-4">Leave a Review</h2>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="mb-2">
                           <label className="text-medium-text">Rating:</label>
                           <div className="flex text-2xl">
                                {[...Array(5)].map((_, i) => (
                                    <button type="button" key={i} onClick={() => setReviewRating(i + 1)} className={`${i < reviewRating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500`}>★</button>
                                ))}
                           </div>
                        </div>
                        <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Your comment..." rows={3} className="w-full p-2 rounded-md border border-gray-300" required></textarea>
                        <button type="submit" className="mt-2 w-full px-4 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Submit Review</button>
                    </form>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;