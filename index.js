import fetchData from "./DataApi.js";
import { displayLoadingIndicator, removeLoadingIndicator, displayGameBoard, displayStartScreen } from "./Display.js";

const MOCK = [{"id":25617,"title":"the \"j\" effect","clues_count":5,"clues":[{"question":"A 1940s dance to boogie-woogie music","answer":"jitterbug","status":"open"},{"question":"4-word French term meaning a pleasing, indefinable quality","answer":"je ne sais quois","status":"open"},{"question":"It's a beam used to support a ceiling","answer":"a joist","status":"open"},{"question":"It's a Spanish word for \"boss\"","answer":"jefe","status":"open"},{"question":"It's the name some folks use for the additions on the ice cream","answer":"jimmies","status":"open"}]},{"id":1253,"title":"hits of the '80s","clues_count":13,"clues":[{"question":"The profits from this Sager/Bacharach Grammy-winning 1986 single go to AIDS research","answer":"\"That\\'s What Friends Are For\"","status":"open"},{"question":"The only #1 pop hit for Kenny Rogers, it has a 1 word title","answer":"\"Lady\"","status":"open"},{"question":"This Juice Newton song has been the biggest hit of the '80s to start with a \"Q\"","answer":"\"Queen of Hearts\"","status":"open"},{"question":"This song by Olivia Newton-John \"worked out\" to be No. 1 longer than any other song in '81","answer":"\"Physical\"","status":"open"},{"question":"Though he's better known as an actor/comedian, he had the following hit in 1985:\"My girl wants to party all the time /Party all the time /Party all the time /My girl wants to party all the time /Party all the time...\"","answer":"Eddie Murphy","status":"open"}]},{"id":27964,"title":"it's a thanksgiving miracle!","clues_count":5,"clues":[{"question":"Cousin Eddie didn't eat all of this turkey day fave, though Bon AppÃ©tit's \"classic herb & fennel\" recipe turned out mwah!","answer":"stuffing","status":"open"},{"question":"We got through our annual viewing of this 1990 film even with a contrarian uncle rooting for \"Wet Bandits\" Joe Pesci & Daniel Stern","answer":"<i>Home Alone</i>","status":"open"},{"question":"Grandma made it in time even after missing her connecting flight at George Bush Intercontinental in this city","answer":"Houston","status":"open"},{"question":"Sorry to say it's a miracle, fans of this NFL team, but they won! That's big, what with their 37-43-2 all-time record on the day","answer":"the Lions","status":"open"},{"question":"We somehow avoided politics, except dad ranting about this president; we get it, dad, he blew it letting South Carolina secede","answer":"Buchanan","status":"open"}]},{"id":19169,"title":"\"extra\"","clues_count":5,"clues":[{"question":"It's the \"ES\" in ESP, or do you need to read my mind?","answer":"extrasensory","status":"open"},{"question":"After films like \"Alien\" & \"Independence Day\", these beings might demand a better image in the media","answer":"extraterrestrials","status":"open"},{"question":"A YouTube clip from the 1940s shows a newsboy saying this 6-word line before \"Millionaire Playboy in Trouble Again!\"","answer":"\"Extra!  Extra!  Read all about it!\"","status":"open"},{"question":"This adjective means not pertinent to the issue at hand","answer":"extraneous","status":"open"},{"question":"It's calculating a value beyond the range of that which is known","answer":"extrapolation","status":"open"}]},{"id":26259,"title":"relax","clues_count":5,"clues":[{"question":"Do this activity that uses abbreviations like yon (yarn over needle), p2tog (purl 2 stitches together) & w&t (wrap & turn)","answer":"knitting","status":"open"},{"question":"Maybe I'll relax by throwing the ball around with this big breed of dog, seen here","answer":"a Great Dane","status":"open"},{"question":"Nothing soothes like a cup of tea made from this herb, whether it's the German or the Roman variety","answer":"chamomile","status":"open"},{"question":"This type of massage originated in Japan & uses finger pressure to stimulate the circulatory system","answer":"shiatsu","status":"open"},{"question":"Let's enjoy this composer's Brandenburg Concerto No. 6, 3rd movement","answer":"(Johann Sebastian) Bach","status":"open"}]},{"id":12344,"title":"there's a weight","clues_count":5,"clues":[{"question":"The atomic weight of hydrogen, or the number of times LBJ was elected President","answer":"1","status":"open"},{"question":"At the Kentucky Derby, the horses' equipment & these can weigh no less than 126 lbs. combined","answer":"the weight of the jockey","status":"open"},{"question":"(Jon of the Clue Crew delivers the clue as he weighs some metal on a scale) A French city lends its name to this system of weight used with precious metals, in which 12 ounces equals a pound","answer":"Troy weight","status":"open"},{"question":"In Great Britain a \"long\" one of these is equal to 2,240 pounds","answer":"a ton","status":"open"},{"question":"There are this many milligrams in a kilogram","answer":"one million","status":"open"}]}];
let categories;
let isLoading;
let round = 0;
let counter = 0;

function isRoundOver() {
    return counter == 30;
}

async function startGame() {
    $('#app').html('');
    counter = 0;
    round++;
    isLoading = true;
    displayLoadingIndicator();

    categories = MOCK.slice();
    console.log(categories);
    // const [finalQuestion, cats] = await fetchData()
    // console.log(finalQuestion);
    await displayGameBoard(categories, round)

    setTimeout(() => {
        removeLoadingIndicator();
        isLoading = false;
    }, 1000)
}


$('#app').on('click', '.game-tile', function() {
    if(!isLoading) {
        const gameTile = $(this);
        const y = Number(gameTile.data('y'));
        const x = Number(gameTile.data('x'));
        
        const clue = categories[y].clues[x];

        if(clue.status === 'open') {
            clue.status = 'question';
            $('#expanded-game-tile').data('y', y).data('x', x)
            $('#expanded-game-tile-text').html(clue.question);
            $('#expanded-game-tile').css('transform', 'rotateX(360deg) scale(1, 1)')
        }
    }
})

$('#app').on('click', '#expanded-game-tile', function() {
    const gameTile = $('#expanded-game-tile');
    const y = Number(gameTile.data('y'));
    const x = Number(gameTile.data('x'));

    console.log('expanded', y, x);

    const clue = categories[y].clues[x];
    console.log(clue);

    if(clue.status === 'question') {
        clue.status = 'answer';
        $('#expanded-game-tile-text').html(clue.answer);
        $(`#col${y}-row${x}`).html('');
    } else if(clue.status === 'answer') {
        counter++;
        clue.status = 'closed';
        $('#expanded-game-tile').css('transform', 'rotateX(0) scale(0.1, 0)')

        if(isRoundOver()) {
            if(round === 2) {
                setTimeout(() => {
                    alert(`Final Question`);
                    $('#expanded-game-tile-text').html('Final Question');
                    $('#expanded-game-tile').css('transform', 'rotateX(360deg) scale(1, 1)')
                })
            } else {
                setTimeout(() => {
                    alert(`Round ${round} Over`);
                    startGame();
                }, 1500)
            }
        }
    }
})

$('#app').on('click', '#game-ui button', function() {
    startGame();
})

// displayGameBoard();
// showFinalQuestion();

// function showFinalQuestion() {
    
// }
// fetchData()
// .then(res => {
//     const [finalQuestion, cats] = res;
//     console.log(finalQuestion);
// })