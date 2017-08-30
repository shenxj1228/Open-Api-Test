"use strict";
let net = require('net');
const log = require('./log');
/**
 * 
 * 
 * @export
 * @class TCP TCP套接字客户端
 */
class TCP {

    /**
     * Creates an instance of TCP.
     * @param {String} host 服务器地址
     * @param {int} port 服务器端口
     * @memberof TCP
     */
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    /**
     * @param {String} data 发送字符串
     * @returns {Promise} promise实例
     * 
     * @memberOf TCP
     */
    send(data) {
        return new Promise((resolve, reject) => {
            let start = new Date(),
                elapsedTime;
            const client = net.connect({
                host: this.host,
                port: this.port
            }, () => {
                start = new Date();
                client.write(data);
            });
            client.on('error', (err) => {
                elapsedTime = new Date() - start;
                log.error(err);
                client.destroy();
                reject({
                    elapsedTime: elapsedTime,
                    body: err
                });
            });
            client.on('data', (data) => {
                elapsedTime = new Date() - start;
                client.destroy();
                resolve({
                    elapsedTime: elapsedTime,
                    body: data.toString('utf8')
                });

            });
        });

    }

}
module.exports = TCP;