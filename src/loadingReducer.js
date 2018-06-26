export default (state = {}, action = {}) => {
    switch (action.type) {
        case 'REDUX_LOADING_MIDDLEWARE': {
            return Object.assign({}, state, {
                loading: action.loading,
            });
        }
        default: {
            return state;
        }
    }
};
