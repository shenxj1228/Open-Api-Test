"use strict";

(function () {
    //定义计时类基于CountUp.js
    var Timing = (function () {
        function Timing(targetId) {
            var options = {  
                useEasing: true,
                  useGrouping: true,
                  separator: ',',
                  decimal: '.',
            };
            this.targetDOM = $('#' + targetId);
            this.timing = new CountUp(targetId, 0, 20, 3, 20, options);
        }
        Timing.prototype.start = function () {
            this.timing.reset();
            this.timing.start();
        }
        Timing.prototype.pauseResume = function (val) {
            this.targetDOM.text(val);
            this.timing.pauseResume();
        }
        return Timing;
    })();

    var timing = new Timing('elapsedTime');

    jQuery(document).ready(function ($) {
        //获取url中seprule的值
        var sepRule = getUrlParam('seprule');
        //获取url中host的值
        var host = getUrlParam('host');
        //获取url中port的值
        var port = getUrlParam('port');
        //获取url中customsep的值
        var customSep = getUrlParam('customsep') || '';
        //获取联机服务信息
        $.get('/getServerInfo', function (data) {
            host = host ? host : data.host;
            port = port ? port : data.port;
            $('#serverIp').val(host);
            $('#serverPort').val(port);
        });


        var ruleNum = Math.floor(sepRule);
        if (sepRule && ruleNum > -1 && ruleNum < 3) {
            $('.sep-rule label').removeClass('active');
            $('.sep-rule input[name="options"]').removeAttr('checked');
            $('.sep-rule input[name="options"]').eq(ruleNum).attr('checked', 'checked');
            $('.sep-rule input[name="options"]').eq(ruleNum).parent().addClass('active');
            if (ruleNum === 2) {
                $('#customSep').val(customSep);
                $('#customSep').removeClass('hidden');
            }
            setPlaceholder(ruleNum);
        }
        //获取API接口
        $.get('/getFixApis', function (data) {
            $('#sendList').empty();
            data.forEach(function (ele, index) {
                if (index % 8 === 0) {
                    $('#sendList').append('<ul class="col-lg-3 col-md-4 col-sm-6"><ul>');
                } else if (index % 4 === 0) {
                    $('#sendList>ul').eq(parseInt(index / 8, 10)).append('<li class="divider"></li>');
                }
                $('#sendList>ul').eq(parseInt(index / 8, 10)).append('<li><a class="sendItem" href="javascript:void(0)" data-href="' + ele.address + '">' + ele.trans_code + '-' + ele.name + '</li>');
            });
            $('#sendList .sendItem').on('click', function () {
                $('#sendType').val('2');
                $('#requestForm').submit();
            });
        });
        //发送按钮
        $('#send').on('click', function () {
            $('#sendType').val('1');
            $('#requestForm').submit();
        });
        //报文规则选择
        $('input[name="options"]').on('change', function () {
            $('#customSep').removeClass('hidden');
            if (!$('#option3').is(':checked')) {
                $('#customSep').addClass('hidden');
            }
        });
        //发送fix报文按钮
        $('#send-fix').on('click', function () {
            $('#sendType').val('0');
            $('#requestForm').submit();
        });

        $('#requestForm').on('submit', function (e) {
            e.preventDefault();
            //sendType: 0-发送fix报文，1-发送至openapi地址，2-发送至指定OpenApi地址
            var sendType = $('#sendType').val();
            var returnData = true;
            $('#send').attr('disabled', 'disabled');
            $('#send-fix').attr('disabled', 'disabled');
            $('#send-dropdown').attr('disabled', 'disabled');
            //$('#elapsedTime').text('');

            if (sendType === '0') {
                var data = dealData($('#request').val(), 'array');
                if (data != '') {
                    timing.start();
                    sendToFix(data);
                } else
                    returnData = false;
            } else if (sendType === '1') {
                var data = dealData($('#request').val());
                if (data != '') {
                    timing.start();
                    sendToOpenApi(data);
                } else
                    returnData = false;
            } else if (sendType === '2') {
                var data = dealData($('#request').val());
                if (data != '') {
                    timing.start();
                    sendToSpecifyOpenApi(data);
                } else
                    returnData = false;
            } else {
                $('#send-fix').removeAttr('disabled');
                $('#send').removeAttr('disabled');
                $('#send-dropdown').removeAttr('disabled');
                alert('未知发送类型【sendType：' + sendType + '】');
            }
            if (!returnData) {
                alert('分隔之后不存在FunctionId');
                $('#send-fix').removeAttr('disabled');
                $('#send').removeAttr('disabled');
                $('#send-dropdown').removeAttr('disabled');
            }
        });
        $('#serverIp').on('input', function () {
            updateUrl();
        });
        $('#serverPort').on('input', function () {
            updateUrl();
        })
        $('.sep-rule label').on('click', function () {
            updateUrl($('.sep-rule label').index($(this)));
        })
        $('#customSep').on('input', function () {
            updateUrl();
        })



    });


    function setPlaceholder(type) {
        var fixDemo = "FunctionId=200047|BankNo=00|BranchNo=001|Channel=G|TransDate=|TransTime=|MemoryType=1~2~3~4~5~6~7~8~9~10";
        switch (Math.floor(type)) {
            case 0:
                $('#request').attr('placeholder', fixDemo);
                break;
            case 1:
                var placeholder = fixDemo.replace(/\|/g, ' &#10; ');
                $('#request').attr('placeholder', placeholder);
                break;
            case 2:
                $('#request').attr('placeholder', fixDemo.replace(/|/g, $('#customSep').val()));
                break;
            default:

        }
    }

    /**
     * 发送至openapi接口
     * 
     * @returns 
     */
    function sendToOpenApi(data) {
        $.ajax({
            type: 'POST',
            url: '/sendToOpenApi/queryAddress',
            data: data,
            timeout: 20000,
            success: function (data) {
                showResponse(data);

            },
            error: function (err) {
                showResponse(err);
            }
        });

    }

    /**
     * 发送至fix报文
     * 
     * @returns 
     */
    function sendToFix(data) {
        $.ajax({
            type: 'POST',
            url: '/sendToFix',
            data: data,
            timeout: 20000,
            headers: {
                "Server-Ip": $('#serverIp').val(),
                "Server-Port": $('#serverPort').val()
            },
            success: function (res) {
                setTimeout(function () {
                    $('#send-fix').removeAttr('disabled');
                    // $('#elapsedTime').text(' (耗时: ' + res.elapsedTime / 1000 + 's)');
                    timing.pauseResume(res.elapsedTime / 1000);
                    if (res.hasOwnProperty('body')) {
                        showResponse(res.body);
                    } else {
                        showResponse(res);
                    }

                }, 300);

            },
            error: function (err) {
                $('#send-fix').removeAttr('disabled');
                timing.pauseResume('NAN');
                showResponse({
                    status: 0,
                    statusText: '超时'
                });

            }
        });
    }
    /**
     * 发送至指定openapi接口
     * 
     * @returns 
     */
    function sendToSpecifyOpenApi(data) {
        $.ajax({
            type: 'POST',
            url: '/sendToOpenApi/' + $(this).data('href'),
            data: data,
            headers: {
                "Server-Ip": $('#serverIp').val(),
                "Server-Port": $('#serverPort').val()
            },
            timeout: 20000,
            success: function (data) {
                showResponse(data);
            },
            error: function (err) {
                showResponse(err);
            }
        });
    }

    /**
     * 显示Response
     * 
     * @param {Json} data 
     */
    function showResponse(data) {
        var strFix = '',
            strStr = '',
            strJson = '';
        if (Array.isArray(data)) {
            var lgh = data.length;
            for (var i = 0; i < lgh; i++) {
                if (i != 0 && i != lgh - 1) {
                    strFix += '\n';
                    strStr += '\n'
                }
                for (var key in data[i]) {
                    strFix += key + '=' + data[i][key] + '\n';
                    strStr += key + '=' + data[i][key] + '|';
                }
            }
        } else {
            for (var key in data) {
                strFix += key + '=' + data[key] + '\n';
                strStr += key + '=' + data[key] + '|';
            }
        }

        $('#strJson').val(JSON.stringify(data).replace(/",/g, '",\n'));
        $('#strFix').val(strFix);
        $('#strStr').val(strStr);
        //$('#strJson').val(JSON.stringify(data).replaceAll('",', '",\n'));
        setTimeout(function () {
            $('#response').JSONView(data, {
                strict: true
            });
            $('#send-fix').removeAttr('disabled');
            $('#send').removeAttr('disabled');
            $('#send-dropdown').removeAttr('disabled');
        }, 300);

    }

    /**
     * 获取url参数值，参数不存在时返回null
     * 
     * @param {String} name 
     * @returns 参数值或null
     */
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    /**
     * 不刷新页面，更新url
     * 
     * @param {Number} seprule 
     */
    function updateUrl(seprule) {
        var sepRule = typeof seprule != 'undefined' ? seprule : $('.sep-rule input[name="options"]').index($('.sep-rule input[name="options"]:checked'));
        var paramUrl = '?seprule=' + sepRule + '&host=' + $('#serverIp').val() + '&port=' + $('#serverPort').val();
        if (sepRule == 2) {
            paramUrl += '&customsep=' + $('#customSep').val();
        }
        history.pushState('', '', paramUrl);
        setPlaceholder(sepRule);
    }

    /**
     * 处理输入报文
     * 
     * @param {any} data 输入报文
     * @param {any} type 类型
     * @returns 
     */
    function dealData(data, type) {
        if (typeof type == 'undefined') {
            type = 'json';
        }
        var sep = '=';
        if ($('#option1').is(":checked")) {
            data = data.replace(/\r/ig, '').replace(/\n/ig, '').split('|');
        } else if ($('#option2').is(":checked")) {
            data = data.replace(/\r/ig, '').split('\n');
        } else if ($('#option3').is(":checked")) {
            var separray = $('#customSep').val().trim().split('^');
            if (separray.length == 2) {
                var septmp = new RegExp('\\' + separray[0]);
                data = data.replace(/\r/ig, '').split(septmp);
                sep = new RegExp('\\' + separray[1]);
            } else {
                return ''
            }
        } else {
            return '';
        }

        var functionid = '',
            r = {},
            x = [],
            y = [];
        data.forEach(function (ele) {
            if (ele.trim() != '') {
                x.push(ele.split(sep)[0]);
                y.push(ele.split(sep)[1]);
                var tmparry = ele.split(sep);
                r[tmparry[0]] = tmparry[1];
                if (tmparry[0] == 'FunctionId') {
                    functionid = tmparry[1];
                }
            }
        });
        if (functionid != '') {
            var tmp = r;
            setTimeout(function () {
                $('#formatedRequest').JSONView(tmp, {});
            }, 300);
            if (type == 'array') {
                if (x.length != y.length)
                    return '';
                r = {
                    'keys': x,
                    'values': y
                }
            }
            return r;
        } else {
            return '';
        }

    }

    //监听复制按钮
    var clipboard = new Clipboard('.copy-tool-btn');
    clipboard.on('success', function (e) {
        console.info('Text:', e.text);
        e.clearSelection();
    });
})();