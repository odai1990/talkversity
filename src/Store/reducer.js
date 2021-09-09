import * as actionTypes from './actions';

const initialState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
    src: '',
    gender: '',
    id: '',
    isAuthenticated: false
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.Login:

            return {
                ...state,
                email: action.respons.email,
                password: action.respons.pasword,
                firstName: action.respons.firstName,
                lastName: action.respons.lastName,
                role: action.respons.role,
                src: action.respons.src,
                gender: action.respons.gender,
                id: action.respons._id,
                isAuthenticated: true
            }
        case actionTypes.SignUp:
            return {
                ...state,
                email: action.respons.email,
                password: action.respons.pasword,
                firstName: action.respons.firstName,
                lastName: action.respons.lastName,
                role: action.respons.role,
                src: action.respons.src,
                gender: action.respons.gender,
                id: action.respons._id,
                isAuthenticated: true
            }
        case actionTypes.LogOut:
            return {
                ...state,
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role: '',
                src: '',
                gender: '',
                id: '',
                isAuthenticated: false
            }
    }
    return state;
};



export default reducer;