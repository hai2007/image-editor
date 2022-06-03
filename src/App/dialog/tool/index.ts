import { Component, ref } from 'nefbl'
import ColorsPicker from 'colors-picker'

import style from './index.scss'
import template from './index.html'

let doback: Function = (info: any) => { }

@Component({
    template,
    styles: [style]
})
export default class {

    active: any

    $setup() {
        return {
            active: ref('move')
        }
    }

    changeTool(event) {
        this.active = event.target.getAttribute('name')
        doback({
            activeTool: this.active
        })

    }

    $mounted() {
        setTimeout(() => {
            doback({
                activeTool: "move"
            })
        })

        ColorsPicker(document.getElementById('backcolor'), document.getElementById('backcolor').style.backgroundColor || "black", '选择背景色').then(function (color) {
            document.getElementById('backcolor').style.backgroundColor = color
        })

        ColorsPicker(document.getElementById('forecolor'), document.getElementById('forecolor').style.backgroundColor || "white", '选择前景色').then(function (color) {
            document.getElementById('forecolor').style.backgroundColor = color
        })

    }

    // 主界面设置的回调
    // 如果当前界面有修改，会通过这个方法反馈回去
    addListener(_doback) {
        doback = _doback
    }

}