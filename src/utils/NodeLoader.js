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

// 定义一个使用Node.js文件系统的加载器类
class NodeLoader extends BaseLoader {
    /**
     * 从本地文件加载数据
     * @param {string} filePath 文件路径
     * @returns {object} 文件内容
     */
    load(filePath) {
        try {
            const fs = require('fs');
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('从文件加载数据时出错:', error);
            return null;
        }
    }

    /**
     * 保存数据到本地文件
     * @param {string} filePath 文件路径
     * @param {string} value 值
     */
    save(filePath, value) {
        try {
            const fs = require('fs');
            fs.writeFileSync(filePath, JSON.stringify(value), 'utf8');
        } catch (error) {
            console.error('保存数据到文件时出错:', error);
        }
    }
}