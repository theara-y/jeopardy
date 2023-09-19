export function displayLoadingIndicator() {
    $('#app').append($('<div id="loading-indicator"><div>'))
}

export function removeLoadingIndicator() {
    $('#loading-indicator').remove();
}

export async function displayGameBoard(categories, gameRound) {
    displayTiles(6, 5);
    await displayHeaders(categories)
    await displayValues(6, 5, gameRound);
}

function displayTiles(nCategories, nCluesPerCategory) {
    const gameBoard = $('<div id="game-board"></div>')
    for(let y = 0; y < nCategories; y++) {
        gameBoard.append(`<div class="game-tile-header"><div id="col${y}-header" class="game-tile-text"></div></div>`);
    }

    for(let x = 0; x < nCluesPerCategory; x++) {
        for(let y = 0; y < nCategories; y++) {
            gameBoard.append(`<div data-y="${y}" data-x="${x}" class="game-tile"><div id="col${y}-row${x}" class="game-tile-text"></div></div>`)
        }
    }

    $('#app').append(gameBoard);
    $('#app').append('<div id="expanded-game-tile"><div id="expanded-game-tile-text"></div></div>')
}

function displayHeaders(categories) {
    let promises = [];
    for(let i = 0; i < categories.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    $(`#col${i}-header`).text(categories[i].title);
                    resolve(true);
                }, i * 500)
            })
        )
    }
    return Promise.all(promises);
}

function displayValues(nCategories, nCluesPerCategory, gameRound) {
    let promises = [];
    for(let y = 0; y < nCategories; y++) {
        for(let x = 0; x < nCluesPerCategory; x++) {
            promises.push(
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        $(`#col${y}-row${x}`).html(`$${(x + 1) * 200 * gameRound}`)
                        resolve(true);
                    }, Math.random() * 1200 + 500)  
                })
            )
        }
    }
    return Promise.all(promises);
}

export function displayStartScreen() {
    $('#app').append(
        $(`
            <div id="game-ui">
                <img src="./jeopardy_logo.png">
                <button>S T A R T</button>
                <div id="info">
                    <div>Theara Ya</div>
                    <div>Powered by jservice.io</div>
                </div>
            </div>
        `)
    )
}