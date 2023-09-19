export default function useLoadingIndicator(initialValue) {
    let busy = initialValue;

    function isLoading() {
        return busy;
    }

    function toggleLoading() {
        busy = !busy

        busy ? displayLoadingIndicator() : removeLoadingIndicator();
    }

    function displayLoadingIndicator() {
        $('#app').append($('<div id="loading-indicator"><div>'))
    }
    
    function removeLoadingIndicator() {
        $('#loading-indicator').remove();
    }

    return [isLoading, toggleLoading];
}