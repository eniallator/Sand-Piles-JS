const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const iterRange = document.getElementById('iterRange')
const iterOutput = document.getElementById('iterOutput')
iterOutput.innerHTML = iterRange.value

iterRange.oninput = () => {
    iterOutput.innerHTML = iterRange.value
}

const imgData = ctx.createImageData(canvas.width, canvas.height)
const maxGrains = 3
const dirToCheck = [[0, -1], [0, 1], [-1, 0], [1, 0]]

let colours = [[237, 191, 198], [175, 141, 134], [95, 72, 66], [67, 46, 54], [38, 12, 26]]

function validateColour(strCol) {
    try {
        const col = JSON.parse(strCol)
        if (col.length !== 3) return false
        for (let n of col) if (String(n).indexOf('.') !== -1 || n < 0 || n > 255) return false
        return col
    } catch (SyntaxError) {
        return false
    }
}

const paramRegex = /[?&]?([^=]+)=([^&]*)/g
let tokens
while ((tokens = paramRegex.exec(document.location.search))) {
    const index = Number(decodeURIComponent(tokens[1]))
    const strCol = decodeURIComponent(tokens[2])

    const validatedColour = validateColour(strCol)
    const validatedIndex = !isNaN(index) && String(index).indexOf('.') === -1 && index >= 0

    if (validatedIndex && validatedColour) colours[index] = validatedColour
}

const mid = { x: Math.ceil(imgData.width / 2), y: Math.ceil(imgData.height / 2) }
let pixels = new SandPileGrid(1000000, mid.x, mid.y)

function update() {
    const newPixels = new SandPileGrid(1000000, mid.x, mid.y)

    for (let y = 0; y < pixels.getYLength(); y++) {
        for (let x = 0; x <= y; x++) {
            if (pixels.get(y, x) > maxGrains) {
                newPixels.set(y, x, newPixels.get(y, x) + pixels.get(y, x) - 4)

                for (let dir of dirToCheck) {
                    let val = newPixels.get(y + dir[0], x + dir[1]) + 1
                    if (y + dir[0] < 1 && y > 0) val++

                    newPixels.set(y + dir[0], x + dir[1], val)
                }
            } else newPixels.set(y, x, newPixels.get(y, x) + pixels.get(y, x))
        }
    }

    pixels = newPixels
}

function draw() {
    const pixelDim = imgData.height / (pixels.getYLength() * 2 + 1)
    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
            const col = colours[pixels.getDrawVals(Math.floor(y / pixelDim), Math.floor(x / pixelDim))] || colours[colours.length - 1]
            const pix = (y * imgData.width + x) * 4
            imgData.data[pix] = col && col[0] ? col[0] : 255
            imgData.data[pix + 1] = col && col[1] ? col[1] : 255
            imgData.data[pix + 2] = col && col[2] ? col[2] : 255
            imgData.data[pix + 3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

function run() {
    for (let i = 0; i < iterRange.value; i++) update()
    draw()
    requestAnimationFrame(run)
}

run()
