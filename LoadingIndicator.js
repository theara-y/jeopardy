export default function useLoadingIndicator(initialValue) {
    let busy = initialValue;

    function isLoading() {
        return busy;
    }

    function toggleLoading() {
        busy = !busy;
        render();
    }

    function render() {
        console.log('rendering');
        busy ? $('#app').append($('<div id="loading-indicator"><div>')) : $('#loading-indicator').remove();
    }

    return [isLoading, toggleLoading];
}