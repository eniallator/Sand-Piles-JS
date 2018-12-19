class SandPileGrid {
    constructor(startAmount, offsetX, offsetY) {
        this._grid = [[startAmount]]
        this.offset = { x: offsetX, y: offsetY }
    }

    getYLength() {
        return this._grid.length
    }

    getXLength() {
        return this._grid[0].length
    }

    set(y, x, val) {
        if (x < 0 || y < 0 || x > this.offset.x || y > this.offset.y) return

        if (y >= this._grid.length) {
            for (let i = this._grid.length; i <= y; i++) {
                this._grid.push(Array(this._grid[0].length).fill(0))
            }
        }

        if (x >= this._grid[y].length) {
            for (let i = 0; i < this._grid.length; i++) {
                for (let j = this._grid.length; j <= x; j++) {
                    this._grid[i].push(0)
                }
            }
        }

        this._grid[y][x] = val
    }

    get(y, x) {
        x = Math.abs(x)
        y = Math.abs(y)

        return (this._grid[y] && this._grid[y][x]) || 0
    }

    getDrawVals(y, x) {
        return this.get(this.offset.x - x, this.offset.y - y)
    }
}
