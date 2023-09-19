export function randomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function useState(initialState) {
    let state = initialState;
    
    function getState() {
        return state;
    }

    function setState(newState) {
        state = newState;
    }

    return [getState, setState];
}