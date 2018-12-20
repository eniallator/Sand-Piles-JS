class SandPileGrid {
    constructor(startAmount, offsetX, offsetY) {
        this._grid = [[startAmount]]
        this._offset = { x: offsetX, y: offsetY }
    }

    getYLength() {
        return this._grid.length
    }

    _getindexVals(y, x) {
        x = Math.abs(x)
        y = Math.abs(y)
        return {
            x: Math.min(x, y),
            y: Math.max(x, y)
        }
    }

    set(y, x, val) {
        x = Math.abs(x)

        if (x < 0 || y < 0 || x > y || y > this._offset.y) return

        for (let i = this._grid.length; i <= y; i++) {
            this._grid.push(Array(i + 1).fill(0))
        }

        this._grid[y][x] = val
    }

    get(y, x) {
        const index = this._getindexVals(y, x)

        return (this._grid[index.y] && this._grid[index.y][index.x]) || 0
    }

    getDrawVals(y, x) {
        return this.get(this._offset.y - y, this._offset.x - x)
    }
}
