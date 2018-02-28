import loadingReducer from './loadingReducer';

describe('loadingReducer', () => {
    it('Should set loading state as true', () => {
        const state = {
            otherState: 'otherState',
            loading: false,
        };

        const action = {
            type: 'REDUX_LOADING_MIDDLEWARE',
            loading: true,
        };

        expect(loadingReducer(state, action)).toEqual({
            otherState: 'otherState',
            loading: true,
        });
    });

    it('Should set loading state as false', () => {
        const state = {
            otherState: 'otherState',
            loading: false,
        };

        const action = {
            type: 'REDUX_LOADING_MIDDLEWARE',
            loading: false,
        };

        expect(loadingReducer(state, action)).toEqual({
            otherState: 'otherState',
            loading: false,
        });
    });

    it('Should return current state if another action is called', () => {
        const state = {
            otherState: 'otherState',
            loading: false,
        };

        const action = {
            type: 'OTHER_ACTION',
            loading: false,
        };

        expect(loadingReducer(state, action)).toEqual(state);
    });
});
