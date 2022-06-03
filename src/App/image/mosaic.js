import Clunch from 'clunch'

Clunch.series('ui-mosaic', [() => {
    return {
        link(painter) {

            painter.config({
                fillStyle: "#ccc"
            })

            // 单个马赛克的大小
            let size = 10

            for (let i = 0; i < this._width / size; i++) {
                for (let j = i % 2; j < this._height / size; j += 2) {
                    painter.fillRect(i * size, j * size, size, size)
                }
            }

        }

    }
}])