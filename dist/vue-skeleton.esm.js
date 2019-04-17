import Vue from 'vue';

// 代表文本
var script = Vue.extend({
    name: 'Text',
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div")
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var SkText = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

// import Col from './components/col.vue';
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
    }
    else {
        return el;
    }
}
// code from `src/platforms/web/entry-runtime-with-compiler.js`
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
    }
    else {
        var container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}
var plugin = function (Vue$$1) {
    // TODO 不好判断这里的this是什么
    // @ts-ignore
    if (plugin.installed) {
        return;
    }
    // @ts-ignore
    plugin.installed = true;
    Vue$$1.mixin({
        mixins: [
            {
                props: {
                    // 控制skeleton是否显示
                    skeletonShow: {
                        type: Boolean,
                        default: true,
                    },
                },
                data: function () {
                    return {
                        skeletonVisible: true,
                    };
                },
                watch: {
                    '$props.skeletonShow': function (val) {
                        this.skeletonVisible = val;
                    },
                },
                created: function () {
                    // @ts-ignore
                    this.skeletonVisible = this.skeletonShow;
                },
            },
        ],
    });
    var mount = Vue$$1.prototype.$mount;
    Vue$$1.prototype.$mount = function (el, hydrating) {
        el = el && query(el);
        // const vm = this;
        // 尝试替换原本mount函数逻辑，必须要完成options.render函数
        var options = this.$options;
        var template = options.template;
        var skeletonTemplate = options.skeletonTemplate;
        // 存在skeletonTemplate的情况下，表明有可以使用的模板
        if (options.skeletonTemplate) {
            var render_1 = options.render;
            var staticRenderFns_1 = null;
            // 创建正常的render
            if (!options.render) {
                if (template) {
                    if (typeof template === 'string') {
                        if (template.charAt(0) === '#') {
                            template = idToTemplate(template);
                        }
                        // 这里有warning
                    }
                    else if (template.nodeType) {
                        template = template.innerHTML;
                    }
                    else {
                        // TODO warning
                        return this;
                    }
                }
                else if (el) {
                    template = getOuterHTML(el);
                }
                if (template) {
                    var compileResult = Vue$$1.compile(template);
                    render_1 = compileResult.render;
                    staticRenderFns_1 = compileResult.staticRenderFns;
                }
            }
            var skeletonCompileResult = Vue$$1.compile(skeletonTemplate);
            var skeletonRender_1 = skeletonCompileResult.render;
            var skeletonStaticRenderFns_1 = skeletonCompileResult.staticRenderFns;
            this.$options.render = function () {
                if (this.skeletonVisible) {
                    // @ts-ignore
                    return skeletonRender_1.apply(this, arguments);
                }
                else {
                    return render_1.apply(this, arguments);
                }
            };
            // 为什么staticRenderFns是一个数组?
            var max = Math.max(skeletonStaticRenderFns_1 ? skeletonStaticRenderFns_1.length : 0, staticRenderFns_1 ? staticRenderFns_1.length : 0);
            this.$options.staticRenderFns = [];
            var _loop_1 = function (i) {
                this_1.$options.staticRenderFns.push(function () {
                    // @ts-ignore
                    if (this.skeletonVisible) {
                        // @ts-ignore
                        return skeletonStaticRenderFns_1[i] ? skeletonStaticRenderFns_1[i].apply(this, arguments) : null;
                    }
                    else {
                        // @ts-ignore
                        return staticRenderFns_1[i] ? staticRenderFns_1[i].apply(this, arguments) : null;
                    }
                });
            };
            var this_1 = this;
            for (var i = 0; i < max; i++) {
                _loop_1(i);
            }
            // this.$options.staticRenderFns = staticRenderFns;
            // console.log('target14', skeletonCompileResult);
        }
        return mount.call(this, el, hydrating);
    };
    // Vue.component('SkeletonCol', Col);
    Vue$$1.component('SkText', SkText);
    // 添加新的指令
    // Vue.directive('skeleton', {
    // })
};

export default plugin;
