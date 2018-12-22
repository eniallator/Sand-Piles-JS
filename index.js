const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const imgData = ctx.createImageData(canvas.width, canvas.height)
const maxGrains = 3
const dirToCheck = [[0, -1], [0, 1], [-1, 0], [1, 0]]
const colours = [[237, 191, 198], [175, 141, 134], [95, 72, 66], [67, 46, 54], [38, 12, 26]]

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
            imgData.data[pix] = col[0]
            imgData.data[pix + 1] = col[1]
            imgData.data[pix + 2] = col[2]
            imgData.data[pix + 3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

function run() {
    for (let i = 0; i < 10; i++) update()
    draw()
    requestAnimationFrame(run)
}

run()
