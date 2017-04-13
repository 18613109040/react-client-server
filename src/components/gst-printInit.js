(function() {
	const ua = window.navigator.userAgent;
	if(ua.match(/QtWebEngine/i)) {
		var gst = {}
		gst.init = false;
		gst.events = {
			KEY_PRESS: "key-press",
			PRINT_END: "print-end"
		}
		gst.printInfo = {
			invoice: 0, //发票收据
			register: 1, //挂号
			detailedList: 2, // 清单打印
			recipe: 3 // 处方打印机
		}
		gst.printer = {};
		new QWebChannel(qt.webChannelTransport, function(channel) {
			// 链接按钮事件
			var events = channel.objects.gstKeyEvents;
			events.keyPress.connect(function(code, name) {
				var keyEvent = new CustomEvent(gst.events.KEY_PRESS, { detail: { code: code, name: name }, aaa: "222" });
				window.dispatchEvent(keyEvent);
			})

			// 链接打印机
			gst.printer = {
				printWeb: channel.objects.gstPrinter.printWeb,
				printData: channel.objects.gstPrinter.printData,
				printView: channel.objects.gstPrinter.printView,
				printEnd: channel.objects.gstPrinter.printEnd
			}
			// 结束打印时的回调，打印成功返回true，打印失败返回false
			if(gst.printer.printEnd) {
			
				gst.printer.printEnd.connect(function(result, printId) {
				
					var keyEvent = new CustomEvent(gst.events.PRINT_END, { detail: { result: result, printId: printId } });
					window.dispatchEvent(keyEvent);
				})
			}

			gst.idCard = {
				getIdCard: channel.objects.idCard.getIdCard
			}

			// 初始化完成后设置状态为true;
			gst.init = true;

			window.gst = gst;
		});

	} else {
		console.warn("检测到此浏览器非固生堂专用浏览器，无法初始化打印程序。");
	}
})();