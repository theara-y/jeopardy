export default function useJumbotron() {
    let prompts = [];
    let index = -1;

    function setPrompts(...newPrompts) {
        prompts = [...newPrompts];
        console.log(prompts);
        index = -1;
    }

    function next() {
        index++
        if(index === prompts.length) {
            $('#expanded-game-tile').css('transform', 'rotateX(0) scale(0.1, 0)')
            return true;
        } else {
            $('#expanded-game-tile').html(prompts[index])
            if(index === 0) {
                $('#expanded-game-tile').css('transform', 'rotateX(360deg) scale(1, 1)')
            }
        }
    }

    return [next, setPrompts];
}