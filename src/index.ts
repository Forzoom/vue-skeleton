// import Col from './components/col.vue';
import SkText from './components/text.vue';
import { PluginObject, PluginFunction } from 'vue';

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
function cached(fn: (str: any) => any) {
    const cache = Object.create(null);
    return function cachedFn(str: any) {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}

/**
 * code from `src/platforms/util/index.js`
 *
 * Query an element selector if it's not an element already.
 */
function query(el: any) {
    if (typeof el === 'string') {
        const selected = document.querySelector(el);
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
}

// code from `src/platforms/web/entry-runtime-with-compiler.js`
const idToTemplate = cached((id) => {
    const el = query(id);
    return el && el.innerHTML;
});

/**
 * code from `src/platforms/web/entry-runtime-with-compiler.js`
 *
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: any) {
    if (el.outerHTML) {
        return el.outerHTML;
    } else {
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}

const plugin: PluginFunction<null> = (Vue) => {
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
                data() {
                    return {
                        skeletonVisible: true,
                    };
                },
                watch: {
                    '$props.skeletonShow'(val: any) {
                        this.skeletonVisible = val;
                    },
                },
                created() {
                    // @ts-ignore
                    this.skeletonVisible = this.skeletonShow;
                },
            },
        ],
    });

    const mount = Vue.prototype.$mount;
    Vue.prototype.$mount = function(el: any, hydrating: any) {
        el = el && query(el);
        // const vm = this;
        // 尝试替换原本mount函数逻辑，必须要完成options.render函数
        const options = this.$options;
        let template = options.template;
        const skeletonTemplate = options.skeletonTemplate;
        // 存在skeletonTemplate的情况下，表明有可以使用的模板
        if (options.skeletonTemplate) {
            let render = options.render;
            let staticRenderFns: any[] | null = null;

            // 创建正常的render
            if (!options.render) {
                if (template) {
                    if (typeof template === 'string') {
                        if (template.charAt(0) === '#') {
                            template = idToTemplate(template);
                        }
                        // 这里有warning
                    } else if (template.nodeType) {
                        template = template.innerHTML;
                    } else {
                        // TODO warning
                        return this;
                    }
                } else if (el) {
                    template = getOuterHTML(el);
                }

                if (template) {
                    const compileResult = Vue.compile(template);
                    render = compileResult.render;
                    staticRenderFns = compileResult.staticRenderFns;
                }
            }

            const skeletonCompileResult = Vue.compile(skeletonTemplate);
            const skeletonRender = skeletonCompileResult.render;
            const skeletonStaticRenderFns = skeletonCompileResult.staticRenderFns;

            this.$options.render = function() {
                if (this.skeletonVisible) {
                    // @ts-ignore
                    return skeletonRender.apply(this, arguments);
                } else {
                    return render.apply(this, arguments);
                }
            };
            // 为什么staticRenderFns是一个数组?
            const max = Math.max(skeletonStaticRenderFns ? skeletonStaticRenderFns.length : 0,
                staticRenderFns ? staticRenderFns.length : 0);
            this.$options.staticRenderFns = [];
            for (let i = 0; i < max; i++) {
                this.$options.staticRenderFns.push(function() {
                    // @ts-ignore
                    if (this.skeletonVisible) {
                        // @ts-ignore
                        return skeletonStaticRenderFns[i] ? skeletonStaticRenderFns[i].apply(this, arguments) : null;
                    } else {
                        // @ts-ignore
                        return staticRenderFns[i] ? staticRenderFns[i].apply(this, arguments) : null;
                    }
                });
            }
            // this.$options.staticRenderFns = staticRenderFns;
            // console.log('target14', skeletonCompileResult);
        }
        return mount.call(this, el, hydrating);
    };

    // Vue.component('SkeletonCol', Col);
    Vue.component('SkText', SkText);

    // 添加新的指令
    // Vue.directive('skeleton', {

    // })
};

export default plugin;
