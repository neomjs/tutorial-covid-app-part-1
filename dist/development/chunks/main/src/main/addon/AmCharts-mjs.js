(self["webpackChunkcovid"] = self["webpackChunkcovid"] || []).push([["src/main/addon/AmCharts-mjs"],{

/***/ "./node_modules/neo.mjs/src/main/addon/AmCharts.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/neo.mjs/src/main/addon/AmCharts.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_Base_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/Base.mjs */ "./node_modules/neo.mjs/src/core/Base.mjs");
/* harmony import */ var _DomAccess_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../DomAccess.mjs */ "./node_modules/neo.mjs/src/main/DomAccess.mjs");



/**
 * Helper class to include amCharts into your neo.mjs app
 * https://www.amcharts.com/docs/v4/
 * @class Neo.main.addon.AmCharts
 * @extends Neo.core.Base
 * @singleton
 */
class AmCharts extends _core_Base_mjs__WEBPACK_IMPORTED_MODULE_0__.default {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.main.addon.AmCharts'
         * @protected
         */
        className: 'Neo.main.addon.AmCharts',
        /**
         * Stores all chart ids inside an object
         * @member {Object} charts={}
         * @protected
         */
        charts: {},
        /**
         * Stores all chart config objects which arrived before the chart lib scripts got loaded
         * @member {Object[]} chartsToCreate=[]
         * @protected
         */
        chartsToCreate: [],
        /**
         * Stores all chart data inside an object. key => chart id
         * No array since in case a chart gets loaded multiple times, we only want to apply the last data on mount.
         * @member {Object} dataMap={}
         * @protected
         */
        dataMap: {},
        /**
         * @member {String} downloadPath='https//www.amcharts.com/lib/4/'
         * @protected
         */
        downloadPath: 'https://www.amcharts.com/lib/4/',
        /**
         * @member {String} fallbackPath='https://neomjs.github.io/pages/resources/amCharts/'
         * @protected
         */
        fallbackPath: 'https://neomjs.github.io/pages/resources/amCharts/',
        /**
         * @member {Boolean} scriptsLoaded_=true
         * @protected
         */
        scriptsLoaded_: false,
        /**
         * @member {Boolean} singleton=true
         * @protected
         */
        singleton: true,
        /**
         * Remote method access for other workers
         * @member {Object} remote={app: [//...]}
         * @protected
         */
        remote: {
            app: [
                'callMethod',
                'create',
                'destroy',
                'setProperties',
                'setProperty',
                'updateData'
            ]
        }
    }}

    /**
     *
     * @param {Object} config
     */
    constructor(config) {
        super(config);

        this.insertAmChartsScripts();
    }

    /**
     * Triggered after the scriptsLoaded config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetScriptsLoaded(value, oldValue) {
        if (value) {
            const me = this;

            me.chartsToCreate.forEach(config => {
                me.create(config);
            });

            me.chartsToCreate = [];

            setTimeout(() => {
                Object.entries(me.dataMap).forEach(([key, dataValue]) => {
                    me.updateData(dataValue);
                });

                me.dataMap = {};
            }, 1000);
        }
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.id
     * @param {String} data.path
     * @param {Array} [data.params]
     */
    callMethod(data) {
        if (this.hasChart(data.id)) {
            const chart      = this.charts[data.id],
                  pathArray  = data.path.split('.'),
                  methodName = pathArray.pop(),
                  scope      = pathArray.length < 1 ? chart:  Neo.ns(pathArray.join('.'), false, chart);

            scope[methodName].call(scope, ...data.params || []);
        } else {
            // todo
        }
    }

    /**
     *
     * @param {Object} chart
     */
    combineSeriesTooltip(chart) {
        chart.series.each(series => {
            series.adapter.add('tooltipText', () => {
                let text = "[bold]{dateX}[/]\n";

                chart.series.each(item => {
                    text += "[" + item.stroke + "]●[/] " + item.name + ": {" + item.dataFields.valueY + "}\n";
                });

                return text;
            });
        });
    }

    /**
     *
     * @param {Object}  data
     * @param {Boolean} data.combineSeriesTooltip
     * @param {Object}  data.config
     * @param {Array}   [data.data]
     * @param {String}  [data.dataPath]
     * @param {String}  data.id
     * @param {String}  data.package
     * @param {String}  data.type='XYChart'
     */
    create(data) {
        const me = this;

        if (!me.scriptsLoaded) {
            me.chartsToCreate.push(data);
        } else {
            // todo: check if self[data.package] exists, if not load it and call create afterwards

            me.charts[data.id] = am4core.createFromConfig(data.config, data.id, self[data.package][data.type || 'XYChart']);

            if (data.combineSeriesTooltip) {
                me.combineSeriesTooltip(me.charts[data.id]);
            }

            // in case data has arrived before the chart got created, apply it now
            if (data.data) {
                me.updateData({
                    data    : data.data,
                    dataPath: data.dataPath,
                    id      : data.id
                });
            } else if (me.dataMap[data.id]) {
                me.updateData(me.dataMap[data.id]);
                delete me.dataMap[data.id];
            }
        }
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.id
     */
    destroy(data) {
        this.charts[data.id].dispose();
        delete this.charts[data.id];
    }

    /**
     *
     * @param {String} id
     * @returns {Boolean}
     */
    hasChart(id) {
        return !!this.charts[id];
    }

    /**
     * Async approach
     * core.js has to arrive first or the other scripts will cause JS errors since they rely on it
     * => fetching the other files after core.js is loaded
     */
    insertAmChartsScripts(useFallback=false) {
        const me       = this,
              basePath = useFallback ? me.fallbackPath : me.downloadPath;

        _DomAccess_mjs__WEBPACK_IMPORTED_MODULE_1__.default.loadScript(basePath + 'core.js').then(() => {
            Promise.all([
                _DomAccess_mjs__WEBPACK_IMPORTED_MODULE_1__.default.loadScript(basePath + 'charts.js'),
                _DomAccess_mjs__WEBPACK_IMPORTED_MODULE_1__.default.loadScript(basePath + 'maps.js'),
                _DomAccess_mjs__WEBPACK_IMPORTED_MODULE_1__.default.loadScript(basePath + 'geodata/worldLow.js')
            ]).then(() => {
                me.scriptsLoaded = true;
            });
        }).catch(e => {
            console.log('Download from amcharts.com failed, switching to fallback', e);
            me.insertAmChartsScripts(true);
        });
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.id
     * @param {Object} data.properties
     */
    setProperties(data) {
        Object.entries(data.properties).forEach(([key, value]) => {
            this.setProperty({
                id   : data.id,
                path : key,
                value: value
            })
        });
    }

    /**
     *
     * @param {Object} data
     * @param {String} data.id
     * @param {Boolean} [data.isColor=false] true will wrap the value into am4core.color()
     * @param {String} data.path
     * @param {*} data.value
     */
    setProperty(data) {
        if (this.hasChart(data.id)) {
            const chart        = this.charts[data.id],
                  pathArray    = data.path.split('.'),
                  propertyName = pathArray.pop(),
                  scope        = Neo.ns(pathArray.join('.'), false, chart);

            scope[propertyName] = data.isColor ? am4core.color(data.value) : data.value;
        } else {
            // todo
        }
    }

    /**
     *
     * @param {Object} data
     * @param {Object} data.data
     * @param {String} data.dataPath
     * @param {String} data.id
     */
    updateData(data) {
        const me = this;

        if (!me.scriptsLoaded || !me.hasChart(data.id)) {
            me.dataMap[data.id] = data;
        } else {
            const chart = me.charts[data.id];

            if (data.dataPath === '') {
                chart.data = data.data;
            } else {
                Neo.ns(data.dataPath, false, chart).data = data.data;
            }
        }
    }
}

Neo.applyClassConfig(AmCharts);

let instance = Neo.create(AmCharts);

Neo.applyToGlobalNs(instance);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb3ZpZC8uL25vZGVfbW9kdWxlcy9uZW8ubWpzL3NyYy9tYWluL2FkZG9uL0FtQ2hhcnRzLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBNEM7QUFDSDs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbURBQUk7QUFDM0Isd0JBQXdCO0FBQ3hCO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU8sU0FBUztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE1BQU07QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTTs7QUFFekM7QUFDQSwyRUFBMkUsK0JBQStCO0FBQzFHLGlCQUFpQjs7QUFFakI7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsT0FBTztBQUN0QixlQUFlLE1BQU07QUFDckIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsOERBQW9CO0FBQzVCO0FBQ0EsZ0JBQWdCLDhEQUFvQjtBQUNwQyxnQkFBZ0IsOERBQW9CO0FBQ3BDLGdCQUFnQiw4REFBb0I7QUFDcEM7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsUUFBUTtBQUN2QixlQUFlLE9BQU87QUFDdEIsZUFBZSxFQUFFO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxpRUFBZSxRQUFRLEUiLCJmaWxlIjoiY2h1bmtzL21haW4vc3JjL21haW4vYWRkb24vQW1DaGFydHMtbWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2UgICAgICBmcm9tICcuLi8uLi9jb3JlL0Jhc2UubWpzJztcbmltcG9ydCBEb21BY2Nlc3MgZnJvbSAnLi4vRG9tQWNjZXNzLm1qcyc7XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIHRvIGluY2x1ZGUgYW1DaGFydHMgaW50byB5b3VyIG5lby5tanMgYXBwXG4gKiBodHRwczovL3d3dy5hbWNoYXJ0cy5jb20vZG9jcy92NC9cbiAqIEBjbGFzcyBOZW8ubWFpbi5hZGRvbi5BbUNoYXJ0c1xuICogQGV4dGVuZHMgTmVvLmNvcmUuQmFzZVxuICogQHNpbmdsZXRvblxuICovXG5jbGFzcyBBbUNoYXJ0cyBleHRlbmRzIEJhc2Uge1xuICAgIHN0YXRpYyBnZXRDb25maWcoKSB7cmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1N0cmluZ30gY2xhc3NOYW1lPSdOZW8ubWFpbi5hZGRvbi5BbUNoYXJ0cydcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgY2xhc3NOYW1lOiAnTmVvLm1haW4uYWRkb24uQW1DaGFydHMnLFxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcmVzIGFsbCBjaGFydCBpZHMgaW5zaWRlIGFuIG9iamVjdFxuICAgICAgICAgKiBAbWVtYmVyIHtPYmplY3R9IGNoYXJ0cz17fVxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBjaGFydHM6IHt9LFxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcmVzIGFsbCBjaGFydCBjb25maWcgb2JqZWN0cyB3aGljaCBhcnJpdmVkIGJlZm9yZSB0aGUgY2hhcnQgbGliIHNjcmlwdHMgZ290IGxvYWRlZFxuICAgICAgICAgKiBAbWVtYmVyIHtPYmplY3RbXX0gY2hhcnRzVG9DcmVhdGU9W11cbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgY2hhcnRzVG9DcmVhdGU6IFtdLFxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcmVzIGFsbCBjaGFydCBkYXRhIGluc2lkZSBhbiBvYmplY3QuIGtleSA9PiBjaGFydCBpZFxuICAgICAgICAgKiBObyBhcnJheSBzaW5jZSBpbiBjYXNlIGEgY2hhcnQgZ2V0cyBsb2FkZWQgbXVsdGlwbGUgdGltZXMsIHdlIG9ubHkgd2FudCB0byBhcHBseSB0aGUgbGFzdCBkYXRhIG9uIG1vdW50LlxuICAgICAgICAgKiBAbWVtYmVyIHtPYmplY3R9IGRhdGFNYXA9e31cbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgZGF0YU1hcDoge30sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtTdHJpbmd9IGRvd25sb2FkUGF0aD0naHR0cHMvL3d3dy5hbWNoYXJ0cy5jb20vbGliLzQvJ1xuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBkb3dubG9hZFBhdGg6ICdodHRwczovL3d3dy5hbWNoYXJ0cy5jb20vbGliLzQvJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1N0cmluZ30gZmFsbGJhY2tQYXRoPSdodHRwczovL25lb21qcy5naXRodWIuaW8vcGFnZXMvcmVzb3VyY2VzL2FtQ2hhcnRzLydcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgZmFsbGJhY2tQYXRoOiAnaHR0cHM6Ly9uZW9tanMuZ2l0aHViLmlvL3BhZ2VzL3Jlc291cmNlcy9hbUNoYXJ0cy8nLFxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7Qm9vbGVhbn0gc2NyaXB0c0xvYWRlZF89dHJ1ZVxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBzY3JpcHRzTG9hZGVkXzogZmFsc2UsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtCb29sZWFufSBzaW5nbGV0b249dHJ1ZVxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBzaW5nbGV0b246IHRydWUsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdGUgbWV0aG9kIGFjY2VzcyBmb3Igb3RoZXIgd29ya2Vyc1xuICAgICAgICAgKiBAbWVtYmVyIHtPYmplY3R9IHJlbW90ZT17YXBwOiBbLy8uLi5dfVxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdGU6IHtcbiAgICAgICAgICAgIGFwcDogW1xuICAgICAgICAgICAgICAgICdjYWxsTWV0aG9kJyxcbiAgICAgICAgICAgICAgICAnY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAnZGVzdHJveScsXG4gICAgICAgICAgICAgICAgJ3NldFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgICAgICdzZXRQcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgJ3VwZGF0ZURhdGEnXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9fVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICAgICAgdGhpcy5pbnNlcnRBbUNoYXJ0c1NjcmlwdHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyZWQgYWZ0ZXIgdGhlIHNjcmlwdHNMb2FkZWQgY29uZmlnIGdvdCBjaGFuZ2VkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb2xkVmFsdWVcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgYWZ0ZXJTZXRTY3JpcHRzTG9hZGVkKHZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICAgICAgbWUuY2hhcnRzVG9DcmVhdGUuZm9yRWFjaChjb25maWcgPT4ge1xuICAgICAgICAgICAgICAgIG1lLmNyZWF0ZShjb25maWcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1lLmNoYXJ0c1RvQ3JlYXRlID0gW107XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKG1lLmRhdGFNYXApLmZvckVhY2goKFtrZXksIGRhdGFWYWx1ZV0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbWUudXBkYXRlRGF0YShkYXRhVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbWUuZGF0YU1hcCA9IHt9O1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEuaWRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5wYXRoXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2RhdGEucGFyYW1zXVxuICAgICAqL1xuICAgIGNhbGxNZXRob2QoZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5oYXNDaGFydChkYXRhLmlkKSkge1xuICAgICAgICAgICAgY29uc3QgY2hhcnQgICAgICA9IHRoaXMuY2hhcnRzW2RhdGEuaWRdLFxuICAgICAgICAgICAgICAgICAgcGF0aEFycmF5ICA9IGRhdGEucGF0aC5zcGxpdCgnLicpLFxuICAgICAgICAgICAgICAgICAgbWV0aG9kTmFtZSA9IHBhdGhBcnJheS5wb3AoKSxcbiAgICAgICAgICAgICAgICAgIHNjb3BlICAgICAgPSBwYXRoQXJyYXkubGVuZ3RoIDwgMSA/IGNoYXJ0OiAgTmVvLm5zKHBhdGhBcnJheS5qb2luKCcuJyksIGZhbHNlLCBjaGFydCk7XG5cbiAgICAgICAgICAgIHNjb3BlW21ldGhvZE5hbWVdLmNhbGwoc2NvcGUsIC4uLmRhdGEucGFyYW1zIHx8IFtdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRvZG9cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNoYXJ0XG4gICAgICovXG4gICAgY29tYmluZVNlcmllc1Rvb2x0aXAoY2hhcnQpIHtcbiAgICAgICAgY2hhcnQuc2VyaWVzLmVhY2goc2VyaWVzID0+IHtcbiAgICAgICAgICAgIHNlcmllcy5hZGFwdGVyLmFkZCgndG9vbHRpcFRleHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSBcIltib2xkXXtkYXRlWH1bL11cXG5cIjtcblxuICAgICAgICAgICAgICAgIGNoYXJ0LnNlcmllcy5lYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9IFwiW1wiICsgaXRlbS5zdHJva2UgKyBcIl3il49bL10gXCIgKyBpdGVtLm5hbWUgKyBcIjoge1wiICsgaXRlbS5kYXRhRmllbGRzLnZhbHVlWSArIFwifVxcblwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gIGRhdGFcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRhdGEuY29tYmluZVNlcmllc1Rvb2x0aXBcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gIGRhdGEuY29uZmlnXG4gICAgICogQHBhcmFtIHtBcnJheX0gICBbZGF0YS5kYXRhXVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW2RhdGEuZGF0YVBhdGhdXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBkYXRhLmlkXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICBkYXRhLnBhY2thZ2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gIGRhdGEudHlwZT0nWFlDaGFydCdcbiAgICAgKi9cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFtZS5zY3JpcHRzTG9hZGVkKSB7XG4gICAgICAgICAgICBtZS5jaGFydHNUb0NyZWF0ZS5wdXNoKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdG9kbzogY2hlY2sgaWYgc2VsZltkYXRhLnBhY2thZ2VdIGV4aXN0cywgaWYgbm90IGxvYWQgaXQgYW5kIGNhbGwgY3JlYXRlIGFmdGVyd2FyZHNcblxuICAgICAgICAgICAgbWUuY2hhcnRzW2RhdGEuaWRdID0gYW00Y29yZS5jcmVhdGVGcm9tQ29uZmlnKGRhdGEuY29uZmlnLCBkYXRhLmlkLCBzZWxmW2RhdGEucGFja2FnZV1bZGF0YS50eXBlIHx8ICdYWUNoYXJ0J10pO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5jb21iaW5lU2VyaWVzVG9vbHRpcCkge1xuICAgICAgICAgICAgICAgIG1lLmNvbWJpbmVTZXJpZXNUb29sdGlwKG1lLmNoYXJ0c1tkYXRhLmlkXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGluIGNhc2UgZGF0YSBoYXMgYXJyaXZlZCBiZWZvcmUgdGhlIGNoYXJ0IGdvdCBjcmVhdGVkLCBhcHBseSBpdCBub3dcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBtZS51cGRhdGVEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSAgICA6IGRhdGEuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVBhdGg6IGRhdGEuZGF0YVBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGlkICAgICAgOiBkYXRhLmlkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lLmRhdGFNYXBbZGF0YS5pZF0pIHtcbiAgICAgICAgICAgICAgICBtZS51cGRhdGVEYXRhKG1lLmRhdGFNYXBbZGF0YS5pZF0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZS5kYXRhTWFwW2RhdGEuaWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLmlkXG4gICAgICovXG4gICAgZGVzdHJveShkYXRhKSB7XG4gICAgICAgIHRoaXMuY2hhcnRzW2RhdGEuaWRdLmRpc3Bvc2UoKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuY2hhcnRzW2RhdGEuaWRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ2hhcnQoaWQpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jaGFydHNbaWRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzeW5jIGFwcHJvYWNoXG4gICAgICogY29yZS5qcyBoYXMgdG8gYXJyaXZlIGZpcnN0IG9yIHRoZSBvdGhlciBzY3JpcHRzIHdpbGwgY2F1c2UgSlMgZXJyb3JzIHNpbmNlIHRoZXkgcmVseSBvbiBpdFxuICAgICAqID0+IGZldGNoaW5nIHRoZSBvdGhlciBmaWxlcyBhZnRlciBjb3JlLmpzIGlzIGxvYWRlZFxuICAgICAqL1xuICAgIGluc2VydEFtQ2hhcnRzU2NyaXB0cyh1c2VGYWxsYmFjaz1mYWxzZSkge1xuICAgICAgICBjb25zdCBtZSAgICAgICA9IHRoaXMsXG4gICAgICAgICAgICAgIGJhc2VQYXRoID0gdXNlRmFsbGJhY2sgPyBtZS5mYWxsYmFja1BhdGggOiBtZS5kb3dubG9hZFBhdGg7XG5cbiAgICAgICAgRG9tQWNjZXNzLmxvYWRTY3JpcHQoYmFzZVBhdGggKyAnY29yZS5qcycpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIERvbUFjY2Vzcy5sb2FkU2NyaXB0KGJhc2VQYXRoICsgJ2NoYXJ0cy5qcycpLFxuICAgICAgICAgICAgICAgIERvbUFjY2Vzcy5sb2FkU2NyaXB0KGJhc2VQYXRoICsgJ21hcHMuanMnKSxcbiAgICAgICAgICAgICAgICBEb21BY2Nlc3MubG9hZFNjcmlwdChiYXNlUGF0aCArICdnZW9kYXRhL3dvcmxkTG93LmpzJylcbiAgICAgICAgICAgIF0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG1lLnNjcmlwdHNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Rvd25sb2FkIGZyb20gYW1jaGFydHMuY29tIGZhaWxlZCwgc3dpdGNoaW5nIHRvIGZhbGxiYWNrJywgZSk7XG4gICAgICAgICAgICBtZS5pbnNlcnRBbUNoYXJ0c1NjcmlwdHModHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5pZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhLnByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBzZXRQcm9wZXJ0aWVzKGRhdGEpIHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YS5wcm9wZXJ0aWVzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHkoe1xuICAgICAgICAgICAgICAgIGlkICAgOiBkYXRhLmlkLFxuICAgICAgICAgICAgICAgIHBhdGggOiBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEuaWRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtkYXRhLmlzQ29sb3I9ZmFsc2VdIHRydWUgd2lsbCB3cmFwIHRoZSB2YWx1ZSBpbnRvIGFtNGNvcmUuY29sb3IoKVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLnBhdGhcbiAgICAgKiBAcGFyYW0geyp9IGRhdGEudmFsdWVcbiAgICAgKi9cbiAgICBzZXRQcm9wZXJ0eShkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NoYXJ0KGRhdGEuaWQpKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFydCAgICAgICAgPSB0aGlzLmNoYXJ0c1tkYXRhLmlkXSxcbiAgICAgICAgICAgICAgICAgIHBhdGhBcnJheSAgICA9IGRhdGEucGF0aC5zcGxpdCgnLicpLFxuICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcGF0aEFycmF5LnBvcCgpLFxuICAgICAgICAgICAgICAgICAgc2NvcGUgICAgICAgID0gTmVvLm5zKHBhdGhBcnJheS5qb2luKCcuJyksIGZhbHNlLCBjaGFydCk7XG5cbiAgICAgICAgICAgIHNjb3BlW3Byb3BlcnR5TmFtZV0gPSBkYXRhLmlzQ29sb3IgPyBhbTRjb3JlLmNvbG9yKGRhdGEudmFsdWUpIDogZGF0YS52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRvZG9cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YS5kYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEuZGF0YVBhdGhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5pZFxuICAgICAqL1xuICAgIHVwZGF0ZURhdGEoZGF0YSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFtZS5zY3JpcHRzTG9hZGVkIHx8ICFtZS5oYXNDaGFydChkYXRhLmlkKSkge1xuICAgICAgICAgICAgbWUuZGF0YU1hcFtkYXRhLmlkXSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0c1tkYXRhLmlkXTtcblxuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YVBhdGggPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgY2hhcnQuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTmVvLm5zKGRhdGEuZGF0YVBhdGgsIGZhbHNlLCBjaGFydCkuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuTmVvLmFwcGx5Q2xhc3NDb25maWcoQW1DaGFydHMpO1xuXG5sZXQgaW5zdGFuY2UgPSBOZW8uY3JlYXRlKEFtQ2hhcnRzKTtcblxuTmVvLmFwcGx5VG9HbG9iYWxOcyhpbnN0YW5jZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3RhbmNlOyJdLCJzb3VyY2VSb290IjoiIn0=