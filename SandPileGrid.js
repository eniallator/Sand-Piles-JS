class SandPileGrid {
    constructor(startAmount, offsetX, offsetY) {
        this._grid = [[startAmount]]
        this._offset = { x: offsetX, y: offsetY }
    }

    getYLength() {
        return this._grid.length
    }

    getXLength() {
        return this._grid[0].length
    }

    set(y, x, val) {
        if (x < 0 || y < 0 || x > this._offset.x || y > this._offset.y) return

        for (let i = this._grid.length; i <= y; i++) {
            this._grid.push(Array(this._grid[0].length).fill(0))
        }

        for (let i = 0; i < this._grid.length; i++) {
            for (let j = this._grid[i].length; j <= x; j++) {
                this._grid[i].push(0)
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
        return this.get(this._offset.y - y, this._offset.x - x)
    }
}
