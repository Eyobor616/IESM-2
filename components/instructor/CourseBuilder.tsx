
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Course, Lesson, LessonType, User, Attachment } from '../../types.ts';

interface CourseBuilderProps {
  courseId: string | null;
  onSave: () => void;
}

const getNewCourse = (currentUser: User | null): Omit<Course, 'id'> => ({
    title: '',
    description: '',
    category: 'Web Development',
    thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/225`,
    instructorIds: currentUser ? [currentUser.id] : [],
    lessons: [],
    prerequisiteCourseId: undefined,
    quizId: undefined,
});

const CourseBuilder: React.FC<CourseBuilderProps> = ({ courseId, onSave }) => {
    const { getCourseById, addCourse, updateCourse, currentUser, courses, quizzes } = useApp();
    const isEditing = !!courseId;
    
    const [courseData, setCourseData] = useState<Course | Omit<Course, 'id'>>(() => getNewCourse(currentUser));
    const [loading, setLoading] = useState(isEditing);
    const [newAttachments, setNewAttachments] = useState<{ [lessonId: string]: { name: string; type: string } }>({});


    useEffect(() => {
        setLoading(isEditing);
        if (isEditing && courseId) {
            const course = getCourseById(courseId);
            if (course) {
                setCourseData(course);
            } else {
                setCourseData(getNewCourse(currentUser));
            }
        } else {
            setCourseData(getNewCourse(currentUser));
        }
        setLoading(false);
    }, [courseId, isEditing, getCourseById, currentUser]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]: value === '' ? undefined : value
        });
    };

    const handleAddLesson = () => {
        const newLesson: Lesson = {
            id: `lesson-${Date.now()}`,
            title: '',
            type: LessonType.TEXT,
            content: '',
            durationMinutes: 10,
            attachments: []
        };
        setCourseData({
            ...courseData,
            lessons: [...courseData.lessons, newLesson]
        });
    };

    const handleLessonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newLessons = [...courseData.lessons];
        const lessonToUpdate = { ...newLessons[index] };

        const fieldName = name as keyof Omit<Lesson, 'id' | 'attachments'>;
        
        if (fieldName === 'durationMinutes') {
            lessonToUpdate[fieldName] = parseInt(value, 10) || 0;
        } else if (fieldName === 'type') {
            lessonToUpdate[fieldName] = value as LessonType;
        } else {
            lessonToUpdate[fieldName] = value;
        }
        
        newLessons[index] = lessonToUpdate;
        setCourseData({ ...courseData, lessons: newLessons });
    };
    
    const handleRemoveLesson = (index: number) => {
        setCourseData({
            ...courseData,
            lessons: courseData.lessons.filter((_, i) => i !== index)
        });
    };

    const handleReorderLesson = (index: number, direction: 'up' | 'down') => {
        const newLessons = [...courseData.lessons];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newLessons.length) {
          const temp = newLessons[index];
          newLessons[index] = newLessons[targetIndex];
          newLessons[targetIndex] = temp;
          setCourseData({ ...courseData, lessons: newLessons });
        }
    };
    
    const handleNewAttachmentChange = (lessonId: string, field: 'name' | 'type', value: string) => {
        setNewAttachments(prev => ({
            ...prev,
            [lessonId]: {
                ...(prev[lessonId] || { name: '', type: '' }),
                [field]: value
            }
        }));
    };
    
    const handleAddAttachment = (lessonIndex: number) => {
        const lesson = courseData.lessons[lessonIndex];
        const newAttachmentData = newAttachments[lesson.id];

        if (!newAttachmentData || !newAttachmentData.name || !newAttachmentData.type) {
            alert('Please provide both a name and a type for the attachment.');
            return;
        }

        const newAttachment: Attachment = {
            id: `att-${Date.now()}`,
            name: newAttachmentData.name,
            type: newAttachmentData.type,
            url: '#' // Placeholder URL
        };

        const newLessons = [...courseData.lessons];
        newLessons[lessonIndex].attachments.push(newAttachment);
        setCourseData({ ...courseData, lessons: newLessons });

        setNewAttachments(prev => ({
            ...prev,
            [lesson.id]: { name: '', type: '' }
        }));
    };

    const handleRemoveAttachment = (lessonIndex: number, attachmentId: string) => {
        const newLessons = [...courseData.lessons];
        newLessons[lessonIndex].attachments = newLessons[lessonIndex].attachments.filter(att => att.id !== attachmentId);
        setCourseData({ ...courseData, lessons: newLessons });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseData.title || !courseData.description || !courseData.category) {
            alert('Please fill all required fields: Title, Description, and Category.');
            return;
        }
        
        if (isEditing && 'id' in courseData) {
            updateCourse(courseData);
        } else {
            addCourse(courseData as Omit<Course, 'id'>);
        }
        onSave();
    };

    if (loading) {
        return <div>Loading course builder...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-dark-text">
                {isEditing ? 'Edit Course' : 'Create New Course'}
            </h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-gray-200 shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-medium-text mb-1">Course Title</label>
                        <input type="text" name="title" id="title" value={courseData.title} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-medium-text mb-1">Category</label>
                        <input type="text" name="category" id="category" value={courseData.category} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-medium-text mb-1">Description</label>
                    <textarea name="description" id="description" value={courseData.description} onChange={handleInputChange} rows={4} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary" required></textarea>
                </div>
                <div>
                    <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-medium-text mb-1">Thumbnail URL</label>
                    <input type="text" name="thumbnailUrl" id="thumbnailUrl" value={courseData.thumbnailUrl} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="prerequisiteCourseId" className="block text-sm font-medium text-medium-text mb-1">Prerequisite Course (Optional)</label>
                        <select name="prerequisiteCourseId" id="prerequisiteCourseId" value={courseData.prerequisiteCourseId || ''} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary">
                            <option value="">None</option>
                            {courses.filter(c => 'id' in courseData ? c.id !== courseData.id : true).map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="quizId" className="block text-sm font-medium text-medium-text mb-1">Quiz (Optional)</label>
                        <select name="quizId" id="quizId" value={courseData.quizId || ''} onChange={handleInputChange} className="w-full bg-gray-50 text-dark-text p-2 rounded-md border border-gray-300 focus:ring-brand-secondary focus:border-brand-secondary">
                            <option value="">None</option>
                            {quizzes.map(q => (
                                <option key={q.id} value={q.id}>{q.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold mb-4 text-dark-text">Lessons</h2>
                    <div className="space-y-4">
                        {courseData.lessons?.map((lesson, index) => (
                            <div key={lesson.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                <div className="absolute top-3 right-3 flex items-center space-x-1">
                                    <button type="button" onClick={() => handleReorderLesson(index, 'up')} disabled={index === 0} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" transform="rotate(180 10 10)"/></svg>
                                    </button>
                                    <button type="button" onClick={() => handleReorderLesson(index, 'down')} disabled={index === courseData.lessons.length - 1} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                                    </button>
                                    <button type="button" onClick={() => handleRemoveLesson(index)} className="p-1 text-red-500 rounded-full hover:bg-red-100 font-bold">&times;</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <input type="text" name="title" placeholder="Lesson Title" value={lesson.title} onChange={(e) => handleLessonChange(index, e)} className="w-full p-2 rounded-md border border-gray-300" required />
                                    <select name="type" value={lesson.type} onChange={(e) => handleLessonChange(index, e)} className="w-full p-2 rounded-md border border-gray-300">
                                        <option value={LessonType.TEXT}>Text</option>
                                        <option value={LessonType.VIDEO}>Video</option>
                                    </select>
                                </div>
                                <textarea name="content" placeholder={lesson.type === LessonType.TEXT ? "Lesson content (Markdown supported)" : "Video URL (e.g., YouTube embed link)"} value={lesson.content} onChange={(e) => handleLessonChange(index, e)} rows={3} className="w-full mt-2 p-2 rounded-md border border-gray-300" required></textarea>
                                {lesson.type === LessonType.VIDEO && <p className="text-xs text-medium-text mt-1">Provide a direct video embed URL (e.g., from YouTube, select "Embed" and copy the src link).</p>}
                                <div className="mt-2">
                                    <label htmlFor={`duration-${index}`} className="text-sm font-medium text-medium-text">Duration (minutes)</label>
                                    <input id={`duration-${index}`} type="number" name="durationMinutes" placeholder="Duration" value={lesson.durationMinutes} onChange={(e) => handleLessonChange(index, e)} className="w-full mt-1 p-2 rounded-md border border-gray-300" required />
                                </div>
                                
                                <div className="border-t border-gray-200 mt-4 pt-4">
                                    <h4 className="text-sm font-semibold text-medium-text mb-2">Attachments</h4>
                                    {lesson.attachments.length > 0 && (
                                        <ul className="space-y-1 mb-3">
                                            {lesson.attachments.map((att) => (
                                                <li key={att.id} className="flex items-center justify-between bg-white py-1 px-2 rounded border text-sm">
                                                    <span>{att.name} <span className="text-gray-500">({att.type})</span></span>
                                                    <button type="button" onClick={() => handleRemoveAttachment(index, att.id)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="flex items-stretch gap-2">
                                        <input type="text" placeholder="File name" value={newAttachments[lesson.id]?.name || ''} onChange={(e) => handleNewAttachmentChange(lesson.id, 'name', e.target.value)} className="w-full p-2 text-sm rounded-md border border-gray-300"/>
                                        <input type="text" placeholder="File type (e.g., PDF)" value={newAttachments[lesson.id]?.type || ''} onChange={(e) => handleNewAttachmentChange(lesson.id, 'type', e.target.value)} className="w-full p-2 text-sm rounded-md border border-gray-300"/>
                                        <button type="button" onClick={() => handleAddAttachment(index)} className="px-3 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300 text-sm">Add</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={handleAddLesson} className="mt-4 px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Add Lesson</button>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button type="button" onClick={onSave} className="px-6 py-3 bg-gray-200 text-dark-text font-bold rounded-lg hover:bg-gray-300 transition-colors mr-4">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-3 bg-brand-accent text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                        {isEditing ? 'Update Course' : 'Save Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseBuilder;