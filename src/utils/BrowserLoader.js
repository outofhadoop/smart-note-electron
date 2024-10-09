// 定义一个基础加载器类
class BaseLoader {
    constructor() {
        this.isNode = typeof window === 'undefined';
    }

    load(source) {
        throw new Error('子类必须实现load方法');
    }

    save(source, value) {
        throw new Error('子类必须实现save方法');
    }
}

// 定义一个使用localStorage的加载器类
class BrowserLoader extends BaseLoader {
    /**
     * 从 localStorage 加载数据
     * @param {string} key 键
     * @returns {object} 数据
     */
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('从 localStorage 加载数据时出错:', error);
            return null;
        }
    }

    /**
     * 保存数据到 localStorage
     * @param {string} key 键
     * @param {string} value 值
     */
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('保存数据到 localStorage 时出错:', error);
        }
    }
}

export default BrowserLoader;