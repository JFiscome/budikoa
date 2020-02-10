const path = require('path')
const {mapDir} = require('../tools/mapDir')

// 默认导出当前文件夹下的映射
module.exports = mapDir(path.join(__dirname))
