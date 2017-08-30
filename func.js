const fs = require('fs');
const path = require("path")
const cfg = require('./config/index.js');
const Api = require('./config/Api.js');
const FIX = require('./funcs/fix');
const request = require('request');
const OAuth = require('oauth');
const BluePromise = require('bluebird');
const log = require('./funcs/log');

const extname = '.apiReturn';
const tokenHeader = 'bearer ';
const maxGetTokenCount = 3;
let token = '';
let getTokenCount = 0;


/**
 * [获取Token]
 * @return {Promise} [返回一个Promise对象]
 */
function getToken() {
    const oauth2 = new OAuth.OAuth2(
        cfg.OAuthInfo.ClientID,
        cfg.OAuthInfo.ClientSecret,
        cfg.OAuthInfo.AuthUrl,
        null,
        'oauth2/token',
        null
    );
    return new BluePromise(function (resolve, reject) {
        oauth2.getOAuthAccessToken('', {
            'grant_type': 'client_credentials'
        }, function (e, access_token, refresh_token, results) {
            getTokenCount++;
            if (e) {
                reject(e);
            } else {
                token = tokenHeader + access_token;
                resolve(token);
            }

        });
    });
}
/**
 * [发送请求到指定接口]
 * @param  {String} apiAddress    [url中的接口最后一段]
 * @param  {String} contentObj [请求Body]
 * @param  {String} token      [令牌]
 */
function submitToApi(apiAddress, contentObj, file) {
    //log.log('url:'+cfg.openApi.host + apiAddress+'\n'+'formData:'+JSON.stringify(contentObj));
    return new BluePromise(function (resolve, reject) {
        request.post({
            url: cfg.openApi.host + apiAddress,
            headers: {
                'Authorization': [token],
                'Content-Type': ['application/x-www-form-urlencoded']
            },
            form: contentObj
        }, {
            timeout: 3000
        }, (e, r, body) => {
            if (e) {
                log.error(e);
                reject({
                    error: e.message
                });
            }
            body = JSON.parse(body);
            if (body.error == 'invalid_token') {
                if (getTokenCount > maxGetTokenCount) {
                    log.error('重新获取令牌' + maxGetTokenCount + '次失败，请检查！！！');
                    process.exit();
                }
                log.warn(body.error_description + ' 重新获取令牌并发送');
                getToken()
                    .then(token => {
                        submitToApi(apiAddress, contentObj, file);
                    })
                    .catch(e => {
                        log.error(e);
                        reject({
                            error: e.message
                        })
                    });
            } else {
                let response = body;
                if (file != '') {
                    response = JSON.stringify(body);
                    fs.writeFile(file + extname, response, 'utf8');
                }
                if (!body.hasOwnProperty('error_no') && body.hasOwnProperty('data') && body.data.length != 0) {
                    response = body.data[0];
                }
                resolve(response);

            }
        });
    });
}

function getRequestBody(apiAddress, file, data) {
    data = data.replace(/\r/gi, '');
    let paramArray = data.split('\n');
    let Obj = {};
    paramArray.forEach(param => {
        if (param.trim() != '') {
            let tmparry = param.split('=');
            Obj[tmparry[0]] = tmparry[1];
        }
    });
    submitToApi(apiAddress, Obj, file);
}




/**
 * 根据FunctionId获取接口地址
 * 
 * @param {string} FunctionId 
 * @returns {string} 接口地址
 */
function getApiAddress(FunctionId) {
    if (FunctionId == undefined) {
        return '';
    } else {
        let address = '';
        Api.apis.some(function (ele) {
            if (ele.trans_code == FunctionId) {
                address = ele.address;
                return true;
            }
        });
        return address;
    }
}


/**
 * 发送FIX报文
 * 
 * @param {Object} req {keys:[_keys]，values:[_values]}字段数组和值数组 
 * @returns {Promise} resolve(应答信息)
 */
function sendToFix(ip, port, req) {
    //log.log(req);
    let fix = new FIX(ip, port);
    return fix.send(req.keys, req.values).then(res => {
        return res;
    }).catch(() => {
        return new Error('连接服务器' + fix.host + ':' + fix.port + '失败');
    })
}

exports.submitToApi = submitToApi;
exports.getToken = getToken;
exports.getApiAddress = getApiAddress;
exports.sendToFix = sendToFix;