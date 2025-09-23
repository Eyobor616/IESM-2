
import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Course, Lesson, LessonType } from '../../types.ts';

interface LessonViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ course, lesson, onBack }) => {
  const { currentUser, getEnrollment, completeLesson } = useApp();

  if (!currentUser) return null;

  const enrollment = getEnrollment(currentUser.id, course.id);
  const isCompleted = enrollment?.completedLessons.includes(lesson.id);

  const handleCompleteLesson = () => {
    if (currentUser) {
      completeLesson(currentUser.id, course.id, lesson.id);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <button onClick={onBack} className="text-brand-secondary hover:underline font-semibold mb-2">
            &larr; Back to {course.title}
          </button>
          <h1 className="text-3xl font-bold text-dark-text">{lesson.title}</h1>
        </div>
        {!isCompleted ? (
          <button 
            onClick={handleCompleteLesson}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Mark as Complete
          </button>
        ) : (
          <span className="px-6 py-2 bg-gray-200 text-gray-600 font-semibold rounded-lg cursor-default">
            Completed
          </span>
        )}
      </div>

      <div className="prose lg:prose-xl max-w-none">
        {lesson.type === LessonType.VIDEO ? (
          <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe 
              src={lesson.content} 
              title={lesson.title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            ></iframe>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-md border">
            <p className="whitespace-pre-wrap">{lesson.content}</p>
          </div>
        )}
      </div>

      {lesson.attachments.length > 0 && (
          <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold text-lg mb-2">Attachments</h3>
              <ul>
                  {lesson.attachments.map(att => (
                      <li key={att.id}>
                          <a href={att.url} download className="text-brand-secondary hover:underline" target="_blank" rel="noopener noreferrer">
                              {att.name} ({att.type})
                          </a>
                      </li>
                  ))}
              </ul>
          </div>
      )}

    </div>
  );
};

export default LessonView;