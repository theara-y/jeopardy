import { randomIntInclusive } from './Utils.js';

const MOCK_CATEGORIES = [{"id":25617,"title":"the \"j\" effect","clues_count":5,"clues":[{"question":"A 1940s dance to boogie-woogie music","answer":"jitterbug","status":"open"},{"question":"4-word French term meaning a pleasing, indefinable quality","answer":"je ne sais quois","status":"open"},{"question":"It's a beam used to support a ceiling","answer":"a joist","status":"open"},{"question":"It's a Spanish word for \"boss\"","answer":"jefe","status":"open"},{"question":"It's the name some folks use for the additions on the ice cream","answer":"jimmies","status":"open"}]},{"id":1253,"title":"hits of the '80s","clues_count":13,"clues":[{"question":"The profits from this Sager/Bacharach Grammy-winning 1986 single go to AIDS research","answer":"\"That\\'s What Friends Are For\"","status":"open"},{"question":"The only #1 pop hit for Kenny Rogers, it has a 1 word title","answer":"\"Lady\"","status":"open"},{"question":"This Juice Newton song has been the biggest hit of the '80s to start with a \"Q\"","answer":"\"Queen of Hearts\"","status":"open"},{"question":"This song by Olivia Newton-John \"worked out\" to be No. 1 longer than any other song in '81","answer":"\"Physical\"","status":"open"},{"question":"Though he's better known as an actor/comedian, he had the following hit in 1985:\"My girl wants to party all the time /Party all the time /Party all the time /My girl wants to party all the time /Party all the time...\"","answer":"Eddie Murphy","status":"open"}]},{"id":27964,"title":"it's a thanksgiving miracle!","clues_count":5,"clues":[{"question":"Cousin Eddie didn't eat all of this turkey day fave, though Bon AppÃ©tit's \"classic herb & fennel\" recipe turned out mwah!","answer":"stuffing","status":"open"},{"question":"We got through our annual viewing of this 1990 film even with a contrarian uncle rooting for \"Wet Bandits\" Joe Pesci & Daniel Stern","answer":"<i>Home Alone</i>","status":"open"},{"question":"Grandma made it in time even after missing her connecting flight at George Bush Intercontinental in this city","answer":"Houston","status":"open"},{"question":"Sorry to say it's a miracle, fans of this NFL team, but they won! That's big, what with their 37-43-2 all-time record on the day","answer":"the Lions","status":"open"},{"question":"We somehow avoided politics, except dad ranting about this president; we get it, dad, he blew it letting South Carolina secede","answer":"Buchanan","status":"open"}]},{"id":19169,"title":"\"extra\"","clues_count":5,"clues":[{"question":"It's the \"ES\" in ESP, or do you need to read my mind?","answer":"extrasensory","status":"open"},{"question":"After films like \"Alien\" & \"Independence Day\", these beings might demand a better image in the media","answer":"extraterrestrials","status":"open"},{"question":"A YouTube clip from the 1940s shows a newsboy saying this 6-word line before \"Millionaire Playboy in Trouble Again!\"","answer":"\"Extra!  Extra!  Read all about it!\"","status":"open"},{"question":"This adjective means not pertinent to the issue at hand","answer":"extraneous","status":"open"},{"question":"It's calculating a value beyond the range of that which is known","answer":"extrapolation","status":"open"}]},{"id":26259,"title":"relax","clues_count":5,"clues":[{"question":"Do this activity that uses abbreviations like yon (yarn over needle), p2tog (purl 2 stitches together) & w&t (wrap & turn)","answer":"knitting","status":"open"},{"question":"Maybe I'll relax by throwing the ball around with this big breed of dog, seen here","answer":"a Great Dane","status":"open"},{"question":"Nothing soothes like a cup of tea made from this herb, whether it's the German or the Roman variety","answer":"chamomile","status":"open"},{"question":"This type of massage originated in Japan & uses finger pressure to stimulate the circulatory system","answer":"shiatsu","status":"open"},{"question":"Let's enjoy this composer's Brandenburg Concerto No. 6, 3rd movement","answer":"(Johann Sebastian) Bach","status":"open"}]},{"id":12344,"title":"there's a weight","clues_count":5,"clues":[{"question":"The atomic weight of hydrogen, or the number of times LBJ was elected President","answer":"1","status":"open"},{"question":"At the Kentucky Derby, the horses' equipment & these can weigh no less than 126 lbs. combined","answer":"the weight of the jockey","status":"open"},{"question":"(Jon of the Clue Crew delivers the clue as he weighs some metal on a scale) A French city lends its name to this system of weight used with precious metals, in which 12 ounces equals a pound","answer":"Troy weight","status":"open"},{"question":"In Great Britain a \"long\" one of these is equal to 2,240 pounds","answer":"a ton","status":"open"},{"question":"There are this many milligrams in a kilogram","answer":"one million","status":"open"}]}];

const url = 'http://jservice.io/'
const MIN_ID = 2;
const MAX_ID = 28163;

function fetchFinalQuestion() {
    return axios.get(url + '/api/final');
}

function fetchClues(categoryId, offset, indexes) {
    return axios.get(url + '/api/clues', {
        params: {
            category: categoryId,
            offset: offset,
        }
    })
}

function fetchCategory(categoryId) {
    return axios.get(url + '/api/category', { params: { id: categoryId } })
}


async function fetchRandomCategories(nCategories) {
    let ids = []
    let categories = [];
    while(ids.length < nCategories) {
        const categoryId = randomIntInclusive(MIN_ID, MAX_ID);
        if(ids.includes(categoryId))
            continue;

        const response = await fetchCategory(categoryId);

        if(response.status !== 200 || response.data.clues_count < 5)
            continue;

        ids.push(categoryId);
        const {id, title, clues_count} = response.data;

        let clues = [];
        if(clues_count === 5) {
            clues = response.data.clues.map(clue => {
                const {question, answer} = clue;
                return {question, answer, status: 'open'};
            })
        }

        categories.push({id, title, clues_count, clues: clues});
    }

    return [ids, categories];
}

async function fetchRandomClues(category, nClues, totalClues, pageSize) {
    let clues = [];
    while(clues.length < nClues) {
        const randomClue = randomIntInclusive(0, totalClues - 1)
        if(clues.includes(randomClue))
            continue
        clues.push(randomClue)
    }

    clues = clues.map(clue => {
        let offset = Math.floor(clue / pageSize);
        let index = clue % pageSize;
        return [clue, offset, index];
    })
    .reduce((acc, cur) => {
        const [clue, offset, index] = cur;
        if(acc[offset] === undefined) {
            acc[offset] = [index];
        } else {
            acc[offset].push(index);
        }
        return acc;
    }, {})

    let result = []
    for(let offset of Object.keys(clues)) {
        const response = await fetchClues(category.id, offset)

        for(let index of clues[offset]) {
            const {question, answer} = response.data[index]
            result.push({question, answer, status: 'open'})
        }
    }
    category.clues = result;
}

async function fetchData() {
    const [ids, categories] = await fetchRandomCategories(1);
    // for(let category of categories) {
    //     if(category.clues.length !== 5) {
    //         await fetchRandomClues(category, 5, category.clues_count, 100)
    //     }
    // }

    let finalQuestion;
    while(true) {
        const response = await fetchFinalQuestion();
        if(response.status !== 200 || ids.includes(response.data[0].category_id))
            continue;
        const {question, answer, category: {title}} = response.data[0];
        finalQuestion = {title, answer, question}
        break;
    }

    return [finalQuestion, categories]
}

export default fetchData;