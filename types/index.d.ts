import { PluginFunction } from 'vue';

declare module '@forzoom/vue-skeleton' {
    const install: PluginFunction<undefined> // 这里的T需要更换成期望得到的options的类型
}
