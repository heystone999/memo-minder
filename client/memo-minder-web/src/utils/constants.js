// constants.js
export const BASE_URL = 'https://memo-minder.onrender.com';

export const STATUS_CODE = {
    SUCCESS: 200,
    ADD_HABIT_SUCCESS: 201,
    UNAUTHORIZED: 401,
};

export const SERVER_API = {
    LOGIN: '/api/login',
    ADD_HABIT: '/api/habits',
    FETCH_HABIT: '/api/habits/user/:userId',
    MODIFY_HABIT: '/api/habits/:habitId',
    DELETE_HABIT: '/api/habits/:habitId',
}