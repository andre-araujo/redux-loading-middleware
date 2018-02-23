'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var loadingChain = new Map();
var threshold = 200;

var loadingDone = function loadingDone(code, callback) {
    setTimeout(function () {
        loadingChain.delete(code);

        if (loadingChain.size <= 0) {
            callback();
        }
    }, threshold);
};

exports.default = function (store) {
    return function (next) {
        return function (action) {
            var nextAction = next(action);
            var isPromise = nextAction && !!nextAction.then;

            if (isPromise) {
                var code = Symbol(action.name);
                loadingChain.set(code, action.name);

                var toggleLoading = function toggleLoading(state) {
                    if (store.dispatch) {
                        store.dispatch({
                            type: 'REDUX_LOADING_MIDDLEWARE',
                            loading: state
                        });
                    } else {
                        store.setState({ loading: state });
                    }
                };

                toggleLoading(true);

                var loadingNextAction = new Promise(function (resolve, reject) {
                    return nextAction.then(function (resp) {
                        loadingDone(code, function () {
                            return toggleLoading(false);
                        });
                        resolve(resp);
                    }).catch(function (resp) {
                        loadingDone(code, function () {
                            return toggleLoading(false);
                        });
                        reject(resp);
                    });
                });

                return loadingNextAction;
            }

            return nextAction;
        };
    };
};