export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    COURSES: '/courses', // Keeping list plural? User had /course in App.jsx for LIST too? Let's check diff. User had COURSES: '/course'. Singular list? 
    // User Diff: COURSES: '/course'
    COURSES: '/course',
    CREATE_COURSE: '/create-course',
    COURSE: '/course/:id',
    COURSE_PREFIX: '/course/',
    COURSE_LINK: (id) => `/course/${id}`
};
