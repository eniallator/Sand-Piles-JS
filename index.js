const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let pixels = [...Array(canvas.height)].map(e => Array(canvas.width).fill(0))
let newPixels = [...Array(canvas.height)].map(e => Array(canvas.width).fill(0))

const imgData = ctx.createImageData(canvas.width, canvas.height)

const maxGrains = 3
const dirToCheck = [[0, -1], [0, 1], [-1, 0], [1, 0]]
const colours = [[237, 191, 198], [175, 141, 134], [95, 72, 66], [67, 46, 54], [38, 12, 26]]

pixels[Math.floor(canvas.height / 2)][Math.floor(canvas.width / 2)] = 100000

function nextGen() {
    for (let y = 0; y < pixels.length; y++) {
        for (let x = 0; x < pixels[y].length; x++) {
            newPixels[y][x] = pixels[y][x] - (pixels[y][x] <= maxGrains ? 0 : 4)

            for (let dir of dirToCheck) {
                if (pixels[y + dir[0]] && pixels[y + dir[0]][x + dir[1]] > maxGrains) {
                    newPixels[y][x]++
                }
            }
        }
    }

    const temp = pixels
    pixels = newPixels
    newPixels = temp

    for (let y in pixels) {
        for (let x in pixels[y]) {
            let col
            if (pixels[y][x] >= colours.length) col = colours[colours.length - 1]
            else col = colours[pixels[y][x]]

            const pix = (y * pixels[y].length + +x) * 4
            imgData.data[pix] = col[0]
            imgData.data[pix + 1] = col[1]
            imgData.data[pix + 2] = col[2]
            imgData.data[pix + 3] = 255
        }
    }

    ctx.putImageData(imgData, 0, 0)
}

function run() {
    for (let i = 0; i < 10; i++) nextGen()
    requestAnimationFrame(run)
}

run()
