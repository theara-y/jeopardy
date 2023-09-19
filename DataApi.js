import { randomIntInclusive } from './Utils.js';

const url = 'https://jservice.io/'
const MIN_ID = 2;
const MAX_ID = 28163;

export async function fetchFinalQuestion() {
    while(true) {
        const response = await axios.get(url + '/api/final');
        if(response.status !== 200)
            continue;
        const {question, answer, category: {title}} = response.data[0];
        return {title, answer, question};
    }
}

function fetchClues(categoryId, offset) {
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

    return categories;
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

export async function fetchData() {
    const categories = await fetchRandomCategories(6);
    for(let category of categories) {
        if(category.clues.length !== 5) {
            await fetchRandomClues(category, 5, category.clues_count, 100)
        }
    }

    return categories;
}