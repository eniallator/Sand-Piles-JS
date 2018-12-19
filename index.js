const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const imgData = ctx.createImageData(canvas.width, canvas.height)
const maxGrains = 3
const dirToCheck = [[0, -1], [0, 1], [-1, 0], [1, 0]]
const colours = [[237, 191, 198], [175, 141, 134], [95, 72, 66], [67, 46, 54], [38, 12, 26]]

const mid = { x: Math.ceil(canvas.width / 2), y: Math.ceil(canvas.height / 2) }
let pixels = new SandPileGrid(1000000, mid.x, mid.y)
let newPixels = new SandPileGrid(1000000, mid.x, mid.y)

function nextGen() {
    for (let y = 0; y < pixels.getYLength(); y++) {
        for (let x = 0; x < pixels.getXLength(); x++) {
            const oldVal = pixels.get(y, x)
            if (oldVal > maxGrains) {
                newPixels.set(y, x, oldVal - 4)

                for (let dir of dirToCheck) {
                    newPixels.set(y + dir[0], x + dir[1], newPixels.get(y + dir[0], x + dir[1]) + 1)
                }
            }
        }
    }

    const temp = pixels
    pixels = newPixels
    newPixels = temp

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const col = colours[pixels.getDrawVals(y, x)] || colours[colours.length - 1]
            const pix = (y * imgData.width + x) * 4

            imgData.data[pix] = col[0]
            imgData.data[pix + 1] = col[1]
            imgData.data[pix + 2] = col[2]
            imgData.data[pix + 3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

function run() {
    for (let i = 0; i < 5; i++) nextGen()
    requestAnimationFrame(run)
}

run()
