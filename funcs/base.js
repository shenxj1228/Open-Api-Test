"use strict";
/**
 * 获取字符串UTF8字节长度
 * 
 * @export
 * @param {String} str
 * @returns {Number} 字符串字节长度
 */
exports.getStrLength = function (str, encoding) {
    return Buffer.from(str, (encoding || 'utf8')).length;
}


/**
 * 数字未达长度，前面补0，
 * 
 * @export
 * @param {Number} num 数字
 * @param {Number} length 长度
 * @returns {String} 数字前面补0的字符串
 */
exports.PrefixInteger = function (num, length) {
    return (Array(length).join('0') + num).slice(-length);
};

/**
 * 删除字符串首尾分隔符
 * 
 * @export
 * @param {String} str 字符串
 * @param {String} char 分隔符
 * @returns
 */
exports.strap = function (str, char) {
    if (char) {
        return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return str.replace(/^\s+|\s+$/g, '');
};