/**
 * Created by Administrator on 2017/3/20.
 */
(function () {
  const ua = window.navigator.userAgent;
  if (ua.match(/QtWebEngine/i)) {
    addPrintScript();
  } else {
    console.warn("检测到此浏览器非固生堂专用浏览器，无法初始化打印程序。");
  }
})();


function addPrintScript() {
  // 动态添加script
  const body = document.getElementsByTagName('body')[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = script.onreadystatechange = function () {
    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
      gstPrintInit();
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null;
    }
  };
  script.src = 'qrc:///qtwebchannel/qwebchannel.js';
  body.appendChild(script);
  // alert("动态添加script");
}

function gstPrintInit() {
  const gst = {
    init: false,
    events: {
      KEY_PRESS: "key-press"
    },
    printInfo: {
      charges: 0,     //收费
      register: 1,    //挂号
      detailedList: 2,
      prescripe:3,//处方
    },
    printer: {},
  };
  new QWebChannel(qt.webChannelTransport, function (channel) {
    // 链接按钮事件
    const events = channel.objects.gstKeyEvents;
    events.keyPress.connect(function (code, name) {
      let keyEvent = new CustomEvent(gst.events.KEY_PRESS, {detail: {code: code, name: name}, aaa: "222"});
      window.dispatchEvent(keyEvent);
    });
    // 链接打印机
    gst.printer = {
      printWeb: channel.objects.gstPrinter.printWeb,
      printData: channel.objects.gstPrinter.printData,
      printView: channel.objects.gstPrinter.printView
    };
    // 初始化完成后设置状态为true;
    gst.init = true;
    window.gst = gst;
    // alert("成功初始化QWebChannel");
  });
}
