const loadingChain = new Map();

let threshold = 200;
let timeout;

const loadingDone = (code, callback) => {
    loadingChain.delete(code);

    if (timeout) {
        clearTimeout(timeout);
    }

    if (loadingChain.size <= 0) {
        timeout = setTimeout(() => {
            callback();
        }, threshold);
    }
};

function loadingMiddleware(store) {
    return next => (action) => {
        const nextAction = next(action);
        const isPromise = nextAction && !!nextAction.then;

        const { skipLoading } = store.getState() || {};

        if (isPromise && !skipLoading) {
            const code = Symbol(action.name);
            loadingChain.set(code, action.name);

            const toggleLoading = (state) => {
                if (store.dispatch) {
                    store.dispatch({
                        type: 'REDUX_LOADING_MIDDLEWARE',
                        loading: state,
                    });
                } else {
                    store.setState({ loading: state });
                }
            };

            toggleLoading(true);

            const loadingNextAction = new Promise((resolve, reject) => nextAction
                .then((resp) => {
                    loadingDone(code, () => toggleLoading(false));
                    resolve(resp);
                })
                .catch((resp) => {
                    loadingDone(code, () => toggleLoading(false));
                    reject(resp);
                }));

            return loadingNextAction;
        }

        return nextAction;
    };
}

loadingMiddleware.setThreshold = (value) => {
    threshold = value;

    return loadingMiddleware;
};

export default loadingMiddleware;
