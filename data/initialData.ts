
import { User, Course, Quiz, UserRole, LessonType } from '../types';

export const initialUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/alice/100' },
  { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/seed/bob/100' },
  { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: UserRole.INSTRUCTOR, avatarUrl: 'https://picsum.photos/seed/charlie/100' },
  { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/diana/100' },
];

export const initialQuizzes: Quiz[] = [
    {
        id: 'quiz-1',
        title: 'React Basics Quiz',
        questions: [
            { id: 'q1-1', text: 'What is JSX?', options: ['A JavaScript syntax extension', 'A CSS preprocessor', 'A database query language', 'A templating engine'], correctAnswerIndex: 0 },
            { id: 'q1-2', text: 'What is the purpose of `useState`?', options: ['To fetch data', 'To manage state in a functional component', 'To handle routing', 'To perform side effects'], correctAnswerIndex: 1 },
            { id: 'q1-3', text: 'Which method is used to render a React element to the DOM?', options: ['ReactDOM.render()', 'React.mount()', 'ReactDOM.createRoot().render()', 'React.start()'], correctAnswerIndex: 2 },
        ]
    },
    {
        id: 'quiz-2',
        title: 'Advanced TypeScript Quiz',
        questions: [
            { id: 'q2-1', text: 'What is a Generic in TypeScript?', options: ['A type of component', 'A way to create reusable code components', 'A specific class', 'A linting rule'], correctAnswerIndex: 1 },
            { id: 'q2-2', text: 'What does the `keyof` operator do?', options: ['Returns the keys of an object', 'Creates a union type of an object\'s property names', 'Accesses a private key', 'Defines a foreign key'], correctAnswerIndex: 1 },
        ]
    }
];

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React, including components, state, and props.',
    instructorIds: ['user-3'],
    lessons: [
      { id: 'l1-1', title: 'Welcome to React', type: LessonType.VIDEO, content: 'https://www.youtube.com/embed/SqcY0GlETPk', durationMinutes: 10, attachments: [] },
      { id: 'l1-2', title: 'Understanding Components', type: LessonType.TEXT, content: 'Components are the building blocks of any React app. A component is a self-contained, reusable piece of UI.', durationMinutes: 15, attachments: [{id: 'a1', name: 'cheatsheet.pdf', type: 'PDF', url:'#'}] },
      { id: 'l1-3', title: 'State and Props', type: LessonType.VIDEO, content: 'https://www.youtube.com/embed/SqcY0GlETPk', durationMinutes: 20, attachments: [] },
    ],
    quizId: 'quiz-1',
    thumbnailUrl: 'https://picsum.photos/seed/react/400/225',
    category: 'Web Development'
  },
  {
    id: 'course-2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript with advanced concepts like generics, decorators, and mapped types.',
    instructorIds: ['user-3'],
    prerequisiteCourseId: 'course-1',
    lessons: [
      { id: 'l2-1', title: 'Generics Deep Dive', type: LessonType.VIDEO, content: 'https://www.youtube.com/embed/SqcY0GlETPk', durationMinutes: 25, attachments: [] },
      { id: 'l2-2', title: 'Decorators Explained', type: LessonType.TEXT, content: 'Decorators provide a way to add both annotations and a meta-programming syntax for classes and class members.', durationMinutes: 20, attachments: [] },
    ],
    quizId: 'quiz-2',
    thumbnailUrl: 'https://picsum.photos/seed/typescript/400/225',
    category: 'Web Development'
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Principles',
    description: 'Explore the core principles of user interface and user experience design for creating intuitive products.',
    instructorIds: ['user-3'],
    lessons: [
        { id: 'l3-1', title: 'The Psychology of Design', type: LessonType.VIDEO, content: 'https://www.youtube.com/embed/SqcY0GlETPk', durationMinutes: 18, attachments: [] },
    ],
    thumbnailUrl: 'https://picsum.photos/seed/uiux/400/225',
    category: 'Design'
  }
];
