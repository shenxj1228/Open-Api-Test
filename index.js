const funcs = require("./func.js");
const express = require("express");
const bodyParser = require("body-parser");
const cmd = require("child_process");
const cfg = require("./config/index.js");
const Api = require("./config/Api.js");
const log = require("./funcs/log");
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

//返回config/Api.js文件中所有接口
app.get("/getFixApis", (req, res) => {
  res.json(Api.apis);
});

//返回config/index.js配置信息host，port
app.get("/getServerInfo", (req, res) => {
  res.json({
    host: cfg.fixOnline.host,
    port: cfg.fixOnline.port
  });
});

//对指定地址发送请求
app.post("/sendToOpenApi/:address", (req, res) => {
  let apiAdress = req.params.address;
  if (apiAdress == "queryAddress") {
    apiAdress = funcs.getApiAddress(req.body.FunctionId);
  } else if (apiAdress === "") {
    res.send({
      error: "没有找到FunctionId：" + req.body.FunctionId + "的API地址"
    });
  } else {
    funcs
      .submitToApi(apiAdress, req.body, "")
      .then(
        response => {
          res.send(response);
        },
        err => {
          res.send(err);
        }
      )
      .catch(err => {
        res.send(err);
        log.error(err);
      });
  }
});

//发送fix报文
app.post("/sendToFix", (req, res) => {
  if (
    req.body.hasOwnProperty("keys") &&
    req.body.keys.length > 0 &&
    req.body.hasOwnProperty("values") &&
    req.body.values.length > 0
  ) {
    let host =
      req.get("Server-Ip").trim() != ""
        ? req.get("Server-Ip").trim()
        : cfg.fixOnline.host;
    let port =
      req.get("Server-Port").trim() != ""
        ? req.get("Server-Port").trim()
        : cfg.fixOnline.port;
    funcs
      .sendToFix(host, port, req.body)
      .then(resfix => {
        res.send(resfix);
      })
      .catch(err => {
        res.send({
          elapsedTime: "N",
          body: err
        });
      });
  } else {
    res.send({
      error: "请求报文异常"
    });
  }
});

app.use(function(req, res, next) {
  let err = new Error(req.url + " Not Found");
  err.status = 404;
  if (req.accepts("html")) {
    res.redirect("/404.html");
    return;
  }
  next(err);
});

if (cfg.OAuthInfo.isUse) {
  funcs.getToken().then(token => {
    startListen(cfg.local.port);
  });
} else {
  startListen(cfg.local.port);
}

function startListen(port) {
  app.listen(port, () => {
    cmd.exec("start http://localhost:" + port);
    log.log("started on port：" + port);
  });
}
