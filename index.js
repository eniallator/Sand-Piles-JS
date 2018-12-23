const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const iterRange = document.getElementById('iterRange')
const iterOutput = document.getElementById('iterOutput')
iterOutput.innerHTML = iterRange.value

iterRange.oninput = () => {
    iterOutput.innerHTML = iterRange.value
}

function hexToRGB(hex) {
    const match = hex.toLowerCase().match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/)
    if (!match) return false
    return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
}

const RGBToHex = RGB => RGB.reduce((acc, n) => acc + (n < 16 ? '0' : '') + n.toString(16), '')

const colourElements = [
    document.getElementById('colour0'),
    document.getElementById('colour1'),
    document.getElementById('colour2'),
    document.getElementById('colour3'),
    document.getElementById('colour4')
]
const defaultColours = ['edbfc6', 'af8d86', '5f4842', '432e36', '260c1a']
let colours = []
for (let i in defaultColours) {
    const col = defaultColours[i]
    colours.push(hexToRGB(col))
    colourElements[i].value = '#' + col
    colourElements[i].addEventListener(
        'input',
        ev => {
            colours[i] = hexToRGB(colourElements[i].value)
            const match = window.location.href.match(/^.*\?/)
            const pageURL = match ? match[0] : window.location.href + '?'
            const URIParams = colours.reduce((acc, col, i) => {
                const hexCol = RGBToHex(col)
                if (defaultColours[i] === hexCol) return acc
                return acc + (acc !== '' ? '&' : '') + i + '=' + hexCol
            }, '')
            history.pushState({}, document.title, pageURL + URIParams)
        },
        false
    )
}

function validateColour(strCol) {
    return strCol.toLowerCase().match(/^[\da-f]{6}$/) && hexToRGB(strCol)
}

const paramRegex = /[?&]?([^=]+)=([^&]*)/g
let tokens
while ((tokens = paramRegex.exec(document.location.search))) {
    const index = Number(decodeURIComponent(tokens[1]))
    const strCol = decodeURIComponent(tokens[2])

    const validatedColour = validateColour(strCol)
    const validatedIndex = !isNaN(index) && String(index).indexOf('.') === -1 && index >= 0

    if (validatedIndex && validatedColour) {
        if (colourElements[index]) colourElements[index].value = '#' + strCol
        colours[index] = validatedColour
    }
}

const imgData = ctx.createImageData(canvas.width, canvas.height)
const maxGrains = 3
const dirToCheck = [[0, -1], [0, 1], [-1, 0], [1, 0]]
let iterNum = 0

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
    iterNum++
}

function draw() {
    const pixelDim = imgData.height / (pixels.getYLength() * 2 + 1)
    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
            const col = colours[pixels.getDrawVals(Math.floor(y / pixelDim), Math.floor(x / pixelDim))] || colours[colours.length - 1]
            const pix = (y * imgData.width + x) * 4
            imgData.data[pix] = col && !isNaN(col[0]) ? col[0] : 255
            imgData.data[pix + 1] = col && !isNaN(col[1]) ? col[1] : 255
            imgData.data[pix + 2] = col && !isNaN(col[2]) ? col[2] : 255
            imgData.data[pix + 3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
    const size = 12
    ctx.font = size + 'px Arial'
    ctx.fillText('Iterations: ' + iterNum, 5, size)
}

function run() {
    for (let i = 0; i < iterRange.value; i++) update()
    draw()
    requestAnimationFrame(run)
}

run()
