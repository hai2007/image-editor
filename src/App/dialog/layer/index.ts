import { Component } from 'nefbl'
import style from './index.scss'
import template from './index.html'

let doback: Function = (info: any) => { }

@Component({
    template,
    styles: [style]
})
export default class {

    addLayer(config) {
        let listEl = document.getElementById('layer-list')
        if (!config.isAppend) {
            listEl.innerHTML = ""
        }

        let li = document.createElement('li')
        li.setAttribute((<any>this).__uniqueId__, '')
        li.innerHTML = ` <span ${(<any>this).__uniqueId__}>
        缩略图
    </span>
    <input type="text" value="${config.name}" ${(<any>this).__uniqueId__}>`

        listEl.appendChild(li)

        li.addEventListener('click', event => {

            // childNodes 属性返回所有的节点，包括文本节点、注释节点；
            // children 属性只返回元素节点
            let lis = listEl.children
            for (let i = 0; i < lis.length; i++) {
                if (lis[i] != event.currentTarget) {
                    lis[i].setAttribute('active', 'no')
                } else {
                    lis[i].setAttribute('active', 'yes')
                    doback({
                        type:"changeCurrent",
                        activeLayer: i
                    })
                }
            }

        })

        li.click()

    }

    // 主界面设置的回调
    // 如果当前界面有修改，会通过这个方法反馈回去
    addListener(_doback) {
        doback = _doback
    }

}