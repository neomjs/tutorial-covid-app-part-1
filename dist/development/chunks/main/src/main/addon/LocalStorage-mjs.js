(self["webpackChunkcovid"] = self["webpackChunkcovid"] || []).push([["src/main/addon/LocalStorage-mjs"],{

/***/ "./node_modules/neo.mjs/src/main/addon/LocalStorage.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/neo.mjs/src/main/addon/LocalStorage.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Base_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/Base.mjs */ "./node_modules/neo.mjs/src/core/Base.mjs");


/**
 * Basic CRUD support for window.localStorage
 * @class Neo.main.addon.LocalStorage
 * @extends Neo.core.Base
 * @singleton
 */
class LocalStorage extends _core_Base_mjs__WEBPACK_IMPORTED_MODULE_0__.default {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.main.addon.LocalStorage'
         * @protected
         */
        className: 'Neo.main.addon.LocalStorage',
        /**
         * Remote method access for other workers
         * @member {Object} remote={app: [//...]}
         * @protected
         */
        remote: {
            app: [
                'createLocalStorageItem',
                'destroyLocalStorageItem',
                'readLocalStorageItem',
                'updateLocalStorageItem'
            ]
        },
        /**
         * @member {Boolean} singleton=true
         * @protected
         */
        singleton: true
    }}

    /**
     * Creates a new item into window.localStorage
     * Uses updateLocalStorageItem() internally
     * @param {Object} opts
     * @param {String} opts.key
     * @param {String} opts.value
     */
    createLocalStorageItem(opts) {
        this.updateLocalStorageItem(opts);
    }

    /**
     * Removes an item from window.localStorage
     * @param {Object} opts
     * @param {String} opts.key
     */
    destroyLocalStorageItem(opts) {
        window.localStorage.removeItem(opts.key);
    }

    /**
     * Gets an item from window.localStorage
     * @param {Object} opts
     * @param {String} opts.key
     */
    readLocalStorageItem(opts) {
        return {
            key  : opts.key,
            value: window.localStorage.getItem(opts.key)
        }
    }

    /**
     * Reads an item from window.localStorage
     * @param {Object} opts
     * @param {String} opts.key
     * @param {String} opts.value
     */
    updateLocalStorageItem(opts) {
        window.localStorage.setItem(opts.key, opts.value);
    }
}

Neo.applyClassConfig(LocalStorage);

let instance = Neo.create(LocalStorage);

Neo.applyToGlobalNs(instance);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb3ZpZC8uL25vZGVfbW9kdWxlcy9uZW8ubWpzL3NyYy9tYWluL2FkZG9uL0xvY2FsU3RvcmFnZS5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixtREFBSTtBQUMvQix3QkFBd0I7QUFDeEI7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU8sU0FBUztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxpRUFBZSxRQUFRLEUiLCJmaWxlIjoiY2h1bmtzL21haW4vc3JjL21haW4vYWRkb24vTG9jYWxTdG9yYWdlLW1qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlIGZyb20gJy4uLy4uL2NvcmUvQmFzZS5tanMnO1xuXG4vKipcbiAqIEJhc2ljIENSVUQgc3VwcG9ydCBmb3Igd2luZG93LmxvY2FsU3RvcmFnZVxuICogQGNsYXNzIE5lby5tYWluLmFkZG9uLkxvY2FsU3RvcmFnZVxuICogQGV4dGVuZHMgTmVvLmNvcmUuQmFzZVxuICogQHNpbmdsZXRvblxuICovXG5jbGFzcyBMb2NhbFN0b3JhZ2UgZXh0ZW5kcyBCYXNlIHtcbiAgICBzdGF0aWMgZ2V0Q29uZmlnKCkge3JldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtTdHJpbmd9IGNsYXNzTmFtZT0nTmVvLm1haW4uYWRkb24uTG9jYWxTdG9yYWdlJ1xuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBjbGFzc05hbWU6ICdOZW8ubWFpbi5hZGRvbi5Mb2NhbFN0b3JhZ2UnLFxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3RlIG1ldGhvZCBhY2Nlc3MgZm9yIG90aGVyIHdvcmtlcnNcbiAgICAgICAgICogQG1lbWJlciB7T2JqZWN0fSByZW1vdGU9e2FwcDogWy8vLi4uXX1cbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3RlOiB7XG4gICAgICAgICAgICBhcHA6IFtcbiAgICAgICAgICAgICAgICAnY3JlYXRlTG9jYWxTdG9yYWdlSXRlbScsXG4gICAgICAgICAgICAgICAgJ2Rlc3Ryb3lMb2NhbFN0b3JhZ2VJdGVtJyxcbiAgICAgICAgICAgICAgICAncmVhZExvY2FsU3RvcmFnZUl0ZW0nLFxuICAgICAgICAgICAgICAgICd1cGRhdGVMb2NhbFN0b3JhZ2VJdGVtJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7Qm9vbGVhbn0gc2luZ2xldG9uPXRydWVcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgc2luZ2xldG9uOiB0cnVlXG4gICAgfX1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgaXRlbSBpbnRvIHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICAgKiBVc2VzIHVwZGF0ZUxvY2FsU3RvcmFnZUl0ZW0oKSBpbnRlcm5hbGx5XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0cy5rZXlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0cy52YWx1ZVxuICAgICAqL1xuICAgIGNyZWF0ZUxvY2FsU3RvcmFnZUl0ZW0ob3B0cykge1xuICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsU3RvcmFnZUl0ZW0ob3B0cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbiBpdGVtIGZyb20gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdHMua2V5XG4gICAgICovXG4gICAgZGVzdHJveUxvY2FsU3RvcmFnZUl0ZW0ob3B0cykge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0ob3B0cy5rZXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYW4gaXRlbSBmcm9tIHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLmtleVxuICAgICAqL1xuICAgIHJlYWRMb2NhbFN0b3JhZ2VJdGVtKG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleSAgOiBvcHRzLmtleSxcbiAgICAgICAgICAgIHZhbHVlOiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0ob3B0cy5rZXkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkcyBhbiBpdGVtIGZyb20gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdHMua2V5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdHMudmFsdWVcbiAgICAgKi9cbiAgICB1cGRhdGVMb2NhbFN0b3JhZ2VJdGVtKG9wdHMpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKG9wdHMua2V5LCBvcHRzLnZhbHVlKTtcbiAgICB9XG59XG5cbk5lby5hcHBseUNsYXNzQ29uZmlnKExvY2FsU3RvcmFnZSk7XG5cbmxldCBpbnN0YW5jZSA9IE5lby5jcmVhdGUoTG9jYWxTdG9yYWdlKTtcblxuTmVvLmFwcGx5VG9HbG9iYWxOcyhpbnN0YW5jZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3RhbmNlOyJdLCJzb3VyY2VSb290IjoiIn0=