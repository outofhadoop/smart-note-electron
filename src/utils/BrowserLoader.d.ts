declare class BaseLoader {
    constructor();
    protected isNode: boolean;
    load(source: string): any;
    save(source: string, value: any): void;
}

declare class BrowserLoader extends BaseLoader {
    /**
     * 从 localStorage 加载数据
     * @param key 键
     * @returns 数据
     */
    load(key: string): any;

    /**
     * 保存数据到 localStorage
     * @param key 键
     * @param value 值
     */
    save(key: string, value: any): void;
}

export default BrowserLoader;
