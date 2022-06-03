import { Component, ref } from 'nefbl'
import style from './index.scss'
import template from './index.html'
import xhtml from '@hai2007/browser/xhtml'

@Component({
    template,
    styles: [style]
})
export default class {

    title: any
    el: any
    width: any
    height: any
    newWidth: any
    newHeight: any
    doback: any
    changeType: any

    $setup() {
        return {
            title: ref(''),
            el: ref(null),
            width: ref(0),
            height: ref(0),
            newWidth: ref(0),
            newHeight: ref(0),
            changeType: ref('center-middle')
        }
    }


    init(init: any) {
        this.title = init.title
        this.el = init.el
        this.width = init.width
        this.height = init.height
        this.newWidth = init.width
        this.newHeight = init.height
        this.doback = init.doback
    }

    update() {
        this.doback(this.newWidth, this.newHeight, this.changeType)
        this.close()
    }

    close() {
        xhtml.remove(this.el)
    }

    doChangeType(event) {
        this.changeType = event.target.getAttribute('val')
    }

    calcHeight() {
        if (this.title == '图像大小') {
            this.newHeight = +(this.newWidth * this.height / this.width).toFixed(0)
        }
    }

    calcWidth() {
        if (this.title == '图像大小') {
            this.newWidth = +(this.newHeight * this.width / this.height).toFixed(0)
        }
    }

}