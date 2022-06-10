import { Component, ref, mountComponent, reactive } from 'nefbl'
import Clunch from 'clunch'
import { isString } from '@hai2007/tool/type'
import getKeyString from '@hai2007/browser/getKeyString.js'

import imageToCanvas from '../tool/imageToCanvas'
import doEraser from '../tool/eraser'
import doBgEraser from '../tool/bgEraser'

import style from './index.scss'
import template from './index.html'
import image from './index.clunch'

// 图层绘制对象
import './image/mosaic.js'
import './image/picture.js'
import './image/cursor.js'

import lazyLoad from './dialog/lazy-load.js'

let clunch: any
let activeLayer: any = null

@Component({
    template,
    styles: [style]
})
export default class {

    width: any
    height: any
    marginTop: any
    marginLeft: any

    dialog: any

    activeTool: any

    move_size: any
    eraser_size: any
    eraser_bg_size: any


    $setup() {
        return {
            width: ref(""),
            height: ref(""),
            marginTop: ref(""),
            marginLeft: ref(""),
            dialog: reactive({}),
            activeTool: ref(null),

            // 移动工具
            move_size: ref(1),

            // 橡皮擦
            eraser_size: ref(10),

            // 背景橡皮擦
            eraser_bg_size: ref(10)

        }
    }

    openDialog(dialogName) {
        return new Promise((resolve, reject) => {
            lazyLoad[dialogName]().then((data => {
                let li = document.createElement('li')
                document.getElementById('dialog').appendChild(li)
                resolve({
                    component: mountComponent(li, data.default, this['_module']),
                    el: li
                })
            }))
        })
    }

    updateSize(width, height) {
        this.width = width
        this.height = height
        this.marginTop = "calc(50vh - 40px - " + height * 0.5 + "px)"
        this.marginLeft = "calc(50vw - " + width * 0.5 + "px)"
    }

    toggleWin(winName) {

        return new Promise((resolve, reject) => {

            if (!isString(winName)) {
                winName = winName.target.getAttribute('name')
            }

            if (!this.dialog[winName]) {
                this.openDialog(winName).then((target: any) => {
                    this.dialog[winName] = {
                        flag: true,
                        component: target.component,
                        el: target.el
                    }
                    resolve(this.dialog[winName])
                })
            } else {
                this.dialog[winName].flag = !this.dialog[winName].flag
                if (this.dialog[winName].flag) {
                    this.dialog[winName].el.style.display = ''
                } else {
                    this.dialog[winName].el.style.display = 'none'
                }
                resolve(this.dialog[winName])
            }

        })

    }

    $mounted() {

        // 初始化开始就自动打开的窗口
        this.toggleWin('tool').then((target: any) => {

            // 监听工具信息
            target.component.addListener(data => {
                this.activeTool = data.activeTool
            })
        })
        this.toggleWin('layer').then((target: any) => {

            // 监听图层信息
            target.component.addListener(data => {

                //   如果当前选中的图层
                if (data.type == 'changeCurrent') {
                    activeLayer = data.activeLayer
                }

            })

        })

        // 初始化画布大小
        this.updateSize(700, 500)

        // 启动绘图
        clunch = new Clunch({
            el: document.getElementById('image-root'),
            render: image,
            animation: false,
            debug: false,
            data() {
                return {
                    mosaic: true,
                    flag: "",
                    layers: [],
                    cursor: {
                        left: 0,
                        top: 0,
                        type: "move",
                        params: {}
                    }
                }
            }
        }).$bind('mousemove', target => {

            clunch.cursor = {
                left: target.left,
                top: target.top,
                type: this.activeTool,
                params: {
                    "move": {},
                    "eraser": {
                        size: this.eraser_size
                    },
                    "eraser-bg": {
                        size: this.eraser_bg_size
                    }
                }[this.activeTool]
            }

        })

        // 挂载到window方便调试
        globalThis.clunch = clunch

        /**
         * 键盘操作统一处理
         */

        // 按下
        document.body.addEventListener('keydown', event => {

            let keyString = getKeyString(event)

            // 选中了图层
            if (activeLayer != null) {
                let currentLayerInstance = clunch.layers[activeLayer]

                // 移动工具
                if (this.activeTool == 'move') {

                    if (['up', 'down', 'left', 'right'].indexOf(keyString) > -1) {

                        if (currentLayerInstance.type == 'picture') {

                            if (['left', 'right'].indexOf(keyString) > -1) {
                                clunch.layers[activeLayer].left += (keyString == 'left' ? -1 : 1) * this.move_size
                            } else {
                                clunch.layers[activeLayer].top += (keyString == 'up' ? -1 : 1) * this.move_size
                            }

                        }

                    }

                }

                clunch.flag = new Date().valueOf()
            }

        })

        /**
         * 统一处理鼠标事件
         */

        // 点击
        clunch.$bind('click', target => {

            // 选中了图层
            if (activeLayer != null) {
                let currentLayerInstance = clunch.layers[activeLayer]

                if (currentLayerInstance.type == 'picture') {

                    let calcSize = val => {
                        return currentLayerInstance.image.width * val / currentLayerInstance.width
                    }

                    let calcLeft = val => {
                        return calcSize(val - currentLayerInstance.left)
                    }

                    let calcTop = val => {
                        return calcSize(val - currentLayerInstance.top)
                    }

                    // 橡皮擦
                    if (this.activeTool == 'eraser') {
                        doEraser(currentLayerInstance, target.left, target.top, this.eraser_size, calcSize, calcLeft, calcTop)
                    }

                    //  背景橡皮擦
                    else if (this.activeTool == 'eraser-bg') {
                        doBgEraser(currentLayerInstance, target.left, target.top, this.eraser_bg_size, calcSize, calcLeft, calcTop)
                    }

                }

                clunch.flag = new Date().valueOf()
            }

        })


    }

