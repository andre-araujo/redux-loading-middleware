'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (state, action) {
    switch (action.type) {
        case 'REDUX_LOADING_MIDDLEWARE':
            {
                return Object.assign({}, state, {
                    loading: action.loading
                });
            }
        default:
            {
                return state;
            }
    }
};