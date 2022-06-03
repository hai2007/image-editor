export default (layer, left, top, size, calcSize, calcLeft, calcTop) => {

   let painter = layer.image.getContext('2d')

   left = calcLeft(left)
   top = calcTop(top)
   size = calcSize(size)

   painter.clearRect(left - size * 0.5, top - size * 0.5, size, size)

}