(self["webpackChunkcovid"] = self["webpackChunkcovid"] || []).push([["src/main/addon/WindowPosition-mjs"],{

/***/ "./node_modules/neo.mjs/src/main/addon/WindowPosition.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/neo.mjs/src/main/addon/WindowPosition.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Base_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/Base.mjs */ "./node_modules/neo.mjs/src/core/Base.mjs");


/**
 *
 * @class Neo.main.addon.WindowPosition
 * @extends Neo.core.Base
 * @singleton
 */
class WindowPosition extends _core_Base_mjs__WEBPACK_IMPORTED_MODULE_0__.default {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.main.addon.WindowPosition'
         * @protected
         */
        className: 'Neo.main.addon.WindowPosition',
        /**
         * @member {String|null} intervalId=null
         */
        intervalId: null,
        /**
         * @member {Number} intervalTime=100
         */
        intervalTime: 20,
        /**
         * Remote method access for other workers
         * @member {Object} remote
         * @protected
         */
        remote: {
            app: [
                'registerWindow',
                'setDock',
                'unregisterWindow'
            ]
        },
        /**
         * @member {Number|null} screenLeft=null
         */
        screenLeft: null,
        /**
         * @member {Number|null} screenTop=null
         */
        screenTop: null,
        /**
         * @member {Boolean} singleton=true
         * @protected
         */
        singleton: true,
        /**
         * @member {Object} windows={}
         * @protected
         */
        windows: {}
    }}

    /**
     * @param {Object} config
     */
    constructor(config) {
        super(config);

        let me  = this,
            win = window;

        me.screenLeft = win.screenLeft;
        me.screenTop  = win.screenTop;

        win.addEventListener('mouseout', me.onMouseOut.bind(me));
        win.addEventListener('resize',   me.onResize.bind(me));
    }

    /**
     *
     */
    adjustPositions() {
        let position;

        Object.entries(this.windows).forEach(([key, value]) => {
            position = this.getPosition(value);

            Neo.Main.windowMoveTo({
                windowName: key,
                x         : position.left,
                y         : position.top
            });
        });
    }

    /**
     *
     */
    checkMovement() {
        let me         = this,
            Manager    = Neo.worker.Manager,
            win        = window,
            screenLeft = win.screenLeft,
            screenTop  = win.screenTop,
            winData;

        if (me.screenLeft !== screenLeft || me.screenTop !== screenTop) {
            winData = Neo.Main.getWindowData();

            me.adjustPositions();

            Manager.sendMessage('app', {
                action: 'windowPositionChange',
                data  : {
                    appName: Manager.appName,
                    ...winData
                }
            });

            me.screenLeft = screenLeft;
            me.screenTop  = screenTop;
        }
    }

    /**
     * Returns true in case the dock direction changes from horizontal (left, right)
     * to vertical (bottom, top) or vice versa.
     * @param {String} oldValue
     * @param {String} newValue
     * @returns {Boolean}
     */
    dockDirectionChange(oldValue, newValue) {
        return (oldValue === 'bottom' || oldValue === 'top') && (newValue === 'left' || newValue === 'right')
            || (newValue === 'bottom' || newValue === 'top') && (oldValue === 'left' || oldValue === 'right');
    }

    /**
     *
     * @param {Object} data
     */
    getPosition(data) {
        let win = window,
            left, top;

        switch (data.dock) {
            case 'bottom':
                left = win.screenLeft;
                top  = win.outerHeight + win.screenTop - 50;
                break;
            case 'left':
                left = win.screenLeft - data.size;
                top  = win.screenTop  + 28;
                break;
            case 'right':
                left = win.outerWidth + win.screenLeft;
                top  = win.screenTop  + 28;
                break;
            case 'top':
                left = win.screenLeft;
                top  = win.screenTop - data.size + 78;
                break;
        }

        return {
            left: left,
            top : top
        };
    }

    /**
     *
     * @param {MouseEvent} event
     */
    onMouseOut(event) {
        let me = this;

        if (!event.toElement) {
            if (!me.intervalId) {
                me.intervalId = setInterval(me.checkMovement.bind(me), me.intervalTime);
            }
        } else if (me.intervalId) {
            clearInterval(me.intervalId);
            me.intervalId = null;
        }
    }

    /**
     *
     * @param {Object} event
     */
    onResize(event) {
        let me  = this,
            win = window,
            height, width;

        Object.entries(me.windows).forEach(([key, value]) => {
            switch (value.dock) {
                case 'bottom':
                case 'top':
                    width = win.outerWidth;
                    break;
                case 'left':
                case 'right':
                    height = win.outerHeight - 28;
                    break;
            }

            Neo.Main.windowResizeTo({
                height    : height,
                width     : width,
                windowName: key
            });
        });

        me.adjustPositions();
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.dock
     * @param {String} data.name
     * @param {Number} data.size
     */
    registerWindow(data) {
        this.windows[data.name] = data;
    }

    /**
     * Docks an existing window to a new side
     * @param {Object} data
     * @param {String} data.dock
     * @param {String} data.name
     */
    setDock(data) {
        let me   = this,
            dock = data.dock,
            name = data.name,
            win  = me.windows[name],
            dockDirectionChange, position;

        if (win) {
            dockDirectionChange = me.dockDirectionChange(dock, win.dock);

            win.dock = dock;
            position = me.getPosition(win);

            if (dockDirectionChange) {
                Neo.Main.windowResizeTo({
                    height    : dock === 'bottom' || dock === 'top'   ? win.size : window.outerHeight - 28,
                    width     : dock === 'left'   || dock === 'right' ? win.size : window.outerWidth,
                    windowName: name
                });
            }

            Neo.Main.windowMoveTo({
                windowName: name,
                x         : position.left,
                y         : position.top
            });
        }
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.name
     */
    unregisterWindow(data) {
        delete this.windows[data.name];
    }
}

Neo.applyClassConfig(WindowPosition);

let instance = Neo.create(WindowPosition);

Neo.applyToGlobalNs(instance);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb3ZpZC8uL25vZGVfbW9kdWxlcy9uZW8ubWpzL3NyYy9tYWluL2FkZG9uL1dpbmRvd1Bvc2l0aW9uLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUF1Qzs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLG1EQUFJO0FBQ2pDLHdCQUF3QjtBQUN4QjtBQUNBLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxpRUFBZSxRQUFRLEUiLCJmaWxlIjoiY2h1bmtzL21haW4vc3JjL21haW4vYWRkb24vV2luZG93UG9zaXRpb24tbWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2UgZnJvbSAnLi4vLi4vY29yZS9CYXNlLm1qcyc7XG5cbi8qKlxuICpcbiAqIEBjbGFzcyBOZW8ubWFpbi5hZGRvbi5XaW5kb3dQb3NpdGlvblxuICogQGV4dGVuZHMgTmVvLmNvcmUuQmFzZVxuICogQHNpbmdsZXRvblxuICovXG5jbGFzcyBXaW5kb3dQb3NpdGlvbiBleHRlbmRzIEJhc2Uge1xuICAgIHN0YXRpYyBnZXRDb25maWcoKSB7cmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1N0cmluZ30gY2xhc3NOYW1lPSdOZW8ubWFpbi5hZGRvbi5XaW5kb3dQb3NpdGlvbidcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgY2xhc3NOYW1lOiAnTmVvLm1haW4uYWRkb24uV2luZG93UG9zaXRpb24nLFxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7U3RyaW5nfG51bGx9IGludGVydmFsSWQ9bnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgaW50ZXJ2YWxJZDogbnVsbCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge051bWJlcn0gaW50ZXJ2YWxUaW1lPTEwMFxuICAgICAgICAgKi9cbiAgICAgICAgaW50ZXJ2YWxUaW1lOiAyMCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW90ZSBtZXRob2QgYWNjZXNzIGZvciBvdGhlciB3b3JrZXJzXG4gICAgICAgICAqIEBtZW1iZXIge09iamVjdH0gcmVtb3RlXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW90ZToge1xuICAgICAgICAgICAgYXBwOiBbXG4gICAgICAgICAgICAgICAgJ3JlZ2lzdGVyV2luZG93JyxcbiAgICAgICAgICAgICAgICAnc2V0RG9jaycsXG4gICAgICAgICAgICAgICAgJ3VucmVnaXN0ZXJXaW5kb3cnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtOdW1iZXJ8bnVsbH0gc2NyZWVuTGVmdD1udWxsXG4gICAgICAgICAqL1xuICAgICAgICBzY3JlZW5MZWZ0OiBudWxsLFxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7TnVtYmVyfG51bGx9IHNjcmVlblRvcD1udWxsXG4gICAgICAgICAqL1xuICAgICAgICBzY3JlZW5Ub3A6IG51bGwsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtCb29sZWFufSBzaW5nbGV0b249dHJ1ZVxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBzaW5nbGV0b246IHRydWUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtPYmplY3R9IHdpbmRvd3M9e31cbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgd2luZG93czoge31cbiAgICB9fVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgICBzdXBlcihjb25maWcpO1xuXG4gICAgICAgIGxldCBtZSAgPSB0aGlzLFxuICAgICAgICAgICAgd2luID0gd2luZG93O1xuXG4gICAgICAgIG1lLnNjcmVlbkxlZnQgPSB3aW4uc2NyZWVuTGVmdDtcbiAgICAgICAgbWUuc2NyZWVuVG9wICA9IHdpbi5zY3JlZW5Ub3A7XG5cbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgbWUub25Nb3VzZU91dC5iaW5kKG1lKSk7XG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAgIG1lLm9uUmVzaXplLmJpbmQobWUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGFkanVzdFBvc2l0aW9ucygpIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uO1xuXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMud2luZG93cykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24odmFsdWUpO1xuXG4gICAgICAgICAgICBOZW8uTWFpbi53aW5kb3dNb3ZlVG8oe1xuICAgICAgICAgICAgICAgIHdpbmRvd05hbWU6IGtleSxcbiAgICAgICAgICAgICAgICB4ICAgICAgICAgOiBwb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgICAgIHkgICAgICAgICA6IHBvc2l0aW9uLnRvcFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY2hlY2tNb3ZlbWVudCgpIHtcbiAgICAgICAgbGV0IG1lICAgICAgICAgPSB0aGlzLFxuICAgICAgICAgICAgTWFuYWdlciAgICA9IE5lby53b3JrZXIuTWFuYWdlcixcbiAgICAgICAgICAgIHdpbiAgICAgICAgPSB3aW5kb3csXG4gICAgICAgICAgICBzY3JlZW5MZWZ0ID0gd2luLnNjcmVlbkxlZnQsXG4gICAgICAgICAgICBzY3JlZW5Ub3AgID0gd2luLnNjcmVlblRvcCxcbiAgICAgICAgICAgIHdpbkRhdGE7XG5cbiAgICAgICAgaWYgKG1lLnNjcmVlbkxlZnQgIT09IHNjcmVlbkxlZnQgfHwgbWUuc2NyZWVuVG9wICE9PSBzY3JlZW5Ub3ApIHtcbiAgICAgICAgICAgIHdpbkRhdGEgPSBOZW8uTWFpbi5nZXRXaW5kb3dEYXRhKCk7XG5cbiAgICAgICAgICAgIG1lLmFkanVzdFBvc2l0aW9ucygpO1xuXG4gICAgICAgICAgICBNYW5hZ2VyLnNlbmRNZXNzYWdlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnd2luZG93UG9zaXRpb25DaGFuZ2UnLFxuICAgICAgICAgICAgICAgIGRhdGEgIDoge1xuICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBNYW5hZ2VyLmFwcE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIC4uLndpbkRhdGFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWUuc2NyZWVuTGVmdCA9IHNjcmVlbkxlZnQ7XG4gICAgICAgICAgICBtZS5zY3JlZW5Ub3AgID0gc2NyZWVuVG9wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGluIGNhc2UgdGhlIGRvY2sgZGlyZWN0aW9uIGNoYW5nZXMgZnJvbSBob3Jpem9udGFsIChsZWZ0LCByaWdodClcbiAgICAgKiB0byB2ZXJ0aWNhbCAoYm90dG9tLCB0b3ApIG9yIHZpY2UgdmVyc2EuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9sZFZhbHVlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5ld1ZhbHVlXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgZG9ja0RpcmVjdGlvbkNoYW5nZShvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIChvbGRWYWx1ZSA9PT0gJ2JvdHRvbScgfHwgb2xkVmFsdWUgPT09ICd0b3AnKSAmJiAobmV3VmFsdWUgPT09ICdsZWZ0JyB8fCBuZXdWYWx1ZSA9PT0gJ3JpZ2h0JylcbiAgICAgICAgICAgIHx8IChuZXdWYWx1ZSA9PT0gJ2JvdHRvbScgfHwgbmV3VmFsdWUgPT09ICd0b3AnKSAmJiAob2xkVmFsdWUgPT09ICdsZWZ0JyB8fCBvbGRWYWx1ZSA9PT0gJ3JpZ2h0Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgIGdldFBvc2l0aW9uKGRhdGEpIHtcbiAgICAgICAgbGV0IHdpbiA9IHdpbmRvdyxcbiAgICAgICAgICAgIGxlZnQsIHRvcDtcblxuICAgICAgICBzd2l0Y2ggKGRhdGEuZG9jaykge1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICBsZWZ0ID0gd2luLnNjcmVlbkxlZnQ7XG4gICAgICAgICAgICAgICAgdG9wICA9IHdpbi5vdXRlckhlaWdodCArIHdpbi5zY3JlZW5Ub3AgLSA1MDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIGxlZnQgPSB3aW4uc2NyZWVuTGVmdCAtIGRhdGEuc2l6ZTtcbiAgICAgICAgICAgICAgICB0b3AgID0gd2luLnNjcmVlblRvcCAgKyAyODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICBsZWZ0ID0gd2luLm91dGVyV2lkdGggKyB3aW4uc2NyZWVuTGVmdDtcbiAgICAgICAgICAgICAgICB0b3AgID0gd2luLnNjcmVlblRvcCAgKyAyODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgbGVmdCA9IHdpbi5zY3JlZW5MZWZ0O1xuICAgICAgICAgICAgICAgIHRvcCAgPSB3aW4uc2NyZWVuVG9wIC0gZGF0YS5zaXplICsgNzg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgIHRvcCA6IHRvcFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudFxuICAgICAqL1xuICAgIG9uTW91c2VPdXQoZXZlbnQpIHtcbiAgICAgICAgbGV0IG1lID0gdGhpcztcblxuICAgICAgICBpZiAoIWV2ZW50LnRvRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFtZS5pbnRlcnZhbElkKSB7XG4gICAgICAgICAgICAgICAgbWUuaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKG1lLmNoZWNrTW92ZW1lbnQuYmluZChtZSksIG1lLmludGVydmFsVGltZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWUuaW50ZXJ2YWxJZCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChtZS5pbnRlcnZhbElkKTtcbiAgICAgICAgICAgIG1lLmludGVydmFsSWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAgICAgKi9cbiAgICBvblJlc2l6ZShldmVudCkge1xuICAgICAgICBsZXQgbWUgID0gdGhpcyxcbiAgICAgICAgICAgIHdpbiA9IHdpbmRvdyxcbiAgICAgICAgICAgIGhlaWdodCwgd2lkdGg7XG5cbiAgICAgICAgT2JqZWN0LmVudHJpZXMobWUud2luZG93cykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZhbHVlLmRvY2spIHtcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gd2luLm91dGVyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gd2luLm91dGVySGVpZ2h0IC0gMjg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBOZW8uTWFpbi53aW5kb3dSZXNpemVUbyh7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ICAgIDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoICAgICA6IHdpZHRoLFxuICAgICAgICAgICAgICAgIHdpbmRvd05hbWU6IGtleVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1lLmFkanVzdFBvc2l0aW9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5kb2NrXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEubmFtZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkYXRhLnNpemVcbiAgICAgKi9cbiAgICByZWdpc3RlcldpbmRvdyhkYXRhKSB7XG4gICAgICAgIHRoaXMud2luZG93c1tkYXRhLm5hbWVdID0gZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2NrcyBhbiBleGlzdGluZyB3aW5kb3cgdG8gYSBuZXcgc2lkZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEuZG9ja1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLm5hbWVcbiAgICAgKi9cbiAgICBzZXREb2NrKGRhdGEpIHtcbiAgICAgICAgbGV0IG1lICAgPSB0aGlzLFxuICAgICAgICAgICAgZG9jayA9IGRhdGEuZG9jayxcbiAgICAgICAgICAgIG5hbWUgPSBkYXRhLm5hbWUsXG4gICAgICAgICAgICB3aW4gID0gbWUud2luZG93c1tuYW1lXSxcbiAgICAgICAgICAgIGRvY2tEaXJlY3Rpb25DaGFuZ2UsIHBvc2l0aW9uO1xuXG4gICAgICAgIGlmICh3aW4pIHtcbiAgICAgICAgICAgIGRvY2tEaXJlY3Rpb25DaGFuZ2UgPSBtZS5kb2NrRGlyZWN0aW9uQ2hhbmdlKGRvY2ssIHdpbi5kb2NrKTtcblxuICAgICAgICAgICAgd2luLmRvY2sgPSBkb2NrO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBtZS5nZXRQb3NpdGlvbih3aW4pO1xuXG4gICAgICAgICAgICBpZiAoZG9ja0RpcmVjdGlvbkNoYW5nZSkge1xuICAgICAgICAgICAgICAgIE5lby5NYWluLndpbmRvd1Jlc2l6ZVRvKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICAgIDogZG9jayA9PT0gJ2JvdHRvbScgfHwgZG9jayA9PT0gJ3RvcCcgICA/IHdpbi5zaXplIDogd2luZG93Lm91dGVySGVpZ2h0IC0gMjgsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoICAgICA6IGRvY2sgPT09ICdsZWZ0JyAgIHx8IGRvY2sgPT09ICdyaWdodCcgPyB3aW4uc2l6ZSA6IHdpbmRvdy5vdXRlcldpZHRoLFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3dOYW1lOiBuYW1lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE5lby5NYWluLndpbmRvd01vdmVUbyh7XG4gICAgICAgICAgICAgICAgd2luZG93TmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICB4ICAgICAgICAgOiBwb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgICAgIHkgICAgICAgICA6IHBvc2l0aW9uLnRvcFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEubmFtZVxuICAgICAqL1xuICAgIHVucmVnaXN0ZXJXaW5kb3coZGF0YSkge1xuICAgICAgICBkZWxldGUgdGhpcy53aW5kb3dzW2RhdGEubmFtZV07XG4gICAgfVxufVxuXG5OZW8uYXBwbHlDbGFzc0NvbmZpZyhXaW5kb3dQb3NpdGlvbik7XG5cbmxldCBpbnN0YW5jZSA9IE5lby5jcmVhdGUoV2luZG93UG9zaXRpb24pO1xuXG5OZW8uYXBwbHlUb0dsb2JhbE5zKGluc3RhbmNlKTtcblxuZXhwb3J0IGRlZmF1bHQgaW5zdGFuY2U7Il0sInNvdXJjZVJvb3QiOiIifQ==