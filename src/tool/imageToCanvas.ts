export default image => {

    let canvas = document.createElement('canvas')

    canvas.setAttribute('width', image.width + "")
    canvas.setAttribute('height', image.height + "")

    canvas.style.width = image.width + "px"
    canvas.style.height = image.height + "px"

    let painter = canvas.getContext('2d')
    painter.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height)

    return canvas
}