    // 文件 / 导入
    importImage(event) {
        let file = event.target.files[0]
        let reader = new FileReader()

        reader.onload = () => {
            let image = new Image()
            image.onload = () => {

                let flag = event.target.getAttribute('flag')

                // 置入
                // 置入就是在原来的基础上新增内容
                // 然后会居中展开，不会修改画布大小
                if (flag == 'append') {
                    clunch.layers.push({
                        image: imageToCanvas(image),
                        type: "picture",
                        left: (clunch._width - image.width) * 0.5,
                        top: (clunch._height - image.height) * 0.5,
                        width: image.width,
                        height: image.height
                    })
                    clunch.flag = new Date().valueOf()
                }

                // 导入
                // 就是把当前环境改为导入的内容
                // 然后会根据图片大小修改画布大小
                else {

                    //  重置画布大小
                    this.updateSize(image.width, image.height)

                    clunch.layers = [{
                        image: imageToCanvas(image),
                        type: "picture",
                        left: 0,
                        top: 0,
                        width: image.width,
                        height: image.height
                    }]
                }

                this.dialog.layer.component.addLayer({
                    isAppend: flag == 'append',
                    name: file.name
                })

            }
            image.src = <string>reader.result
        }
        reader.readAsDataURL(file)
    }

    // 文件 / 导出
    exportImage() {

        clunch.mosaic = false

        setTimeout(() => {

            let canvas = document.createElement('canvas')
            canvas.setAttribute('width', clunch._width)
            canvas.setAttribute('height', clunch._height)

            canvas.getContext('2d').drawImage(clunch.__canvas, 0, 0, clunch._width * 2, clunch._height * 2, 0, 0, clunch._width, clunch._height)

            let btn = document.createElement('a')
            btn.href = canvas.toDataURL('image/png')
            btn.download = "default.png"
            btn.click()

            clunch.mosaic = true
        }, 100)

    }

    // 编辑 / 画布大小
    editCanvasSize() {
        this.openDialog('size').then((target: any) => {

            let _this = this

            target.component.init({
                title: "画布大小",
                el: target.el,
                width: clunch._width,
                height: clunch._height,
                doback(newWidth, newHeight, changeType) {

                    console.log(changeType)

                    _this.updateSize(newWidth, newHeight)

                    for (let i = 0; i < clunch.layers.length; i++) {
                        let layer = clunch.layers[i]
                        if (layer.type = 'picture') {

                            if (changeType == 'left-top') {

                                // todo

                            } else if (changeType == 'center-top') {

                                clunch.layers[i].left = layer.left - (clunch._width - newWidth) * 0.5

                            } else if (changeType == 'rigth-top') {

                                clunch.layers[i].left = newWidth - clunch._width + layer.left

                            } else if (changeType == 'left-middle') {

                                clunch.layers[i].top = layer.top - (clunch._height - newHeight) * 0.5

                            } else if (changeType == 'center-middle') {

                                clunch.layers[i].left = layer.left - (clunch._width - newWidth) * 0.5
                                clunch.layers[i].top = layer.top - (clunch._height - newHeight) * 0.5

                            } else if (changeType == 'rigth-middle') {

                                clunch.layers[i].left = newWidth - clunch._width + layer.left
                                clunch.layers[i].top = layer.top - (clunch._height - newHeight) * 0.5

                            } else if (changeType == 'left-bottom') {

                                clunch.layers[i].top = newHeight - clunch._height + layer.top

                            } else if (changeType == 'center-bottom') {

                                clunch.layers[i].left = layer.left - (clunch._width - newWidth) * 0.5
                                clunch.layers[i].top = newHeight - clunch._height + layer.top

                            } else if (changeType == 'rigth-bottom') {

                                clunch.layers[i].left = newWidth - clunch._width + layer.left
                                clunch.layers[i].top = newHeight - clunch._height + layer.top

                            }

                        }
                    }

                }
            })
        })
    }

    // 编辑 / 图像大小
    editImageSize() {
        this.openDialog('size').then((target: any) => {

            let _this = this

            target.component.init({
                title: "图像大小",
                el: target.el,
                width: clunch._width,
                height: clunch._height,
                doback(newWidth, newHeight) {

                    for (let i = 0; i < clunch.layers.length; i++) {
                        let layer = clunch.layers[i]
                        if (layer.type = 'picture') {

                            clunch.layers[i].width = (newWidth / clunch._width) * layer.width
                            clunch.layers[i].left = (newWidth / clunch._width) * layer.left

                            clunch.layers[i].height = (newHeight / clunch._height) * layer.height
                            clunch.layers[i].top = (newHeight / clunch._height) * layer.top

                        }
                    }
                    _this.updateSize(newWidth, newHeight)

                }
            })
        })
    }

}