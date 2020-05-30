import HeaderContainer         from './HeaderContainer.mjs';
import MainContainerController from './MainContainerController.mjs';
import Viewport                from '../../../node_modules/neo.mjs/src/container/Viewport.mjs';

/**
 * @class Covid.view.MainContainer
 * @extends Neo.container.Viewport
 */
class MainContainer extends Viewport {
    static getConfig() {return {
        className: 'Covid.view.MainContainer',
        ntype    : 'main-container',

        autoMount : true,
        controller: MainContainerController,
        layout    : {ntype: 'vbox', align: 'stretch'},

        items: [
            {module: HeaderContainer, height: 120},
            {ntype : 'component',     vdom  : {innerHTML: 'Center'}},
            {ntype : 'component',     vdom  : {innerHTML: 'Footer'}}
        ]
    }}
}

Neo.applyClassConfig(MainContainer);

export {MainContainer as default};