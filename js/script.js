import Grid from "./Grid.js"
import Tile from "./Tile.js"
const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()

function setupInput() {
    let container = document.querySelector('body');
    let listener = SwipeListener(container);
    container.addEventListener('swipe', handleSwipe, { once: true });
    window.addEventListener("keydown", handleInput, { once: true });
}

const scoreNumberSpan = document.querySelector('.scoreNumber')
const bestScoreNumber = document.querySelector('.bestScoreNumber')
localStorage.setItem('Score', 0)
bestScoreNumber.textContent = localStorage.getItem('BestScore')

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput()
                return
            }
            await moveUp()
            break
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }
            await moveRight()
            break
        default:
            setupInput()
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles())
    scoreNumberSpan.textContent = localStorage.getItem('Score');

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            if (!localStorage.BestScore) {
                localStorage.setItem('BestScore', localStorage.getItem('Score'))
            } else {
                if (parseInt(localStorage.getItem('Score')) >= parseInt(localStorage.getItem('BestScore'))) {
                    localStorage.setItem('BestScore', localStorage.getItem('Score'))
                }
            }
            gameBoard.classList.add('lose')
        })
        return
    }

    setupInput()
}

async function handleSwipe(e) {
    if (e.detail.x[0] < e.detail.x[1] && (e.detail.y[0] + 150) >= e.detail.y[1] && (e.detail.y[0] - 150) <= e.detail.y[1]) {
        if (!canMoveRight()) {
            setupInput()
            return
        }
        await moveRight()
    } else if (e.detail.x[0] > e.detail.x[1] && (e.detail.y[0] + 150) >= e.detail.y[1] && (e.detail.y[0] - 150) <= e.detail.y[1]) {
        if (!canMoveLeft()) {
            setupInput()
            return
        }
        await moveLeft()
    } else if (e.detail.y[0] > e.detail.y[1] && (e.detail.x[0] + 150) >= e.detail.x[1] && (e.detail.x[0] - 150) <= e.detail.x[1]) {
        if (!canMoveUp()) {
            setupInput()
            return
        }
        await moveUp()
    } else if (e.detail.y[0] < e.detail.y[1] && (e.detail.x[0] + 150) >= e.detail.x[1] && (e.detail.x[0] - 150) <= e.detail.x[1]) {
        if (!canMoveDown()) {
            setupInput()
            return
        }
        await moveDown()
    }
    else {
        setupInput()
        return
    }

    grid.cells.forEach(cell => cell.mergeTiles())
    scoreNumberSpan.textContent = localStorage.getItem('Score');

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            if (!localStorage.BestScore) {
                localStorage.setItem('BestScore', localStorage.getItem('Score'))
            } else {
                if (parseInt(localStorage.getItem('Score')) >= parseInt(localStorage.getItem('BestScore'))) {
                    localStorage.setItem('BestScore', localStorage.getItem('Score'))
                }
            }
            gameBoard.classList.add('lose')
        })
        return
    }

    setupInput()
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (cell.tile == null) continue
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }

                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile
                    } else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null
                }
            }
            return promises
        })
    )
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.cellsByRow)
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}