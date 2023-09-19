import fetchData from "./DataApi.js";
import useLoadingIndicator from "./LoadingIndicator.js";
import useJumbotron from "./Jumbotron.js";
import {displayGameBoard, displayStartScreen } from "./Display.js";

const MOCK = [{"id":25617,"title":"the \"j\" effect","clues_count":5,"clues":[{"question":"A 1940s dance to boogie-woogie music","answer":"jitterbug","status":"open"},{"question":"4-word French term meaning a pleasing, indefinable quality","answer":"je ne sais quois","status":"open"},{"question":"It's a beam used to support a ceiling","answer":"a joist","status":"open"},{"question":"It's a Spanish word for \"boss\"","answer":"jefe","status":"open"},{"question":"It's the name some folks use for the additions on the ice cream","answer":"jimmies","status":"open"}]},{"id":1253,"title":"hits of the '80s","clues_count":13,"clues":[{"question":"The profits from this Sager/Bacharach Grammy-winning 1986 single go to AIDS research","answer":"\"That\\'s What Friends Are For\"","status":"open"},{"question":"The only #1 pop hit for Kenny Rogers, it has a 1 word title","answer":"\"Lady\"","status":"open"},{"question":"This Juice Newton song has been the biggest hit of the '80s to start with a \"Q\"","answer":"\"Queen of Hearts\"","status":"open"},{"question":"This song by Olivia Newton-John \"worked out\" to be No. 1 longer than any other song in '81","answer":"\"Physical\"","status":"open"},{"question":"Though he's better known as an actor/comedian, he had the following hit in 1985:\"My girl wants to party all the time /Party all the time /Party all the time /My girl wants to party all the time /Party all the time...\"","answer":"Eddie Murphy","status":"open"}]},{"id":27964,"title":"it's a thanksgiving miracle!","clues_count":5,"clues":[{"question":"Cousin Eddie didn't eat all of this turkey day fave, though Bon AppÃ©tit's \"classic herb & fennel\" recipe turned out mwah!","answer":"stuffing","status":"open"},{"question":"We got through our annual viewing of this 1990 film even with a contrarian uncle rooting for \"Wet Bandits\" Joe Pesci & Daniel Stern","answer":"<i>Home Alone</i>","status":"open"},{"question":"Grandma made it in time even after missing her connecting flight at George Bush Intercontinental in this city","answer":"Houston","status":"open"},{"question":"Sorry to say it's a miracle, fans of this NFL team, but they won! That's big, what with their 37-43-2 all-time record on the day","answer":"the Lions","status":"open"},{"question":"We somehow avoided politics, except dad ranting about this president; we get it, dad, he blew it letting South Carolina secede","answer":"Buchanan","status":"open"}]},{"id":19169,"title":"\"extra\"","clues_count":5,"clues":[{"question":"It's the \"ES\" in ESP, or do you need to read my mind?","answer":"extrasensory","status":"open"},{"question":"After films like \"Alien\" & \"Independence Day\", these beings might demand a better image in the media","answer":"extraterrestrials","status":"open"},{"question":"A YouTube clip from the 1940s shows a newsboy saying this 6-word line before \"Millionaire Playboy in Trouble Again!\"","answer":"\"Extra!  Extra!  Read all about it!\"","status":"open"},{"question":"This adjective means not pertinent to the issue at hand","answer":"extraneous","status":"open"},{"question":"It's calculating a value beyond the range of that which is known","answer":"extrapolation","status":"open"}]},{"id":26259,"title":"relax","clues_count":5,"clues":[{"question":"Do this activity that uses abbreviations like yon (yarn over needle), p2tog (purl 2 stitches together) & w&t (wrap & turn)","answer":"knitting","status":"open"},{"question":"Maybe I'll relax by throwing the ball around with this big breed of dog, seen here","answer":"a Great Dane","status":"open"},{"question":"Nothing soothes like a cup of tea made from this herb, whether it's the German or the Roman variety","answer":"chamomile","status":"open"},{"question":"This type of massage originated in Japan & uses finger pressure to stimulate the circulatory system","answer":"shiatsu","status":"open"},{"question":"Let's enjoy this composer's Brandenburg Concerto No. 6, 3rd movement","answer":"(Johann Sebastian) Bach","status":"open"}]},{"id":12344,"title":"there's a weight","clues_count":5,"clues":[{"question":"The atomic weight of hydrogen, or the number of times LBJ was elected President","answer":"1","status":"open"},{"question":"At the Kentucky Derby, the horses' equipment & these can weigh no less than 126 lbs. combined","answer":"the weight of the jockey","status":"open"},{"question":"(Jon of the Clue Crew delivers the clue as he weighs some metal on a scale) A French city lends its name to this system of weight used with precious metals, in which 12 ounces equals a pound","answer":"Troy weight","status":"open"},{"question":"In Great Britain a \"long\" one of these is equal to 2,240 pounds","answer":"a ton","status":"open"},{"question":"There are this many milligrams in a kilogram","answer":"one million","status":"open"}]}];
const MOCK_FINAL = {"title":"card games","answer":"baccarat","question":"Chapter 9 of Ian Fleming's \"Casino Royale\" is called \"The Game is\" this"};

let [isLoading, toggleLoading] = useLoadingIndicator(false)
let [nextPrompt, setJumbotron] = useJumbotron();
const MAX_COUNT = 1;

let round = 0;
let count = 0;
let categories = [];
let finalQuestion = {};

async function startNewRound() {
    $('#app').html('');
    toggleLoading();
    count = 0;
    round += 1;
    categories = MOCK.slice();
    finalQuestion = {...MOCK_FINAL};
    await displayGameBoard(categories, round);
    toggleLoading();

    // const [finalQuestion, cats] = await fetchData()
    // console.log(finalQuestion);
}

startNewRound();


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
    startNewRound();
})

function showFinalQuestion() {
    const {title, question, answer} = finalQuestion;
    setJumbotron('Final Question', 'Category: ' + title, question, answer);
    nextPrompt();
}

function nextAction() {
    count += 1;

    if(count === MAX_COUNT && round == 1) {
        startNewRound();
    } else if(count === MAX_COUNT && round == 2) {
        showFinalQuestion();
    } else {
        displayStartScreen();
    }
}