import Clunch from 'clunch'

Clunch.series('ui-picture', ['json', 'number', ($json, $number) => {
    return {
        attrs: {
            image: $json(),
            left: $number(),
            top: $number(),
            width: $number(),
            height: $number()
        },
        link(painter, attr) {

            painter.drawImage(
                attr.image,
                0, 0,
                attr.image.width,
                attr.image.height,
                attr.left,
                attr.top,
                attr.width * 2,
                attr.height * 2
            )

        }

    }
}])