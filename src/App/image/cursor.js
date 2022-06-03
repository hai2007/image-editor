import Clunch from 'clunch'

Clunch.series('ui-cursor', ['json', 'string', 'number', ($json, $string, $number) => {
    return {
        attrs: {
            left: $number(),
            top: $number(),
            type: $string(),
            params: $json()
        },
        link(painter, attr) {

            painter.config({
                "shadowBlur": 2,
                "shadowColor": "white"
            })

            // 移动工具
            if (attr.type == 'move') {

                painter
                    .config({
                        fillStyle: "black",
                        strokeStyle: "white"
                    })
                    .beginPath()
                    .moveTo(attr.left, attr.top)
                    .lineTo(attr.left + 5, attr.top + 10)
                    .lineTo(attr.left + 10, attr.top + 5)
                    .closePath()
                    .full()

            }

            // 橡皮擦
            else if (attr.type == 'eraser' || attr.type == 'eraser-bg') {

                painter
                    .config({
                        strokeStyle: "black"
                    })
                    .strokeRect(attr.left - attr.params.size * 0.5, attr.top - attr.params.size * 0.5, attr.params.size, attr.params.size)

                // 背景橡皮擦
                if (attr.type == 'eraser-bg') {

                    painter.beginPath().moveTo(attr.left - 2, attr.top).lineTo(attr.left + 2, attr.top).stroke()
                        .beginPath().moveTo(attr.left, attr.top - 2).lineTo(attr.left, attr.top + 2).stroke()

                }

            }

        }

    }
}])