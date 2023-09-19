import {fetchData, fetchFinalQuestion } from "./DataApi.js";
import useLoadingIndicator from "./LoadingIndicator.js";
import useJumbotron from "./Jumbotron.js";
import {displayGameBoard, displayStartScreen } from "./Display.js";

let [isLoading, toggleLoading] = useLoadingIndicator(false)
let [nextPrompt, setJumbotron] = useJumbotron();
const MAX_COUNT = 30;

let round = 0;
let count = 0;
let categories = [];

async function startNewRound() {
    $('#app').html('');
    toggleLoading();
    count = 0;
    round += 1;
    categories = await fetchData();
    console.log(categories);
    await displayGameBoard(categories, round);
    toggleLoading();
}

$('#app').on('click', '.game-tile', function() {
    if(!isLoading()) {
        const gameTile = $(this);
        const y = Number(gameTile.data('y'));
        const x = Number(gameTile.data('x'));

        const clue = categories[y].clues[x];

        if(clue.status === 'open') {
            if(count === MAX_COUNT - 1) {
                setJumbotron(clue.question, clue.answer, 'End of Round ' + round);
            } else {
                setJumbotron(clue.question, clue.answer);
            }
            nextPrompt();
            clue.status = 'closed';
            gameTile.empty();
        }
    }
})

$('#app').on('click', '#expanded-game-tile', function() {
    let result = nextPrompt();
    if(result === true)
        nextAction();
})

$('#app').on('click', '#game-ui button', function() {
    round = 0;
    startNewRound();
})

async function showFinalQuestion() {
    const {title, question, answer} = await fetchFinalQuestion();
    setJumbotron('Final Question', 'Category: ' + title, question, answer);
    nextPrompt();
}

function nextAction() {
    console.log("next action");
    count += 1;

    if(count === MAX_COUNT && round == 1) {
        startNewRound();
    } else if(count === MAX_COUNT && round == 2) {
        round += 1;
        showFinalQuestion();
    } else if(round == 3) {
        displayStartScreen();
    }
}

displayStartScreen();