module.exports = {
	"apis": [{
			"trans_code": "100001",
			"name": "客户签约",
			"address": "client_sign"
		},
		{
			"trans_code": "100002",
			"name": "客户解约",
			"address": "client_signoff"
		},
		{
			"trans_code": "100003",
			"name": "客户更换银行卡号",
			"address": "client_modify_bankacc"
		},
		{
			"trans_code": "100005",
			"name": "取客户资料(从银行核心获取)",
			"address": "client_get_clientinfo"
		},
		{
			"trans_code": "100008",
			"name": "风险等级校验",
			"address": "client_check_riskinfo"
		},
		{
			"trans_code": "100010",
			"name": "风险等级修改",
			"address": "client_modify_risklevel"
		},
		{
			"trans_code": "100013",
			"name": "银行帐号登记",
			"address": "client_add_bankacc"
		},
		{
			"trans_code": "100014",
			"name": "银行帐号取消登记",
			"address": "client_del_bankacc"
		},
		{
			"trans_code": "100015",
			"name": "更换银行帐号流水查询",
			"address": "client_bankacc_req_query"
		},
		{
			"trans_code": "100100",
			"name": "开户",
			"address": "client_account_open"
		},
		{
			"trans_code": "100104",
			"name": "客户信息变更",
			"address": "client_modify_baseinfo"
		},
		{
			"trans_code": "100200",
			"name": "产品购买",
			"address": "client_product_buy"
		},
		{
			"trans_code": "100202",
			"name": "产品赎回",
			"address": "client_product_redeem"
		},
		{
			"trans_code": "100219",
			"name": "客户撤单",
			"address": "client_req_cancel"
		},
		{
			"trans_code": "100300",
			"name": "客户信息查询",
			"address": "client_baseinfo_query"
		},
		{
			"trans_code": "100301",
			"name": "客户签约银行帐号信息查询",
			"address": "client_bankacc_query"
		},
		{
			"trans_code": "100302",
			"name": "账户查询",
			"address": "client_account_query"
		},
		{
			"trans_code": "100304",
			"name": "份额查询",
			"address": "client_share_query"
		},
		{
			"trans_code": "100330",
			"name": "行情查询",
			"address": "client_prddaily_query"
		},
		{
			"trans_code": "100342",
			"name": "允许撤单流水查询",
			"address": "client_cancel_req_query"
		},
		{
			"trans_code": "100352",
			"name": "风险问卷查询",
			"address": "client_riskscore_query"
		},
		{
			"trans_code": "100353",
			"name": "风险评估",
			"address": "client_risk_assessment"
		},
		{
			"trans_code": "100375",
			"name": "风险等级查询",
			"address": "client_risklevel_query"
		},
		{
			"trans_code": "100376",
			"name": "客户当前流水查询",
			"address": "client_req_query"
		},
		{
			"trans_code": "100377",
			"name": "客户历史流水查询",
			"address": "client_hisreq_query"
		}
	]
}