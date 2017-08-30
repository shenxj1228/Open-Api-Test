module.exports = {
    OAuthInfo: {
        isUse: false,
        AuthUrl: 'http://1123.123.cn/oauth2/',
        AccessTokenUrl: 'http://123.123.cn/oauth2/oauth2/token',
        grant_type: 'client_credentials',
        ClientID: 'b713b7d7-5163-485b-123-123', //系统获取token的ID
        ClientSecret: 'f55b0291-8e33-123-a523-123' //系统获取token的Secret
    },
    openApi: {
        host: 'http://123.123.cn/hips/v1/', //Open Api地址
        folder: 'apis/' //暂时不用配置
    },
    fixOnline: {
        host: '192.168.76.20',
        port: '7772'
    },
    local: {
        port: '3300' //本地启动端口
    }
}
