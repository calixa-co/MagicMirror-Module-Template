/* global Module */

/* Magic Mirror
 * Module: calixa-MM-module
 *
 * By Victor
 * MIT Licensed.
 */

Module.register("calixa-MM-module", {

	defaults: {
		updateInterval: 5000,
		retryDelay: 5000,
		cnt: 0
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();

		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {

		var self = this;

		var urlApi = "http://34.74.37.123:5001/mock_recom";
		var retry = true;

		/*var zmq = require('zmq');
		var sock = zmq.socket('pull');
		sock.connect('tcp://127.0.0.1:5557')
		sock.on('message', function(msg){
			console.log('work: %s', msg.toString());
		})*/

		var dataRequest = new XMLHttpRequest();

		dataRequest.open("GET", urlApi, true);

		dataRequest.onreadystatechange = function() {

			console.log(this.readyState);

			if (this.readyState === 4) {

				console.log(this.status);

				if (this.status === 200) {
					self.processData(JSON.parse(this.response));

				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;

				} else {
					Log.error(self.name, "Could not get data from python backend.");

				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {

		var self = this;

		var wrapper = document.createElement("div");

		if (this.dataRequest) {

			var wrapperDataRequest = document.createElement('div');

			/*wrapperDataRequest.innerHTML = `

				<h5>Recommended</br>for you</h5>

				<div class="left_panel">

					<div class="img_box">
						<a><img class="img" src="https://aritzia.scene7.com/is/image/Aritzia/large/s19_04_a08_69045_10108_on_a.jpg">
						<img class="cart" src="modules/calixa-MM-module/img/cart.jpg"><b>&nbsp Kate Skinny Pant</b>
						</a>
					</div>

					<div class="img_box">
						<a><img class="img" src="https://aritzia.scene7.com/is/image/Aritzia/large/s19_04_a08_71233_15725_on_b.jpg">
						<img class="cart" src="modules/calixa-MM-module/img/cart.jpg"><b>&nbsp Basic High Rise Legging</b>
						</a>
					</div>

					<div class="img_box">
						<a><img class="img" src="https://aritzia.scene7.com/is/image/Aritzia/large/s19_04_a08_69665_11420_on_b.jpg">
						<img class="cart" src="modules/calixa-MM-module/img/cart.jpg"><b>&nbsp Sienna Crop Top</b>
						</a>
					</div>

				</div>
			`;*/

			wrapperDataRequest.innerHTML = `

				<div class="left_panel">

				<h5>Recommended for you</h5>

					<div class="img_box">
						<a><img class="img" src="` + this.dataRequest.recommendation[0].url + `">
						<img class="cart" src="modules/calixa-MM-module/img/cart.jpg"><b>&nbsp ` + this.dataRequest.recommendation[0].name + `</b>
						</a>
					</div>

					<div class="img_box">
						<a><img class="img" src="` + this.dataRequest.recommendation[1].url + `">
						<img class="cart" src="modules/calixa-MM-module/img/cart.jpg"><b>&nbsp ` + this.dataRequest.recommendation[1].name + `</b>
						</a>
					</div>

					<div class="img_box">
						<a><img class="img" src="` + this.dataRequest.recommendation[2].url + `">
						<img class="cart" src="modules/calixa-MM-module/img/cart.jpg"><b>&nbsp ` + this.dataRequest.recommendation[2].name + `</b>
						</a>
					</div>

				</div>
			`;

			wrapper.appendChild(wrapperDataRequest);
		}

		// Data from helper
		/*if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}*/
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"calixa-MM-module.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		var notif = "calixa-MM-module-NOTIFICATION_TEST N° " + self.config.cnt
		this.sendSocketNotification( notif, data);
		self.config.cnt += 1;
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "calixa-MM-module-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
