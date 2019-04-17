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
var plugin = function (Vue) {
    // TODO 不好判断这里的this是什么
    // @ts-ignore
    if (plugin.installed) {
        return;
    }
    // @ts-ignore
    plugin.installed = true;
    Vue.mixin({
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
    var mount = Vue.prototype.$mount;
    Vue.prototype.$mount = function (el, hydrating) {
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
                    var compileResult = Vue.compile(template);
                    render_1 = compileResult.render;
                    staticRenderFns_1 = compileResult.staticRenderFns;
                }
            }
            var skeletonCompileResult = Vue.compile(skeletonTemplate);
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
    // Vue.component('SkText', SkText);
    // 添加新的指令
    // Vue.directive('skeleton', {
    // })
};

export default plugin;
