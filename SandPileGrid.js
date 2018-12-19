class SandPileGrid {
    constructor(startAmount, drawOffsetX, drawOffsetY) {
        this._grid = [[startAmount]]
        this.drawOffset = { x: drawOffsetX, y: drawOffsetY }
    }

    getYLength() {
        return this._grid.length
    }

    getXLength() {
        return this._grid[0].length
    }

    set(y, x, val) {
        if (x < 0 || y < 0) return

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
        return this.get(this.drawOffset.x - x, this.drawOffset.y - y)
    }
}
