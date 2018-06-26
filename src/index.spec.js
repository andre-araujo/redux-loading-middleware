import loadingMiddleware from './index';

jest.useFakeTimers();

let actionMock;
let nextMock;
let storeMock;

beforeEach(() => {
    actionMock = jest.fn(() => Promise.resolve('ok'));
    nextMock = jest.fn(action => action());
    storeMock = {
        setState: jest.fn(),
        getState: jest.fn(),
    };
});

describe('loadingMiddleware', () => {
    it('should call return next calling action without changes if it is not a promise', () => {
        actionMock = jest.fn();
        nextMock = jest.fn(() => 'next');

        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock);

        expect(nextMock).toHaveBeenCalled();
        expect(storeMock.setState).not.toHaveBeenCalled();
        expect(loadingAction).toBe('next');
    });

    it('should call setState with loading true if it is a promise', () => {
        loadingMiddleware(storeMock)(nextMock)(actionMock);

        expect(storeMock.setState).toHaveBeenCalledWith({ loading: true });
    });

    it('should call setState with loading false if it is a resolved promise', (done) => {
        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock);

        loadingAction.then(() => {
            jest.runAllTimers();
            expect(storeMock.setState).toHaveBeenCalledWith({ loading: false });
            done();
        });
    });

    it('should resolves with nextAction value if it is a resolved promise', (done) => {
        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock);

        loadingAction.then((resp) => {
            expect(resp).toBe('ok');
            done();
        });
    });

    it('should call setState with loading false if it is a rejected promise', (done) => {
        actionMock = jest.fn(() => Promise.reject('not ok'));
        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock);

        loadingAction.catch(() => {
            jest.runAllTimers();
            expect(storeMock.setState).toHaveBeenCalledWith({ loading: false });
            done();
        });
    });

    it('should rejects with nextAction value if it is a rejected promise', (done) => {
        actionMock = jest.fn(() => Promise.reject('not ok'));
        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock);

        loadingAction.catch((resp) => {
            expect(resp).toBe('not ok');
            done();
        });
    });

    it('should wait chained promises to be done to set loading as false', (done) => {
        const actionMock1 = jest.fn(() => new Promise(resolve => setTimeout(() => resolve('ok'), 50)));
        const actionMock2 = jest.fn(() => new Promise(resolve => setTimeout(() => resolve('ok'), 100)));

        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock1);
        const loadingAction2 = loadingMiddleware(storeMock)(nextMock)(actionMock2);

        jest.runTimersToTime(260);

        loadingAction.then(() => {
            expect(storeMock.setState).not.toHaveBeenCalledWith({
                loading: false,
            });

            jest.runTimersToTime(301);

            loadingAction2.then(() => {
                expect(storeMock.setState).toHaveBeenCalledWith({
                    loading: false,
                });

                done();
            });
        });
    });

    it('should dispatch REDUX_LOADING_MIDDLEWARE action if middleware is on redux context', (done) => {
        actionMock = jest.fn(() => Promise.resolve('ok'));
        storeMock = {
            dispatch: jest.fn(),
            setState: jest.fn(),
            getState: jest.fn(),
        };

        const loadingAction = loadingMiddleware(storeMock)(nextMock)(actionMock);

        loadingAction.then((resp) => {
            expect(resp).toBe('ok');
            expect(storeMock.dispatch).toHaveBeenCalledWith({
                loading: true,
                type: 'REDUX_LOADING_MIDDLEWARE',
            });
            expect(storeMock.setState).not.toHaveBeenCalled();
            done();
        });
    });
});
