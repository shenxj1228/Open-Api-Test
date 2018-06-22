"use strict";
const log = require('./log');
let {
    getStrLength,
    PrefixInteger,
    strap
} = require('./base');
let TCP = require('./tcp');
class FIX {
    /**
     * Creates an instance of Fix.
     * 
     * @param {string} [host='127.0.0.1'] 发送主机地址
     * @param {any} port 发送主机端口
     * 
     * @memberOf Fix
     */
    constructor(host = '127.0.0.1', port) {
        this.host = host;
        this.port = port;
        this.soh = '\x01';
        /**
         * 处理发送数据
         * @param {Array} keys 键名
         * @param {Array} values 键值
         * @returns {String} 格式化的发送数据
         */
        this.dealSendData = function (keys, values) {
            let data = keys.length + this.soh + '1' + this.soh;
            let tmparray = keys.concat(values);
            data = data + tmparray.join(this.soh) + this.soh;
            let header = 'F017' + PrefixInteger(getStrLength(data), 5) + 'UTF-8   ';
            return header + data;
        };
        /**
         * 处理应答数据
         * @param {String} data 应答数据
         * @returns {Object} JSON化应答数据
         */
        this.dealRecvData = function (res) {
            let data = res.body;
            let tmparray = strap(data.toString().substring(17), this.soh).split(this.soh);
            let filedCount = parseInt(tmparray.splice(0, 1)[0]);
            let num = parseInt(tmparray.splice(0, 1)[0]);
            let fileldArray = tmparray.splice(0, filedCount);
            let
                result, resultArray = [];
            for (let i = 0; i < num; i++) {
                let obj = {};
                for (let j = 0; j < filedCount; j++) {
                    obj[fileldArray[j]] = tmparray[j];
                }
                resultArray.push(obj);
            }
            result = (num === 1) ? resultArray[0] : resultArray;

            return {
                elapsedTime: res.elapsedTime,
                body: result
            };
        }
    }

    /**
     *发送fix报文 
     * 
     * @param {Array} keys 键名
     * @param {Array} values 键值
     * @return {Promise}  
     * 
     * @memberOf Fix
     */
    send(keys, values) {
        let host = this.host;
        let port = this.port;
        let t = new TCP(host, port);
        let data = this.dealSendData(keys, values);
        log.log(data);
        return t.send(data).then(res => {
            log.log(res.body);
            return this.dealRecvData(res);
        }, err => {
            return err;
        });
    }
}
module.exports = FIX;