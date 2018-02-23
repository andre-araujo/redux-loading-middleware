const loadingChain = new Map();
const threshold = 200;

const loadingDone = (code, callback) => {
    setTimeout(() => {
        loadingChain.delete(code);

        if (loadingChain.size <= 0) {
            callback();
        }
    }, threshold);
};

export default store => next => (action) => {
    const nextAction = next(action);
    const isPromise = nextAction && !!nextAction.then;

    if (isPromise) {
        const code = Symbol(action.name);
        loadingChain.set(code, action.name);

        store.setState({ loading: true });

        const loadingNextAction = new Promise((resolve, reject) => nextAction
            .then((resp) => {
                loadingDone(code, () => store.setState({ loading: false }));
                resolve(resp);
            })
            .catch((resp) => {
                loadingDone(code, () => store.setState({ loading: false }));
                reject(resp);
            }));

        return loadingNextAction;
    }

    return nextAction;
};
