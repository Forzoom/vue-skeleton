(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es.object.create')) :
  typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es.object.create'], factory) :
  (factory((global.VueSkeleton = {})));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  // function warn(msg, vm) {
  //     const trace = vm ? generateComponentTrace(vm) : '';
  //     if (config.warnHandler) {
  //         config.warnHandler.call(null, msg, vm, trace);
  //     } else if (hasConsole && (!config.silent)) {
  //         console.error(`[Vue warn]: ${msg}${trace}`);
  //     }
  // }

  /**
   * code from `src/shared/util.js`
   *
   * Create a cached version of a pure function.
   *
   * 会缓存str所对应的结果，每一次都会检查是否hit
   */
  function cached(fn) {
    var cache = Object.create(null);
    return function cachedFn(str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }
  /**
   * code from `src/platforms/util/index.js`
   *
   * Query an element selector if it's not an element already.
   */


  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);

      if (!selected) {
        // process.env.NODE_ENV !== 'production' && warn(
        //   'Cannot find element: ' + el
        // )
        return document.createElement('div');
      }

      return selected;
    } else {
      return el;
    }
  } // code from `src/platforms/web/entry-runtime-with-compiler.js`


  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML;
  });
  /**
   * code from `src/platforms/web/entry-runtime-with-compiler.js`
   *
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */

  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  var plugin = function plugin(Vue) {
    // TODO 不好判断这里的this是什么
    // @ts-ignore
    if (plugin.installed) {
      return;
    } // @ts-ignore


    plugin.installed = true;
    Vue.mixin({
      mixins: [{
        props: {
          // 控制skeleton是否显示
          skeletonShow: {
            type: Boolean,
            "default": true
          }
        },
        data: function data() {
          return {
            skeletonVisible: true
          };
        },
        watch: {
          '$props.skeletonShow': function $propsSkeletonShow(val) {
            this.skeletonVisible = val;
          }
        },
        created: function created() {
          // @ts-ignore
          this.skeletonVisible = this.skeletonShow;
        }
      }]
    });
    var mount = Vue.prototype.$mount;

    Vue.prototype.$mount = function (el, hydrating) {
      var _this = this;

      el = el && query(el); // const vm = this;
      // 尝试替换原本mount函数逻辑，必须要完成options.render函数

      var options = this.$options;
      var template = options.template;
      var skeletonTemplate = options.skeletonTemplate; // 存在skeletonTemplate的情况下，表明有可以使用的模板

      if (options.skeletonTemplate) {
        var _ret = function () {
          var render = options.render;
          var staticRenderFns = null; // 创建正常的render

          if (!options.render) {
            if (template) {
              if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                  template = idToTemplate(template);
                } // 这里有warning

              } else if (template.nodeType) {
                template = template.innerHTML;
              } else {
                // TODO warning
                return {
                  v: _this
                };
              }
            } else if (el) {
              template = getOuterHTML(el);
            }

            if (template) {
              var compileResult = Vue.compile(template);
              render = compileResult.render;
              staticRenderFns = compileResult.staticRenderFns;
            }
          }

          var skeletonCompileResult = Vue.compile(skeletonTemplate);
          var skeletonRender = skeletonCompileResult.render;
          var skeletonStaticRenderFns = skeletonCompileResult.staticRenderFns;

          _this.$options.render = function () {
            if (this.skeletonVisible) {
              // @ts-ignore
              return skeletonRender.apply(this, arguments);
            } else {
              return render.apply(this, arguments);
            }
          }; // 为什么staticRenderFns是一个数组?


          var max = Math.max(skeletonStaticRenderFns ? skeletonStaticRenderFns.length : 0, staticRenderFns ? staticRenderFns.length : 0);
          _this.$options.staticRenderFns = [];

          var _loop = function _loop(i) {
            _this.$options.staticRenderFns.push(function () {
              // @ts-ignore
              if (this.skeletonVisible) {
                // @ts-ignore
                return skeletonStaticRenderFns[i] ? skeletonStaticRenderFns[i].apply(this, arguments) : null;
              } else {
                // @ts-ignore
                return staticRenderFns[i] ? staticRenderFns[i].apply(this, arguments) : null;
              }
            });
          };

          for (var i = 0; i < max; i++) {
            _loop(i);
          } // this.$options.staticRenderFns = staticRenderFns;

        }();

        if (_typeof(_ret) === "object") return _ret.v;
      }

      return mount.call(this, el, hydrating);
    };
  };
  function loader(source, map) {
    // @ts-ignore
    this.callback(null, "export default function (Component) {\n            Component.options.skeletonTemplate = ".concat(JSON.stringify(source), "\n        }"), map);
  }

  exports.plugin = plugin;
  exports.loader = loader;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
