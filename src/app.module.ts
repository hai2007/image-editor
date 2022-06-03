import { Module } from 'nefbl'

// 主界面
import AppComponent from './App/index'

// 指令
import uiBind from 'sprout-ui/nefbl/directive/ui-bind'
import uiModel from 'sprout-ui/nefbl/directive/ui-model'
import uiOn from 'sprout-ui/nefbl/directive/ui-on'
import uiLazy from 'sprout-ui/nefbl/directive/ui-lazy'
import uiDragdrop from './directive/ui-dragdrop'

@Module({
    declarations: [
        AppComponent,
        uiBind, uiModel, uiOn, uiLazy, uiDragdrop
    ],
    imports: [],
    exports: [],
    bootstrap: AppComponent
})
export default class {

}
