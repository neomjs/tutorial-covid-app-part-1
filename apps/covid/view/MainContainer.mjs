import Viewport from '../../../node_modules/neo.mjs/src/container/Viewport.mjs';

/**
 * @class Covid.view.MainContainer
 * @extends Neo.container.Viewport
 */
class MainContainer extends Viewport {
    static getConfig() {return {
        className: 'Covid.view.MainContainer',
        ntype    : 'main-container',

        autoMount: true,
        layout   : {ntype: 'vbox', align: 'stretch'},

        items: [
            {ntype: 'component', vdom: {innerHTML: 'Header'}},
            {ntype: 'component', vdom: {innerHTML: 'Center'}},
            {ntype: 'component', vdom: {innerHTML: 'Footer'}}
        ]
    }}
}

Neo.applyClassConfig(MainContainer);

export {MainContainer as default};