
// 钢琴

$.getScript('https://aoz0ra.github.io/mpp.aoz0ra.net/FixedDraw.js');
$.getScript('https://piano.ourworldofpixels.com/curssettings.js');
$.getScript('https://piano.ourworldofpixels.com/addon.js');

$(function() {

	var test_mode = (window.location.hash && window.location.hash.match(/^(?:#.+)*#test(?:#.+)*$/i));

	var gSeeOwnCursor = (window.location.hash && window.location.hash.match(/^(?:#.+)*#seeowncursor(?:#.+)*$/i));

	var gMidiVolumeTest = (window.location.hash && window.location.hash.match(/^(?:#.+)*#midivolumetest(?:#.+)*$/i));

	var gMidiOutTest;

	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /*, from*/) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) from += len;
			for (; from < len; from++) {
				if (from in this && this[from] === elt) return from;
			}
			return -1;
		};
	}

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
		|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
		|| function (cb) { setTimeout(cb, 1000 / 30); };








	




























	var DEFAULT_VELOCITY = 0.5;












































	var TIMING_TARGET = 1000;



















// Utility

////////////////////////////////////////////////////////////////



var Rect = function(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.x2 = x + w;
	this.y2 = y + h;
};
Rect.prototype.contains = function(x, y) {
	return (x >= this.x && x <= this.x2 && y >= this.y && y <= this.y2);
};
















// performing translation

////////////////////////////////////////////////////////////////

	var Translation = (function() {
		var strings = {
			"people are playing": {
				"pt": "pessoas estão jogando",
				"es": "personas están jugando",
				"ru": "человек играет",
				"fr": "personnes jouent",
				"ja": "人が遊んでいる",
				"de": "Leute spielen",
				"zh": "人在玩",
				"nl": "mensen spelen",
				"pl": "osób grają",
				"hu": "ember játszik"
			},
			"New Room...": {
				"pt": "Nova Sala ...",
				"es": "Nueva sala de...",
				"ru": "Новый номер...",
				"ja": "新しい部屋",
				"zh": "新房间",
				"nl": "nieuwe Kamer",
				"hu": "új szoba"
			},
			"room name": {
				"pt": "nome da sala",
				"es": "sala de nombre",
				"ru": "название комнаты",
				"fr": "nom de la chambre",
				"ja": "ルーム名",
				"de": "Raumnamen",
				"zh": "房间名称",
				"nl": "kamernaam",
				"pl": "nazwa pokój",
				"hu": "szoba neve"
			},
			"Visible (open to everyone)": {
				"pt": "Visível (aberto a todos)",
				"es": "Visible (abierto a todo el mundo)",
				"ru": "Visible (открытый для всех)",
				"fr": "Visible (ouvert à tous)",
				"ja": "目に見える（誰にでも開いている）",
				"de": "Sichtbar (offen für alle)",
				"zh": "可见（向所有人开放）",
				"nl": "Zichtbaar (open voor iedereen)",
				"pl": "Widoczne (otwarte dla wszystkich)",
				"hu": "Látható (nyitott mindenki számára)"
			},
			"Enable Chat": {
				"pt": "Ativar bate-papo",
				"es": "Habilitar chat",
				"ru": "Включить чат",
				"fr": "Activer discuter",
				"ja": "チャットを有効にする",
				"de": "aktivieren Sie chatten",
				"zh": "启用聊天",
				"nl": "Chat inschakelen",
				"pl": "Włącz czat",
				"hu": "a csevegést"
			},
			"Play Alone": {
				"pt": "Jogar Sozinho",
				"es": "Jugar Solo",
				"ru": "Играть в одиночку",
				"fr": "Jouez Seul",
				"ja": "一人でプレイ",
				"de": "Alleine Spielen",
				"zh": "独自玩耍",
				"nl": "Speel Alleen",
				"pl": "Zagraj sam",
				"hu": "Játssz egyedül"
			}
			// todo: it, tr, th, sv, ar, fi, nb, da, sv, he, cs, ko, ro, vi, id, nb, el, sk, bg, lt, sl, hr
			// todo: Connecting, Offline mode, input placeholder, Notifications
		};

		var setLanguage = function(lang) {
			language = lang
		};

		var getLanguage = function() {
			if(window.navigator && navigator.language && navigator.language.length >= 2) {
				return navigator.language.substr(0, 2).toLowerCase();
			} else {
				return "en";
			}
		};

		var get = function(text, lang) {
			if(typeof lang === "undefined") lang = language;
			var row = strings[text];
			if(row == undefined) return text;
			var string = row[lang];
			if(string == undefined) return text;
			return string;
		};

		var perform = function(lang) {
			if(typeof lang === "undefined") lang = language;
			$(".translate").each(function(i, ele) {
				var th = $(this);
				if(ele.tagName && ele.tagName.toLowerCase() == "input") {
					if(typeof ele.placeholder != "undefined") {
						th.attr("placeholder", get(th.attr("placeholder"), lang))
					}
				} else {
					th.text(get(th.text(), lang));
				}
			});
		};

		var language = getLanguage();

		return {
			setLanguage: setLanguage,
			getLanguage: getLanguage,
			get: get,
			perform: perform
		};
	})();

	Translation.perform();















// AudioEngine classes

////////////////////////////////////////////////////////////////

	var AudioEngine = function() {
	};

	AudioEngine.prototype.init = function(cb) {
		this.volume = 0.6;
		this.sounds = {};
		this.paused = true;
		return this;
	};

	AudioEngine.prototype.load = function(id, url, cb) {
	};

	AudioEngine.prototype.play = function() {
	};

	AudioEngine.prototype.stop = function() {
	};

	AudioEngine.prototype.setVolume = function(vol) {
		this.volume = vol;
	};
	
	AudioEngine.prototype.resume = function() {
		this.paused = false;
	};


	AudioEngineWeb = function() {
		this.threshold = 10;
		this.worker = new Worker("/workerTimer.js");
		var self = this;
		this.worker.onmessage = function(event)
			{
				if(event.data.args)
				if(event.data.args.action==0)
				{
					self.actualPlay(event.data.args.id, event.data.args.vol, event.data.args.time, event.data.args.part_id);
				}
				else
				{
					self.actualStop(event.data.args.id, event.data.args.time, event.data.args.part_id);
				}
			}
	};

	AudioEngineWeb.prototype = new AudioEngine();

	AudioEngineWeb.prototype.init = function(cb) {
		AudioEngine.prototype.init.call(this);

		this.context = new AudioContext();

		this.masterGain = this.context.createGain();
		this.masterGain.connect(this.context.destination);
		this.masterGain.gain.value = this.volume;

		this.limiterNode = this.context.createDynamicsCompressor();
		this.limiterNode.threshold.value = -10;
		this.limiterNode.knee.value = 0;
		this.limiterNode.ratio.value = 20;
		this.limiterNode.attack.value = 0;
		this.limiterNode.release.value = 0.1;
		this.limiterNode.connect(this.masterGain);

		// for synth mix
		this.pianoGain = this.context.createGain();
		this.pianoGain.gain.value = 0.5;
		this.pianoGain.connect(this.limiterNode);
		this.synthGain = this.context.createGain();
		this.synthGain.gain.value = 0.5;
		this.synthGain.connect(this.limiterNode);

		this.playings = {};
		
		if(cb) setTimeout(cb, 0);
		return this;
	};

	AudioEngineWeb.prototype.load = function(id, url, cb) {
		var audio = this;
		var req = new XMLHttpRequest();
		req.open("GET", url);
		req.responseType = "arraybuffer";
		req.addEventListener("readystatechange", function(evt) {
			if(req.readyState !== 4) return;
			try {
				audio.context.decodeAudioData(req.response, function(buffer) {
					audio.sounds[id] = buffer;
					if(cb) cb();
				});
			} catch(e) {
				/*throw new Error(e.message
					+ " / id: " + id
					+ " / url: " + url
					+ " / status: " + req.status
					+ " / ArrayBuffer: " + (req.response instanceof ArrayBuffer)
					+ " / byteLength: " + (req.response && req.response.byteLength ? req.response.byteLength : "undefined"));*/
				new Notification({id: "audio-download-error", title: "Problem", text: "For some reason, an audio download failed with a status of " + req.status + ". ",
					target: "#piano", duration: 10000});
			}
		});
		req.send();
	};

	AudioEngineWeb.prototype.actualPlay = function(id, vol, time, part_id) { //the old play(), but with time insted of delay_ms.
		if(this.paused) return;
		if(!this.sounds.hasOwnProperty(id)) return;
		var source = this.context.createBufferSource();
		source.buffer = this.sounds[id];
		var gain = this.context.createGain();
		gain.gain.value = vol;
		source.connect(gain);
		gain.connect(this.pianoGain);
		source.start(time);
		// Patch from ste-art remedies stuttering under heavy load
		if(this.playings[id]) {
			var playing = this.playings[id];
			playing.gain.gain.setValueAtTime(playing.gain.gain.value, time);
			playing.gain.gain.linearRampToValueAtTime(0.0, time + 0.2);
			playing.source.stop(time + 0.21);
			if(enableSynth && playing.voice) {
				playing.voice.stop(time);
			}
		}
		this.playings[id] = {"source": source, "gain": gain, "part_id": part_id};

		if(enableSynth) {
			this.playings[id].voice = new synthVoice(id, time);
		}
	}
	
	AudioEngineWeb.prototype.play = function(id, vol, delay_ms, part_id)
	{
		if(!this.sounds.hasOwnProperty(id)) return;
		var time = this.context.currentTime + (delay_ms / 1000); //calculate time on note receive.
		var delay = delay_ms - this.threshold;
		if(delay<=0) this.actualPlay(id, vol, time, part_id);
		else {
			this.worker.postMessage({delay:delay,args:{action:0/*play*/,id:id, vol:vol, time:time, part_id:part_id}}); // but start scheduling right before play.
		}
	}
	
	AudioEngineWeb.prototype.actualStop = function(id, time, part_id) {
		if(this.playings.hasOwnProperty(id) && this.playings[id] && this.playings[id].part_id === part_id) {
			var gain = this.playings[id].gain.gain;
			gain.setValueAtTime(gain.value, time);
			gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16);
			gain.linearRampToValueAtTime(0.0, time + 0.4);
			this.playings[id].source.stop(time + 0.41);
			

			if(this.playings[id].voice) {
				this.playings[id].voice.stop(time);
			}

			this.playings[id] = null;
		}
	};

	AudioEngineWeb.prototype.stop = function(id, delay_ms, part_id) {
			var time = this.context.currentTime + (delay_ms / 1000);
			var delay = delay_ms - this.threshold;
			if(delay<=0) this.actualStop(id, time, part_id);
			else {
				this.worker.postMessage({delay:delay,args:{action:1/*stop*/, id:id, time:time, part_id:part_id}});
			}
	};

	AudioEngineWeb.prototype.setVolume = function(vol) {
		AudioEngine.prototype.setVolume.call(this, vol);
		this.masterGain.gain.value = this.volume;
	};
	
	AudioEngineWeb.prototype.resume = function() {
		this.paused = false;
		this.context.resume();
	};


























// Renderer classes

////////////////////////////////////////////////////////////////

	var Renderer = function() {
	};

	Renderer.prototype.init = function(piano) {
		this.piano = piano;
		this.resize();
		return this;
	};

	Renderer.prototype.resize = function(width, height) {
		if(typeof width == "undefined") width = $(this.piano.rootElement).width();
		if(typeof height == "undefined") height = Math.floor(width * 0.2);
		$(this.piano.rootElement).css({"height": height + "px", marginTop: Math.floor($(window).height() / 2 - height / 2) + "px"});
		this.width = width * window.devicePixelRatio;
		this.height = height * window.devicePixelRatio;
	};

	Renderer.prototype.visualize = function(key, color) {
	};


var DOMRenderer = function() {
		Renderer.call(this);
	};
	DOMRenderer.prototype = new Renderer();
	DOMRenderer.prototype.init = function(piano) {
		// create keys in dom
		for(var i in piano.keys) {
			if(!piano.keys.hasOwnProperty(i)) continue;
			var key = piano.keys[i];
			var ele = document.createElement("div");
			key.domElement = ele;
			piano.rootElement.appendChild(ele);
			// "key sharp cs cs2"
			ele.note = key.note;
			ele.id = key.note;
			ele.className = "key " + (key.sharp ? "sharp " : " ") + key.baseNote + " " + key.note + " loading";
			var table = $('<table width="100%" height="100%" style="pointer-events:none"></table>');
			var td = $('<td valign="bottom"></td>');
			table.append(td);
			td.valign = "bottom";
			$(ele).append(table);
		}
		// add event listeners
		var mouse_down = false;
		$(piano.rootElement).mousedown(function(event) {
			// todo: IE10 doesn't support the pointer-events css rule on the "blips"
			var ele = event.target;
			if($(ele).hasClass("key") && piano.keys.hasOwnProperty(ele.note)) {
				var key = piano.keys[ele.note];
				press(key.note);
				mouse_down = true;
				event.stopPropagation();
			};
			//event.preventDefault();
		});
		piano.rootElement.addEventListener("touchstart", function(event) {
			for(var i in event.changedTouches) {
				var ele = event.changedTouches[i].target;
				if($(ele).hasClass("key") && piano.keys.hasOwnProperty(ele.note)) {
					var key = piano.keys[ele.note];
					press(key.note);
					mouse_down = true;
					event.stopPropagation();
				}
			}
			//event.preventDefault();
		}, false);
		$(window).mouseup(function(event) {
			mouse_down = false;
		});
		/*$(piano.rootElement).mouseover(function(event) {
			if(!mouse_down) return;
			var ele = event.target;
			if($(ele).hasClass("key") && piano.keys.hasOwnProperty(ele.note)) {
				var key = piano.keys[ele.note];
				press(key.note);
			}
		});*/
		Renderer.prototype.init.call(this, piano);
		return this;
	};
	DOMRenderer.prototype.resize = function(width, height) {
		Renderer.prototype.resize.call(this, width, height);
	};
	DOMRenderer.prototype.visualize = function(key, color) {
		var k = $(key.domElement);
		k.addClass("play");
		setTimeout(function(){
			k.removeClass("play");
		}, 200);
		// "blips"
		var d = $('<div style="width:100%;height:10%;margin:0;padding:0">&nbsp;</div>');
		d.css("background", color);
		k.find("td").append(d);
		d.fadeOut(1000, function(){
			d.remove();
		});
	};

	var CanvasRenderer = function() {
		Renderer.call(this);
	};

	CanvasRenderer.prototype = new Renderer();

	CanvasRenderer.prototype.init = function(piano) {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		piano.rootElement.appendChild(this.canvas);

		Renderer.prototype.init.call(this, piano); // calls resize()

		// create render loop
		var self = this;
		var render = function() {
			self.redraw();
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// add event listeners
		var mouse_down = false;
		var last_key = null;
		$(piano.rootElement).mousedown(function(event) {
			mouse_down = true;
			//event.stopPropagation();
			event.preventDefault();

			var pos = CanvasRenderer.translateMouseEvent(event);
			var hit = self.getHit(pos.x, pos.y);
			if(hit) {
				press(hit.key.note, hit.v);
				last_key = hit.key;
			}
		});
		piano.rootElement.addEventListener("touchstart", function(event) {
			mouse_down = true;
			//event.stopPropagation();
			event.preventDefault();
			for(var i in event.changedTouches) {
				var pos = CanvasRenderer.translateMouseEvent(event.changedTouches[i]);
				var hit = self.getHit(pos.x, pos.y);
				if(hit) {
					press(hit.key.note, hit.v);
					last_key = hit.key;
				}
			}
		}, false);
		$(window).mouseup(function(event) {
			if(last_key) {
				release(last_key.note);
			}
			mouse_down = false;
			last_key = null;
		});
		/*$(piano.rootElement).mousemove(function(event) {
			if(!mouse_down) return;
			var pos = CanvasRenderer.translateMouseEvent(event);
			var hit = self.getHit(pos.x, pos.y);
			if(hit && hit.key != last_key) {
				press(hit.key.note, hit.v);
				last_key = hit.key;
			}
		});*/

		return this;
	};

	CanvasRenderer.prototype.resize = function(width, height) {
		Renderer.prototype.resize.call(this, width, height);
		if(this.width < (16 * 7) * 2) this.width = (16 * 7) * 2;
		if(this.height < this.width * 0.2) this.height = Math.floor(this.width * 0.2);
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.width = this.width / window.devicePixelRatio + "px";
		this.canvas.style.height = this.height / window.devicePixelRatio + "px";
		
		// calculate key sizes
		this.whiteKeyWidth = this.width / (24 * 7);
		this.whiteKeyHeight = Math.floor(this.height * 0.9);
		this.blackKeyWidth = this.whiteKeyWidth * 0.75 - 1;
		this.blackKeyHeight = Math.floor(this.height * 0.5);

		this.blackKeyOffset = Math.floor(this.whiteKeyWidth - (this.blackKeyWidth / 2));
		this.keyMovement = Math.floor(this.whiteKeyHeight * 0.015);

		this.whiteBlipWidth = Math.floor(this.whiteKeyWidth - 1);
		this.whiteBlipHeight = Math.floor(this.whiteBlipWidth * 1.5);
		this.whiteBlipX = Math.floor((this.whiteKeyWidth - this.whiteBlipWidth) / 2);
		this.whiteBlipY = Math.floor(this.whiteKeyHeight - this.whiteBlipHeight * 0.7);
		this.blackBlipWidth = Math.floor(this.blackKeyWidth - 1);
		this.blackBlipHeight = Math.floor(this.blackBlipWidth * 1.5);
		this.blackBlipY = Math.floor(this.blackKeyHeight - this.blackBlipHeight - 1);
		this.blackBlipX = Math.floor((this.blackKeyWidth - this.blackBlipWidth) / 2);
		
		// prerender white key
		
		this.whiteKeyRender = document.createElement("canvas");
		this.whiteKeyRender.width = this.whiteKeyWidth;
		this.whiteKeyRender.height = this.height + 10;
		var ctx = this.whiteKeyRender.getContext("2d");
// 		if(ctx.createLinearGradient) {
// 			var gradient = ctx.createLinearGradient(0, 0, 0, this.whiteKeyHeight);
// 			gradient.addColorStop(0, "#eee0");
// 			gradient.addColorStop(0.75, "#fff");
// 			gradient.addColorStop(1, "#dad4d4");
// 			ctx.fillStyle = gradient;
// 		} else {
			ctx.fillStyle = "#fff4";
// 		}
		ctx.strokeStyle = "#000";
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = 0;
// 		ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
		ctx.lineWidth = 0;
		ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
		
		// prerender black key
		this.blackKeyRender = document.createElement("canvas");
		this.blackKeyRender.width = this.blackKeyWidth + 10;
		this.blackKeyRender.height = this.blackKeyHeight + 10;
		var ctx = this.blackKeyRender.getContext("2d");
// 		if(ctx.createLinearGradient) {
// 			var gradient = ctx.createLinearGradient(0, 0, 0, this.blackKeyHeight);
// 			gradient.addColorStop(0, "#000");
// 			gradient.addColorStop(1, "#444");
// 			ctx.fillStyle = gradient;
// 		} else {
			ctx.fillStyle = "#0004";
// 		}
		ctx.strokeStyle = "#222";
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineWidth = 0;
// 		ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
		ctx.lineWidth = 0;
		ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
        

		// prerender shadows
		this.shadowRender = [];
		var y = -this.canvas.height * 2;
		for(var j = 0; j < 2; j++) {
			var canvas = document.createElement("canvas");
			this.shadowRender[j] = canvas;
			canvas.width = this.canvas.width;
			canvas.height = this.canvas.height;
			var ctx = canvas.getContext("2d");
			var sharp = j ? true : false;
			ctx.lineJoin = "flat";
			ctx.lineCap = "flat";
			ctx.lineWidth = 1;
			ctx.shadowColor = "rgba(0, 0, 0, 0)";
			ctx.shadowBlur = this.keyMovement * 0;
			ctx.shadowOffsetY = -y + this.keyMovement;
			if(sharp) {
				ctx.shadowOffsetX = this.keyMovement;
			} else {
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = -y + this.keyMovement;
			}
			for(var i in this.piano.keys) {
				if(!this.piano.keys.hasOwnProperty(i)) continue;
				var key = this.piano.keys[i];
				if(key.sharp != sharp) continue;

				if(key.sharp) {
					ctx.fillRect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2,
						y + ctx.lineWidth / 2,
						this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
				} else {
					ctx.fillRect(this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2,
						y + ctx.lineWidth / 2,
						this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
				}
			}
		}

		// update key rects
		for(var i in this.piano.keys) {
			if(!this.piano.keys.hasOwnProperty(i)) continue;
			var key = this.piano.keys[i];
			if(key.sharp) {
				key.rect = new Rect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial, 0,
					this.blackKeyWidth, this.blackKeyHeight);
			} else {
				key.rect = new Rect(this.whiteKeyWidth * key.spatial, 0,
					this.whiteKeyWidth, this.whiteKeyHeight);
			}
		}
	};

	CanvasRenderer.prototype.visualize = function(key, color) {
		key.timePlayed = Date.now();
		key.blips.push({"time": key.timePlayed, "color": color});
	};

	CanvasRenderer.prototype.redraw = function() {
		var now = Date.now();
		var timeLoadedEnd = now - 1000;
		var timePlayedEnd = now - 100;
		var timeBlipEnd = now - 1000;

		this.ctx.save();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// draw all keys
		for(var j = 0; j < 2; j++) {
			this.ctx.globalAlpha = 1.0;
			this.ctx.drawImage(this.shadowRender[j], 0, 0);
			var sharp = j ? true : false;
			for(var i in this.piano.keys) {
				if(!this.piano.keys.hasOwnProperty(i)) continue;
				var key = this.piano.keys[i];
				if(key.sharp != sharp) continue;

				if(!key.loaded) {
					this.ctx.globalAlpha = 0.2;
				} else if(key.timeLoaded > timeLoadedEnd) {
					this.ctx.globalAlpha = ((now - key.timeLoaded) / 1000) * 0.8 + 0.2;
				} else {
					this.ctx.globalAlpha = 1.0;
				}
				var y = 0;
				if(key.timePlayed > timePlayedEnd) {
					y = Math.floor(this.keyMovement - (((now - key.timePlayed) / 100) * this.keyMovement));
				}
				var x = Math.floor(key.sharp ? this.blackKeyOffset + this.whiteKeyWidth * key.spatial
					: this.whiteKeyWidth * key.spatial);
				var image = key.sharp ? this.blackKeyRender : this.whiteKeyRender;
				this.ctx.drawImage(image, x, y);
				
				var clr = gPiano.color + 0x333333;
				
				clr = clr > 0xFFFFFF ? 0xFFFFFF : clr;
				// this.ctx.fillStyle = sharp ? "#222222" : '#'+('000000'+clr.toString(16)).slice(-6);
				// this.ctx.fillRect(x, y, sharp ? this.blackKeyWidth : this.whiteKeyWidth-1, sharp ? this.blackKeyHeight : this.whiteKeyHeight);

				// render blips
				if(key.blips.length) {
					var alpha = this.ctx.globalAlpha;
					var w, h;
					if(key.sharp) {
						x += this.blackBlipX;
						y = this.blackBlipY;
						w = this.blackBlipWidth;
						h = this.blackBlipHeight;
					} else {
						x += this.whiteBlipX;
						y = this.whiteBlipY;
						w = this.whiteBlipWidth;
						h = this.whiteBlipHeight;
					}
					for(var b = 0; b < key.blips.length; b++) {
						var blip = key.blips[b];
						if(blip.time > timeBlipEnd) {
							this.ctx.fillStyle = blip.color;
							this.ctx.globalAlpha = alpha - ((now - blip.time) / 1000);
							this.ctx.fillRect(x, y, w, h);
						} else {
							key.blips.splice(b, 1);
							--b;
						}
						y -= h;
					}
				}
			}
		}
		this.ctx.restore();
	};

	CanvasRenderer.prototype.renderNoteLyrics = function() {
		// render lyric
		for(var part_id in this.noteLyrics) {
			if(!this.noteLyrics.hasOwnProperty(i)) continue;
			var lyric = this.noteLyrics[part_id];
			var lyric_x = x;
			var lyric_y = this.whiteKeyHeight + 1;
			this.ctx.fillStyle = key.lyric.color;
			var alpha = this.ctx.globalAlpha;
			this.ctx.globalAlpha = alpha - ((now - key.lyric.time) / 1000);
			this.ctx.fillRect(x, y, 10, 10);
		}
	};

	CanvasRenderer.prototype.getHit = function(x, y) {
		for(var j = 0; j < 2; j++) {
			var sharp = j ? false : true; // black keys first
			for(var i in this.piano.keys) {
				if(!this.piano.keys.hasOwnProperty(i)) continue;
				var key = this.piano.keys[i];
				if(key.sharp != sharp) continue;
				if(key.rect.contains(x, y)) {
					var v = y / (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight);
					v += 0.25;
					v *= DEFAULT_VELOCITY;
					if(v > 1.0) v = 1.0;
					return {"key": key, "v": v};
				}
			}
		}
		return null;
	};


	CanvasRenderer.isSupported = function() {
		var canvas = document.createElement("canvas");
		return !!(canvas.getContext && canvas.getContext("2d"));
	};

	CanvasRenderer.translateMouseEvent = function(evt) {
		var element = evt.target;
		var offx = 0;
		var offy = 0;
		do {
			if(!element) break; // wtf, wtf?
			offx += element.offsetLeft;
			offy += element.offsetTop;
		} while(element = element.offsetParent);
		return {
			x: evt.pageX - offx,
			y: evt.pageY - offy
		}
	};











// Soundpack Stuff by electrashave ♥

////////////////////////////////////////////////////////////////

	function SoundSelector(piano) {
	    this.initialized = false;
	    this.keys = piano.keys;
	    this.loading = {};
	    this.notification;
	    this.packs = [];
	    this.piano = piano;
	    this.soundSelection = localStorage?.soundSelection || "MPP Classic";
	    this.addPack({name: "MPP Classic", keys: Object.keys(this.piano.keys), ext: ".mp3", url: "/sounds/mppclassic/"});
	}

	SoundSelector.prototype.addPack = function(pack, load) {
		var self = this;
		self.loading[pack.url || pack] = true;
		function add(obj) {
			var added = false;
			for (var i = 0; self.packs.length > i; i++) {
				if (obj.name == self.packs[i].name) {
					added = true;
					break;
				}
			}

			if (added) return console.warn("Sounds already added!!"); //no adding soundpacks twice D:<

			if (obj.url.substr(obj.url.length-1) != "/") obj.url = obj.url + "/";
			var html = document.createElement("li");
			html.classList = "pack";
			html.innerText = obj.name + " (" + obj.keys.length + " keys)";
			html.onclick = function() {
				self.loadPack(obj.name);
				self.notification.close();
			};
			obj.html = html;
			self.packs.push(obj);
			self.packs.sort(function(a, b) {
	            if(a.name < b.name) return -1;
	            if(a.name > b.name) return 1;
	            return 0;
	        });
	        if (load) self.loadPack(obj.name);
	        delete self.loading[obj.url];
		}

		if (typeof pack == "string") {
			$.getJSON(pack + "/info.json").done(function(json) {
				json.url = pack;
				add(json);
			});
		} else add(pack); //validate packs??
	};

	SoundSelector.prototype.addPacks = function(packs) {
		for (var i = 0; packs.length > i; i++) this.addPack(packs[i]);
	};

	SoundSelector.prototype.init = function() {
		var self = this;
		if (self.initialized) return console.warn("Sound selector already initialized!");

	    if (!!Object.keys(self.loading).length) return setTimeout(function() {
	        self.init();
	    }, 250);

	    $("#sound-btn").on("click", function() {
			if (document.getElementById("Notification-Sound-Selector") != null)
				return self.notification.close();
			var html = document.createElement("ul");
	        //$(html).append("<p>Current Sound: " + self.soundSelection + "</p>");

	        for (var i = 0; self.packs.length > i; i++) {
				var pack = self.packs[i];
				if (pack.name == self.soundSelection) pack.html.classList = "pack enabled";
				else pack.html.classList = "pack";
				html.appendChild(pack.html);
	        }

			self.notification = new Notification({title: "Change those sounds!", html: html, id: "Sound-Selector", duration: -1, target: "#sound-btn"});
	    });
	    self.initialized = true;
	    self.loadPack(self.soundSelection, true);
	};

	SoundSelector.prototype.loadPack = function(pack, f) {
		for (var i = 0; this.packs.length > i; i++) {
			var p = this.packs[i];
			if (p.name == pack) {
				pack = p;
				break;
			}
		}
		if (typeof pack == "string") {
			console.warn("Sound pack does not exist! Loading default pack...");
	        return this.loadPack("MPP Classic");
		}

		if (pack.name == this.soundSelection && !f) return;
		if (pack.keys.length != Object.keys(this.piano.keys).length) {
			this.piano.keys = {};
			for (var i = 0; pack.keys.length > i; i++) this.piano.keys[pack.keys[i]] = this.keys[pack.keys[i]];
			this.piano.renderer.resize();
		}

		var self = this;
		for (var i in this.piano.keys) {
	        if (!this.piano.keys.hasOwnProperty(i)) continue;
	        (function() {
	            var key = self.piano.keys[i];
	            key.loaded = false;
	            self.piano.audio.load(key.note, pack.url + key.note + pack.ext, function() {
	                key.loaded = true;
	                key.timeLoaded = Date.now();
	            });
	        })();
	    }
	    if(localStorage) localStorage.soundSelection = pack.name;
	    this.soundSelection = pack.name;
	};

	SoundSelector.prototype.removePack = function(name) {
		var found = false;
		for (var i = 0; this.packs.length > i; i++) {
			var pack = this.packs[i];
			if (pack.name == name) {
				this.packs.splice(i, 1);
				if (pack.name == this.soundSelection) this.loadPack(this.packs[0].name); //add mpp default if none?
				break;
			}
		}
		if (!found) console.warn("Sound pack not found!");
	};











// Pianoctor

////////////////////////////////////////////////////////////////

	var PianoKey = function(note, octave) {
		this.note = note + octave;
		this.baseNote = note;
		this.octave = octave;
		this.sharp = note.indexOf("s") != -1;
		this.loaded = false;
		this.timeLoaded = 0;
		this.domElement = null;
		this.timePlayed = 0;
		this.blips = [];
	};

	var Piano = function(rootElement) {
	
		var piano = this;
		piano.rootElement = rootElement;
		piano.keys = {};
		
		var white_spatial = 0;
		var black_spatial = 0;
		var black_it = 0;
		var black_lut = [2, 1, 2, 1, 1];
		var addKey = function(note, octave) {
			var key = new PianoKey(note, octave);
			piano.keys[key.note] = key;
			if(key.sharp) {
				key.spatial = black_spatial;
				black_spatial += black_lut[black_it % 5];
				++black_it;
			} else {
				key.spatial = white_spatial;
				++white_spatial;
			}
		}
		if(test_mode) {
			addKey("c", 2);
		} else {
			addKey("a", -8);
			addKey("as", -8);
			addKey("b", -8);
			var notes = "c cs d ds e f fs g gs a as b".split(" ");
			for(var oct = -8; oct < 15; oct++) {
				for(var i in notes) {
					addKey(notes[i], oct);
				}
			}
			addKey("c", 15);
		}


		this.renderer = new CanvasRenderer().init(this);
		
		window.addEventListener("resize", function() {
			piano.renderer.resize();
		});


		window.AudioContext = window.AudioContext || window.webkitAudioContext || undefined;
		var audio_engine = AudioEngineWeb;
		this.audio = new audio_engine().init();
	};

	Piano.prototype.play = function(note, vol, participant, delay_ms, lyric) {
		if(!this.keys.hasOwnProperty(note) || !participant) return;
		var key = this.keys[note];
		if(key.loaded) this.audio.play(key.note, vol, delay_ms, participant.id);
		if(gMidiOutTest) gMidiOutTest(key.note, vol * 100, delay_ms);
		var self = this;
		setTimeout(function() {
			self.renderer.visualize(key, participant.color);
			if(lyric) {
                console.log(`${note} received with lyric ${lyric}`)
			}
			var jq_namediv = $(participant.nameDiv);
			jq_namediv.addClass("play");
			setTimeout(function() {
				jq_namediv.removeClass("play");
			}, 15);
		}, delay_ms || 0);
	};

	Piano.prototype.stop = function(note, participant, delay_ms) {
		if(!this.keys.hasOwnProperty(note)) return;
		var key = this.keys[note];
		if(key.loaded) this.audio.stop(key.note, delay_ms, participant.id);
		if(gMidiOutTest) gMidiOutTest(key.note, 0, delay_ms);
	};
	
	var gPiano = new Piano(document.getElementById("piano"));
	
	var gSoundSelector = new SoundSelector(gPiano);
	gSoundSelector.addPacks([
	/*	"/sounds/Emotional_2.0/",
		"/sounds/Harp/",
		"/sounds/Music_Box/",
		"/sounds/Vintage_Upright/",
		"/sounds/Steinway_Grand/",
		"/sounds/Emotional/",
		"/sounds/Untitled/"*/
		"https://aoz0ra.github.io/piano-sounds/Emotional/",
		"https://aoz0ra.github.io/piano-sounds/Emotional_2.0/",
		"https://aoz0ra.github.io/piano-sounds/GreatAndSoftPiano/",
		"https://aoz0ra.github.io/piano-sounds/HardAndToughPiano/",
		"https://aoz0ra.github.io/piano-sounds/HardPiano/",
		"https://aoz0ra.github.io/piano-sounds/Harp/",
		"https://aoz0ra.github.io/piano-sounds/Harpsicord/",
		"https://aoz0ra.github.io/piano-sounds/LoudAndProudPiano/",
		"https://aoz0ra.github.io/piano-sounds/MLG/",
		"https://aoz0ra.github.io/piano-sounds/Music_Box/",
		"https://aoz0ra.github.io/piano-sounds/NewPiano/",
		"https://aoz0ra.github.io/piano-sounds/Orchestra/",
		"https://aoz0ra.github.io/piano-sounds/Oxygen/",
		"https://aoz0ra.github.io/piano-sounds/Piano2/",
		"https://aoz0ra.github.io/piano-sounds/PianoSounds/",
		"https://aoz0ra.github.io/piano-sounds/Rhodes_MK1/",
		"https://aoz0ra.github.io/piano-sounds/SoftPiano/",
		"https://aoz0ra.github.io/piano-sounds/Steinway_Grand/",
		"https://aoz0ra.github.io/piano-sounds/Untitled/",
		"https://aoz0ra.github.io/piano-sounds/Vintage_Upright/",
		"https://aoz0ra.github.io/piano-sounds/Vintage_Upright_Soft/",
		"https://aoz0ra.github.io/sm64musicboxmpp/SM64MusicBox/",
		"https://hri7566.github.io/Dog/"
	]);
	gSoundSelector.init();







	var gAutoSustain = false;
	var gSustain = false;

	var gHeldNotes = {};
	var gSustainedNotes = {};
	
	var pressMultiplier = 1;
	var playingPrivately = false;

	var octavesBelow = 0;
	var octavesAbove = 0;

	function press(id, vol) {
		if(!gClient.preventsPlaying() && gNoteQuota.spend(1)) {
			for (i = 0; i < pressMultiplier; i++) {
		    	gHeldNotes[id] = true;
		    	gSustainedNotes[id] = true;
		    	gPiano.play(id, vol !== undefined ? vol : DEFAULT_VELOCITY, gClient.getOwnParticipant(), 0);
		    	if (playingPrivately == false) {
			        gClient.startNote(id, vol);
			    }
			}
			for (i = 1; i <= octavesBelow; i++) {
                var octaveBelowID;
                var octavelessNote;
                var noteOctave;
                if (id.includes(`s`)) {
                	noteOctave = parseInt(id.substr(2, id.length));
                	octavelessNote = id.substr(0, 2);
                }
                else {
                	noteOctave = parseInt(id.substr(1, id.length));
                	octavelessNote = id.substr(0, 1);
                }

                noteOctave -= i;

                octaveBelowID = `${octavelessNote}${noteOctave}`;

				//for (i = 0; i < pressMultiplier; i++) {
		    	    gHeldNotes[octaveBelowID] = true;
		    	    gSustainedNotes[octaveBelowID] = true;
		    	    gPiano.play(octaveBelowID, vol !== undefined ? vol : DEFAULT_VELOCITY, {"_id":"c3b37991df19a2fce284d583","name":"꧁ঔৣ༺Ṡʜäᴅøw-¢ʜäɴ⁘ṀṔⱣṠẹ¢üʀiṭẏ Ċʀẹäṭøʀ༻️ঔৣ꧂","color":"#000000","id":"cf2a3016de12d6d05ab802bf","x":50,"y":50,"displayX":50,"displayY":50,"nameDiv":{"participantId":"cf2a3016de12d6d05ab802bf"}}, 0);
		    	    if (playingPrivately == false) {
			            gClient.startNote(octaveBelowID, vol);
			        }
			    //}
			}
		}
	}

	function release(id) {
		if(gHeldNotes[id]) {
			gHeldNotes[id] = false;
			if((gAutoSustain || gSustain) && !enableSynth) {
				gSustainedNotes[id] = true;
			} else {
				if(gNoteQuota.spend(1)) {
					gPiano.stop(id, gClient.getOwnParticipant(), 0);
					gClient.stopNote(id);
					gSustainedNotes[id] = false;
				}
			}
		}
	}

	function pressSustain() {
		gSustain = true;
	}

	function releaseSustain() {
		gSustain = false;
		if(!gAutoSustain) {
			for(var id in gSustainedNotes) {
				if(gSustainedNotes.hasOwnProperty(id) && gSustainedNotes[id] && !gHeldNotes[id]) {
					gSustainedNotes[id] = false;
					if(gNoteQuota.spend(1)) {
						gPiano.stop(id, gClient.getOwnParticipant(), 0);
						gClient.stopNote(id);
					}
				}
			}
		}
	}









// internet science

////////////////////////////////////////////////////////////////

	var channel_id = decodeURIComponent(window.location.pathname);
	if(channel_id.substr(0, 1) == "/") channel_id = channel_id.substr(1);
	if(channel_id == "") channel_id = "lobby";

	var wssport = window.location.hostname == "www.multiplayerpiano.com" ? 443 : 8443;
	var gClient = new Client("wss://" + window.location.hostname + ":" + wssport);
	gClient.setChannel(channel_id);
	gClient.start();

	gClient.on("disconnect", function(evt) {
		console.log(evt);
	});

	// Setting status
	(function() {
		gClient.on("status", function(status) {
			$("#status").text(status);
		});
		gClient.on("count", function(count) {
			if(count > 0) {
				$("#status").html('<span class="number">'+count+'</span> '+(count==1? 'person is' : 'people are')+' playing');
				document.title = "Piano (" + count + ")";
			} else {
				document.title = "Piano (Offline)";
			}
		});
	})();

    setTimeout(botSettings.greetFriends = true, 20000)

	// Handle changes to participants
	(function() {
		gClient.on("participant added", function(part) {

			if (botSettings.greetFriends == true) {
				if (friends.includes(part._id)) {
				    sendChat(`Oh hey there, ${part.name}!`)
				}
			}

			part.displayX = 50;
			part.displayY = 50;

			// add nameDiv
			var div = document.createElement("div");
			div.className = "name";
			div.participantId = part.id;
			div.textContent = part.name || "";
			div.style.backgroundColor = part.color || "#777";
			if(gClient.participantId === part.id) {
				$(div).addClass("me");
			}
			if(gClient.channel && gClient.channel.crown && gClient.channel.crown.participantId === part.id) {
				$(div).addClass("owner");
			}
			if(gPianoMutes.indexOf(part._id) !== -1) {
				$(part.nameDiv).addClass("muted-notes");
			}
			if(gChatMutes.indexOf(part._id) !== -1) {
				$(part.nameDiv).addClass("muted-chat");
			}
// 			if(EXT.draw && EXT.draw.mutes.indexOf(part._id) !== -1){
			 //   $(part.nameDiv).addClass("muted-lines");
    // 		}
			div.style.display = "none";
			part.nameDiv = $("#names")[0].appendChild(div);
			$(part.nameDiv).fadeIn(500);

			// sort names
			var arr = $("#names .name");
			arr.sort(function(a, b) {
				a = a.style.backgroundColor; // todo: sort based on user id instead
				b = b.style.backgroundColor;
				if (a > b) return 1;
				else if (a < b) return -1;
				else return 0;
			});
			$("#names").html(arr);

			// add cursorDiv
			if(gClient.participantId !== part.id || gSeeOwnCursor) {
				var div = document.createElement("div");
				div.className = "cursor";
				div.style.display = "none";
				part.cursorDiv = $("#cursors")[0].appendChild(div);
				$(part.cursorDiv).fadeIn(500);

				var div = document.createElement("div");
				div.className = "name";
				div.style.backgroundColor = part.color || "#777"
				div.textContent = part.name || "";
				part.cursorDiv.appendChild(div);

			} else {
				part.cursorDiv = undefined;
			}
		});
		gClient.on("participant removed", function(part) {
			// remove nameDiv
			var nd = $(part.nameDiv);
			var cd = $(part.cursorDiv);
			cd.fadeOut(5000);
			nd.fadeOut(2000, function() {
				nd.remove();
				cd.remove();
				part.nameDiv = undefined;
				part.cursorDiv = undefined;
			});
		});
		gClient.on("participant update", function(part) {
			var name = part.name || "";
			var color = part.color || "#777";
			part.nameDiv.style.backgroundColor = color;
			part.nameDiv.textContent = name;
			$(part.cursorDiv)
			.find(".name")
			.text(name)
			.css("background-color", color);

			//$(part.nameDiv).fadeOut(10);
			//$(part.nameDiv).fadeIn(20);
		});
		gClient.on("ch", function(msg) {
			for(var id in gClient.ppl) {
				if(gClient.ppl.hasOwnProperty(id)) {
					var part = gClient.ppl[id];
					if(part.id === gClient.participantId) {
						$(part.nameDiv).addClass("me");
					} else {
						$(part.nameDiv).removeClass("me");
					}
					if(msg.ch.crown && msg.ch.crown.participantId === part.id) {
						$(part.nameDiv).addClass("owner");
						$(part.cursorDiv).addClass("owner");
					} else {
						$(part.nameDiv).removeClass("owner");
						$(part.cursorDiv).removeClass("owner");
					}
					if(gPianoMutes.indexOf(part._id) !== -1) {
						$(part.nameDiv).addClass("muted-notes");
					} else {
						$(part.nameDiv).removeClass("muted-notes");
					}
				// 	if(EXT.draw && EXT.draw.mutes.indexOf(part._id) !== -1){
    //                     $(part.nameDiv).addClass("muted-lines");
    //                         } else {
				// 		$(part.nameDiv).removeClass("muted-lines");
				// 	}
					if(gChatMutes.indexOf(part._id) !== -1) {
						$(part.nameDiv).addClass("muted-chat");
					} else {
						$(part.nameDiv).removeClass("muted-chat");
					}
				}
			}
		});
		function updateCursor(msg) {
			const part = gClient.ppl[msg.id];
			if (part && part.cursorDiv) {
				part.cursorDiv.style.left = msg.x + "%";
				part.cursorDiv.style.top = msg.y + "%";
			}
		}
		gClient.on("m", updateCursor);
		gClient.on("participant added", updateCursor);
	})();


	// Handle changes to crown
	(function() {
		var jqcrown = $('<div id="crown"></div>').appendTo(document.body).hide();
		var jqcountdown = $('<span></span>').appendTo(jqcrown);
		var countdown_interval;
		jqcrown.click(function() {
			gClient.sendArray([{m: "chown", id: gClient.participantId}]);
		});
		gClient.on("ch", function(msg) {
			if(msg.ch.crown) {
				var crown = msg.ch.crown;
				if(!crown.participantId || !gClient.ppl[crown.participantId]) {
					var land_time = crown.time + 2000 - gClient.serverTimeOffset;
					var avail_time = crown.time + 15000 - gClient.serverTimeOffset;
					jqcountdown.text("");
					jqcrown.show();
					if(land_time - Date.now() <= 0) {
						jqcrown.css({"left": crown.endPos.x + "%", "top": crown.endPos.y + "%"});
					} else {
						jqcrown.css({"left": crown.startPos.x + "%", "top": crown.startPos.y + "%"});
						jqcrown.addClass("spin");
						jqcrown.animate({"left": crown.endPos.x + "%", "top": crown.endPos.y + "%"}, 2000, "linear", function() {
							jqcrown.removeClass("spin");
						});
					}
					clearInterval(countdown_interval);
					countdown_interval = setInterval(function() {
						var time = Date.now();
						if(time >= land_time) {
							var ms = avail_time - time;
							if(ms > 0) {
								jqcountdown.text(Math.ceil(ms / 1000) + "s");
							} else {
								jqcountdown.text("");
								clearInterval(countdown_interval);
							}
						}
					}, 1000);
				} else {
					jqcrown.hide();
				}
			} else {
				jqcrown.hide();
			}
		});
		gClient.on("disconnect", function() {
			jqcrown.fadeOut(2000);
		});
	})();

	
	// Playing notes
	gClient.on("n", function(msg) {
		var t = msg.t - gClient.serverTimeOffset + TIMING_TARGET - Date.now();
		var participant = gClient.findParticipantById(msg.p);
		if(gPianoMutes.indexOf(participant._id) !== -1)
			return;
		for(var i = 0; i < msg.n.length; i++) {
			var note = msg.n[i];
			var ms = t + (note.d || 0);
			if(ms < 0) {
				ms = 0;
			}
			else if(ms > 10000) continue;
			if(note.s) {
				gPiano.stop(note.n, participant, ms);
			} else {
				var vel = (typeof note.v !== "undefined")? parseFloat(note.v) : DEFAULT_VELOCITY;
				if(!vel) vel = 0;
				else if(vel < 0) vel = 0;
				else if (vel > 1) vel = 1;
				gPiano.play(note.n, vel, participant, ms);
				if(enableSynth) {
					gPiano.stop(note.n, participant, ms + 1000);
				}
			}
		}
	});

	// Send cursor updates
	var mx = 0, last_mx = -10, my = 0, last_my = -10;
	setInterval(function() {
		if(Math.abs(mx - last_mx) > 0.1 || Math.abs(my - last_my) > 0.1) {
			last_mx = mx;
			last_my = my;
			gClient.sendArray([{m: "m", x: mx, y: my}]);
			if(gSeeOwnCursor) {
				gClient.emit("m", { m: "m", id: gClient.participantId, x: mx, y: my });
			}
			var part = gClient.getOwnParticipant();
			if(part) {
				part.x = mx;
				part.y = my;
			}
		}
	}, 15);
	$(document).mousemove(function(event) {
		mx = ((event.pageX / $(window).width()) * 100).toFixed(2);
		my = ((event.pageY / $(window).height()) * 100).toFixed(2);
	});


// $("#room-settings").append(`<input type="color" name="color2"></input>`)

	// Room settings button
	(function() {
		gClient.on("ch", function(msg) {
			if(gClient.isOwner()) {
				$("#room-settings-btn").show();
			} else {
				$("#room-settings-btn").hide();
			}
		});
		$("#room-settings-btn").click(function(evt) {
			if(gClient.channel && gClient.isOwner()) {
				var settings = gClient.channel.settings;
				openModal("#room-settings");
				setTimeout(function() {
					$("#room-settings .checkbox[name=visible]").prop("checked", settings.visible);
					$("#room-settings .checkbox[name=chat]").prop("checked", settings.chat);
					$("#room-settings .checkbox[name=crownsolo]").prop("checked", settings.crownsolo);
					$("#room-settings input[name=color]").val(settings.color);
					$("#room-settings input[name=color2]").val(settings.color2);
				}, 100);
			}
		});
		$("#room-settings .submit").click(function() {
			var settings = {
				visible: $("#room-settings .checkbox[name=visible]").is(":checked"),
				chat: $("#room-settings .checkbox[name=chat]").is(":checked"),
				crownsolo: $("#room-settings .checkbox[name=crownsolo]").is(":checked"),
				color: $("#room-settings input[name=color]").val(),
				color2: $("#room-settings input[name=color2]").val(),
			};
			gClient.setChannelSettings(settings);
			closeModal();
		});
		$("#room-settings .drop-crown").click(function() {
			closeModal();
			if(confirm("This will drop the crown...!"))
				gClient.sendArray([{m: "chown"}]);
		});
	})();

	// Handle notifications
	gClient.on("notification", function(msg) {
		new Notification(msg);
	});

	// Don't foget spin
	gClient.on("ch", function(msg) {
		var chidlo = msg.ch._id.toLowerCase();
		if(chidlo === "spin" || chidlo.substr(-5) === "/spin") {
			$("#piano").addClass("spin");
		} else {
			$("#piano").removeClass("spin");
		}
	});

	/*function eb() {
		if(gClient.channel && gClient.channel._id.toLowerCase() === "test/fishing") {
			ebsprite.start(gClient);
		} else {
			ebsprite.stop();
		}
	}
	if(ebsprite) {
		gClient.on("ch", eb);
		eb();
	}*/

	// Crownsolo notice
	gClient.on("ch", function(msg) {
		let notice = "";
		let has_notice = false;
		if(msg.ch.settings.crownsolo) {
			has_notice = true;
			notice += '<p>This room is set to "only the owner can play."</p>';
		}
		if(msg.ch.settings['no cussing']){
			has_notice = true;
			notice += '<p>This room is set to "no cussing."</p>';
		}
		let notice_div = $("#room-notice");
		if(has_notice) {
			notice_div.html(notice);
			if(notice_div.is(':hidden')) notice_div.fadeIn(400);
		} else {
			if(notice_div.is(':visible')) notice_div.fadeOut(6000);
		}
	});
	gClient.on("disconnect", function() {
		$("#room-notice").fadeOut(1000);
	});


	// Background color
	(function() {
		var old_color1 = new Color("#000000");
		var old_color2 = new Color("#000000");
		function setColor(hex, hex2) {
			var color1 = new Color(hex);
			var color2 = new Color(hex2 || hex);
			if(!hex2)
				color2.add(-0x40, -0x40, -0x40);

			var bottom = document.getElementById("bottom");
			
			var duration = 500;
			var step = 0;
			var steps = 5;
			var step_ms = duration / steps;
			var difference = new Color(color1.r, color1.g, color1.b);
			difference.r -= old_color1.r;
			difference.g -= old_color1.g;
			difference.b -= old_color1.b;
			var inc1 = new Color(difference.r / steps, difference.g / steps, difference.b / steps);
			difference = new Color(color2.r, color2.g, color2.b);
			difference.r -= old_color2.r;
			difference.g -= old_color2.g;
			difference.b -= old_color2.b;
			var inc2 = new Color(difference.r / steps, difference.g / steps, difference.b / steps);
			var iv;
			iv = setInterval(function() {
				old_color1.add(inc1.r, inc1.g, inc1.b);
				old_color2.add(inc2.r, inc2.g, inc2.b);
				document.body.style.background = "radial-gradient(ellipse at center, "+old_color1.toHexa()+" 0%,"+old_color2.toHexa()+" 100%)";
				bottom.style.background = old_color2.toHexa();
				if(++step >= steps) {
					clearInterval(iv);
					old_color1 = color1;
					old_color2 = color2;
					document.body.style.background = "radial-gradient(ellipse at center, "+color1.toHexa()+" 0%,"+color2.toHexa()+" 100%)";
					bottom.style.background = color2.toHexa();
				}
			}, step_ms);
		}

		function setColorToDefault() {
			setColor("#000000", "#000000");
		}

		setColorToDefault();

		gClient.on("ch", function(ch) {
			if(ch.ch.settings) {
				if(ch.ch.settings.color) {
					setColor(ch.ch.settings.color, ch.ch.settings.color2);
				} else {
					setColorToDefault();
				}
			}
		});
	})();





	var gPianoMutes = (localStorage?.pianoMutes || "").split(',').filter(v => v);
	var gChatMutes = (localStorage?.chatMutes || "").split(',').filter(v => v);


 	









	

	
	



	var volume_slider = document.getElementById("volume-slider");
	volume_slider.value = gPiano.audio.volume;
	$("#volume-label").text("Volume: " + Math.floor(gPiano.audio.volume * 100) + "%");
	volume_slider.addEventListener("input", function(evt) {
		var v = +volume_slider.value;
		gPiano.audio.setVolume(v);
		if (window.localStorage) localStorage.volume = v;
		$("#volume-label").text("Volume: " + Math.floor(v * 100) + "%");
	});




	var Note = function(note, octave) {
		this.note = note;
		this.octave = octave || 0;
	};



	var n = function(a, b) { return {note: new Note(a, b), held: false}; };
	var key_binding = {
		65: n("gs"),
		90: n("a"),
		83: n("as"),
		88: n("b"),
		67: n("c", 1),
		70: n("cs", 1),
		86: n("d", 1),
		71: n("ds", 1),
		66: n("e", 1),
		78: n("f", 1),
		74: n("fs", 1),
		77: n("g", 1),
		75: n("gs", 1),
		188: n("a", 1),
		76: n("as", 1),
		190: n("b", 1),
		191: n("c", 2),
		222: n("cs", 2),

		49: n("gs", 1),
		81: n("a", 1),
		50: n("as", 1),
		87: n("b", 1),
		69: n("c", 2),
		52: n("cs", 2),
		82: n("d", 2),
		53: n("ds", 2),
		84: n("e", 2),
		89: n("f", 2),
		55: n("fs", 2),
		85: n("g", 2),
		56: n("gs", 2),
		73: n("a", 2),
		57: n("as", 2),
		79: n("b", 2),
		80: n("c", 3),
		189: n("cs", 3),
		173: n("cs", 3), // firefox why
		219: n("d", 3),
		187: n("ds", 3),
		61: n("ds", 3), // firefox why
		221: n("e", 3)
	};

	var capsLockKey = false;

	var transpose_octave = 0;
	
	function handleKeyDown(evt) {
		//console.log(evt);
		var code = parseInt(evt.keyCode);
		console.log(`press keycode ${code}`)
		if(key_binding[code] !== undefined) {
			var binding = key_binding[code];
			if(!binding.held) {
				binding.held = true;

				var note = binding.note;
				var octave = 1 + note.octave + transpose_octave;
				if(evt.shiftKey) ++octave;
				else if(capsLockKey || evt.ctrlKey) --octave;
				note = note.note + octave;
				var vol = velocityFromMouseY();
				press(note, vol);
			}

			if(++gKeyboardSeq == 3) {
				gKnowsYouCanUseKeyboard = true;
				if(window.gKnowsYouCanUseKeyboardTimeout) clearTimeout(gKnowsYouCanUseKeyboardTimeout);
				if(localStorage) localStorage.knowsYouCanUseKeyboard = true;
				if(window.gKnowsYouCanUseKeyboardNotification) gKnowsYouCanUseKeyboardNotification.close();
			}

			evt.preventDefault();
			evt.stopPropagation();
			return false;
		} else if(code == 20) { // Caps Lock
			capsLockKey = true;
			evt.preventDefault();
		} else if(code === 0x20) { // Space Bar
			pressSustain();
			evt.preventDefault();
		} else if((code === 38) && transpose_octave < 11) {
			++transpose_octave;
			new Notification({title: "OCTAVE", text: `Octave: ${transpose_octave}`})
		} else if((code === 40) && transpose_octave > -10) {
			--transpose_octave;
			new Notification({title: "OCTAVE", text: `Octave: ${transpose_octave}`})
		} else if(code === 37) {
			++octavesBelow;
			new Notification({title: "MULTI-OCTAVE", text: `Octaves below: ${octavesBelow}`})
		} else if(code === 39) {
			--octavesBelow;
			new Notification({title: "MULTI-OCTAVE", text: `Octaves below: ${octavesBelow}`})
		} else if(code === 192) {
			playingPrivately = !playingPrivately;
			new Notification({title: "", text: playingPrivately == true? `now playing privately` : `no longer playing privately`})
		} else if(code == 9) { // Tab (don't tab away from the piano)
			evt.preventDefault();
		} else if(code == 8) { // Backspace (don't navigate Back)
			gAutoSustain = !gAutoSustain;
			evt.preventDefault();
		}
	};

	function handleKeyUp(evt) {
		var code = parseInt(evt.keyCode);
		if(key_binding[code] !== undefined) {
			var binding = key_binding[code];
			if(binding.held) {
				binding.held = false;
				
				var note = binding.note;
				var octave = 1 + note.octave + transpose_octave;
				if(evt.shiftKey) ++octave;
				else if(capsLockKey || evt.ctrlKey) --octave;
				note = note.note + octave;
				release(note);
			}

			evt.preventDefault();
			evt.stopPropagation();
			return false;
		} else if(code == 20) { // Caps Lock
			capsLockKey = false;
			evt.preventDefault();
		} else if(code === 0x20) { // Space Bar
			releaseSustain();
			evt.preventDefault();
		}
	};

	function handleKeyPress(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		if(evt.keyCode == 27 || evt.keyCode == 13) {
			//$("#chat input").focus();
		}
		return false;
	};

	var recapListener = function(evt) {
		captureKeyboard();
	};

	function captureKeyboard() {
		$("#piano").off("mousedown", recapListener);
		$("#piano").off("touchstart", recapListener);
		$(document).on("keydown", handleKeyDown );
		$(document).on("keyup", handleKeyUp);
		$(window).on("keypress", handleKeyPress );
	};

	function releaseKeyboard() {
		$(document).off("keydown", handleKeyDown );
		$(document).off("keyup", handleKeyUp);
		$(window).off("keypress", handleKeyPress );
		$("#piano").on("mousedown", recapListener);
		$("#piano").on("touchstart", recapListener);
	};

	captureKeyboard();


	var velocityFromMouseY = function() {
		return 0.0 + (my / 100) * 5;
	};





	// NoteQuota
	var gNoteQuota = (function() {
		var last_rat = 0;
		var nqjq = $("#quota .value");
		setInterval(function() {
			gNoteQuota.tick();
		}, 2000);
		return new NoteQuota(function(points) {
			// update UI
			var rat = (points / this.max) * 100;
			if(rat <= last_rat)
				nqjq.stop(true, true).css("width", rat.toFixed(0) + "%");
			else
				nqjq.stop(true, true).animate({"width": rat.toFixed(0) + "%"}, 2000, "linear");
			last_rat = rat;
		});
	})();
	gClient.on("nq", function(nq_params) {
		gNoteQuota.setParams(nq_params);
	});
	gClient.on("disconnect", function() {
		gNoteQuota.setParams(NoteQuota.PARAMS_OFFLINE);
	});



	// click participant names
	(function() {
		var ele = document.getElementById("names");
		var touchhandler = function(e) {
			var target_jq = $(e.target);
			if(target_jq.hasClass("name")) {
				target_jq.addClass("play");
				if(e.target.participantId == gClient.participantId) {
					openModal("#rename", "input[name=name]");
					setTimeout(function() {
						$("#rename input[name=name]").val(gClient.ppl[gClient.participantId].name);
						$("#rename input[name=color]").val(gClient.ppl[gClient.participantId].color);
					}, 100);
				} else if(e.target.participantId) {
					var id = e.target.participantId;
					var part = gClient.ppl[id] || null;
					if(part) {
						participantMenu(part);
						e.stopPropagation();
					}
				}
			}
		};
		ele.addEventListener("mousedown", touchhandler);
		ele.addEventListener("touchstart", touchhandler);
		var releasehandler = function(e) {
			$("#names .name").removeClass("play");
		};
		document.body.addEventListener("mouseup", releasehandler);
		document.body.addEventListener("touchend", releasehandler);

		var removeParticipantMenus = function() {
			$(".participant-menu").remove();
			$(".participantSpotlight").hide();
			document.removeEventListener("mousedown", removeParticipantMenus);
			document.removeEventListener("touchstart", removeParticipantMenus);
		};

		var participantMenu = function(part) {
			if(!part) return;
			removeParticipantMenus();
			document.addEventListener("mousedown", removeParticipantMenus);
			document.addEventListener("touchstart", removeParticipantMenus);
			$("#" + part.id).find(".enemySpotlight").show();
			var menu = $('<div class="participant-menu"></div>');
			$("body").append(menu);
			// move menu to name position
			var jq_nd = $(part.nameDiv);
			var pos = jq_nd.position();
			menu.css({
				"top": pos.top + jq_nd.height() + 15,
				"left": pos.left + 6,
				"background": part.color || "black"
			});
			menu.on("mousedown touchstart", function(evt) {
				evt.stopPropagation();
				var target = $(evt.target);
				if(target.hasClass("menu-item")) {
					target.addClass("clicked");
					menu.fadeOut(200, function() {
						removeParticipantMenus();
					});
				}
			});
			// this spaces stuff out but also can be used for informational
			$('<div class="info"></div>').appendTo(menu).text(part._id);
// 			$('<div class="info"></div>').appendTo(menu).text(`${part.color} | ${part.color.getName()}`);
			// add menu items
			if(gPianoMutes.indexOf(part._id) == -1) {
				$('<div class="menu-item">Mute Notes</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					gPianoMutes.push(part._id);
					if(localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
					$(part.nameDiv).addClass("muted-notes");
				});
			} else {
				$('<div class="menu-item">Unmute Notes</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					var i;
					while((i = gPianoMutes.indexOf(part._id)) != -1)
						gPianoMutes.splice(i, 1);
					if(localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
					$(part.nameDiv).removeClass("muted-notes");
				});
			}
// 			if(EXT.draw){
// 				if(EXT.draw.mutes.indexOf(part._id) == -1) {
// 					$('<div class="menu-item">Mute Lines</div>').appendTo(menu)
// 					.on("mousedown touchstart", function(evt) {
// 						EXT.draw.mutes.push(part._id);
// 						$(part.nameDiv).addClass("muted-lines");
// 					});
// 				} else {
// 					$('<div class="menu-item">Unmute Lines</div>').appendTo(menu)
// 					.on("mousedown touchstart", function(evt) {
// 						var i;
// 						while((i = EXT.draw.mutes.indexOf(part._id)) != -1)
// 							EXT.draw.mutes.splice(i, 1);
// 						$(part.nameDiv).removeClass("muted-lines");
// 					});
// 				}
// 			}
			if(gChatMutes.indexOf(part._id) == -1) {
				$('<div class="menu-item">Mute Chat</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					gChatMutes.push(part._id);
					if(localStorage) localStorage.chatMutes = gChatMutes.join(',');
					$(part.nameDiv).addClass("muted-chat");
				});
			} else {
				$('<div class="menu-item">Unmute Chat</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					var i;
					while((i = gChatMutes.indexOf(part._id)) != -1)
						gChatMutes.splice(i, 1);
					if(localStorage) localStorage.chatMutes = gChatMutes.join(',');
					$(part.nameDiv).removeClass("muted-chat");
				});
			}
			if(!(gPianoMutes.indexOf(part._id) >= 0) || !(gChatMutes.indexOf(part._id) >= 0)) {
				$('<div class="menu-item">Mute Completely</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					gPianoMutes.push(part._id);
					if(localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
					gChatMutes.push(part._id);
					if(localStorage) localStorage.chatMutes = gChatMutes.join(',');
				// 	if(EXT.draw){
				// 		EXT.draw.mutes.push(part._id);
				// 		$(part.nameDiv).addClass("muted-lines");
				// 	}
					$(part.nameDiv).addClass("muted-notes");
					$(part.nameDiv).addClass("muted-chat");
				});
			}
			if((gPianoMutes.indexOf(part._id) >= 0) || (gChatMutes.indexOf(part._id) >= 0)) {
				$('<div class="menu-item">Unmute Completely</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					var i;
					while((i = gPianoMutes.indexOf(part._id)) != -1)
						gPianoMutes.splice(i, 1);
					while((i = gChatMutes.indexOf(part._id)) != -1)
						gChatMutes.splice(i, 1);
					if(localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
					if(localStorage) localStorage.chatMutes = gChatMutes.join(',');
					$(part.nameDiv).removeClass("muted-notes");
					$(part.nameDiv).removeClass("muted-chat");
				});
			}
			if(gClient.isOwner()) {
				$('<div class="menu-item give-crown">Give Crown</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					if(confirm("Give room ownership to "+part.name+"?"))
						gClient.sendArray([{m: "chown", id: part.id}]);
				});
				$('<div class="menu-item kickban">Kickban</div>').appendTo(menu)
				.on("mousedown touchstart", function(evt) {
					var minutes = prompt("How many minutes? (0-60)", "30");
					if(minutes === null) return;
					minutes = parseFloat(minutes) || 0;
					var ms = minutes * 60 * 1000;
					gClient.sendArray([{m: "kickban", _id: part._id, ms: ms}]);
				});
			}
			menu.fadeIn(150);
		};
	})();
	















// Notification class

////////////////////////////////////////////////////////////////

	var Notification = function(par) {
		if(this instanceof Notification === false) throw("yeet");
		EventEmitter.call(this);

		var par = par || {};

		this.id = "Notification-" + (par.id || Math.random());
		this.title = par.title || "";
		this.text = par.text || "";
		this.html = par.html || "";
		this.target = $(par.target || "#piano");
		this.duration = par.duration || 30000;
		this["class"] = par["class"] || "classic";
		
		var self = this;
		var eles = $("#" + this.id);
		if(eles.length > 0) {
			eles.remove();
		}
		this.domElement = $('<div class="notification"><div class="notification-body"><div class="title"></div>' +
			'<div class="text"></div></div><div class="x">Ⓧ</div></div>');
		this.domElement[0].id = this.id;
		this.domElement.addClass(this["class"]);
		this.domElement.find(".title").text(this.title);
		if(this.text.length > 0) {
			this.domElement.find(".text").text(this.text);
		} else if(this.html instanceof HTMLElement) {
			this.domElement.find(".text")[0].appendChild(this.html);
		} else if(this.html.length > 0) {
			this.domElement.find(".text").html(this.html);
		}
		document.body.appendChild(this.domElement.get(0));
		
		this.position();
		this.onresize = function() {
			self.position();
		};
		window.addEventListener("resize", this.onresize);

		this.domElement.find(".x").click(function() {
			self.close();
		});

		if(this.duration > 0) {
			setTimeout(function() {
				self.close();
			}, this.duration);
		}

		return this;
	}

	mixin(Notification.prototype, EventEmitter.prototype);
	Notification.prototype.constructor = Notification;

	Notification.prototype.position = function() {
		var pos = this.target.offset();
		var x = pos.left - (this.domElement.width() / 2) + (this.target.width() / 4);
		var y = pos.top - this.domElement.height() - 8;
		var width = this.domElement.width();
		if(x + width > $("body").width()) {
			x -= ((x + width) - $("body").width());
		}
		if(x < 0) x = 0;
		this.domElement.offset({left: x, top: y});
	};

	Notification.prototype.close = function() {
		var self = this;
		window.removeEventListener("resize",  this.onresize);
		this.domElement.fadeOut(500, function() {
			self.domElement.remove();
			self.emit("close");
		});
	};















// set variables from settings or set settings

////////////////////////////////////////////////////////////////

	var gKeyboardSeq = 0;
	var gKnowsYouCanUseKeyboard = false;
	if(localStorage && localStorage.knowsYouCanUseKeyboard) gKnowsYouCanUseKeyboard = true;
	if(!gKnowsYouCanUseKeyboard) {
		window.gKnowsYouCanUseKeyboardTimeout = setTimeout(function() {
			window.gKnowsYouCanUseKeyboardNotification = new Notification({title: "Did you know!?!",
				text: "You can play the piano with your keyboard, too.  Try it!", target: "#piano", duration: 10000});
		}, 30000);
	}




	if(window.localStorage) {

		if(localStorage.volume) {
			volume_slider.value = localStorage.volume;
			gPiano.audio.setVolume(localStorage.volume);
			$("#volume-label").text("Volume: " + Math.floor(gPiano.audio.volume * 100) + "%");
		}
		else localStorage.volume = gPiano.audio.volume;

		window.gHasBeenHereBefore = (localStorage.gHasBeenHereBefore || false);
		if(gHasBeenHereBefore) {
		}
		localStorage.gHasBeenHereBefore = true;
		
	}
	
	
	
	
	// warn user about loud noises before starting sound (no autoplay)
	openModal("#sound-warning");
	var user_interact = function(evt) {
		document.removeEventListener("click", user_interact);
		closeModal();
		MPP.piano.audio.resume();
	}
	document.addEventListener("click", user_interact);













// New room, change room

////////////////////////////////////////////////////////////////

	$("#room > .info").text("--");
	gClient.on("ch", function(msg) {
		var channel = msg.ch;
		var info = $("#room > .info");
		info.text(channel._id);
		if(channel.settings.lobby) info.addClass("lobby");
		else info.removeClass("lobby");
		if(!channel.settings.chat) info.addClass("no-chat");
		else info.removeClass("no-chat");
		if(channel.settings.crownsolo) info.addClass("crownsolo");
		else info.removeClass("crownsolo");
		if(channel.settings['no cussing']) info.addClass("no-cussing");
		else info.removeClass("no-cussing");
		if(!channel.settings.visible) info.addClass("not-visible");
		else info.removeClass("not-visible");
	});
	gClient.on("ls", function(ls) {
		for(var i in ls.u) {
			if(!ls.u.hasOwnProperty(i)) continue;
			var room = ls.u[i];
			var info = $("#room .info[roomname=\"" + (room._id + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0') + "\"]");
			if(info.length == 0) {
				info = $("<div class=\"info\"></div>");
				info.attr("roomname", room._id);
				$("#room .more").append(info);
			}
			info.text(room._id + " (" + room.count + ")");
			if(room.settings.lobby) info.addClass("lobby");
			else info.removeClass("lobby");
			if(!room.settings.chat) info.addClass("no-chat");
			else info.removeClass("no-chat");
			if(room.settings.crownsolo) info.addClass("crownsolo");
			else info.removeClass("crownsolo");
			if(room.settings['no cussing']) info.addClass("no-cussing");
			else info.removeClass("no-cussing");
			if(!room.settings.visible) info.addClass("not-visible");
			else info.removeClass("not-visible");
			if(room.banned) info.addClass("banned");
			else info.removeClass("banned");
		}
	});
	$("#room").on("click", function(evt) {
		evt.stopPropagation();

		// clicks on a new room
		if($(evt.target).hasClass("info") && $(evt.target).parents(".more").length) {
			$("#room .more").fadeOut(500);
			var selected_name = $(evt.target).attr("roomname");
			if(typeof selected_name != "undefined") {
				changeRoom(selected_name, "right");
			}
			return false;
		}
		// clicks on "New Room..."
		else if($(evt.target).hasClass("new")) {
			openModal("#new-room", "input[name=name]");
		}
		// all other clicks
		var doc_click = function(evt) {
			if($(evt.target).is("#room .more")) return;
			$(document).off("mousedown", doc_click);
			$("#room .more").fadeOut(500);
			gClient.sendArray([{m: "-ls"}]);
		}
		$(document).on("mousedown", doc_click);
		$("#room .more .info").remove();
		$("#room .more").show();
		gClient.sendArray([{m: "+ls"}]);
	});
	$("#new-room-btn").on("click", function(evt) {
		evt.stopPropagation();
		openModal("#new-room", "input[name=name]");
	});


	$("#play-alone-btn").on("click", function(evt) {
		evt.stopPropagation();
		var room_name = "Room" + Math.floor(Math.random() * 1000000000000);
		changeRoom(room_name, "right", {"visible": false});
		setTimeout(function() {
			new Notification({id: "share", title: "Playing alone", html: 'You are playing alone in a room by yourself, but you can always invite \
				friends by sending them the link.<br/><br/>\
				<a href="#" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=\'+encodeURIComponent(location.href),\'facebook-share-dialog\',\'width=626,height=436\');return false;">Share on Facebook</a><br/><br/>\
				<a href="http://twitter.com/home?status='+encodeURIComponent(location.href)+'" target="_blank">Tweet</a>', duration: 25000});
		}, 1000);
	});

	

	var gModal;

	function modalHandleEsc(evt) {
		if(evt.keyCode == 27) {
			closeModal();
			evt.preventDefault();
			evt.stopPropagation();
		}
	};
	
	function openModal(selector, focus) {
		if(chat) chat.blur();
		releaseKeyboard();
		$(document).on("keydown", modalHandleEsc);
		$("#modal #modals > *").hide();
		$("#modal").fadeIn(250);
		$(selector).show();
		setTimeout(function() {
			$(selector).find(focus).focus();
		}, 100);
		gModal = selector;
	};

	function closeModal() {
		$(document).off("keydown", modalHandleEsc);
		$("#modal").fadeOut(300);
		$("#modal #modals > *").hide();
		captureKeyboard();
		gModal = null;
	};

	var modal_bg = $("#modal .bg")[0];
	$(modal_bg).on("click", function(evt) {
		if(evt.target != modal_bg) return;
		closeModal();
	});

	(function() {
		function submit() {
			var name = $("#new-room .text[name=name]").val();
			var settings = {
				visible: $("#new-room .checkbox[name=visible]").is(":checked"),
				chat: true
			};
			$("#new-room .text[name=name]").val("");
			closeModal();
			changeRoom(name, "right", settings);
			setTimeout(function() {
			new Notification({id: "share", title: "Created a Room", html: 'You can invite friends to your room by sending them the link.<br/><br/>\
				<a href="#" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=\'+encodeURIComponent(location.href),\'facebook-share-dialog\',\'width=626,height=436\');return false;">Share on Facebook</a><br/><br/>\
				<a href="http://twitter.com/home?status='+encodeURIComponent(location.href)+'" target="_blank">Tweet</a>', duration: 25000});
		}, 1000);
		};
		$("#new-room .submit").click(function(evt) {
			submit();
		});
		$("#new-room .text[name=name]").keypress(function(evt) {
			if(evt.keyCode == 13) {
				submit();
			} else if(evt.keyCode == 27) {
				closeModal();
			} else {
				return;
			}
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	})();



	




	function changeRoom(name, direction, settings, push) {
		if(!settings) settings = {};
		if(!direction) direction = "right";
		if(typeof push == "undefined") push = true;
		var opposite = direction == "left" ? "right" : "left";

		if(name == "") name = "lobby";
		if(gClient.channel && gClient.channel._id === name) return;
		if(push) {
			var url = "/" + encodeURIComponent(name).replace("'", "%27");
			if(window.history && history.pushState) {
				history.pushState({"depth": gHistoryDepth += 1, "name": name}, "Piano > " + name, url);
			} else {
				window.location = url;
				return;
			}
		}
		
		gClient.setChannel(name, settings);

		var t = 0, d = 100;
		$("#piano").addClass("ease-out").addClass("slide-" + opposite);
		setTimeout(function() {
			$("#piano").removeClass("ease-out").removeClass("slide-" + opposite).addClass("slide-" + direction);
		}, t += d);
		setTimeout(function() {
			$("#piano").addClass("ease-in").removeClass("slide-" + direction);
		}, t += d);
		setTimeout(function() {
			$("#piano").removeClass("ease-in");
		}, t += d);
	};

	var gHistoryDepth = 0;
	$(window).on("popstate", function(evt) {
		var depth = evt.state ? evt.state.depth : 0;
		if(depth == gHistoryDepth) return; // <-- forgot why I did that though...
		
		var direction = depth <= gHistoryDepth ? "left" : "right";
		gHistoryDepth = depth;

		var name = decodeURIComponent(window.location.pathname);
		if(name.substr(0, 1) == "/") name = name.substr(1);
		changeRoom(name, direction, null, false);
	});




















// Rename

////////////////////////////////////////////////////////////////

(function() {
		function submit() {
			var set = {
				name: $("#rename input[name=name]").val(),
				color: $("#rename input[name=color]").val()
			};
			//$("#rename .text[name=name]").val("");
			closeModal();
			gClient.sendArray([{m: "userset", set: set}]);
		};
		$("#rename .submit").click(function(evt) {
			submit();
		});
		$("#rename .text[name=name]").keypress(function(evt) {
			if(evt.keyCode == 13) {
				submit();
			} else if(evt.keyCode == 27) {
				closeModal();
			} else {
				return;
			}
			evt.preventDefault();
			evt.stopPropagation();
			return false;
		});
	})();

// document.getElementById(`rename`)
$(`#rename`).append(`<input type="color" name="color"></input>`)







function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}


// `linked html`
// `html`
// `plain` - the default
// `pre`
// `linked text`
var chatMode = `linked text`

var nebulaStyle = false;

var narrowIDs = true;

function time12HR() {
    var now = new Date();
    var hh = now.getHours();
    var min = now.getMinutes();
    var sec = now.getSeconds();

    var ampm = (hh >= 12) ? 'PM' : 'AM';
    hh = hh % 12;
    hh = hh? hh : 12;
    hh = hh < 10? '0' + hh : hh;
    min = min < 10? '0' + min : min;
    sec = sec < 10? '0' + sec : sec;
 
    return hh + ":" + min + ":" + sec + " " + ampm;
 
} // thanks, Nebula!

function time24HR() {
    var now = new Date();
    var hh = now.getHours();
    var min = now.getMinutes();
    var sec = now.getSeconds();
    
    hh = hh < 10? '0' + hh : hh;
    min = min < 10? '0' + min : min;
    sec = sec < 10? '0' + sec : sec;
    
    return hh + ":" + min + ":" + sec;
 
}



// chatctor

////////////////////////////////////////////////////////////////

	var chat = (function() {
		gClient.on("ch", function(msg) {
			if(msg.ch.settings.chat) {
				chat.show();
			} else {
				chat.hide();
			}
		});
		gClient.on("disconnect", function(msg) {

		});
		gClient.on("c", function(msg) {
			chat.clear();
			if(msg.c) {
				for(var i = 0; i < msg.c.length; i++) {
					chat.receive(msg.c[i]);
				}
			}
		});
		gClient.on("a", function(msg) {
			chat.receive(msg);
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			try {

				var testCommand = findReplaceFirst(botSettings.newPrefix, '', msg.a.split(` `)[0].toLowerCase());

				
			
				var args = msg.a.split(" "); // Arguments, excluding the /command
				var args2 = msg.a.split(" "); // Arguments, including the /command
				var name = msg.p.name; // Who executed this command?
				var cmd = findReplaceFirst(botSettings.prefix, '', args[0].toLowerCase());
			
				var text2 = args2.join(` `);
			
				args.shift(); // args, say bye to the /command
				
				var text = args.join(` `);

				var commandsObject = {
		'help': {
			exec: `newHelp("${text}")`,
			alts: [`helpme`, `cmds`, `?`],
			rank: -3,
			tags: [`allusers`, `general`],
			info: `Lists commands, optionally with a certain tag`,
			reqs: []
		},
		'tags': {
			exec: `sendChat(collectAllTags().join(" ·:· "))`,
			alts: [`alltags`],
			rank: -3,
			tags: [`allusers`, `general`],
			info: `List all the tags that my commands have`,
			reqs: []
		},
		'test': {
			exec: `sendChat("Yay, this works ·:· ${botSettings.newPrefix}${testCommand} - args: ${args} | text: ${text} | your rank: ${checkRank(msg.p._id)}")`,
			alts: [`test_alt`],
			rank: -3,
			tags: [`allusers`, `general`, `test`],
			info: `Test if the bot works right`,
			reqs: []
		},
		'about': {
			exec: `sendChat("${botSettings.info.botName} ${botSettings.info.ver} - Now with a new system, and it's taking a little while to develop.");`,
			alts: [],
			rank: -3,
			tags: [`allusers`, `general`, `meta`],
			info: `About the bot`,
			reqs: []
		},

		'stars': {
			exec: `var starArray = "　　　　☆　　　　🌟　　　　　　　・　　　💖　.　　*✫　　　　　　⚝　　　⁘　　　　　✦　　　✫　˚　".split(""); var starsString = ""; for (i=0; i<399; i++) { starsString += starArray[random(1, starArray.length - 2, true)] }; sendChat(starsString);`,
			alts: [`starfield`],
			rank: -3,
			tags: [`allusers`, `misc`, `unicode`],
			info: `Instant starfield!`,
			reqs: []
		},

		'time': {
			exec: `sendChat(new Date())`,
			alts: [],
			rank: -3,
			tags: [`allusers`, `misc`],
			info: `Get my local time`,
			reqs: []
		},

		'milliseconds': {
			exec: `sendChat("${Number(new Date())} milliseconds since Jan 1, 1970")`,
			alts: [`millis`, `ms`],
			rank: -3,
			tags: [`allusers`, `misc`],
			info: `Get the amount of milliseconds it's been since the Unix Epoch of January 1, 1970`,
			reqs: []
		},

		'owo': {
			exec: `sendChat("uwu")`,
			alts: [],
			rank: -3,
			tags: [`allusers`, `misc`, `owo`, `uwu`],
			info: `òwó`,
			reqs: []
		},
		'uwu': {
			exec: `sendChat("owo")`,
			alts: [],
			rank: -3,
			tags: [`allusers`, `misc`, `owo`, `uwu`],
			info: `ùwú`,
			reqs: []
		},


        
        'brokencmd': {
        	exec: `thiscommandwontworkandwillerror();`,
        	alts: [],
        	rank: 0,
        	tags: [`normalrank`, `test`, `error`],
			info: `An intentionally broken command that I will not fix`,
			reqs: [],
        },

        'hiddencmd': {
        	exec: `sendChat("Congratulations, you found a hidden command")`,
        	alts: [``],
        	rank: 0,
        	tags: [`normalrank`, `hidden`],
			info: `oh hey`,
			reqs: [],
        },

    	'say': {
			exec: `sendChat("${text}")`,
			alts: [`echo`, `aparecium`],
			rank: 0,
			tags: [`normalrank`, `general`, `notschoolsafe`],
			info: `Make this bot say something!`,
			reqs: []
		},

		'uptime': {
			exec: `sendChat(g_uptime(secondsUptime))`,
			alts: [],
			rank: 0,
			tags: [`normalrank`, `meta`],
			info: `Print the bot's uptime`,
			reqs: []
		},

		'bgcolor': {
			exec: `gClient.sendArray([{m:'chset', set:{color: "${args[0]}", color2: "${args[1]}"}}])`,
			alts: [`bgcolour`, `roomcolor`, `roomcolour`],
			rank: 0,
			tags: [`normalrank`, `rooms`, `roomsettings`, `color`],
			info: `Set the room's background colour`,
			reqs: []
		},
        'thesunisadeadlylazer': {
        	exec: `advNotes('""""""""""--mumu +a1a1  a1a1 a1a1 zqzq  a1a1 zqzq  a1a1', 160); forceChat('͏ｔｈｅ　ｓｕｎ　ｉｓ　ａ　ｄｅａｄｌｙ　ｌａｚｅｒ')`,
        	alts: [`thesun`],
        	rank: 0,
        	tags: [`normalrank`, `billwurtz`, `soundeffect`, `notschoolsafe`],
			info: `hey can we go on land? ｎｏ why not? ...`,
			reqs: []
        },
        'notanymoretheresablanket': {
        	exec: `advNotes('+r t y u  u Z t  r', 150); sendChat('not anymore, there\\'s a blanket')`,
        	alts: [`notanymore`],
        	rank: 0,
        	tags: [`normalrank`, `billwurtz`, `soundeffect`, `notschoolsafe`, `hidden`],
			info: `oh`,
			reqs: []
        },

        'settings': {
        	exec: `botSettingsCmd()`,
        	alts: [`setting`, `botsettings`, `botsetting`],
        	rank: 0,
        	tags: [`normalrank`, `bot`, `botsettings`],
        	info: `Set the bot settings! | Usage: ${botSettings.newPrefix}${testCommand} set [setting] [new value] | [reset|get|save] [setting] | [saveall|resetall] ·:·⁝·:·`,
        	reqs: []
        },

        'info': {
        	exec: `infoCmd()`,
        	alts: [],
        	rank: 0,
        	tags: [`normalrank`, `color`, `colour`],
        	info: `Get various information about a player | Usage: ${botSettings.newPrefix}${testCommand} [--_id] [--color|--colour] <name> ·:·⁝·:·`,
        	reqs: []
        },

        'color': {
        	exec: `colorCmd()`,
        	alts: [`colour`],
        	rank: 0,
        	tags: [`normalrank`, `color`, `colour`],
        	info: `Get various information about a player | Usage: ${botSettings.newPrefix}${testCommand} [--_id] [--color|--colour] <name> ·:·⁝·:·`,
        	reqs: []
        },







        'hug': {
        	exec: `rpAction('hugs no one. u.u', 'hugs themselves as they are lonely. u.u', 'gives', ' a big warm hug! ^.^', '\\'s hug missed and went everywhere! >ᵥ<')`,
        	alts: [],
        	rank: 0,
        	tags: [`normalrank`, `rp`],
			info: `Hug someone!`,
			reqs: []
        },








        'factorial': {
        	exec: `var num=parseFloat(text.trim());sendChat((text == "" || isNaN(num) )? 'This command needs a number to be used.' : factorial(num))`,
        	alts: [`!`],
        	rank: 0,
        	tags: [`normalrank`, `math`, `maths`, `probability`],
			info: `Calculate the factorial of a number`,
			reqs: [`math`]
        },
        'factors': {
        	exec: `var includeSums = flagTest('', 'sums', 0)? true : false; var num = parseFloat(text.trim()); sendChat((text == "" || isNaN(num))? "This command needs a number to be used." : advFactors(num${includeSums == true? `, true` : ``}))`,
        	alts: [`factor`, `factorsof`],
        	rank: 0,
        	tags: [`normalrank`, `math`, `maths`],
			info: `Calculate the factors of a number`,
			reqs: [`math`]
        },
        'round': {
        	exec: `sendChat((!args[0] || text == "")? 'Round a number, optionally to any amount of digits. | Usage: ${botSettings.newPrefix}${testCommand} [number] [accuracy in digits]' : round(args[0], args[1]? args[1] : 0))`,
        	alts: [],
        	rank: 0,
        	tags: [`normalrank`, `math`, `maths`],
        	info: `Round a number, optionally to any amount of digits | Usage: ${botSettings.prefix}${cmd} [number] [accuracy in digits]`,
        	reqs: [`math`]
        },
        'make_pyth_triple': {
        	exec: `if (!args[1] || text == "") {sendChat('Construct a Pythagorean triple with two numbers by calculating (n*n - m*m), (2*n*m), and (n*n + m*m) for the side lengths. | Usage: ${botSettings.newPrefix}${testCommand} [m] [n]') } else { sendChat(constructPythTriple(args[0], args[1])) }`,
        	alts: [`mpt`, `pyth_triple`],
        	rank: 0,
        	tags: [`normalrank`, `math`, `maths`, `geometry`],
        	info: `Construct a Pythagorean triple with two numbers by calculating (n*n - m*m), (2*n*m), and (n*n + m*m) for the side lengths. | Usage: ${botSettings.newPrefix}${testCommand} [m] [n]`,
        	reqs: [`math`]
        },
        'directsegment': {
        	exec: `if (!args[5] || text == "") {sendChat('Directed segment from (arg1, arg2) –to→ (arg3, arg4), split with a ratio of arg5:arg6 | Usage: ${botSettings.newPrefix}${testCommand} [x1] [y1] [x2] [y2] [m] [n]')} else {sendChat(directSegment(args[0], args[1], args[2], args[3], args[4], args[5]))}`,
            alts: [`dseg`],
            rank: 0,
            tags: [`normalrank`, `math`, `maths`, `notschoolsafe`],
            info: `Directed segment from (arg1, arg2) –to→ (arg3, arg4), split with a ratio of arg5:arg6 | Usage: ${botSettings.newPrefix}${testCommand} [x1] [y1] [x2] [y2] [m] [n]`,
            reqs: [`math`]
        },
        'heronsformula': {
        	exec: `if (!args[2] || text == "") {sendChat('Heron\\'s Formula - Calculate a triangle\\'s area from side lengths | Usage: ${botSettings.prefix}${cmd} [a] [b] [c]')} else {sendChat(heronsFormula(args[0], args[1], args[2]))}`,
        	alts: [`hform`],
        	rank: 0,
        	tags: [`normalrank`, `math`, `maths`]
        },








		
		'move': {
			exec: `changeRoom("${text}")`,
			alts: [`moveto`, `mv`, `chroom`],
			rank: 3,
			tags: [`extrahigh`, `rooms`, `admin`],
			info: `Move to a room`,
			reqs: []
		},
		'quicktravel': {
			exec: String.raw`if (text == "rp") {changeRoom("✧𝓡𝓟 𝓡𝓸𝓸𝓶✧")}
			else if (text == "grant") {changeRoom("Grant, we need to talk.   [Serious]")}
			else if (text == "shadroom") {changeRoom("Shadow's Room")}
			else if (text == "shadrp") {changeRoom("Shadow's RP Room")}
			else if (text == "nebslobby") {changeRoom("ı || ๖ۣۜ𝓝𝓮𝓫𝓾𝓵𝓪™ [🇬🇧] || ı:'s Lobby")}
			else if (text == "alone") {changeRoom("Shadow's Alone Time", "right", {visible: false})}`,

			alts: [`waypoint`, `warp`],
			rank: 3,
			tags: [`extrahigh`, `rooms`, `grantloves`, `admin`],

			info: `Warp to a room`,
			reqs: []
		},
		'rproom': {
			exec: `changeRoom("✧𝓡𝓟 𝓡𝓸𝓸𝓶✧")`,
			alts: [],
			rank: 3,
			tags: [`extrahigh`, `rooms`, `admin`],
			info: `Warp right to the RP Room`,
			reqs: []
		},
		'nocussing': {
			exec: `noCussing()`,
			alts: [`noswearing`],
			rank: 3,
			tags: [`extrahigh`, `rooms`, `roomsettings`, `chat`, `admin`],
			info: `Toggle the hidden No Cussing setting`,
			reqs: []
		},
		/*'grantneedstotalk': {
			exec: `changeRoom("Grant, come here.   [Serious]")`,
			alts: [],
			rank: 3,
			tags: [`extrahigh`, `rooms`, `grantloves`],
		},*/


		'clear': {
			exec: `chat.clear()`,
			alts: [`clearchat`, `cls`, `obliviate`],
			rank: 10,
			tags: [`owner`, `chat`],
			info: `Clear the chat`,
			reqs: []
		},
		'applycss': {
			exec: `applyCSS("${text}")`,
			alts: [`css`],
			rank: 10,
			tags: [`owner`, `css`],
			info: `Apply a CSS file to make MPP look different`,
			reqs: []
		},
		'resetcss': {
			exec: `addCSS("", false)`,
			alts: [],
			rank: 10,
			tags: [`owner`, `css`],
			info: `Reset the CSS to the site's defaults`,
			reqs: []
		},
		'applyfont': {
			exec: `applyFont(\`${text}\`)`,
			alts: [`usefont`, `font`],
			rank: 10,
			tags: [`owner`, `css`],
			info: `Use a different font`,
			reqs: []
		},
		'loadpreset': {
			exec: `loadPreset(\`${text}\`)`,
			alts: [`loadpre`],
			rank: 10,
			tags: [`owner`, `botsettings`],
			info: `Load any of the bot's presets`,
			reqs: []
		},
		'restart': {
			exec: `location.reload(true)`,
			alts: [`reload`, `stupefy`],
			rank: 10,
			tags: [`owner`, `bot`],
			info: `Restart the bot`,
			reqs: []
		},
	}

	function doCommand(command) {
		if ( ( checkRank(msg.p._id) >= commandsObject[command].rank && ( botSettings.lockdownMode == false || checkRank(msg.p._id) >= 10 ) ) || botSettings.anarchyMode == true) {

			console.log(`rank and stuff checks out`)

			console.log(commandsObject[command].tags)

            if (botSettings.schoolMode == true && commandsObject[command].tags.includes(`notschoolsafe`)) {
            	sendChat(`I'm sorry, but that command isn't safe for school usage.`)
            }

            else {

    			if (flagTest(``, `tags`, text, 0)) {
    				console.log(`tags flag detected`)
    				sendChat(commandsObject[command].tags.join(` · `))
    			}
    			else if (flagTest(`?`, `help`, text, 0)) {
    				console.log(`help flag detected`)
    				sendChat(commandsObject[command].info)
    			}
    			else {
    				console.log(`evaluating command`)
    				//for (const requisite of commandsObject[command].reqs) {
    				//	if ( failures[commandsObject[command].reqs[requisite]] == false) {
    						eval(commandsObject[command].exec)
    				//	}
    				//	else {
    				//		sendChat(`This command requires the bot's ${commandsObject[command].reqs[requisite]} module, which errored out while loading.`)
    				//	}
    				//}
    			    
    			}
            
        		
            }
        }

        else if (flagTest(`?`, `help`, text, 0)) {
     		sendChat(`${commandsObject[command].info} | This command is for rank ${commandsObject[command].rank} and up, but you're only ${checkRank(msg.p._id)}`)
     	}
    	else {
        	sendChat(`Your rank's too low for ${botSettings.newPrefix}${testCommand}, it's ${checkRank(msg.p._id)} when it should be at least ${commandsObject[command].rank}`)
        }
	}

				for (const command of Object.keys(commandsObject) ) {
					if (testCommand == command) {
						doCommand(command);
					}
					for (const commandAlt of commandsObject[command].alts) {
						if (testCommand == commandAlt) {
							doCommand(command);
				    	}
					}
				}

				function collectAllTags() {
                    var tagsCollected = [];

					for (const command of Object.keys(commandsObject) ) {
                        console.log(`testing ${command}...`)

					    for (i = 0; i < commandsObject[command].tags.length; i++) {
					    	console.log(`detected tag ${commandsObject[command].tags[i]}`)
					    	if ( tagsCollected.includes(commandsObject[command].tags[i]) || commandsObject[command].tags[i] == `hidden`) {

					    	}
					    	else {
					    		console.log(`tag ${commandsObject[command].tags[i]} not included yet, pushed`)
					    		tagsCollected.push(commandsObject[command].tags[i])
					    	}
					    }
				    }

				    return tagsCollected.sort();
				}

				function newHelp(tag) {
                    var stringToOutput = ""
                    infoLine(`newHelp`, `stringToOutput initialised`)
                    //    tagsArray = tags.split(` `);

                    
					for (const command of Object.keys(commandsObject).sort() ) {
						infoLine(`newHelp`, `adding ${command}`)

						if (tag) {
			    		    if (checkRank(msg.p._id) >= commandsObject[command].rank
			    		    && commandsObject[command].tags.includes(tag)
			    		    && !(commandsObject[command].tags.includes(`hidden`)) ) {

			    		    	if (commandsObject[command].tags.includes(`notschoolsafe`)
			    		    	&& botSettings.schoolMode == true) {

			    		    	}
			    		    	else {
			    		    	    infoLine(`newHelp`, `rank and tag check out, added`)
				    	            stringToOutput += ` ·:· ${botSettings.newPrefix}${command} `
				    	            
				    	            if (commandsObject[command].alts.length > 0) {
				    	            	infoLine(`newHelp`, `${commandsObject[command].alts.length} alts detected`)
				    	                for (const commandAlt of commandsObject[command].alts) {
			    		    	            infoLine(`newHelp`, `adding alternate of ${commandAlt}`)
			        	    	           	stringToOutput += `·${botSettings.newPrefix}${commandAlt}`
			    	        	        }
			    	        	    }
			    	        	}
				    	    }
				    	}
				    	else {
				    		if (checkRank(msg.p._id) >= commandsObject[command].rank
			    		    && !(commandsObject[command].tags.includes(`hidden`))
			    		    ) {
			    		    	if (commandsObject[command].tags.includes(`notschoolsafe`)
			    		    	&& botSettings.schoolMode == true) {

			    		    	}
			    		    	else {
	    		    		    	//infoLine(`newHelp`, `rank and tag check out, added`)
	    			    	        stringToOutput += ` ·:· ${botSettings.newPrefix}${command} `
	    			    	        
	    			    	        //if (commandsObject[command].alts.length > 0) {
	    			    	        //	//infoLine(`newHelp`, `${commandsObject[command].alts.length} alts detected`)
	    			    	        //    for (const commandAlt of commandsObject[command].alts) {
	    		    		    	//        //infoLine(`newHelp`, `adding alternate of ${commandAlt}`)
	    		        	    	//       	stringToOutput += `·${botSettings.newPrefix}${commandAlt}`
	    		    	        	//    }
	    		    	        	//}
			    	        	}
				    	    }
				    	}
			    		
			    	}
			    	infoLine(`newHelp`, `stringToOutput is ${stringToOutput}`)
			    	sendChat(stringToOutput)
				}




                function infoCmd() {

                	var sendID = false;
                	var sendColor = false;
                	var sendAll = true;
              if (flagTest(``, `_id`, text, 0)) {
                flagDetected = true;
                text = text.replace(`--_id`, ``).trim()
                debugLine(`/info`, `removed _id flag, $text is now "${text}"`)
                sendAll = false;
                sendID = true;
              }

              if (flagTest(``, `color`, text, 0) || flagTest(``, `colour`, text, 0)) {
                flagDetected = true;
                text = text.replace(`--color`, ``).trim()
                text = text.replace(`--colour`, ``).trim()
                debugLine(`/info`, `removed color flag, $text is now "${text}"`)
                sendAll = false;
                sendColor = true;
              }

                	if (text.trim() == '') {
              debugLine(`/info`, `no text, will grab info of sender`)
              var inputColor = getColorName(msg.p.color)
              //sendChat(`name: ${name} | id: ${msg.p.id}`);
              sendChat(sendAll == true? `_id: ${msg.p._id} | id: ${msg.p.id} | colo(u)r: ${inputColor} (${msg.p.color})` : ((sendID == true? `_id: ${msg.p._id}` : ``) + (sendColor == true? `colo(u)r: ${inputColor} (${msg.p.color})` : ``)))
              //if (msg.p._id !== gClient.getOwnParticipant()._id) {
              //  sendChat(`cursor x: ${msg.p.x} | cursor y: ${msg.p.y}`);
              //}
            } else if (info(text.trim())) {

              let input = info(text.trim())

              debugLine(`/info`, `found ${input.name} while searching for ${text}`)

              let input_colorName = getColorName(input.color)

              debugLine(`/info`, `got color name of ${input.color}`)

              //sendChat(`name: ${input_name}`);

              var whatToSend = `${input.name}`

              var flagDetected = false;

              if (input._id === gClient.getOwnParticipant()._id) {
                debugLine(`/info`, `${input.name} is me`)
                sendChat(`Me!${(sendAll == true || sendID == true)? ` | _id: ${input._id}` : ``}${sendAll == true? ` | id: ${input.id} |` : ``}${(sendAll == true || sendColor == true)? ` color: ${input_colorName} (${input.color})` : ``}`)
              }
              else {
                debugLine(`/info`, `${input.name} isn't me`)
                sendChat(`${input.name}${(sendAll == true || sendID == true)? ` | _id: ${input._id}` : ``}${sendAll == true? ` | id: ${input.id} |` : ``}${(sendAll == true || sendColor == true)? ` color: ${input_colorName} (${input.color})` : ``}`);
              }
              //if (input._id !== gClient.getOwnParticipant()._id) {
              //  sendChat(`cursor x: ${input.x} | cursor y: ${input.y}`);
              //}
            }
            else {
              debugLine(`/info`, `couldn't find the requested player`)
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
                }

				function botSettingsCmd() {
					if (args[0] == 'saveall') {
              if (msg.p._id === gClient.getOwnParticipant()._id) {
                botDefaults.cursorBot.ballOnString.mass = botSettings.cursorBot.ballOnString.mass;
                botDefaults.cursorBot.ballOnString.gravity = botSettings.cursorBot.ballOnString.gravity;
                botDefaults.cursorBot.ballOnString.friction = botSettings.cursorBot.ballOnString.friction;
                botDefaults.cursorBot.bounce.Xspeed = botSettings.cursorBot.bounce.Xspeed;
                botDefaults.cursorBot.bounce.Yspeed = botSettings.cursorBot.bounce.Yspeed;
                botDefaults.cursorBot.bounce.Zspeed = botSettings.cursorBot.bounce.Zspeed;
                botDefaults.cursorBot.mode = botSettings.cursorBot.mode;

                botDefaults.itsSlashHelp = botSettings.itsSlashHelp;
                botDefaults.dadBot = botSettings.dadBot;
                botDefaults.prefix = botSettings.prefix;
                botDefaults.newPrefix = botSettings.newPrefix;
                botDefaults.jsCmd = botSettings.jsCmd;
              }
              else {
                sendChat(`I'm sorry, but you can't save all settings at once.`)
              }
            }

            if (args[0] == 'resetall') {
              if (msg.p._id === gClient.getOwnParticipant()._id) {
                resetCursor();

                botSettings.itsSlashHelp = botDefaults.itsSlashHelp;
                botSettings.dadBot = botDefaults.dadBot;
                botSettings.prefix = botDefaults.prefix;
                botSettings.newPrefix = botDefaults.newPrefix;
                botSettings.jsCmd = botDefaults.jsCmd;
              }
              else {
                sendChat(`I'm sorry, but you can't reset all settings at once.`)
              }
            }

            if (args[0] == 'cursorbot') {
              if (args[1] == 'set') {
                if (args[2] == 'mass') {
                  botSettings.cursorBot.ballOnString.mass = parseFloat(args[3])
                  sendChat('mass now set to ${args[3]}')
                }
                if (args[2] == 'gravity') {
                  botSettings.cursorBot.ballOnString.gravity = parseFloat(args[3])
                  sendChat('gravity now set to ${args[3]}')
                }
                if (args[2] == 'friction') {
                  botSettings.cursorBot.ballOnString.friction = parseFloat(args[3])
                  sendChat('friction now set to ${args[3]}')
                }
                if (args[2] == 'bounceXspeed') {
                  botSettings.cursorBot.bounce.Xspeed = parseFloat(args[3])
                  sendChat('bounce x speed now set to ${args[3]}')
                }
                if (args[2] == 'bounceYspeed') {
                  botSettings.cursorBot.bounce.Yspeed = parseFloat(args[3])
                  sendChat('bounce y speed now set to ${args[3]}')
                }
                if (args[2] == 'bounceZspeed') {
                  botSettings.cursorBot.bounce.Zspeed = parseFloat(args[3])
                  sendChat('bounce z speed now set to ${args[3]}')
                }
                if (args[2] == 'mode') {
                  if (args[3] == 'ballOnString') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'ballOnString'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'roughFollow') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'roughFollow'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'battlingCursor') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'battlingCursor'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'goCrazy') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'goCrazy'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'hatLastChatter') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'hatLastChatter'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'bounce') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = `bounce`
                    sendChat(`mode now set to ${args[3]}`)
                  }
                  if (args[3] == 'bounce3d') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = `bounce3d`
                    sendChat(`mode now set to ${args[3]}`)
                  }
                  if (args[3] == `screensaver`) {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = `screensaver`
                    sendChat(`mode now set to ${args[3]}`)
                  }
                  if (args[3] == 'off') {
                    botSettings.cursorBot.enable = false
                  }
                }
              }
              if (args[1] == 'get') {
                if (args[2] == 'mass') {
                  sendChat(botSettings.cursorBot.ballOnString.mass)
                }
                if (args[2] == 'gravity') {
                  sendChat(botSettings.cursorBot.ballOnString.gravity)
                }
                if (args[2] == 'friction') {
                  sendChat(botSettings.cursorBot.ballOnString.friction)
                }
                if (args[2] == `mode`) {
                  sendChat(botSettings.cursorBot.mode);
                }
                if (args[2] == 'bounceXspeed') {
                  sendChat(botSettings.cursorBot.bounce.Xspeed)
                }
                if (args[2] == 'bounceYspeed') {
                  sendChat(botSettings.cursorBot.bounce.Yspeed)
                }
                if (args[2] == 'bounceZspeed') {
                  sendChat(botSettings.cursorBot.bounce.Zspeed)
                }
              }
              if (args[1] == 'reset') {
                if (args[2] == 'all') {
                  resetCursor();
                  sendChat(`all cursor bot settings reset`)
                }
                if (args[2] == 'mass') {
                  botSettings.cursorBot.ballOnString.mass = botDefaults.cursorBot.ballOnString.mass;
                  sendChat(`mass reset to ${botSettings.cursorBot.ballOnString.mass}`)
                }
                if (args[2] == 'gravity') {
                  botSettings.cursorBot.ballOnString.gravity = botDefaults.cursorBot.ballOnString.gravity;
                  sendChat(`gravity reset to ${botSettings.cursorBot.ballOnString.gravity}`)
                }
                if (args[2] == 'friction') {
                  botSettings.cursorBot.ballOnString.friction = botDefaults.cursorBot.ballOnString.friction;
                  sendChat(`friction reset to ${botSettings.cursorBot.ballOnString.friction}`)
                }
                if (args[2] == 'bounceXspeed') {
                  botSettings.cursorBot.bounce.Xspeed = botDefaults.cursorBot.bounce.Xspeed;
                  sendChat(`bounce x speed reset to ${botSettings.cursorBot.bounce.Xspeed}`)
                }
                if (args[2] == 'bounceYspeed') {
                  botSettings.cursorBot.bounce.Yspeed = botDefaults.cursorBot.bounce.Yspeed;
                  sendChat(`bounce y speed reset to ${botSettings.cursorBot.bounce.Yspeed}`)
                }
                if (args[2] == 'bounceZspeed') {
                  botSettings.cursorBot.bounce.Zspeed = botDefaults.cursorBot.bounce.Zspeed;
                  sendChat(`bounce z speed reset to ${botSettings.cursorBot.bounce.Zspeed}`)
                }
                if (args[2] == `mode`) {
                  botSettings.cursorBot.mode = botDefaults.cursorBot.mode;
                  sendChat(`mode reset to ${botSettings.cursorBot.mode}`)
                }
              }
              if (args[1] == 'save') {
                if (args[2] == 'all') {
                  botDefaults.cursorBot.ballOnString.mass = botSettings.cursorBot.ballOnString.mass;
                  botDefaults.cursorBot.ballOnString.gravity = botSettings.cursorBot.ballOnString.gravity;
                  botDefaults.cursorBot.ballOnString.friction = botSettings.cursorBot.ballOnString.friction;
                  botDefaults.cursorBot.bounce.Xspeed = botSettings.cursorBot.bounce.Xspeed;
                  botDefaults.cursorBot.bounce.Yspeed = botSettings.cursorBot.bounce.Yspeed;
                  botDefaults.cursorBot.bounce.Zspeed = botSettings.cursorBot.bounce.Zspeed;
                  botDefaults.cursorBot.mode = botSettings.cursorBot.mode;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'mass') {
                  botDefaults.cursorBot.ballOnString.mass = botSettings.cursorBot.ballOnString.mass;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'gravity') {
                  botDefaults.cursorBot.ballOnString.gravity = botSettings.cursorBot.ballOnString.gravity;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'friction') {
                  botDefaults.cursorBot.ballOnString.friction = botSettings.cursorBot.ballOnString.friction;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'bounceXspeed') {
                  botDefaults.cursorBot.bounce.Xspeed = botSettings.cursorBot.bounce.Xspeed;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'bounceYspeed') {
                  botDefaults.cursorBot.bounce.Yspeed = botSettings.cursorBot.bounce.Yspeed;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'bounceZspeed') {
                  botDefaults.cursorBot.bounce.Zspeed = botSettings.cursorBot.bounce.Zspeed;
                  sendChat(`Saved!`)
                }
                if (args[2] == `mode`) {
                  botDefaults.cursorBot.mode = botSettings.cursorBot.mode;
                  sendChat(`Saved!`)
                }
              }
            }

            if (args[0] == `itsSlashHelp`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  if (args[2] == `true`) {
                    botSettings.itsSlashHelp = true;
                    sendChat(`“It's /help” setting is now on`)
                  }
                  if (args[2] == `false`) {
                    botSettings.itsSlashHelp = false;
                    sendChat(`“It's /help” setting is now off`)
                  }
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.itsSlashHelp)
                }
                if (args[1] == `reset`) {
                  botSettings.itsSlashHelp = botDefaults.itsSlashHelp;
                  sendChat(`“It's /help” setting reset`)
                }
                if (args[1] == `save`) {
                  botDefaults.itsSlashHelp = botSettings.itsSlashHelp;
                  sendChat(`“Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set/get “It's /help”.`)
              }
            }

            if (args[0] == `dadBot`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  if (args[2] == `true`) {
                    botSettings.dadBot = true;
                    sendChat(`Dad Bot now on`)
                  }
                  if (args[2] == `false`) {
                    botSettings.dadBot = false;
                    sendChat(`Dad Bot now off`)
                  }
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.dadBot)
                }
                if (args[1] == `reset`) {
                  botSettings.dadBot = botDefaults.dadBot;
                  sendChat(`Dad Bot reset`)
                }
                if (args[1] == `save`) {
                  botDefaults.dadBot = botSettings.dadBot;
                  sendChat(`Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for my Dad Bot.`)
              }
            }

            if (args[0] == `anarchyMode`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  if (args[2] == true) {
                    botSettings.anarchyMode = true;
                    sendChat(`LET THE ANARCHY COMMENCE!`)
                  }
                  if (args[2] == false) {
                    botSettings.anarchyMode = false;
                    sendChat(`Back to a controlled, ranked system.`)
                  }
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.anarchyMode)
                }
                if (args[1] == `reset`) {
                  botSettings.anarchyMode = botDefaults.anarchyMode;
                  sendChat(`Anarchy Mode reset`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }

            if (args[0] == `prefix`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  botSettings.newPrefix = args[2];
                  sendChat(`Now it's ${botSettings.newPrefix}help and such`)
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.newPrefix)
                }
                if (args[1] == `reset`) {
                  botSettings.prefix = botDefaults.newPrefix;
                  debugLine(`resetting settings`, `botSettings.newPrefix set to botDefaults.newPrefix | is now ${botSettings.newPrefix}`)
                  sendChat(`Now it's ${botSettings.newPrefix}help and such`)
                }
                if (args[1] == `save`) {
                  botDefaults.prefix = botSettings.newPrefix;
                  debugLine(`saving settings`, `botDefaults.newPrefix set to botSettings.newPrefix | is now ${botDefaults.newPrefix}`)
                  sendChat(`Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }

            if (args[0] == `oldprefix`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  botSettings.prefix = args[2];
                  sendChat(`Now it's ${botSettings.prefix}help and such`)
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.prefix)
                }
                if (args[1] == `reset`) {
                  botSettings.prefix = botDefaults.prefix;
                  debugLine(`resetting settings`, `botSettings.prefix set to botDefaults.prefix | is now ${botSettings.prefix}`)
                  sendChat(`Now it's ${botSettings.prefix}help and such`)
                }
                if (args[1] == `save`) {
                  botDefaults.prefix = botSettings.prefix;
                  debugLine(`saving settings`, `botDefaults.prefix set to botSettings.prefix | is now ${botDefaults.prefix}`)
                  sendChat(`Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }

            if (args[0] == `testsetting`) {

              if (args[1] == `set`) {
                testsetting = args[2];
                sendChat(`testsetting is now ${testsetting}`)
              }
              if (args[1] == `get`) {
                sendChat(testsetting)
              }
              if (args[1] == `reset`) {
                testsetting = testdefault;
                debugLine(`resetting settings`, `testsetting now ${testsetting}`)
                sendChat(`testsetting reset to ${testsetting}`)
              }
              if (args[1] == `save`) {
                testdefault = testsetting;
                debugLine(`saving settings`, `testdefault now ${testdefault}`)
                sendChat(`testdefault now ${testdefault}`)
              }
            }

            if (args[0] == `jsCmd`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  botSettings.jsCmd = args[2];
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.jsCmd)
                }
                if (args[1] == `reset`) {
                  botSettings.jsCmd = botDefaults.jsCmd;
                }
                if (args[1] == `save`) {
                  botDefaults.jsCmd = botSettings.jsCmd;
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }
				}



				function rpAction(noText, selfText, beforeText, afterText, missText) {
          	if (text == '') {
              sendChat(`${name} ${noText}`);
            } else if (info(text)) {
              let input = info(text).name
              if (input == msg.p.name) {
                sendChat(`${name} ${selfText}`);
              } else {
                sendChat(`${name} ${beforeText} ${input}${afterText}`);
              }
            } else {
              //sendChat(`${name}, I couldn't find anyone by the name of ${text}.`)
              sendChat(`${name}${missText}`)
            }
          }
















				//if ()
				
				/*if (name.startsWith(`GrantLovesCreamTheRabbit`) && msg.p._id != `5c5bbb65bae2b3e7321ddfa6`) {
	        sendChat(`Ban this fake Grant now.`)
	        blIds.push(msg.p._id)
        bannedIds.push(msg.p._id)
	      }

	      if ( !name.startsWith(`GrantLoves`) && msg.p._id == `5c5bbb65bae2b3e7321ddfa6`) {
        sendChat(`Grant's impersonating again, BAN HIM.`)
      }*/
	      
	      if (text2.includes(`Now playing: 135 - ${atob("\x52\x6c\x56\x44\x53\x79\x42\x50\x52\x6b\x59\x68\x49\x51\x3d\x3d")}!`)
          || text2.includes(`Now playing: 284 - MIDI SPAM PART 3`)) {
        changeRoom(`Shadow's Room`)
      }
      if (botSettings.roomColorLastChat == true) {
        if (MPP.client.isOwner()) {
          gClient.sendArray([{m:'chset', set:{color:msg.p.color}}]);
        }
      }
      else if (botSettings.roomColorLastChat == 'flat') {
        if (MPP.client.isOwner()) {
          gClient.sendArray([{m:'chset', set:{color:msg.p.color, color2:msg.p.color}}]);
        }
      }
      else if (botSettings.roomColorLastChat == 'andBlack') {
        if (MPP.client.isOwner()) {
          gClient.sendArray([{m:'chset', set:{color:msg.p.color, color2: `#000000`}}]);
        }
      }
      else if (botSettings.roomColorLastChat == 'inward') {
        if (MPP.client.isOwner()) {
          var prevColor = "";
          prevColor = MPP.client.channel.settings.color;
          gClient.sendArray([{m:'chset', set:{color:msg.p.color, color2:prevColor}}]);
        }
      }
      else if (botSettings.roomColorLastChat == 'outward') {
        if (MPP.client.isOwner()) {
          var prevColor = "";
          prevColor = MPP.client.channel.settings.color;
          gClient.sendArray([{m:'chset', set:{color:prevColor, color2:msg.p.color}}]);
        }
      }
			
			if (text2.startsWith(botSettings.prefix)) {
				if (botSettings.fullPower === true) {
          if (cmd === 'clear') { //            /clear
            if (msg.p._id === gClient.getOwnParticipant()._id) {
              chat.clear();
              infoLine('', 'Chat cleared')
            } else {
              sendChat(`I'm sorry, but you can't use ${botSettings.prefix}clear.`)
            }
          }

          if (cmd === 'move') {
            changeRoom(`${text}`)
          }

          if (cmd == `rproom`) {
            changeRoom(`✧𝓡𝓟 𝓡𝓸𝓸𝓶✧`)
		  }

          if (cmd == `nocussing`) {
            noCussing()
          }

          if (cmd === 'restart') {
            location.reload(true); // reloads from the server
          }

          if (cmd === 'bgcolor') {
            gClient.sendArray([{m:'chset', set:{color: args[0], color2:args[1]}}])
          }
        }
				
				if (botSettings.power === true
            && !(blIds.includes(msg.p._id))
            && !(blNames.includes(msg.p.name))
            && (botSettings.lockdownMode === false || msg.p._id === gClient.getOwnParticipant()._id) // not locked down, or it's me
            && (botSettings.allowFakers == false && ( // blocking fakers and (isn't my name, or is me)
            msg.p.name != gClient.getOwnParticipant().name || msg.p._id === gClient.getOwnParticipant()._id))) {
					
					if (cmd === 'applycss' && msg.p._id === MPP.client.getOwnParticipant()._id) {
            applyCSS(text);
          }
          if (cmd === 'resetcss' && msg.p._id === MPP.client.getOwnParticipant()._id) {
            addCSS(``, false); // override if present
          }
					
				//   /help me!
          if (cmd === "help") {

            if (!(args[0])) {args[0] = ''}
            var page = args[0].toLowerCase()


            //sendChat("Commands are: " + cmds);
            if (args[0] === "main") {
              sendChat(`<MAIN COMMANDS> ${cmdsMain}`);
            }
            else if (page === "math" || page === "maths" || page === "mathematics") {
              sendChat(`<MATH> ${cmdsMath}`);
            }
            else if (page === "rp" || page === "roleplay" || page === "roleplaying") {
              sendChat(`<ROLEPLAYING> ${cmdsRP}`);
            }
            else if (page === "text") {
              sendChat(`<TEXT COMMANDS> ${cmdsText}`);
            }
            else if (page === "other") {
              sendChat(`<OTHER COMMANDS> ${cmdsOther}`);
            }
            else if (page === `all`) {
              sendChat(`<MAIN> ${cmdsMain}`);
              sendChat(`<MATH> ${cmdsMath}`);
              sendChat(`<ROLEPLAYING> ${cmdsRP}`);
              sendChat(`<TEXT> ${cmdsText}`);
              sendChat(`<OTHER> ${cmdsOther}`);
              sendChat((botSettings.safeMode == false
                        || checkRank(msg.p._id) >= 2
                        || msg.p._id == gClient.getOwnParticipant()._id)? `Not available in Safe Mode: ${cmdsUnsafe}` : ``);
              // Ternary Operator - if Safe Mode is off or
              // it's a Level 2+ user, show unsafe commands
            }
            //else if (page === "temp" || page === "temperature") {
            //  sendChat(`[Soon to be deprecated by ${botSettings.prefix}convert] Temperature conversion to/from [C]elsius, [F]ahrenheit, `+
            //           `[K]elvin, [Ra]nkine, [D]elisle, [N]ewton, [Ré]aumur, `+
            //           `and [Rø]mer (ro) with ${botSettings.prefix}[FROM]_to_[TO] (e.g. c_to_f, `+
            //           `ra_to_ro, etc.)`);
            //}
            else if (page === "unsafe" || page === "wip") {
              sendChat((botSettings.safeMode == false
                        || checkRank(msg.p._id) >= 2
                        || msg.p._id == gClient.getOwnParticipant()._id)? `Not available in Safe Mode: ${cmdsUnsafe}` : `Unsafe commands aren't available right now as I'm in Safe Mode.`);
            }
            else {
              sendChat(`Help pages: ${botSettings.prefix}help main || `+
                       `${failures.math == false? `${botSettings.prefix}help math || ` : ``} `+
                       `${botSettings.prefix}help roleplay || `+
                       `${failures.text == false? `${botSettings.prefix}help text || ` : ``} `+
                       `${botSettings.prefix}help other`+
                       ((botSettings.safeMode == false
                         || checkRank(msg.p._id) >= 2
                         || msg.p._id == gClient.getOwnParticipant()._id)? ` || ${botSettings.prefix}help unsafe` : ``))
              sendChat(`¿Necesito comandos en español? Teclea «${botSettings.prefix}ayúdame».`)

              sendChat(`[[ Josh's MPP Anti-Troll Script v0.10.1]] - Original at `+
                       `github.com/SYZYGY-DEV333/MPP-Anti-Troll`);

              if (gClient.isOwner() && admins.includes(msg.p._id)) {

                sendChat(`${botSettings.prefix}nameban -- blacklist a name | ${botSettings.prefix}idban -- blacklist an _id | ${botSettings.prefix}unban -- removes name or _id from blacklist | ${botSettings.prefix}admin -- makes user an admin, given an _id | ${botSettings.prefix}dbclear -- clears/resets database`);

              } else if (!(admins.includes(gClient.getOwnParticipant()._id))) {

                admins.push(gClient.getOwnParticipant()._id);

              }
            }
          }

          if ((cmd === 'ayúdame' || cmd === 'ayudame')) {
            //sendChat(`<COMANDOS PRINCIPALES> ${cmdsMainEs}`);
            ////sendChat(`<DE MATEMÁTICAS> ${cmdsMathEs}`);
            //sendChat(`<DEL JUEGO DE ROLES> ${cmdsRPEs}`);
            //sendChat(`<DE TEXTO> ${cmdsTextEs}`);
            ////sendChat(`<COMANDOS OTROS> ${cmdsOtherEs}`);

            sendChat(`${cmdsMainEs}, ${cmdsRPEs}, ${cmdsTextEs}`)
            sendChat(`Need commands in English?  Type “${botSettings.prefix}help”.`)

          }

          if (cmd === "test") { //                            /test - Test Command
            sendChat(`[/test command] args: ${args} | text: ${text} | linuxSplit: ${linuxSplit(text)} | name of executer: ${name} | cmd: ${cmd} | your rank: ${checkRank(msg.p._id)}`);
          }

          if (cmd === "prueba") { //                   /prueba - Comando de Prueba
            sendChat(`[comando /prueba] args: ${args} | texto: ${text} | linuxSplit: ${linuxSplit(text)} | nombre de ejecutor: ${name} | cmd: ${cmd} | su [rank]: ${checkRank(msg.p._id)}`);
          }


          if (cmd === "about") { //                         /about - About the bot
            sendChat(`${botSettings.info.botName} ${botSettings.info.ver} - A port of the Tampermonkey version to a script.js replacement.`);
            sendChat(`${botSettings.info.aboutText}`);
          }
          // to do: /sobre

          if (cmd === "stars") {
            //sendChat(`☆✦　　 　.　.　 ✫　 　.˚ ✦　　　˚.　 　 　 　☆ 　 　 　 . 　 　 　 . ✫ 　 　 　 .　 　˚.　 　　　　 ✫ 　 　 　 　 　 　 . 　 　 　 ✫ 　 　 　 　. 　 　 　 ˚ ✦ 　 　 ✫ 　.˚ ✦　 　　　　 ✫ 　　 　 ˚.✫ 　˚.　　 　 　 　☆　 　　 　 　 　 　☆✦　　 　.　.　 ✫　 　.˚ ✦　　　˚.　 　 　 　☆ 　 　 　 . 　 　 　 . ✫ 　 　 　 .　 　˚.　 　　　　 ✫ 　 　 　 　 　 　 .　 　☆　 　　 　 　 　 　☆✦　　 　.　.　 ✫　 　.˚ ✦　　　˚.　 　 　 　☆ 　 　 　 . 　 　 　 . ✫ 　 　 　 .　 　˚.　 　　☆✦　　 　.　.　 ✫　 　.˚ ✦　　　˚.　 　 　 　☆ 　 　 　 . 　 　 　 . ✫ 　 　 　 .　 　˚.　 　　　　 ✫ 　 　 　 　 　 　 . 　 　 　 ✫ 　 　 　 　. 　 　 　 ˚ ✦ 　 　 ✫ 　.˚ ✦　 　　　　 ✫ 　　 　 ˚.✫ 　˚.　　 　 　 　☆`)
            var starArray = "　　　　☆　　　　🌟　　　　　　　・　　　💖　.　　*✫　　　　　　⚝　　　　　　　✦　　　✫　˚　".split(``); var starsString = ""; for (i=0; i<399; i++) { starsString += starArray[random(1, starArray.length - 2, true)] }; sendChat(starsString);
          }



          if (cmd == `uptime`) {
          	sendChat(g_uptime(secondsUptime))
          }


          if (cmd === 'changelog') { //         *********** /changelog ***********
            sendChat(`Version ${botSettings.info.ver}:`);
            sendChat(`First version and already this is freakin' huge, as a port of a Tampermonkey userscript to a script.js replacement.`)
            if (args[0] != 'short') {
              //sendChat(`Previous snapshot (04/17/2020):`);
              //sendChat(`I'm doing some cleanup work.`);

              sendChat(`What you might've missed: The very creation of this bot`);
            }
            //                                  --------------------------------------------------------------------------------------------------------------------------------------------
          }


          if (cmd === "motd") { // /motd
            //sendChat("MOTD: Piano with quarter tones! http://www.youtube.com/watch?v=v5sI-s4E9js");
            //sendChat("Radionomy is developing Winamp again! http://winamp.com")
            sendChat("No MOTD right now.")
          }


          if (cmd == `isanonygoldhere`) {

            var _idList = Object.keys(gClient.ppl).map(id => gClient.ppl[id]._id);

            if (_idList.includes(`3a9efbc285be425de40b7387`)
                || _idList.includes(`0201647e8de794e555bd5a09`)
                || _idList.includes(`5132f846c5bf8144b9cd6540`)
                || _idList.includes(`a3b8f6b0745bcedfeaea0def`)) {
              sendChat(`Yes`)
            }
            else {
              sendChat(`No`)
            }
          }
          
          
          
          
          
          
          
          //                        MATH
          if (failures.math == false) {
            if (cmd === 'factorial') { //             /
              var num = parseFloat(text.trim() )
              if (text == "" || isNaN(num) ) {
                sendChat(`\u034F${cmd} needs a number to be used.`)
              } else {
                sendChat(factorial(num))
              }
            }

            if (cmd === 'factors') { //               /
              var num = parseFloat(text.trim() )
              if (text == "" || isNaN(num) ) {
                sendChat(`\u034F${cmd} needs a number to be used.`)
              } else {
                sendChat(advFactors(num))
              }
            }

            if (cmd === 'round') {
              // args[0] is <<number>>
              // args[1] is <<accuracy>>
              sendChat((!args[1] || text == "")? `Round a number to any number of digits. | Usage: ${botSettings.prefix}${cmd} [number] [accuracy in digits]` : round(args[0], args[1]))
              
            }

            if (cmd === "make_pyth_triple" || cmd === "mpt") {
              if (!args[1] || text == "") {
                sendChat(`Construct a Pythagorean triple with two numbers by calculating (n*n - m*m), (2*n*m), and (n*n + m*m) for the side lengths. | Usage: ${botSettings.prefix}${cmd} [m] [n]`)
              } else {
                sendChat(constructPythTriple(args[0], args[1]))
              }
            }

            

            if (cmd === "directsegment" || cmd === "dseg") {
              if (!args[5] || text == "") {
                sendChat(`Directed segment from (arg1, arg2) –to→ (arg3, arg4), split with a ratio of arg5:arg6 | Usage: ${botSettings.prefix}${cmd} [x1] [y1] [x2] [y2] [m] [n]`)
              } else {
                sendChat(directSegment(args[0], args[1], args[2], args[3], args[4], args[5]))
              }
            }

            if (cmd === "heronsformula" || cmd === "hform") {
              if (!args[2] || text == "") {
                sendChat(`Heron's Formula - Calculate a triangle's area from side lengths | Usage: ${botSettings.prefix}${cmd} [a] [b] [c]`)
              } else {
                sendChat(heronsFormula(args[0], args[1], args[2]))
              }
            }

            if (cmd === "twopoint" || cmd === "2pt") {
              if (!args[2] || text == "") {
                sendChat(`Two-Point Formula: Get a linear function containing the points (arg1, arg2) and (arg3, arg4) | Usage: ${botSettings.prefix}${cmd} [x1] [y1] [x2] [y2]`)
              } else {
                sendChat(twoPoint(args[0], args[1], args[2], args[3]))
              }
            }// ###################################################################
            // ###################################################################
            // ###################################################################
            // ###################################################################
            // ###################################################################
            // ###################################################################
            // ###################################################################
            // ###################################################################
            // ###################################################################


            if (cmd === "triangletest" || cmd === "tritest") {
              if (!args[2] || text == "") {
                sendChat(`Give the three sides of a triangle, and get the type of triangle it is | Usage: ${botSettings.prefix}${cmd} [a] [b] [c]`)
              } else {
                sendChat(triangleTest(args[0], args[1], args[2]))
              }
            }

            if (cmd === "hypotenuse" || cmd === "hypot") {
              if (!args[2] || text == "") {
                sendChat(`Calculate the hypotenuse (longest side) of a right triangle, given the two other sides | Usage: ${botSettings.prefix}${cmd} [leg1] [leg2]`)
              } else {
                sendChat(hypotenuse(args[0], args[1]))
              }
            }
          }
          
          
          
          
          
          
          
          if (cmd === "me") { //                                /me - Do something
            if (args.length == 0) {
              sendChat(`*${name} does something I don't know of*`);
            } else {
              sendChat(`*${name} ${text}*`);
            }
          }

          if (cmd === "yo") { //                                  /yo - Hacer algo
            if (args.length == 0) {
              sendChat(`*${name} hice algo que no se*`);
            } else {
              sendChat(`*${name} ${text}*`);
            }
          }



          if (cmd === 'hug') { //                   /hug
            if (text == '') {
              sendChat(`${name} hugs no one. u.u`);
            } else if (info(text)) {
              let input = info(text).name
              if (input == msg.p.name) {
                sendChat(`${name} hugs themselves because they are lonely. u.u`);
              } else {
                sendChat(`${name} gives ${input} a big warm hug.`);
              }
            } else {
              //sendChat(`${name}, I couldn't find anyone by the name of ${text}.`)
              sendChat(`${name}'s hug missed and went everywhere!`)
            }
          }

          

          if (cmd === 'abraza') { //                   /abraza - /hug en español
            if (text == '') {
              sendChat(`${name} abraza a nadie. u.u`);
            } else if (info(text)) {
              let input = info(text).name
              if (input == msg.p.name) {
                sendChat(`${name} abraza a el/ella mismo/a porque el/ella esta solo. u.u`);
              } else {
                sendChat(`${name} da un abrazo grande y cálido a ${input}.`);
              }
            } else {
              //sendChat(`${name}, yo no puedo buscar alguien por el nombre de ${text}.`)
              sendChat(`¡El abrazo de ${name} falló y fue a todas partes!`)
            }
          }


          if (cmd === 'poke') { //                  /poke
            if (text == '') {
              sendChat(name + ' pokes no one. :(');
            } else if (info(text)) {
              let input = info(text).name
              if (input == msg.p.name) {
                sendChat(`You can't poke yourself! XD`);
              } else {
                sendChat(name + ' pokes ' + input + '.');
              }
            } else {
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }


          if (cmd === "grouphug") { //              /grouphug
            sendChat(name + ' gives everyone a big warm hug! *aww*')
          }


          if (cmd === 'screech') { //               /screech
            if (text == '') {
              sendChat(name + ' screeches the air... I don\'t know how.');
            } else if (info(text)) {
              let input = info(text).name
              if (text == msg.p.name) {
                sendChat(name + ' screeches themselves... I don\'t know how.');
              } else {
                sendChat(name + ' screeches ' + input + '. *screeeech*');
              }
            } else {
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }
          


          if (cmd === 'lick') { //                  /lick
            if (text == '') {
              sendChat(name +
                       " couldn't find anything to lick, so they licked the wall.");
            } else if (info(text)) {
              let input = info(text).name
              if (text == name) {
                sendChat(name + " licks themselves. I don't want to know where.");
              } else {
                sendChat(name + ' licks ' + input + '.');
                sendChat(input + ' revolts in disgust.');
              }
            } else {
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }


          if (cmd === 'slap') { //                  /slap
            if (text == '') {
              sendChat(name +
                       " slaps the air.");
            } else if (info(text)) {
              let input = info(text).name
              if (input == name) {
                sendChat(name + " slaps themselves. I don't want to know where.");
              } else {
                sendChat(name + ' slaps ' + input + '.');
                sendChat(input + ' revolts in disgust.');
              }
            }
          }


          if (cmd === 'kill') { //                                  /kill someone.
            if (text == '') {
              sendChat(`${name} attempts to stab the air, somehow misses, and lands on their foot. `)
              sendChat(`${name} screams in pain.`);
            } else if (info(text)) {
              let input = info(text).name
              if (input == name) {
                sendChat(name + ' commits suicide! :(');
              } else {
                sendChat(name +' kills ' + input +' with scissors. ')
                sendChat(input + ' screams in pain.');
              }
            } else {
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }

          if (cmd === 'mato') { //                                  /mato - /kill in Spanish
            if (text == '') {
              sendChat(`${name} trata apuñalar el aire, falla de algún modo, y se cae el pie.`)
              sendChat(`${name} grita en dolor.`);
            } else if (info(text)) {
              let input = info(text).name
              if (input == name) {
                sendChat(`¡${name} se suicida! :(`);
              } else {
                sendChat(name +' mata a ' + input +' con tijera(s). ')
                sendChat(input + ' grita en dolor.');
              }
            } else {
              sendChat(`${name}, yo no puedo buscar alguien por el nombre de ${text}`)
            }
          }


          if (cmd === "die") { //              /die
            sendChat(name + ' dies. X_X')
          }

          if (cmd === "muero") { //              /muero
            sendChat(name + ' muere. X_X')
          }


          if (cmd === 'highfive') { //                 Give a /highfive to someone
            if (text == '') {
              sendChat(`${name} high-fives no one.`);
            } else if (info(text)) {
              let input = info(text).name
              if (input == msg.p.name) {
                sendChat(`You can't high-five yourself! XD`);
              } else {
                sendChat(name + ' high-fives ' + input + '.');
              }
            } else {
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }


          if (cmd === 'cuddle') { //                /cuddle
            if (text == '') {
              sendChat(name + ' cuddles no one.');
            } else if (info(text)) {
              let input = info(text).name
              if (input == msg.p.name) {
                sendChat(`You can't cuddle yourself! XD`);
              } else {
                sendChat(name + ' cuddles ' + input + '.');
              }
            } else {
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }


          if (cmd === "party") { //                                  Host a /party
            if (text == '') {
              sendChat(`${name} is hosting a party!`)
            } else {
              sendChat(`${name} is hosting a party ${text}!`)
            }
          }

          if (cmd === "fiesta") { //                           Ofrecer una /fiesta
            if (text == '') {
              sendChat(`¡${name} esta ofreciendo una fiesta!`)
            } else {
              sendChat(`¡${name} esta ofreciendo una fiesta ${text}!`)
            }
          }

          if (cmd === 'applaud') { //                                     /applaud
            sendChat(name + ' applauds!')
          }

          if (cmd === 'facepalm') { //                                   /facepalm
            sendChat(name + ' facepalms.')
          }


          if (cmd === "meow") { //              /meow
            sendChat(name + ' meows. ^w^')
          }
          
          
          
          
          
          
          
          
          
          
          if (cmd === 'say') { //                   /say
            sendChat('\u034F' + text)
          }

          if (cmd === 'unicode') {

            sendChat('Spanish letters, upside down ?!, quotes, and script a: '+
                     'ɑáéíóúýäëïöüÿñÁÉÍÓÚÝÄËÏÖÜÑ¿¡‘’“”‹›«»')

          }

          if (cmd === 'fancy') {
            sendChat(text.replace(/(\b\w+\b)/igm, "\u0e56\u06e3\u06dc$1"))
          }

          if (cmd === 'bw_classic' || cmd === 'reverse_classic' || cmd === 'backward_classic' || cmd === 'backwards_classic') {
            sendChat('\u034F' + reverseString(text) )
          }

          if (failures.text == false) {

            if (cmd === 'fw' || cmd === 'fullwidth' || cmd === 'big') {
              sendChat(ASCIItoFW(text));
            }

            if (cmd === 'bw' || cmd === 'reverse' || cmd === 'backward' || cmd === 'backwards') {
              //sendChat(text.replace(/([\uD800-\uDBFF])([\uDC00-\uDFFF])/g, "$2$1").split("").reverse().join(""))
              sendChat(newReverse(text))
            }

            if (cmd == `flip` || cmd == `upsidedown`) {
            	sendChat(upsideDown(text))
            }

            if (cmd == `namegen`) {
            	if (!args[0]) {
            		sendChat(`Here's your generated name: ${nameGen()}`)
            	}
            	else if (parseInt(args[0]) != parseFloat(args[0])
            	|| parseInt(args[0]) < 1) {
            		sendChat(`Invalid amount.`)
            	}
            	else {
            	sendChat(`Here's your generated name${parseInt(args[0]) > 1? `s` : ``}: ${multiNameGen(parseInt(args[0])).join(`, `)}`)
            	}
            }

            if (cmd === 'encode') { //                /encode text into Base64
              try {
                sendChat(btoa(text))
              } catch (err) {
                sendChat(`Your text consists of characters outside the Latin-1 range, which I cannot encode.`)
              }
            }

            if (cmd === 'decode') { //                /decode text from Base64
              try {
                sendChat(atob(text))
              } catch (err) {
                sendChat(`It looks like that isn't proper base64, ${name}.`)
              }
            }

            if (cmd === 'bin') { //                   /
              sendChat(encode(text, 2))
            }
            if (cmd === 'unbin') { //                 /
              sendChat(decode(text, 2))
            }

            if (cmd === 'oct') { //                   /
              sendChat(encode(text, 8))
            }
            if (cmd === 'unoct') { //                 /
              sendChat(decode(text, 8))
            }

            if (cmd === 'dec') { //                   /
              sendChat(encode(text, 10))
            }
            if (cmd === 'undec') { //                 /
              sendChat(decode(text, 10))
            }

            if (cmd === 'hex') { //                   /
              sendChat(encode(text, 16))
            }
            if (cmd === 'unhex') { //                 /
              sendChat(decode(text, 16))
            }
          }
          
          
          
          
          
          
          if (cmd == `owo`) {sendChat(`uwu`)}
          if (cmd == `uwu`) {sendChat(`owo`)}
          
          if (cmd === 'boom') { //                  /boom
            if (boomTimer < boomsPerMinute || botSettings.anarchyMode == true || enableBoom == true) {
              boom(1, 1);
              forceChat("Boom!")
            } else {
              sendChat(`I'm sorry, but you can't use ${botSettings.prefix}boom right now.`)
            }
            boomTimer += 1;
            infoLine(`boomTimer`, `boomTimer set to ${boomTimer}`)
          }

          if (cmd === "dice") { //                  /dice
            if (parseInt(text) == 0 || text === '') {
              text = 6;
              infoLine(`/dice`, `No number provided, assuming a d6`)
            }
            if (isNaN(text) || parseInt(text) !== parseFloat(text)) {
              sendChat(`I'm sorry, ${name}, but “${text}” is an invalid number.`)
            } else {
              sendChat(name + ", you rolled a " + Math.floor(Math.random() * text + 1) + " out of " + text)
            }
          }

          if (cmd == `ping`) {
            var ping = Date.now() - msg.t; forceChat(`Pong! ${ping} | Thanks, Tehc`)
          }

          if (cmd === "info") { //                  /info
            if (text == '') {
              debugLine(`/info`, `no text, will grab info of sender`)
              var inputColor = new Color(msg.p.color)
              //sendChat(`name: ${name} | id: ${msg.p.id}`);
              sendChat(`_id: ${msg.p._id} | id: ${msg.p.id}`);
              sendChat(`colo(u)r: ${inputColor} (${msg.p.color})`)
              //if (msg.p._id !== gClient.getOwnParticipant()._id) {
              //  sendChat(`cursor x: ${msg.p.x} | cursor y: ${msg.p.y}`);
              //}
            } else if (info(text)) {

              let input = info(text)

              debugLine(`/info`, `found ${input.name} while searching for ${text}`)

              let input_colorName = getColorName(input.color)

              debugLine(`/info`, `got color name of ${input.color}`)

              //sendChat(`name: ${input_name}`);

              var whatToSend = `${input.name}`

              var flagDetected = false;

              if (flagTest(``, `_id`, text, 0)) {
                flagDetected = true;
                text = text.replace(`--_id`, ``)
                whatToSend += ` | _id: ${input._id}`
              }

              if (flagTest(``, `color`, text, 0) || flagTest(``, `colour`, text, 0)) {
                flagDetected = true;
                text = text.replace(`--color`, ``)
                text = text.replace(`--colour`, ``)
                whatToSend += ` | colo(u)r: ${input_colorName}`
              }

              if (flagDetected == false) {
                if (input._id === gClient.getOwnParticipant()._id) {
                  debugLine(`/info`, `${input.name} is me`)
                  sendChat(`My Info | _id: ${input._id} | id: ${input.id}`)
                }

                else {
                  debugLine(`/info`, `${input.name} isn't me`)
                  sendChat(`${input.name} | _id: ${input._id} | id: ${input.id}`);
                }

                sendChat(`color: ${input_colorName} (${input.color})`);
              }
              //if (input._id !== gClient.getOwnParticipant()._id) {
              //  sendChat(`cursor x: ${input.x} | cursor y: ${input.y}`);
              //}
            }
            else {
              debugLine(`/info`, `couldn't find the requested player`)
              sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
            }
          }

          if (cmd === 'quote') { //                 /
            var textArray = [
              'Life is like riding a bicycle. To keep your balance, you must keep moving.',
              'Excuses are only attempts to explain failure.',
              'Sometimes, people are beautiful. Not in looks. Not in what they say. Just in what they are.',
              'If you dont know where you are going, any road will take you there',
              'It is better to get hurt by the truth than comforted with a lie.',
              'Where there is love there is life.',
              'Of all sad words of tongue or pen, the saddest are these; It might have been.',
              '\'It\'s impossible,\' said Pride. \'It\'s risky,\' said Experience. \'It\'s pointless,\' said Reason. \'Give it a try...,\' whispered The Heart',
              'Some day, everything will make perfect sense. So for now, laugh at the confusion, smile through the tears, and keep reminding yourself everything happens for a reason',
              'The secret to happiness is not to do what makes you happy, its to be happy doing what you\'re already doing.',
              'It is sad when someone you know becomes someone you knew.',
              'The best and most beautiful things in the world cannot be seen or even touched, they must be felt with the heart.',
              'I do believe that if you haven\'t learnt about sadness, you cannot appreciate happiness.',
              'Crying is cleansing. There is a reason for tears, happiness or sadness.',
              'It is during our darkest moments that we must focus to see the light.',
              'There are two things to keep in mind when you are an old man: always take advantage of a hard-on, and never trust a fart °-°',
              'Don\'t wish what you can do!',
              'People say nothing rhymes with Orange, this is false. Nothing and Orange do not rhyme. (English word ordering and syntax is funny :D)',
              'If you try to fail, but succeed, which one have you done?'
            ];
            var randomNumber = Math.floor(Math.random() * textArray.length);
            sendChat(textArray[randomNumber])
          }

          if (cmd === 'funnyquote') { //            /
            var textArray = [
              'Someone got hit by a can on the head. They were lucky, as it was a SoftDrink.',
              'Welcome the weirdness, it\'s yours, use it',
              'I wanna make a jigsaw puzzle that\'s 40,000 pieces. And when you finish it, it says go outside.',
              'I haven\'t spoken to my wife in years. I didn\'t want to interrupt her.',
              'Always remember that you are absolutely unique. Just like everyone else.',
              'Alright everyone, line up alphabetically according to your height.',
              'A lot of people are afraid of heights. Not me, I\'m afraid of widths.',
              'My fake plants died because I did not pretend to water them.',
              'My grandmother started walking five miles a day when she was sixty. She\'s ninety-seven now, and we dont know where the hell she is.',
              'A day without sunshine is like, you know, night.',
              'A successful man is one who makes more money than his wife can spend. A successful woman is one who can find such a man',
              'I\'m super lazy today!!! Which is like normal lazy but I\'m also wearing a cape...',
              'Lasagna is basically spaghetti flavored cake.',
              'My wife told me the other day that I don\'t take her to expensive places any more, so I took her to the gas station.',
              'Chuck Norris can blow bubbles with chewing tobacco',
              'On a scale of 1 to 10, what\'s your favorite color of the alphabet?'
            ]; //â€™
            var randomNumber = Math.floor(Math.random() * textArray.length);
            sendChat(textArray[randomNumber])
          }

          if (cmd === 'grammar') { //               /
            var textArray = [
              '[Grammar Nazi] “Alot” is not a word',
              '[Grammar Nazi] “There” is a noun meaning “a place that is not here”. “Their” is an adjective, used when something belongs to “them”. “They\'re” is a contraction, short for “they are”.',
              '[Grammar Nazi] “It\'s” is a contraction for “it is”. “Its” is used whenever “it” possesses something.',
              '[Grammar Nazi] Use the word “an” when the next word has a vowel sound, with a few exceptions like “utopia” which has a “Y” sound.',
              '[Grammar Nazi] Don\'t add an apostrophe when the word is a plural — unless the plural\'s of an initialism, where the apostrophe usage is almost universally accepted, like in “P\'s and Q\'s”.',
              '[Grammar Nazi] Let\'s eat grandma... I meant “Let\'s eat, grandma”. Lesson learned: Don\'t eat grandma and put a comma.',
              '[Grammar Nazi] “Attain” means “reach”, and “obtain” means “get.” You attain a mountaintop, but obtain a rare baseball card.',
              '[Grammar Nazi] “As of yet” is a windy and pretentious substitute for plain old English “yet” or “as yet”, an unjustified extension of the pattern in sentences like “as of Friday the 27th of May”.',
              '[Grammar Nazi] The casual, shortened spellings of “altho” and “tho” are not acceptable in formal or edited English. Stick with “although” and “though”.',
              '[Grammar Nazi] A “bazaar” is a market where miscellaneous goods are sold. “Bizarre”, in contrast, is an adjective meaning “strange”, “weird.”',
              '[Grammar Nazi] “Calvary”, always capitalized, is the hill on which Jesus was crucified. It means “hill of skulls”. Soldiers mounted on horseback are cavalry (not capitalized).',
              '[Grammar Nazi] In the US the barrier preventing a flood is called a “dike.” “Dyke” is a term for a type of lesbian, generally considered insulting but adopted as a label for themselves by some lesbians. Nom nom nom',
              '[Grammar Nazi] Although “dove” is a common form of the past tense of “dive”, a few authorities consider “dived” preferable in formal writing.',
              '[Grammar Nazi] An “epoch” is a long period of time, like the Pleistocene Epoch.',
              '[Grammar Nazi] Pitfall: a hidden or unsuspected danger or difficulty.',
              '[Grammar Nazi] When you shift to a new topic or activity, you segue. Many people unfamiliar with the unusual Italian spelling of the word misspell it as “segway”. This error is being encouraged by the deliberately punning name used by the manufacturers of the Segway Human Transporter.',
              '[Grammar Nazi] Tiramisù is Italian for “pick me up”, and is the name of a popular modern Italian dessert. It\'s commonly misspelled as tirimisù, which gives it a slightly Japanese air. The Japanese love tiramisù, but although they sometimes make it with green tea rather than coffee this misspelling isn\'t their fault.',
              '[Grammar Nazi] In formal fencing matches, when someone is hit by an opponent\'s sword it is traditional for the person hit to cry out “touché” (French for “touched”) to acknowledge that fact. In other contexts, we may say “touché” when somebody scores a point against us in an argument, or otherwise skewers us verbally.',
              '[Grammar Nazi] “Xmas” is not originally an attempt to exclude Christ from Christmas, but uses an abbreviation of the Greek spelling of the word “Christ” with the “X” representing the Greek letter Chi. However, so few people know this that it\'s probably better not to use this popular abbreviation in religious contexts.',
              '[Grammar Nazi] In some dialects it\'s common to say “you\'ve got a ways to go before you\'ve saved enough to buy a Miata”, but in standard English it\'s just “a way to go”.',
              '[Grammar Nazi] “Than” is a comparision, while “then” is time based.',

              // https://getpocket.com/explore/item/43-embarrassing-grammar-mistakes-even-smart-people-make
              '[Grammar Nazi] "First-come first-serve" is incorrect, as it suggests the one who serves everyone is the first who arrives, which is not the phrase\'s intent. "First-come first-served" is correct.',
              '[Grammar Nazi] "I could care less" is wrong, as it suggests you still have care possibly still allocated to the situation in question. "I couldn\'t care less" is correct as it communicates "I have no more care to give".',
              '[Grammar Nazi] "Irregardless" is not a word.',
              //'[Grammar Nazi] Using "I" as the last word in a sentence is a remarkably common mistake. Same with "Me" as the first word.',
              '[Grammar Nazi] Don\'t confuse “I” and “me” when referring to multiple people including yourself.  Slow down and consider whether, if it was just you, you\'d use “I” or “me”.',
              '[Grammar Nazi] "Shoo-in", not "shoe-in".',
              '[Grammar Nazi] It\'s either "emigrate(d) from" (e for [e]xit), or "immigrate(d) to" (i for [i]n).',
              '[Grammar Nazi] Decades, centuries, and all plurals cannot use apostrophes.',
              '[Grammar Nazi] "Homed in" (M), not "honed in" (N).',
              '[Grammar Nazi] "Bated breath", not "baited breath".',
              '[Grammar Nazi] "Whet your appetite", not "wet your appetite".',
              '[Grammar Nazi] "Make do", not "make due".',
              '[Grammar Nazi] "Due diligence", not "do diligence".',
              '[Grammar Nazi] "Piqued my interest", not "peaked my interest".',
              '[Grammar Nazi] "Must\'ve / must have", "should\'ve / should have", and "could\'ve / could have", not "must of", "should of", or "could of".',
              '[Grammar Nazi] Both "per say" and "persay" are incorrect. The Latin phrase which means "in itself" is "per se". Even so, you should probably avoid that phrase anyways to be clear and concise.',
              '[Grammar Nazi] "All of a / the sudden", not "all the sudden".',
              '[Grammar Nazi] "Year" is redundant in "first-year anniversary" and the like.',
              '[Grammar Nazi] "Unthaw" is used as a verb all the time, but know its meaning!',
              '[Grammar Nazi] "Hot" is redundant in "hot water heater". Either use "cold" or omit it.',
              '[Grammar Nazi] "Bald-face", not "boldface", in "bald-face lie".',
              '[Grammar Nazi] "Chalk it up", not "chock it up".',
              '[Grammar Nazi] "Through the wringer", not "through the ringer".',
              '[Grammar Nazi] Whether subject-verb disagreement is a grammatical error or not is up to debate, so to stay safe make sure the two agree, especially in formal writing.',
              '[Grammar Nazi] "Given free rein", not "given free reign".',
              '[Grammar Nazi] "Bud", not "butt", in "nip it in the bud".',
              '[Grammar Nazi] "Tide me over", not "tie me over".',
              '[Grammar Nazi] "Toe the line", not "tow the line".',
              '[Grammar Nazi] "Chock full", not "chalk full".',
              '[Grammar Nazi] "Throes of passion", not "throws of passion".',
              '[Grammar Nazi] "Moot point", not "mute point".',
              '[Grammar Nazi] Don\'t overuse "literally". It\'s commonly used as an exaggeration, but don\'t use it like that in formal writing.',
              '[Grammar Nazi] No X in "espresso"',
              '[Grammar Nazi] "Jibe", not "jive", in "jibe in the facts".',
              '[Grammar Nazi] Pronounciation error: Don\'t pronounce "forté" as "for-tay". It\'s pronounced "fort". Better yet, avoid it altogether.',
              '[Grammar Nazi] Pronounciation error: Pronounce "etcetera" how it\'s spelled.',
              '[Grammar Nazi] "Deep-seated", not "deep-seeded".',
              '[Grammar Nazi] "Exact revenge", not "extract revenge". Look it up if you don\'t believe me.',
              '[Grammar Nazi] "Sneak peek", not "sneak peak".',
              '[Grammar Nazi] "Bowl of cold oatmeal", not "cold bowl of oatmeal". Place word modifiers next to what they modify!',
              '[Grammar Nazi] If a word modifier is at the beginning of a sentence, put what it modifies right after the comma.',
              '[Grammar Nazi] Don\'t use quotation marks for emphasis.',
              '[Grammar Nazi] "To whom", not "to who"',

              // https://s3.wp.wsu.edu/uploads/sites/1350/2017/05/errorsRTF.txt
              // there are a lot there ^
              '[Grammar Nazi] "Hundreds", not "100\'s". 100 specifically means one hundred.',
              '[Grammar Nazi] "180 degrees away", not "360 degrees away". 360 degrees is a full circle, but 180 degrees is diametrically opposite.',
              '[Grammar Nazi] A.D. means "anno domini", which itself means "in the year of the Lord".',
              '[Grammar Nazi] "Á la", not "ála".',
              '[Grammar Nazi] Diacritics over some letters are optional in English. A diaresis (¨) can be used to break a dipthong, as in "naïve", and some words English received from other languages can be spelled with the diacritics they originally had, such as "façade" from French.',
              '[Grammar Nazi] [To 24-hour time users, you can safely disregard this one if you wish.] "AM" stands for "ante meridiem" / "before noon", and "PM" for "post meridiem", "after noon". Even though clocks label 12 noon as "12 PM", that actually means 12 midnight. The same happens with 12 AM, which means noon. Better yet, avoid those and say "12 noon" and "12 midnight".',
              '[Grammar Nazi] In formal writing, it\'s preferable to capitalize "AM" and "PM", though the lowercase variants are now common enough to be accepted in informal contexts. Also, do not omit the space before those in formal writing.',
              '[Grammar Nazi] "Abject" is always negative.',
              '[Grammar Nazi] Things are not \'able to be done\'.',
              '[Grammar Nazi] The usage of "about" in "[noun / noun phrase] is/are (all) about [something else]" is sort of abstract and should be avoided in formal English.',
              '[Grammar Nazi] People often mix up "obtuse" (90 to 180 degrees, exclusive / dull) and "abstuse" (difficult to understand).',
              '[Grammar Nazi] Academia is pronounced "ack-uh-DEEM-ee-yuh".',
              '[Grammar Nazi] In music, "a cappella" is preferred to "a capella", which is prefered to "acapella".',
              '[Grammar Nazi] "Exceed" means to break past a limit, while "accede" means "give in", "agree".',
              '[Grammar Nazi] Words adopted from foreign languages will sometimes carry their diacritics with them, as in "café".  As they get more usage in English, they lose their accents ("cafe").',//  A diaresis (¨) is used to separate dipthongs, as in "naïve".  Both of those, however, are completely optional.',
              '[Grammar Nazi] Accept / except: Just remember that the [X] in e[x]cept e[x]cludes.',
              '[Grammar Nazi] "Access" has been turned into a verb in recent times, and conservatives object to that usage.  They will, however, be good with "get access to".',
              '[Grammar Nazi] There\'s an "acks" sound at the beginning of "accessory" - "ks", not "ss".',
              '[Grammar Nazi] Don\'t confuse "-ally" suffixes with "-ly" -- "accidentally", but "independently".',
              '[Grammar Nazi] Normally, "accurate" and "precise" are rough synonyms.  But in formal / scientific usage, "[a]ccuracy" is how close to the "[a]ctual", but "pr[e]cision" is how close to [e]ach other.',
              '[Grammar Nazi] "Crossed", not "acrossed".',
              '[Grammar Nazi] "Actionable" used to refer to something that provides grounds for a legal action, but now it\'s a fancy synonym for "doable" whose usage is confusing.',
              '[Grammar Nazi] "Ad nauseam", not "ad nauseum" or "ad nausea".',
              '[Grammar Nazi] "[Ad]vertisement is abbreviated "ad" -- one D in "advertisement", one D in "ad".',
              '[Grammar Nazi] To adopt is to make an object your own, but to adapt is to change it to be better for a purpose.',
              '[Grammar Nazi] "Added" is redundant in "added bonus", as a bonus is already something additional.',
              '[Grammar Nazi] Some people will scowl at usage of "addicting" -- use "addictive" instead.',
              '[Grammar Nazi] Administer / minister: "Ad" in "administer" resembles "aid".  "Minister" as a verb requires "to" following it.',
              '[Grammar Nazi] The rare usage of "administrate" can get people scowled at -- use "administer" instead.',
              '[Grammar Nazi] Use "admission" for almost all contexts -- "admittance" refers to physical entry.',
              '[Grammar Nazi] "Adultery", not "adultry".  This one\'s very important for those who use it!',

              // Here are some NON-errors.
              // People think that these are errors, but this is actually correct usage!
              '[Grammar Nazi] Split infinitives ("to [some word(s)] [verb]") are completely okay, but preferably should only be used when alternatives don\'t sound good.',
              '[Grammar Nazi] Ending a sentence with a preposition is fine, as is beginning one with a conjunction.',
              '[Grammar Nazi] "Between", from the word\'s inception onwards, wasn\'t just used to refer to just two objects.',
              '[Grammar Nazi] Some people insist that "over" can\'t mean "more than", but that usage is regular and has been for over 1000 years.',
              '[Grammar Nazi] Happy people correctly say that they feel good, but feeling well refers to health.',
              '[Grammar Nazi] "Forward" is slightly preferred to "forwards" in formal situations, but both are fine.',
              '[Grammar Nazi] "Since" can mean "because".',
              '[Grammar Nazi] Punctuation position in quotations differ among people.  I put the punctuation inside the quotation unless it isn\'t part of it.',

              // A bunch of commonly misspelled words -- heh, even "misspell" is in this.
              '[Grammar Nazi] Commonly misspelled words starting with A: absence, abundance, accessible, accidentally, acclaim, accommodate, accomplish, accordion, accumulate, achievement, acquaintance, across, address, advertisement, aggravate, alleged, annual, apparent, appearance, argument, atheist, athletics, attendance, auxiliary',
              '[Grammar Nazi] Commonly misspelled words starting with B: badminton, balloon, barbecue, barbiturate, bargain, basically, beggar, beginning, believe, biscuit, bouillon, boundary, Britain, business',
              //'[Grammar Nazi] Commonly misspelled words starting with C: ',
              //'[Grammar Nazi] Commonly misspelled words starting with D: ',
              //'[Grammar Nazi] Commonly misspelled words starting with E: ',
              //'[Grammar Nazi] Commonly misspelled words starting with F: ',
              //'[Grammar Nazi] Commonly misspelled words starting with G: ',
              //'[Grammar Nazi] Commonly misspelled words starting with H: ',
              //'[Grammar Nazi] Commonly misspelled words starting with I: ',
              //'[Grammar Nazi] Commonly misspelled words starting with J: ',
              //'[Grammar Nazi] Commonly misspelled words starting with K: ',
              //'[Grammar Nazi] Commonly misspelled words starting with L: ',
              //'[Grammar Nazi] Commonly misspelled words starting with M: ',
              //'[Grammar Nazi] Commonly misspelled words starting with N: ',
              //'[Grammar Nazi] Commonly misspelled words starting with O: ',
              //'[Grammar Nazi] Commonly misspelled words starting with P: ',
              //'[Grammar Nazi] Commonly misspelled words starting with Q: ',
              //'[Grammar Nazi] Commonly misspelled words starting with R: ',
              //'[Grammar Nazi] Commonly misspelled words starting with S: ',
              //'[Grammar Nazi] Commonly misspelled words starting with T: ',
              //'[Grammar Nazi] Commonly misspelled words starting with U: ',
              //'[Grammar Nazi] Commonly misspelled words starting with V: ',
              //'[Grammar Nazi] Commonly misspelled words starting with W: ',
              //'[Grammar Nazi] Commonly misspelled words starting with X: ',
              //'[Grammar Nazi] Commonly misspelled words starting with Y: ',
              //'[Grammar Nazi] Commonly misspelled words starting with Z: ',

              `[Grammar Nazi] ‘To try a different tack’, not ‘to try a different tact’.`
            ]
            var randomNumber = Math.floor(Math.random() * textArray.length);
            sendChat(textArray[randomNumber])
          }

          if (cmd === "tip") { //                                             /tip
            var textArray = [
              'Tip: You can toggle sustain by pressing [Backspace].',
              'Tip: You can shift octaves by holding either [Shift], [Alt/Option], [Ctrl], or [Caps Lock].  The arrows also shift octaves.',
              'Tip: You can click on your name to change it.',
              'Tip: If another player is annoying you, you can click their name and mute their notes and/or chat.',
              'Tip: Q/Z, W/X, E/C and R/V ect.. are all an octave apart.',
              'Tip: The volume of your notes is relative to your mouse position i.e. high = quiet notes, low = loud notes. (Unless you\'re using a midi piano)',
              'Tip: If someone\'s mouse is in the bottom left that means they haven\'t moved their mouse since you\'ve connected.',
              'Tip: Multiplayer Piano works best and lags least with Google Chrome: https://www.google.com/intl/en/chrome/browser/',
              //'If you\'re on MIDI and it randomly stops working, try going to the Java control panel and removing the permission and adding it again'
            ];
            if (isNaN(Number(text)) || text == "") {
              var randomNumber = Math.floor(Math.random() * textArray.length);
              sendChat(textArray[randomNumber])
            } else {
              sendChat(textArray[Number(text)])
            }
          }

          if (cmd == `sound`) {
            debugLine(`/sound`, `sound command | ${args[0]} | ${args[1]} | ${args[2]} | ${args[3]}`)
            if (args[0] && args[0].toLowerCase() == `windows`) {
              debugLine(`/sound`, `Windows...`)
              if (args[1] && args[1].toLowerCase() == `fakes:`) {
                debugLine(`/sound`, `...fakes: ...`)
                if (args[2] && args[2].toLowerCase() == `whistler`) {
                  debugLine(`/sound`, `...Whistler...`)
                  if (args[3] && args[3].toLowerCase() == `startup`) {
                    debugLine(`/sound`, `...startup`)
                    playSound(sounds.Windows.Fakes.Whistler.startup)
                  }
                  if (args[3] && args[3].toLowerCase() == `shutdown`) {
                    debugLine(`/sound`, `...shutdown`)
                    playSound(sounds.Windows.Fakes.Whistler.shutdown)
                  }
                }
              }

              if (args[1] && args[1].toLowerCase() == `3.1`) {
                debugLine(`/sound`, `...3.1...`)
                if (args[2] && args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.w3_1.startup)
                }
                if (args[2] && args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w3_1.shutdown)
                }
              }
              if (args[1] && args[1].toLowerCase() == `95`) {
                debugLine(`/sound`, `...95...`)
                if (args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.w95.startup)
                }
                if (args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w95.shutdown)
                }
              }
              if (args[1] && args[1].toLowerCase() == `98`) {
                debugLine(`/sound`, `...98...`)
                if (args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.w98.startup)
                }
                if (args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w98.shutdown)
                }
                if (args[2].toLowerCase() == `beta`) {
                  debugLine(`/sound`, `...beta...`)
                  if (args[3].toLowerCase() == `startup`) {
                    debugLine(`/sound`, `...startup`)
                    playSound(sounds.Windows.w98.beta.startup)
                  }
                  if (args[3].toLowerCase() == `shutdown`) {
                    debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w98.beta.shutdown)
                  }
                }
              }
              if (args[1] && (args[1].toLowerCase() == `2000` || args[1].toLowerCase() == `me`)) {
                debugLine(`/sound`, `...ME/2000...`)
                if (args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.w2000.startup)
                }
                if (args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w2000.shutdown)
                }
              }
              if (args[1] && args[1].toLowerCase() == `xp`) {
                debugLine(`/sound`, `...XP...`)
                if (args[2] && args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.XP.startup)
                }
                if (args[2] && args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.XP.shutdown)
                }
              }
              if (args[1] && (args[1].toLowerCase() == `vista` || args[1].toLowerCase() == `7`)) {
                debugLine(`/sound`, `...Vista/7...`)
                if (args[2] && args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.Vista7.startup)
                }
                if (args[2] && args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.Vista7.shutdown)
                }
              }
              if (args[1] && (args[1].toLowerCase() == `8` || args[1].toLowerCase() == `8.1`)) {
                debugLine(`/sound`, `...8/8.1...`)
                if (args[2] && args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.w8.startup)
                }
                if (args[2] && args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w8.shutdown)
                }
              }
              if (args[1] && args[1].toLowerCase() == `10`) {
                debugLine(`/sound`, `...10...`)
                if (args[2] && args[2].toLowerCase() == `startup`) {
                  debugLine(`/sound`, `...startup`)
                  playSound(sounds.Windows.w10.startup)
                }
                if (args[2] && args[2].toLowerCase() == `shutdown`) {
                  debugLine(`/sound`, `...shutdown`)
                  playSound(sounds.Windows.w10.shutdown)
                }
                if (args[2] && args[2].toLowerCase() == `background`) {
                  debugLine(`/sound`, `...background`)
                  playSound(sounds.Windows.w10.background)
                }
                if (args[2] && args[2].toLowerCase() == `foreground`) {
                  debugLine(`/sound`, `...foreground`)
                  playSound(sounds.Windows.w10.foreground)
                }
                if (args[2] && args[2].toLowerCase() == `uac`) {
                  debugLine(`/sound`, `...UAC`)
                  playSound(sounds.Windows.w10.UAC)
                }
              }


              // tm!sound Windows 3.1 startup
            }
            else if (args[0] && args[0].toLowerCase() == `kde`) {
if (args[1] && args[1].toLowerCase() == `oxygen`) {
	
}
            }
            else if (args[0] && args[0].toLowerCase() == `macos`) {
            	if (args[1] && args[1].toLowerCase() == `startup`) {
            		playSound(sounds.macOS.startup)
            	}
            }
          }

          if (cmd === 'time') { //                               What /time is it?
            sendChat(new Date())
          }

          if (cmd === 'millis') { //                /
            sendChat(Number(new Date()))
          }

          if (cmd == `sandbox` || cmd == `sb`) {
          	sendChat(`> ${jsSandbox(text)}`)
          }

          if (cmd === 'interject') {
            sendChat("I'd just like to interject for a moment. What you're referring to as Linux "+
                     "is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. "+
                     "Linux is not an operating system unto itself, but rather another free component "+
                     "of a fully functioning GNU system made useful by the GNU corelibs, shell utilities "+
                     "and vital system components comprising a full OS as defined by POSIX.")

            sendChat("Many computer users run a modified version of the GNU system every day, without "+
                     "realizing it. Through a peculiar turn of events, the version of GNU which is widely "+
                     "used today is often called Linux, and many of its users are not aware that it is "+
                     "basically the GNU system, developed by the GNU Project.")

            sendChat("There really is a Linux, and these people are using it, but it is just a part of "+
                     "the system they use. Linux is the kernel, the program in the system that allocates "+
                     "the machine's resources to the other programs that you run. The kernel is an essential "+
                     "part of an operating system, but useless by itself; it can only function in the "+
                     "context of a complete operating system. Linux is normally used in combination with "+
                     "the GNU operating system —  ...")

            sendChat("...the whole system is basically GNU with Linux added, or "+
                     "GNU/Linux. All the so-called 'Linux' distributions are really distributions of GNU/Linux.")

          }

          if (cmd === 'coinflip') { //              /
            var randomNumber = random(0, 1)
            if (randomNumber <= 0.5) {
              sendChat(`${name} flipped a coin and got heads`)
            } else {
              sendChat(`${name} flipped a coin and got tails`)
            }
          }

          if ((cmd == 'request' || cmd == `suggest`)
              && (botSettings.takingRequests === true
                  || checkRank(msg.p._id) >= 2
                  ||msg.p._id == gClient.getOwnParticipant()._id)) {
            if (text === '') {
              sendChat(`Please, what would you like to ${botSettings.prefix}request for my bot?`)
            } else {
              commandRequest(name, text)
              sendChat(`I have received your request, ${name}. It might be a while before I add that feature, though.`)
            }
          }

          if (cmd == `follow`) {
            if ( flagTest(``, `off`, text, 0) ) {
              botSettings.cursorBot.followOnePerson.enable = false;
            }
            else if ( flagTest(``, `on`, text, 0) ) {
              botSettings.cursorBot.followOnePerson.enable = true;
            }
            else if ( flagTest(``, `me`, text, 0) ) {
              botSettings.cursorBot.followOnePerson._id = msg.p._id;
            }
            else if (text == '') {
              sendChat(`Argument required — either ‘--on’, ‘--off’, ‘--me’, or a player's name.`);
            }
            else if (info(text)) {
              botSettings.cursorBot.followOnePerson._id = info(text)._id
            }
            else {
              sendChat(`Invalid input or couldn't find player: ${text}`)
            }
          }

          if (cmd === 'settings') {

            if (args[0] == 'saveall') {
              if (msg.p._id === gClient.getOwnParticipant()._id) {
                botDefaults.cursorBot.ballOnString.mass = botSettings.cursorBot.ballOnString.mass;
                botDefaults.cursorBot.ballOnString.gravity = botSettings.cursorBot.ballOnString.gravity;
                botDefaults.cursorBot.ballOnString.friction = botSettings.cursorBot.ballOnString.friction;
                botDefaults.cursorBot.bounce.Xspeed = botSettings.cursorBot.bounce.Xspeed;
                botDefaults.cursorBot.bounce.Yspeed = botSettings.cursorBot.bounce.Yspeed;
                botDefaults.cursorBot.bounce.Zspeed = botSettings.cursorBot.bounce.Zspeed;
                botDefaults.cursorBot.mode = botSettings.cursorBot.mode;

                botDefaults.itsSlashHelp = botSettings.itsSlashHelp;
                botDefaults.dadBot = botSettings.dadBot;
                botDefaults.prefix = botSettings.prefix;
                botDefaults.jsCmd = botSettings.jsCmd;
              }
              else {
                sendChat(`I'm sorry, but you can't save all settings at once.`)
              }
            }

            if (args[0] == 'resetall') {
              if (msg.p._id === gClient.getOwnParticipant()._id) {
                resetCursor();

                botSettings.itsSlashHelp = botDefaults.itsSlashHelp;
                botSettings.dadBot = botDefaults.dadBot;
                botSettings.prefix = botDefaults.prefix;
                botSettings.jsCmd = botDefaults.jsCmd;
              }
              else {
                sendChat(`I'm sorry, but you can't reset all settings at once.`)
              }
            }

            if (args[0] == 'cursorbot') {
              if (args[1] == 'set') {
                if (args[2] == 'mass') {
                  botSettings.cursorBot.ballOnString.mass = parseFloat(args[3])
                  sendChat('mass now set to ${args[3]}')
                }
                if (args[2] == 'gravity') {
                  botSettings.cursorBot.ballOnString.gravity = parseFloat(args[3])
                  sendChat('gravity now set to ${args[3]}')
                }
                if (args[2] == 'friction') {
                  botSettings.cursorBot.ballOnString.friction = parseFloat(args[3])
                  sendChat('friction now set to ${args[3]}')
                }
                if (args[2] == 'bounceXspeed') {
                  botSettings.cursorBot.bounce.Xspeed = parseFloat(args[3])
                  sendChat('bounce x speed now set to ${args[3]}')
                }
                if (args[2] == 'bounceYspeed') {
                  botSettings.cursorBot.bounce.Yspeed = parseFloat(args[3])
                  sendChat('bounce y speed now set to ${args[3]}')
                }
                if (args[2] == 'bounceZspeed') {
                  botSettings.cursorBot.bounce.Zspeed = parseFloat(args[3])
                  sendChat('bounce z speed now set to ${args[3]}')
                }
                if (args[2] == 'mode') {
                  if (args[3] == 'ballOnString') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'ballOnString'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'roughFollow') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'roughFollow'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'battlingCursor') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'battlingCursor'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'goCrazy') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'goCrazy'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'hatLastChatter') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = 'hatLastChatter'
                    sendChat('mode now set to ${args[3]}')
                  }
                  if (args[3] == 'bounce') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = `bounce`
                    sendChat(`mode now set to ${args[3]}`)
                  }
                  if (args[3] == 'bounce3d') {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = `bounce3d`
                    sendChat(`mode now set to ${args[3]}`)
                  }
                  if (args[3] == `screensaver`) {
                    botSettings.cursorBot.enable = true
                    botSettings.cursorBot.mode = `screensaver`
                    sendChat(`mode now set to ${args[3]}`)
                  }
                  if (args[3] == 'off') {
                    botSettings.cursorBot.enable = false
                  }
                }
              }
              if (args[1] == 'get') {
                if (args[2] == 'mass') {
                  sendChat(botSettings.cursorBot.ballOnString.mass)
                }
                if (args[2] == 'gravity') {
                  sendChat(botSettings.cursorBot.ballOnString.gravity)
                }
                if (args[2] == 'friction') {
                  sendChat(botSettings.cursorBot.ballOnString.friction)
                }
                if (args[2] == `mode`) {
                  sendChat(botSettings.cursorBot.mode);
                }
                if (args[2] == 'bounceXspeed') {
                  sendChat(botSettings.cursorBot.bounce.Xspeed)
                }
                if (args[2] == 'bounceYspeed') {
                  sendChat(botSettings.cursorBot.bounce.Yspeed)
                }
                if (args[2] == 'bounceZspeed') {
                  sendChat(botSettings.cursorBot.bounce.Zspeed)
                }
              }
              if (args[1] == 'reset') {
                if (args[2] == 'all') {
                  resetCursor();
                  sendChat(`all cursor bot settings reset`)
                }
                if (args[2] == 'mass') {
                  botSettings.cursorBot.ballOnString.mass = botDefaults.cursorBot.ballOnString.mass;
                  sendChat(`mass reset to ${botSettings.cursorBot.ballOnString.mass}`)
                }
                if (args[2] == 'gravity') {
                  botSettings.cursorBot.ballOnString.gravity = botDefaults.cursorBot.ballOnString.gravity;
                  sendChat(`gravity reset to ${botSettings.cursorBot.ballOnString.gravity}`)
                }
                if (args[2] == 'friction') {
                  botSettings.cursorBot.ballOnString.friction = botDefaults.cursorBot.ballOnString.friction;
                  sendChat(`friction reset to ${botSettings.cursorBot.ballOnString.friction}`)
                }
                if (args[2] == 'bounceXspeed') {
                  botSettings.cursorBot.bounce.Xspeed = botDefaults.cursorBot.bounce.Xspeed;
                  sendChat(`bounce x speed reset to ${botSettings.cursorBot.bounce.Xspeed}`)
                }
                if (args[2] == 'bounceYspeed') {
                  botSettings.cursorBot.bounce.Yspeed = botDefaults.cursorBot.bounce.Yspeed;
                  sendChat(`bounce y speed reset to ${botSettings.cursorBot.bounce.Yspeed}`)
                }
                if (args[2] == 'bounceZspeed') {
                  botSettings.cursorBot.bounce.Zspeed = botDefaults.cursorBot.bounce.Zspeed;
                  sendChat(`bounce z speed reset to ${botSettings.cursorBot.bounce.Zspeed}`)
                }
                if (args[2] == `mode`) {
                  botSettings.cursorBot.mode = botDefaults.cursorBot.mode;
                  sendChat(`mode reset to ${botSettings.cursorBot.mode}`)
                }
              }
              if (args[1] == 'save') {
                if (args[2] == 'all') {
                  botDefaults.cursorBot.ballOnString.mass = botSettings.cursorBot.ballOnString.mass;
                  botDefaults.cursorBot.ballOnString.gravity = botSettings.cursorBot.ballOnString.gravity;
                  botDefaults.cursorBot.ballOnString.friction = botSettings.cursorBot.ballOnString.friction;
                  botDefaults.cursorBot.bounce.Xspeed = botSettings.cursorBot.bounce.Xspeed;
                  botDefaults.cursorBot.bounce.Yspeed = botSettings.cursorBot.bounce.Yspeed;
                  botDefaults.cursorBot.bounce.Zspeed = botSettings.cursorBot.bounce.Zspeed;
                  botDefaults.cursorBot.mode = botSettings.cursorBot.mode;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'mass') {
                  botDefaults.cursorBot.ballOnString.mass = botSettings.cursorBot.ballOnString.mass;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'gravity') {
                  botDefaults.cursorBot.ballOnString.gravity = botSettings.cursorBot.ballOnString.gravity;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'friction') {
                  botDefaults.cursorBot.ballOnString.friction = botSettings.cursorBot.ballOnString.friction;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'bounceXspeed') {
                  botDefaults.cursorBot.bounce.Xspeed = botSettings.cursorBot.bounce.Xspeed;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'bounceYspeed') {
                  botDefaults.cursorBot.bounce.Yspeed = botSettings.cursorBot.bounce.Yspeed;
                  sendChat(`Saved!`)
                }
                if (args[2] == 'bounceZspeed') {
                  botDefaults.cursorBot.bounce.Zspeed = botSettings.cursorBot.bounce.Zspeed;
                  sendChat(`Saved!`)
                }
                if (args[2] == `mode`) {
                  botDefaults.cursorBot.mode = botSettings.cursorBot.mode;
                  sendChat(`Saved!`)
                }
              }
            }

            if (args[0] == `itsSlashHelp`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  if (args[2] == `true`) {
                    botSettings.itsSlashHelp = true;
                    sendChat(`“It's /help” setting is now on`)
                  }
                  if (args[2] == `false`) {
                    botSettings.itsSlashHelp = false;
                    sendChat(`“It's /help” setting is now off`)
                  }
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.itsSlashHelp)
                }
                if (args[1] == `reset`) {
                  botSettings.itsSlashHelp = botDefaults.itsSlashHelp;
                  sendChat(`“It's /help” setting reset`)
                }
                if (args[1] == `save`) {
                  botDefaults.itsSlashHelp = botSettings.itsSlashHelp;
                  sendChat(`“Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set/get “It's /help”.`)
              }
            }

            if (args[0] == `dadBot`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  if (args[2] == `true`) {
                    botSettings.dadBot = true;
                    sendChat(`Dad Bot now on`)
                  }
                  if (args[2] == `false`) {
                    botSettings.dadBot = false;
                    sendChat(`Dad Bot now off`)
                  }
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.dadBot)
                }
                if (args[1] == `reset`) {
                  botSettings.dadBot = botDefaults.dadBot;
                  sendChat(`Dad Bot reset`)
                }
                if (args[1] == `save`) {
                  botDefaults.dadBot = botSettings.dadBot;
                  sendChat(`Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for my Dad Bot.`)
              }
            }

            if (args[0] == `anarchyMode`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  if (args[2] == true) {
                    botSettings.anarchyMode = true;
                    sendChat(`LET THE ANARCHY COMMENCE!`)
                  }
                  if (args[2] == false) {
                    botSettings.anarchyMode = false;
                    sendChat(`Back to a controlled, ranked system.`)
                  }
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.anarchyMode)
                }
                if (args[1] == `reset`) {
                  botSettings.anarchyMode = botDefaults.anarchyMode;
                  sendChat(`Anarchy Mode reset`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }

            if (args[0] == `prefix`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  botSettings.prefix = args[2];
                  sendChat(`Now it's ${botSettings.prefix}help and such`)
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.prefix)
                }
                if (args[1] == `reset`) {
                  botSettings.prefix = botDefaults.prefix;
                  debugLine(`resetting settings`, `botSettings.prefix set to botDefaults.prefix | is now ${botSettings.prefix}`)
                  sendChat(`Now it's ${botSettings.prefix}help and such`)
                }
                if (args[1] == `save`) {
                  botDefaults.prefix = botSettings.prefix;
                  debugLine(`saving settings`, `botDefaults.prefix set to botSettings.prefix | is now ${botDefaults.prefix}`)
                  sendChat(`Saved!`)
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }

            if (args[0] == `testsetting`) {

              if (args[1] == `set`) {
                testsetting = args[2];
                sendChat(`testsetting is now ${testsetting}`)
              }
              if (args[1] == `get`) {
                sendChat(testsetting)
              }
              if (args[1] == `reset`) {
                testsetting = testdefault;
                debugLine(`resetting settings`, `testsetting now ${testsetting}`)
                sendChat(`testsetting reset to ${testsetting}`)
              }
              if (args[1] == `save`) {
                testdefault = testsetting;
                debugLine(`saving settings`, `testdefault now ${testdefault}`)
                sendChat(`testdefault now ${testdefault}`)
              }
            }

            if (args[0] == `jsCmd`) {
              if (msg.p._id == gClient.getOwnParticipant()._id
                  || botSettings.anarchyMode == true) {
                if (args[1] == `set`) {
                  botSettings.jsCmd = args[2];
                }
                if (args[1] == `get`) {
                  sendChat(botSettings.jsCmd)
                }
                if (args[1] == `reset`) {
                  botSettings.jsCmd = botDefaults.jsCmd;
                }
                if (args[1] == `save`) {
                  botDefaults.jsCmd = botSettings.jsCmd;
                }
              } else {
                sendChat(`I'm sorry, but you can't set the settings for ${args[0]}.`)
              }
            }
            // msg.p._id === gClient.getOwnParticipant()._id

          }


          if (MPP.addons) {
            if (cmd == `brushsize`) {
              MPP.addons.draw.brushSize = parseFloat(args[0])
            }

            if (cmd == `brushcolor`) {
              MPP.addons.draw.customColor = args[0]
            }
          }

          //    ----- Conversions -----

          if (cmd === 'convert' || cmd === 'conv') {

            // args[0] is "convert from this"
            var convertFrom = args[0]

            // args[1] is "...to this"
            var convertTo = args[1]

            // args[2] is the value to convert
            var valueToConvert = args[2]



            if (convertFrom == "c") {
              if (convertTo == "f") {
                sendChat(`${valueToConvert} Celsius/Centigrade to Fahrenheit: ${omniConvert(valueToConvert, 9/5, 32, 1)}`);
              }
              if (convertTo == 'k') {
                sendChat(`${valueToConvert} Celsius/Centigrade to Kelvin: ${omniConvert(valueToConvert, 1, 273.15, 1)}`);
              }
              if (convertTo == 're') {
                sendChat(`${valueToConvert} Celsius/Centigrade to Réaumur: ${omniConvert(valueToConvert, 1, 0, 0.8)}`);
              }
              if (convertTo == 'd') {
                sendChat(`${valueToConvert} Celsius/Centigrade to Delisle: ${omniConvert(valueToConvert, -1, 100, 1.5)}`);
              }
              if (convertTo == 'ra') {
                sendChat(`${valueToConvert} Celsius/Centigrade to Rankine: ${omniConvert(valueToConvert, 1, 273/15, 9/5)}`);
              }
              if (convertTo == 'd') {
                sendChat(`${valueToConvert} Celsius/Centigrade to Newton: ${omniConvert(valueToConvert, 1, 0, 33/100)}`);
              }
              if (convertTo == 'ro') {
                sendChat(`${valueToConvert} Celsius/Centigrade to Rømer: ${omniConvert(valueToConvert, 21/40, 7.5, 1)}`);
              }
              //if (convertTo == 'old-c') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to older Celsius: ${omniConvert(valueToConvert, -1, 100, 1)}`);
              //}
            }

            if (convertFrom == "f") {
              if (convertTo == "c") {
                sendChat(`${valueToConvert} Fahrenheit to Celsius: ${omniConvert(valueToConvert, 1, -32, 5/9)}`);
              }
              //if (convertTo == 'k') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to Kelvin: ${omniConvert(valueToConvert, 1, 273.15, 1)}`);
              //}
              //if (convertTo == 're') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to Réaumur: ${omniConvert(valueToConvert, 1, 0, 0.8)}`);
              //}
              //if (convertTo == 'd') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to Delisle: ${omniConvert(valueToConvert, -1, 100, 1.5)}`);
              //}
              //if (convertTo == 'ra') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to Rankine: ${omniConvert(valueToConvert, 1, 273/15, 9/5)}`);
              //}
              //if (convertTo == 'd') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to Newton: ${omniConvert(valueToConvert, 1, 0, 33/100)}`);
              //}
              //if (convertTo == 'ro') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to Rømer: ${omniConvert(valueToConvert, 21/40, 7.5, 1)}`);
              //}
              //if (convertTo == 'old-c') {
              //  sendChat(`${valueToConvert} Celsius/Centigrade to older Celsius: ${omniConvert(valueToConvert, -1, 100, 1)}`);
              //}
            }
          }


          // all of those X_to_Y commands have obsolesced
          // replaced:
          // c to f, k, re, d, ra, n, ro




          //    ----- Potentially unsafe/buggy commands, disabled in Safe Mode -----

          if ((botSettings.safeMode == false
               || checkRank(msg.p._id) >= 2
               || msg.p._id == gClient.getOwnParticipant()._id)) {
            if (cmd === "notes") {
              playNotes(text, 100)
            }
            if (cmd === "temponotes") {
              var speed = parseInt(args[0]);
              args.shift();
              text = text.split(' ')
              text.shift();
              text = text.join(' ')
              playNotes(text, speed)
            }
            if (cmd === "advnotes") {
              var speed = parseInt(args[0]);
              args.shift();
              text = text.split(' ')
              text.shift();
              text = text.join(' ')
              advNotes(text, speed)
            }
            if (cmd === 'rage') {
              if (msg.p._id === gClient.getOwnParticipant()._id || botSettings.anarchyMode == true) {
                boom(8);
                forceChat("NNGGGGAAAAAAAAAAAAHHHHHHHHH!!!!!")
              } else {
                sendChat(`I'm sorry, but you can't use ${botSettings.prefix}rage.`)
              }
            }
            if (cmd === 'allcolors' || cmd === 'allcolours') {
              if (text === 'hexcodes' || text === 'hex') {
                sendChat(Object.values(gClient.ppl).map((user) => `${user.name} (${new Color(user.color).toHexa()})`).join(", ")+".")
              } else {
                sendChat(Object.values(gClient.ppl).map((user) => `${user.name} (${getColorName(user.color).replace("A shade of ", '')})`).join(", ")+".");
              }
            }

            /*if (cmd === botSettings.prefix + `dotstyle`) {
            sendChat(dotstyle(text))
          }*/

            if (cmd === "color" | cmd === "colour") {
              if (text == "") {
                var inputColor = getColorName(msg.p.color)
                sendChat(`${name}, you are ${inputColor}, ${msg.p.color} to be exact.`)
              } else if (pattern.test(text)) {
                if (text.length === 4) {
                  var hexColor = `#${text.charAt(1)}${text.charAt(1)}${text.charAt(2)}${text.charAt(2)}${text.charAt(3)}${text.charAt(3)}`;
                }
                else if (text.length === 3) {
                  var hexColor = `#${text.charAt(0)}${text.charAt(0)}${text.charAt(1)}${text.charAt(1)}${text.charAt(2)}${text.charAt(2)}`;
                }
                else if (text.length === 6) {
                  var hexColor = `#${text.charAt(0)}${text.charAt(1)}${text.charAt(2)}${text.charAt(3)}${text.charAt(4)}${text.charAt(5)}`;
                }
                else {
                  var hexColor = text;
                }
                var inputColor = getColorName(hexColor)
                sendChat(`${name}, ${text} is ${inputColor}.`)
              } else if (info(text)) {
                let input = info(text); console.log(`input init to info(${text}), or ${input}`)
                var inputColor = getColorName(input.color)
                sendChat(`${name}, ${input.name} is ${inputColor}, ${input.color} to be exact.`)
              } else if (info(text) === undefined) {
                sendChat(`${name}, I couldn't find anyone by the name of ${text}`)
              }
            }

            if (cmd === 'list') {
              var list = "  Connected users: ";
              for (var id in gClient.ppl) {
                if (gClient.ppl.hasOwnProperty(id)) {
                  list += ", " + gClient.ppl[id].name;
                }
              }
              list = list.substr(2);
              sendChat(list)
            }
          }
				}
			}
			else {
				if (botSettings.dadBot === true) {
          //if ( ( (args2.includes(`i'm`) )
          //     || (args2.includes(`i’m`) )
          //     || (args2.includes(`im`) )
          //     || (args2.includes(`I'm`) )
          //     || (args2.includes(`I’m`) )
          //     || (args2.includes(`Im`) )
          //     || (args2.includes(`I'M`) )
          //     || (args2.includes(`I’M`) )
          //     || (args2.includes(`IM`) ))
          //      && msg.p._id !== gClient.getOwnParticipant()._id) {
          //  sendChat(`Hi, ${args2[args2.indexOf(`I'm`)+1]}, I'm Dad.`)
          //}

          if (msg.p._id !== gClient.getOwnParticipant()._id) {
            if (args2.indexOf(`i'm`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`i’m`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`im`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`I'm`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`I’m`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`Im`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`I'M`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`I’M`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }
            else if (args2.indexOf(`IM`) == 0) {
              var restOfText = args2.shift().join(` `);
              sendChat(`Hi, ${restOfText}, I'm Dad.`)
            }



            else if (args2.includes(`i'm`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`i'm`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`i’m`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`i’m`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`im`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`im`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`I'm`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`I'm`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`I’m`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`I’m`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`Im`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`Im`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`I'M`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`I'M`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`I’M`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`I’M`)+1]}, I'm Dad.`)
            }
            else if (args2.includes(`IM`)) {
              sendChat(`Hi, ${args2[args2.indexOf(`IM`)+1]}, I'm Dad.`)
            }
          }
        }
        
        if ((args2[0] === "!help" || args2[0] === ":help" || args2[0] === ".help"
             || args2[0] === ">help" || args2[0] === "/help" || args2[0] === "\\help"
             || args2[0] === "|help" || args2[0] === "~help" || args2[0] === "@help"
             || args2[0] === "#help" || args2[0] === "$help" || args2[0] === "%help"
             || args2[0] === "^help" || args2[0] === "&help") && cmd !== "help"
            && botSettings.itsSlashHelp == true) {
          if (botSettings.power == true) {
            sendChat(`${name}${botSettings.itsSlashHelpText}`); // change to fit the text
          }
        }
				
				if (args2[0] === botSettings.jsCmd) {
          if ( (trustedUsers.includes(msg.p._id) && botSettings.safeMode === false) ||
              msg.p._id === gClient.getOwnParticipant()._id
              || botSettings.anarchyMode === true) {
            function doJS(codeToExecute) {
              try {
                sendChat('> '+eval(codeToExecute));
              }
              catch (error) {
                sendChat('[Error] ' + error);
              }
            }
            doJS(text)
          }
          else {
            sendChat(`I'm sorry, but you can't use ${botSettings.jsCmd}.`)
          }
        }
			}
			
			}
			catch (err) {
				sendChat(`error: ${err}`)
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		});

		$("#chat input").on("focus", function(evt) {
			releaseKeyboard();
			$("#chat").addClass("chatting");
			chat.scrollToBottom();
		});
		/*$("#chat input").on("blur", function(evt) {
			captureKeyboard();
			$("#chat").removeClass("chatting");
			chat.scrollToBottom();
		});*/
		$(document).mousedown(function(evt) {
			if(!$("#chat").has(evt.target).length > 0) {
				chat.blur();
			}
		});
		document.addEventListener("touchstart", function(event) {
			for(var i in event.changedTouches) {
				var touch = event.changedTouches[i];
				if(!$("#chat").has(touch.target).length > 0) {
					chat.blur();
				}
			}
		});
		$(document).on("keydown", function(evt) {
			if($("#chat").hasClass("chatting")) {
				if(evt.keyCode == 27) {
					chat.blur();
					evt.preventDefault();
					evt.stopPropagation();
				} else if(evt.keyCode == 13) {
					$("#chat input").focus();
				}
			} else if(!gModal && (evt.keyCode == 27 || evt.keyCode == 13)) {
				$("#chat input").focus();
			}
		});
		$("#chat input").on("keydown", function(evt) {
			if(evt.keyCode == 13) {
				if(MPP.client.isConnected()) {
					var message = $(this).val();
					if(message.length == 0) {
						setTimeout(function() {
							chat.blur();
						}, 100);
					} else if(message.length <= 512) {
						chat.send(message);
						$(this).val("");
						setTimeout(function() {
							chat.blur();
						}, 100);
					}
				}
				evt.preventDefault();
				evt.stopPropagation();
			} else if(evt.keyCode == 27) {
				chat.blur();
				evt.preventDefault();
				evt.stopPropagation();
			} else if(evt.keyCode == 9) {
				evt.preventDefault();
				evt.stopPropagation();
			}
		});

		return {
			show: function() {
				$("#chat").fadeIn(250);
			},

			hide: function() {
				$("#chat").fadeOut(2000);
			},

			clear: function() {
				$("#chat li").remove();
			},

			scrollToBottom: function() {
				var ele = $("#chat ul").get(0);
				ele.scrollTop = ele.scrollHeight - ele.clientHeight;
			},

			blur: function() {
				if($("#chat").hasClass("chatting")) {
					$("#chat input").get(0).blur();
					$("#chat").removeClass("chatting");
					chat.scrollToBottom();
					captureKeyboard();
				}
			},

			sendRaw: function(message) {
				gClient.sendArray([{m: 'a', message: message}])
			},

			send: function(message) {
				//gClient.sendArray([{m:"a", message: message}]);
				if (message.startsWith(`?nofont `) || message.startsWith(botSettings.prefix) || message.startsWith(botSettings.newPrefix) || message.startsWith(botSettings.jsCmd)
				|| message.startsWith(`qhy!`) || message.startsWith(`++`) || message.startsWith(`~`) || message.startsWith(`/`) || message.startsWith(`;`) || message.startsWith(`*`)) {
                    sendWithAutoBuffer(message.startsWith(`?nofont `)? message.replace(`?nofont `, ``) : message)
				}
				else if (message.startsWith(`?fullwidth `)) {
					sendWithAutoBuffer(ASCIItoFW(message.replace(`?fullwidth `, ``)))
				}
				else if (message.startsWith(`?script `)) {
					sendWithAutoBuffer(fontStyle(message.replace(`?script `, ``), `script`))
				}
				else if (message.startsWith(`?flip `)) {
					sendWithAutoBuffer(upsideDown(message.replace(`?flip `, ``)))
				}
				else if (message.startsWith(`?private `)) {
					chat.receive({a: message.replace(`?private `, ``), p: {color: `${gClient.getOwnParticipant().color}88`, name: `${gClient.getOwnParticipant().name}`}})
				}
				else if (message.startsWith(`?js `)) {
					chat.receive({a: message.replace(`?js `, `⁘→ `), p: {color: `#00aaff88`, name: `—— ⁘ ıɴput ⁘ —→`}})
					message = message.replace(`?js `, ``);
					try {
					    chat.receive({a: `${eval(message)}`, p: {color: `#00ffaa88`, name: `←— ⁘ output ⁘ ——`}})
					}
					catch (err) {
						chat.receive({a: `${err}`, p: {color: `#ff880088`, name: `—→ ⁘ eʀʀoʀ ⁘ ←—`}})
					}
				}
				else {
					sendWithAutoBuffer(`⁘ ${message.split(`b`).join(`ʙ`).split(`d`).join(`ᴅ`).split(`h`).join(`ʜ`).split(`i`).join(`ı`).split(`j`).join(`ȷ`).split(`l`).join(`L`).split(`n`).join(`ɴ`).split(`r`).join(`ʀ`)} ⁘`)
				}
			},

			receive: function(msg) {
			    
			    if (nebulaStyle == true) {
	    		    msg.a = msg.a.replace(/</g, '&lt;');
                    msg.p.name = msg.p.name.replace(/</g, '&lt;');
                    shlink = msg.a.replace(/((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function(link) {
                        stuff=link;
                        if (link.match('^https?:\/\/')) stuff=stuff.replace(/^https?:\/\//i, '')
                        else link = 'https://' + link;
    
                        return '<a target="_blank" style="text-decoration: none;" href="' + link + '">' + link + '</a>';
                    });
 
                    //  var li = $('<li><span class="name"/><span style="position: initial" class="message"/>');
                    var li = $('<li><span class="name"/><span class="message"/>');
 
                
 
                    li.find(".name").html("(" + msg.p._id + ") [" + time12HR() + "] " + msg.p.name + ":");
                    li.find(".message").text(msg.a);
                    li.css("color", msg.p.color || "white");
                    li.css("color", msg.p.color || "white");
                    var text_stuff = shlink;
                    li.find(".message").html(
                        "<span class='msg_'>" + text_stuff + "</span>"
                    );
    
                    $("#chat ul").append(li);
			    }
			    
			    
					else {
						if(gChatMutes.indexOf(msg.p._id) != -1) return;

						var li = $('<li><span class="name"/><span class="message"/>');

						li.find(".name").text(`${time24HR()} | ${narrowIDs == true? (msg.p._id? msg.p._id : `undef`).substring(0, 6) : msg.p._id} | ${msg.p.name}:`);
						
					    if (chatMode == `linked html`){
						    li.find(".message").html(linkify(msg.a));
			        }
			        else if (chatMode == `linked text`){
    				    li.find(".message").html( linkify( msg.a.replace( /</g , '&lt;' ) ) );
			        }
			        else if (chatMode == `html`) {
		    	        li.find(".message").html(msg.a)
	    		    }
	    		    else if (chatMode == `safe html`) {
	    		    	li.find(".message").html(msg.a.replace(/onerror=".*"/, ``))
	    		    }
    			    else if (chatMode == `pre`) {
			            li.find(".message").html(`<pre style="display: inline">${msg.a}</pre>`)
			        }
			        else {
			        	li.find(".message").text(msg.a)
			        }
		    		
	    			li.css("color", msg.p.color || "#deaddead");
    
	    			$("#chat ul").append(li);
    
			    	var eles = $("#chat ul li").get();
		    		for(var i = 1; i <= eles.length; i++) {
	    				eles[eles.length - i].style.opacity = 1 / i;
    				}
				    // if(eles.length > 50) {
			    	// 	eles[0].style.display = "none";
		    		// }
	    			if(eles.length > 5000) {    
    					$(eles[0]).remove();
    				}
    
    				// scroll to bottom if not "chatting" or if not scrolled up
    				if(!$("#chat").hasClass("chatting")) {
    					chat.scrollToBottom();
    				} else {
    					var ele = $("#chat ul").get(0);
    					if(ele.scrollTop > ele.scrollHeight - ele.offsetHeight - 150)
					    	chat.scrollToBottom();
		    		}
			    }
			}
		};
	})();
	
	// just gonna slot sendWithAutoBuffer() in here
	function sendWithAutoBuffer(msg) {
		if (chatBuffer.length != 0 || chatBufferAdmin.length != 0) {
			sendChat(msg)
		}
		else {
			gClient.sendArray([{m: 'a', message: msg}])
		}
	}














// MIDI

////////////////////////////////////////////////////////////////

	var MIDI_TRANSPOSE = -12;
	var MIDI_KEY_NAMES = ["a-1", "as-1", "b-1"];
	var bare_notes = "c cs d ds e f fs g gs a as b".split(" ");
	for(var oct = 0; oct < 7; oct++) {
		for(var i in bare_notes) {
			MIDI_KEY_NAMES.push(bare_notes[i] + oct);
		}
	}
	MIDI_KEY_NAMES.push("c7");

	var devices_json = "[]";
	function sendDevices() {
		gClient.sendArray([{"m": "devices", "list": JSON.parse(devices_json)}]);
	}
	gClient.on("connect", sendDevices);

	(function() {

		if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess().then(
				function(midi) {
					console.log(midi);
					function midimessagehandler(evt) {
						if(!evt.target.enabled) return;
						//console.log(evt);
						var channel = evt.data[0] & 0xf;
						var cmd = evt.data[0] >> 4;
						var note_number = evt.data[1];
						var vel = evt.data[2];
						//console.log(channel, cmd, note_number, vel);
						if(cmd == 8 || (cmd == 9 && vel == 0)) {
							// NOTE_OFF
							release(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE]);
						} else if(cmd == 9) {
							// NOTE_ON
							if(evt.target.volume !== undefined)
								vel *= evt.target.volume;
							press(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE], vel / 100);
						} else if(cmd == 11) {
							// CONTROL_CHANGE
							if(!gAutoSustain) {
								if(note_number == 64) {
									if(vel > 0) {
										pressSustain();
									} else {
										releaseSustain();
									}
								}
							}
						}
					}

					function deviceInfo(dev) {
						return {
							type: dev.type,
							//id: dev.id,
							manufacturer: dev.manufacturer,
							name: dev.name,
							version: dev.version,
							//connection: dev.connection,
							//state: dev.state,
							enabled: dev.enabled,
							volume: dev.volume
						};
					}

					function updateDevices() {
						var list = [];
						if(midi.inputs.size > 0) {
							var inputs = midi.inputs.values();
							for(var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
								var input = input_it.value;
								list.push(deviceInfo(input));
							}
						}
						if(midi.outputs.size > 0) {
							var outputs = midi.outputs.values();
							for(var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
								var output = output_it.value;
								list.push(deviceInfo(output));
							}
						}
						var new_json = JSON.stringify(list);
						if(new_json !== devices_json) {
							devices_json = new_json;
							sendDevices();
						}
					}

					function plug() {
						if(midi.inputs.size > 0) {
							var inputs = midi.inputs.values();
							for(var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
								var input = input_it.value;
								//input.removeEventListener("midimessage", midimessagehandler);
								//input.addEventListener("midimessage", midimessagehandler);
								input.onmidimessage = midimessagehandler;
								if(input.enabled !== false) {
									input.enabled = true;
								}
								if(typeof input.volume === "undefined") {
									input.volume = 1.0;
								}
								console.log("input", input);
							}
						}
						if(midi.outputs.size > 0) {
							var outputs = midi.outputs.values();
							for(var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
								var output = output_it.value;
								//output.enabled = false; // edit: don't touch
								if(typeof output.volume === "undefined") {
									output.volume = 1.0;
								}
								console.log("output", output);
							}
							gMidiOutTest = function(note_name, vel, delay_ms) {
								var note_number = MIDI_KEY_NAMES.indexOf(note_name);
								if(note_number == -1) return;
								note_number = note_number + 9 - MIDI_TRANSPOSE;

								var outputs = midi.outputs.values();
								for(var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
									var output = output_it.value;
									if(output.enabled) {
										var v = vel;
										if(output.volume !== undefined)
											v *= output.volume;
										output.send([0x90, note_number, v], window.performance.now() + delay_ms);
									}
								}
							}
						}
						showConnections(false);
						updateDevices();
					}

					midi.addEventListener("statechange", function(evt) {
						if(evt instanceof MIDIConnectionEvent) {
							plug();
						}
					});

					plug();


					var connectionsNotification;

					function showConnections(sticky) {
						//if(document.getElementById("Notification-MIDI-Connections"))
							//sticky = 1; // todo: instead, 
						var inputs_ul = document.createElement("ul");
						if(midi.inputs.size > 0) {
							var inputs = midi.inputs.values();
							for(var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
								var input = input_it.value;
								var li = document.createElement("li");
								li.connectionId = input.id;
								li.classList.add("connection");
								if(input.enabled) li.classList.add("enabled");
								li.textContent = input.name;
								li.addEventListener("click", function(evt) {
									var inputs = midi.inputs.values();
									for(var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
										var input = input_it.value;
										if(input.id === evt.target.connectionId) {
											input.enabled = !input.enabled;
											evt.target.classList.toggle("enabled");
											console.log("click", input);
											updateDevices();
											return;
										}
									}
								});
								if(gMidiVolumeTest) {
									var knob = document.createElement("canvas");
									mixin(knob, {width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: "knob"});
									li.appendChild(knob);
									knob = new Knob(knob, 0, 2, 0.01, input.volume, "volume");
									knob.canvas.style.width = "16px";
									knob.canvas.style.height = "16px";
									knob.canvas.style.float = "right";
									knob.on("change", function(k) {
										input.volume = k.value;
									});
									knob.emit("change", knob);
								}
								inputs_ul.appendChild(li);
							}
						} else {
							inputs_ul.textContent = "(none)";
						}
						var outputs_ul = document.createElement("ul");
						if(midi.outputs.size > 0) {
							var outputs = midi.outputs.values();
							for(var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
								var output = output_it.value;
								var li = document.createElement("li");
								li.connectionId = output.id;
								li.classList.add("connection");
								if(output.enabled) li.classList.add("enabled");
								li.textContent = output.name;
								li.addEventListener("click", function(evt) {
									var outputs = midi.outputs.values();
									for(var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
										var output = output_it.value;
										if(output.id === evt.target.connectionId) {
											output.enabled = !output.enabled;
											evt.target.classList.toggle("enabled");
											console.log("click", output);
											updateDevices();
											return;
										}
									}
								});
								if(gMidiVolumeTest) {
									var knob = document.createElement("canvas");
									mixin(knob, {width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: "knob"});
									li.appendChild(knob);
									knob = new Knob(knob, 0, 2, 0.01, output.volume, "volume");
									knob.canvas.style.width = "16px";
									knob.canvas.style.height = "16px";
									knob.canvas.style.float = "right";
									knob.on("change", function(k) {
										output.volume = k.value;
									});
									knob.emit("change", knob);
								}
								outputs_ul.appendChild(li);
							}
						} else {
							outputs_ul.textContent = "(none)";
						}
						var div = document.createElement("div");
						var h1 = document.createElement("h1");
						h1.textContent = "Inputs";
						div.appendChild(h1);
						div.appendChild(inputs_ul);
						h1 = document.createElement("h1");
						h1.textContent = "Outputs";
						div.appendChild(h1);
						div.appendChild(outputs_ul);
						connectionsNotification = new Notification({"id":"MIDI-Connections", "title":"Connect a MIDI device here!","duration":sticky?"-1":"4500","html":div,"target":"#midi-btn"});
					}

					document.getElementById("midi-btn").addEventListener("click", function(evt) {
						if(!document.getElementById("Notification-MIDI-Connections"))
							showConnections(true);
						else {
							connectionsNotification.close();
						}
					});
				},
				function(err){
					console.log(err);
				} );
		}
	})();














// bug supply

////////////////////////////////////////////////////////////////
	
	window.onerror = function(message, url, line) {
		var url = url || "(no url)";
		var line = line || "(no line)";
		// errors in socket.io
		if(url.indexOf("socket.io.js") !== -1) {
			if(message.indexOf("INVALID_STATE_ERR") !== -1) return;
			if(message.indexOf("InvalidStateError") !== -1) return;
			if(message.indexOf("DOM Exception 11") !== -1) return;
			if(message.indexOf("Property 'open' of object #<c> is not a function") !== -1) return;
			if(message.indexOf("Cannot call method 'close' of undefined") !== -1) return;
			if(message.indexOf("Cannot call method 'close' of null") !== -1) return;
			if(message.indexOf("Cannot call method 'onClose' of null") !== -1) return;
			if(message.indexOf("Cannot call method 'payload' of null") !== -1) return;
			if(message.indexOf("Unable to get value of the property 'close'") !== -1) return;
			if(message.indexOf("NS_ERROR_NOT_CONNECTED") !== -1) return;
			if(message.indexOf("Unable to get property 'close' of undefined or null reference") !== -1) return;
			if(message.indexOf("Unable to get value of the property 'close': object is null or undefined") !== -1) return;
			if(message.indexOf("this.transport is null") !== -1) return;
		}
		// errors in soundmanager2
		if(url.indexOf("soundmanager2.js") !== -1) {
			// operation disabled in safe mode?
			if(message.indexOf("Could not complete the operation due to error c00d36ef") !== -1) return;
			if(message.indexOf("_s.o._setVolume is not a function") !== -1) return;
		}
		// errors in midibridge
		if(url.indexOf("midibridge") !== -1) {
			if(message.indexOf("Error calling method on NPObject") !== -1) return;
		}
		// too many failing extensions injected in my html
		if(url.indexOf(".js") !== url.length - 3) return;
		// extensions inject cross-domain embeds too
		if(url.toLowerCase().indexOf("multiplayerpiano.com") == -1) return;

		// errors in my code
		if(url.indexOf("script.js") !== -1) {
			if(message.indexOf("Object [object Object] has no method 'on'") !== -1) return;
			if(message.indexOf("Object [object Object] has no method 'off'") !== -1) return;
			if(message.indexOf("Property '$' of object [object Object] is not a function") !== -1) return;
		}

		var enc = "/bugreport/"
			+ (message ? encodeURIComponent(message) : "") + "/"
			+ (url ? encodeURIComponent(url) : "") + "/"
			+ (line ? encodeURIComponent(line) : "");
		var img = new Image();
		img.src = enc;
	};









	// API
	window.MPP = {
		press: press,
		release: release,
		pressSustain: pressSustain,
		releaseSustain: releaseSustain,
		piano: gPiano,
		client: gClient,
		chat: chat,
		noteQuota: gNoteQuota,
		soundSelector: gSoundSelector,
		Notification: Notification
	};










	// record mp3
	(function() {
		var button = document.querySelector("#record-btn");
		var audio = MPP.piano.audio;
		var context = audio.context;
		var encoder_sample_rate = 44100;
		var encoder_kbps = 128;
		var encoder = null;
		var scriptProcessorNode = context.createScriptProcessor(4096, 2, 2);
		var recording = false;
		var recording_start_time = 0;
		var mp3_buffer = [];
		button.addEventListener("click", function(evt) {
			if(!recording) {
				// start recording
				mp3_buffer = [];
				encoder = new lamejs.Mp3Encoder(2, encoder_sample_rate, encoder_kbps);
				scriptProcessorNode.onaudioprocess = onAudioProcess;
				audio.masterGain.connect(scriptProcessorNode);
				scriptProcessorNode.connect(context.destination);
				recording_start_time = Date.now();
				recording = true;
				button.textContent = "Stop Recording";
				button.classList.add("stuck");
				new Notification({"id": "mp3", "title": "Recording MP3...", "html": "It's recording now.  This could make things slow, maybe.  Maybe give it a moment to settle before playing.<br><br>This feature is experimental.<br>Send complaints to <a href=\"mailto:multiplayerpiano.com@gmail.com\">multiplayerpiano.com@gmail.com</a>.", "duration": 10000});
			} else {
				// stop recording
				var mp3buf = encoder.flush();
				mp3_buffer.push(mp3buf);
				var blob = new Blob(mp3_buffer, {type: "audio/mp3"});
				var url = URL.createObjectURL(blob);
				scriptProcessorNode.onaudioprocess = null;
				audio.masterGain.disconnect(scriptProcessorNode);
				scriptProcessorNode.disconnect(context.destination);
				recording = false;
				button.textContent = "Record MP3";
				button.classList.remove("stuck");
				new Notification({"id": "mp3", "title": "MP3 recording finished", "html": "<a href=\""+url+"\" target=\"blank\">And here it is!</a> (open or save as)<br><br>This feature is experimental.<br>Send complaints to <a href=\"mailto:multiplayerpiano.com@gmail.com\">multiplayerpiano.com@gmail.com</a>.", "duration": 0});
			}
		});
		function onAudioProcess(evt) {
			var inputL = evt.inputBuffer.getChannelData(0);
			var inputR = evt.inputBuffer.getChannelData(1);
			var mp3buf = encoder.encodeBuffer(convert16(inputL), convert16(inputR));
			mp3_buffer.push(mp3buf);
		}
		function convert16(samples) {
			var len = samples.length;
			var result = new Int16Array(len);
			for(var i = 0; i < len; i++) {
				result[i] = 0x8000 * samples[i];
			}
			return(result);
		}
	})();







	// synth
	var enableSynth = false;
	var audio = gPiano.audio;
	var context = gPiano.audio.context;
	var synth_gain = context.createGain();
	synth_gain.gain.value = 0.05;
	synth_gain.connect(audio.synthGain);

	var osc_types = ["sine", "square", "sawtooth", "triangle"];
	var osc_type_index = 1;

	var osc1_type = "square";
	var osc1_attack = 0;
	var osc1_decay = 0.2;
	var osc1_sustain = 0.5;
	var osc1_release = 2.0;

	function synthVoice(note_name, time) {
		var note_number = MIDI_KEY_NAMES.indexOf(note_name);
		note_number = note_number + 9 - MIDI_TRANSPOSE;
		var freq = Math.pow(2, (note_number - 69) / 12) * 440.0;
		this.osc = context.createOscillator();
		this.osc.type = osc1_type;
		this.osc.frequency.value = freq;
		this.gain = context.createGain();
		this.gain.gain.value = 0;
		this.osc.connect(this.gain);
		this.gain.connect(synth_gain);
		this.osc.start(time);
		this.gain.gain.setValueAtTime(0, time);
		this.gain.gain.linearRampToValueAtTime(1, time + osc1_attack);
		this.gain.gain.linearRampToValueAtTime(osc1_sustain, time + osc1_attack + osc1_decay);
	}

	synthVoice.prototype.stop = function(time) {
		//this.gain.gain.setValueAtTime(osc1_sustain, time);
		this.gain.gain.linearRampToValueAtTime(0, time + osc1_release);
		this.osc.stop(time + osc1_release);
	};

	(function() {
		var button = document.getElementById("synth-btn");
		var notification;

		button.addEventListener("click", function() {
			if(notification) {
				notification.close();
			} else {
				showSynth();
			}
		});

		function showSynth() {

			var html = document.createElement("div");

			// on/off button
			(function() {
				var button = document.createElement("input");
				mixin(button, {type: "button", value: "ON/OFF", className: enableSynth ? "switched-on" : "switched-off"});
				button.addEventListener("click", function(evt) {
					enableSynth = !enableSynth;
					button.className = enableSynth ? "switched-on" : "switched-off";
					if(!enableSynth) {
						// stop all
						for(var i in audio.playings) {
							if(!audio.playings.hasOwnProperty(i)) continue;
							var playing = audio.playings[i];
							if(playing && playing.voice) {
								playing.voice.osc.stop();
								playing.voice = undefined;
							}
						}
					}
				});
				html.appendChild(button);
			})();

			// mix
			var knob = document.createElement("canvas");
			mixin(knob, {width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob"});
			html.appendChild(knob);
			knob = new Knob(knob, 0, 100, 0.1, 50, "mix", "%");
			knob.canvas.style.width = "32px";
			knob.canvas.style.height = "32px";
			knob.on("change", function(k) {
				var mix = k.value / 100;
				audio.pianoGain.gain.value = 1 - mix;
				audio.synthGain.gain.value = mix;
			});
			knob.emit("change", knob);

			// osc1 type
			(function() {
				osc1_type = osc_types[osc_type_index];
				var button = document.createElement("input");
				mixin(button, {type: "button", value: osc_types[osc_type_index]});
				button.addEventListener("click", function(evt) {
					if(++osc_type_index >= osc_types.length) osc_type_index = 0;
					osc1_type = osc_types[osc_type_index];
					button.value = osc1_type;
				});
				html.appendChild(button);
			})();

			// osc1 attack
			var knob = document.createElement("canvas");
			mixin(knob, {width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob"});
			html.appendChild(knob);
			knob = new Knob(knob, 0, 2, 0.001, osc1_attack, "osc1 attack", "s");
			knob.canvas.style.width = "32px";
			knob.canvas.style.height = "32px";
			knob.on("change", function(k) {
				osc1_attack = k.value;
			});
			knob.emit("change", knob);

			// osc1 decay
			var knob = document.createElement("canvas");
			mixin(knob, {width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob"});
			html.appendChild(knob);
			knob = new Knob(knob, 0, 5, 0.001, osc1_decay, "osc1 decay", "s");
			knob.canvas.style.width = "32px";
			knob.canvas.style.height = "32px";
			knob.on("change", function(k) {
				osc1_decay = k.value;
			});
			knob.emit("change", knob);

			var knob = document.createElement("canvas");
			mixin(knob, {width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob"});
			html.appendChild(knob);
			knob = new Knob(knob, 0, 1, 0.001, osc1_sustain, "osc1 sustain", "x");
			knob.canvas.style.width = "32px";
			knob.canvas.style.height = "32px";
			knob.on("change", function(k) {
				osc1_sustain = k.value;
			});
			knob.emit("change", knob);

			// osc1 release
			var knob = document.createElement("canvas");
			mixin(knob, {width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob"});
			html.appendChild(knob);
			knob = new Knob(knob, 0, 5, 0.001, osc1_release, "osc1 release", "s");
			knob.canvas.style.width = "32px";
			knob.canvas.style.height = "32px";
			knob.on("change", function(k) {
				osc1_release = k.value;
			});
			knob.emit("change", knob);



			var div = document.createElement("div");
			div.innerHTML = "<br><br><br><br><center>this space intentionally left blank</center><br><br><br><br>";
			html.appendChild(div);

			

			// notification
			notification = new Notification({title: "Synthesize!", html: html, duration: -1, target: "#synth-btn"});
			notification.on("close", function() {
				var tip = document.getElementById("tooltip");
				if(tip) tip.parentNode.removeChild(tip);
				notification = null;
			});
		}
	})();



	







	


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//             SHADOWOS Z BEGINS HERE
	

	
	
	var failures = {};

    failures.botMessages = false;
    try {
	    $(`body`).append(`<div id="botMessages" style="position: fixed; width: 50vw; height: 80px; bottom: 90px; right: 16px; font-size: 10px; z-index: 9007199254740992; overflow: hidden; pointer-events: none;"><ul style="height: 80px; overflow: auto;"></ul></div>`)
    }
    catch (err) {
    	botSettings.botMessageLocation = "chat"
    }
	
	//                          <RECEIVE-CHAT FUNCTIONS>
failures.receiveChat = false;
try {

  // Make me receive a private chat-line
  function receiveChat(color, name, text) {
    if (botSettings.botMessageLocation == "separate") {
        $(`#botMessages ul`).append(`<li style="color: ${color}">${time24HR()} | ${name}: ${text}</li>`)
        var ele = $("#botMessages ul").get(0)
		ele.scrollTop = ele.scrollHeight - ele.clientHeight;
    }
    else {
        chat.receive({a: text, p: {color: color, name: name}})
    }
  }


  function traceLine(name, text) {
    if (botSettings.log.trace.chat == true) {
      receiveChat(`#88888888`, name, text)
    }
    if (botSettings.log.trace.console == true) {
      console.log(`%ctrce | ${name} | ${text}`, `color: #888888`)
    }
  }


  function verboseLine(name, text) {
    if (botSettings.log.verbose.chat == true) {
      receiveChat(`#aaaaaa88`, name, text)
    }
    if (botSettings.log.verbose.console == true) {
      console.log(`%cvrbs | ${name} | ${text}`, `color: #666666`)
    }
  }


  function debugLine(name, text) {
    if (botSettings.log.debug.chat == true) {
      receiveChat(`#cccccc88`, name, text)
    }
    if (botSettings.log.debug.console == true) {
      console.log(`%cdbug | ${name} | ${text}`, `color: #444444`)
    }
  }


  function infoLine(name, text) {
    if (botSettings.log.info.chat == true) {
      receiveChat(`#bbddff88`, name, text)
    }
    if (botSettings.log.info.console == true) {
      console.log(`%cinfo | ${name} | ${text}`, `color: #004488`)
    }
  }


  function markLine(name, text) {
    if (botSettings.log.mark.chat == true) {
      receiveChat(`#ffffaa88`, name, text)
    }
    if (botSettings.log.mark.console == true) {
      console.log(`%cmark | ${name} | ${text}`, `color: #888800`)
    }
  }


  function noteLine(name, text) {
    if (botSettings.log.notification.chat == true) {
      receiveChat(`#ffddbb88`, name, text)
    }
    if (botSettings.log.notification.console == true) {
      console.log(`%cnote | ${name} | ${text}`, `color: #884400`)
    }
  }


  function warnLine(name, text) {
    if (botSettings.log.warning.chat == true) {
      receiveChat(`#ffdd2288`, name, text)
    }
    if (botSettings.log.warning.console == true) {
      console.log(`%cwarn | ${name} | ${text}`, `color: #ddbb22`)
    }
  }


  function errLine(name, text) {
    if (botSettings.log.error.chat == true) {
      receiveChat(`#ff774488`, name, text)
    }
    if (botSettings.log.error.console == true) {
      console.log(`%cfail | ${name} | ${text}`, `color: #dd5522`)
    }
  }


  function critLine(name, text) {
    if (botSettings.log.critical.chat == true) {
      receiveChat(`#ee331188`, name, text)
    }
    if (botSettings.log.critical.console == true) {
      console.log(`%ccrit | ${name} | ${text}`, `color: #dd2200; font-size: 1.1rem`)
    }
  }


  function alertLine(name, text) {
    if (botSettings.log.alert.chat == true) {
      receiveChat(`#ee220088`, name, text)
    }
    if (botSettings.log.alert.console == true) {
      console.log(`%calrt | ${name} | ${text}`, `background: #ff4422; color: #ffffff; font-size: 1.2rem`)
    }
  }


  function emerLine(name, text) {
    if (botSettings.log.emergency.chat == true) {
      receiveChat(`#bb220088`, name, text)
    }
    if (botSettings.log.emergency.console == true) {
      console.log(`%cemer | ${name} | ${text}`, `background: #ff0000; color: #ffff00; font-size: 1.5rem`)
    }
  }

  // List the functions — I need to fix this up
  function help() {

    receiveChat("#FFFFFF", "\uFFFC", ".:' :. .. .: JAVASCRIPT FUNCTIONS"+
                ":: :.: :: .:'")

    receiveChat("#FFFFFF", "Name", "nameSetting(setting, newName) setNameSuffix(text) ");

    receiveChat("#FFFFFF", "Chat", "sendChat(msg) forceChat(text) "+
                "clearBuffer()");

    receiveChat("#FFFFFF", "String",
                "findReplace(find,replace,caseSensitiveBool,string,"+
                "failsafeBool) \"string\".findReplace(find,replace,"+
                "caseSensitiveBool,failsafeBool) FWtoASCII(string) "+
                "ASCIItoFW(string) reverseString(str) encode(str,base)" +
                "decode(octBytes,base) expandHexcode(hexcode) "+
                "splitHexcode(hexcode)/*#abcdef*/ hexcodeToRGB(hexcode)" +
                "rgbToHexcode(rgbString) isSpam(text) \"string\".trim()");

    receiveChat("#FFFFFF", "Numbers", "round(number, accuracy) "+
                "random(min,max,integerBool) constructPythTriple(m,n)" +
                "factorial(num) advFactors(n) directSegment(x1,y1,x2,y2,m,n) "+
                "heronsFormula(a,b,c) twoPoint(x1,y1,x2,y2)" +
                "triangleTest(a,b,c) hypotenuse(leg1,leg2) "+
                "omniConvert(x,add,mult)");

    receiveChat("#FFFFFF", "Piano", "boom(times,vol) press(note,vol) "+
                "spam(s,d) playNotes(text,tempo)");

    receiveChat("#FFFFFF", "Bot", "setMode(mode, quietBool)/*full,safe,cmd,off*/ "+
                "setPrefix(text) moveCursor(x,y) resetCursor() kickban(id,ms)"+
                "loadPreset(settings)");

    receiveChat("#FFFFFF", "Other", "info(name) nonCoercible(val) "+
                "removeFromArray(array,value)");

  }

}
catch (err) {

  chat.send(`Couldn't load the receive-chat functions.  They won't affect you, as only I'd see them. | ${err}`)

  failures.receiveChat = err

}
//                          </RECEIVE-CHAT FUNCTIONS>



//                                 <WORD LIST>
failures.words = false;
try {
  var wordListObj = {
    "collections":[ // Synonyms for ‘collection’, including ‘collection’ itself.
      "accrual","aggregation","album","analects","anthology","array","assembly","assortment",
      "bank","batch","bouquet","bricolage","bushel",
      "clump","clutch","collection","collective","compilation","conglomeration","constellation","contribution","cumulation",
      "digest","everything","flight","florilegium",
      "garland","gathering","group","gumbo",
      "heap","herd","hoard","jumble",
      "kaleidoscope","kit", "list","lot",
      "mashup","medley","melange","menu","mine","miscellany","mishmash","mix",
      "nest","organization",
      "pack","packet","parcel","playlist","pool","potpourri",
      "range","reserve","reservoir","roll",
      "selection","set","shrewdness","spicilege","stack","stockpile","store","supply",
      "treasure","treasury","troupe","variety"
    ],

    "objects":[
      "aardvark","aardwolf","abacus","abrosaurus","acai","acapella","accelerator","accordion","account","achillobator","acorn","acoustic","acrylic","act","action","activity","actor","actress","adapter","adasaurus","addition",
      "address","adjustment","advantage","aerosteon","afrovenator","aftermath","afternoon","aftershave","afterthought","agate","age","agenda","agreement","agustinia","air","airboat","airbus","airedale","airmail","airplane",
      "airport","airship","akubra","alamosaurus","alarm","albacore","albatross","albertonykus","albertosaurus","alder","aletopelta","alfalfa","algebra","alibi","alley","alligator","allium","allosaurus","alloy","allspice",
      "almanac","almandine","almond","alpaca","alphabet","alto","aluminum","alvarezsaurus","alyssum","amaranthus","amaryllis","amazonsaurus","amber","ambert","ambulance","amethyst","amount","amphibian","amusement","anaconda",
      "anatosaurus","anchovy","andesaurus","anemone","angelfish","anger","angle","anglerfish","angolatitan","angora","animal","animantarx","anise","ankle","ankylosaurus","anorak","answer","ant","antarctopelta","anteater",
      "antelope","anthropology","antimatter","antimony","antique","antler","antlion","apartment","apatosaurus","aphid","apogee","apology","appalachiosaurus","apparatus","apparel","appeal","appendix","apple","appliance",
      "approach","approval","apricot","april","aquarius","aragon","aragosaurus","arch","archaeology","archaeopteryx","archduchess","archduke","archeology","archer","area","argon","argument","aries","aristosuchus","arithmetic",
      "armadillo","armchair","army","arrhinceratops","arrow","art","arthropod","artichoke","ash","asiago","asp","asparagus","aspen","asphalt","aster","asterisk","asteroid","astrodon","astronaut","astronomy","athlete","atlasaurus",
      "atmosphere","atom","atrociraptor","attack","attempt","attention","attic","attraction","august","aunt","aura","aurora","auroraceratops","author","authority","authorization","avatar","avenue","avocado","axolotl","azimuth",
      "babcat","baboon","backbone","background","backpack","bacon","bactrosaurus","badge","badger","bag","bagel","bagpipe","bait","baker","bakery","balance","balaur","ball","ballcap","balloon","balmoral","bambiraptor","bamboo",
      "banana","band","bandana","bandicoot","bangle","banjo","bank","banon","bar","barber","barberry","bard","barge","baritone","barnacle","barometer","baron","baroness","barracuda","baryonyx","base","baseball","basement","basil",
      "basilisk","basin","basket","basketball","bass","bassoon","bat","bath","bathroom","bathtub","battery","bay","bayberry","beach","bead","beak","beam","bean","beanie","bear","bearberry","beard","bearskin","beast","beat",
      "beaufort","beauty","becklespinax","bed","bedbug","bee","beech","beechnut","beef","beet","beetle","beginner","begonia","behavior","belief","bell","bellflower","bellusaurus","belly","belt","beluga","bench","beret","bergamot",
      "berry","beryl","beryllium","bestseller","bicycle","bike","bill","billboard","binder","biology","biplane","birch","bird","birth","birthday","bismuth","bison","bit","bite","bittersweet","blackberry","blackbird","blackcurrant",
      "bladder","blade","blanket","blarney","blender","blinker","blizzard","blob","block","bloom","blossom","blouse","blue","bluebell","boa","boar","board","boat","boater","bobcat","bobolink","bolt","bone","bongo","bonnet",
      "bonobo","bonsai","book","bookcase","booklet","boot","booth","border","borogovia","boron","bosworth","botany","bottle","bottom","bougon","boursin","bovid","bow","bowl","bowler","box","boysenberry","brace","brachiosaurus",
      "bracket","braid","brain","brake","bramble","branch","brand","brass","brazil","bread","breadfruit","break","breakfast","bream","breath","breeze","brian","brick","bridge","brie","brisket","broccoli","brochure","broker",
      "bromine","brontomerus","bronze","brook","broom","brother","brow","brownie","browser","brush","bubble","bubbler","buckaroo","bucket","buckthorn","buckthornpepperberry","budget","buffalo","buffer","buffet","bug","bugle",
      "building","bulb","bull","bumper","bun","bunny","burglar","burn","burrito","burst","bus","busby","bush","butter","buttercup","butterfly","butterkase","butternut","button","buzzard","cabbage","cabin","cabinet","caboc","cacao",
      "cactus","cadet","cadmium","cafe","cairnsmore","cake","calcium","calculator","calendula","calf","calliandra","camel","camelotia","camera","camp","can","canary","candle","candy","candytuft","canid","canidae","cannon","canoe",
      "canopy","cantaloupe","canvas","cap","capacity","caper","cappelletti","capri","capricorn","captain","caption","capybara","car","caravan","caravel","caraway","carbon","card","cardamom","cardboard","cardigan","cardinal","care",
      "caribou","carnation","carob","carol","carp","carpenter","carpet","carriage","carrot","cart","cartoon","cartwheel","carver","case","cashew","casquette","cast","castanet","cat","catamaran","catboat","catcher","caterpillar",
      "catfish","cathedral","catmint","catshark","catsup","cattle","cauliflower","cause","caution","cave","cayenne","ceder","ceiling","celery","celestite","cell","cellar","cello","celsius","cement","cemetery","cent","centaur",
      "centipede","century","cephalopod","ceramic","ceratonykus","cereal","ceres","cerise","cesium","chair","chalk","challenge","chameleon","chamomile","chance","change","channel","chanter","character","chard","charger","chartreuse",
      "chasmosaurus","chatter","chauffeur","check","cheddar","cheek","cheese","cheetah","chef","chemistry","cheque","cherry","cheshire","chess","chestnut","chevre","chickadee","chicken","chicory","child","chili","chill","chiller",
      "chime","chimpanzee","chinchilla","chip","chipmunk","chips","chive","chocolate","chokeberry","chopper","chord","christmas","chronometer","chrysanthemum","chungkingosaurus","church","cicada","cilantro","cinema","cinnamon","circle",
      "cirrus","citipati","citrine","citron","citrus","city","clam","clarinet","class","clave","clavicle","clef","clematis","clementine","clerk","click","client","climb","clipper","cloak","cloche","clock","close","closet","cloth","cloud",
      "cloudberry","clove","clover","clownfish","club","clutch","coach","coal","coast","coaster","coat","cobalt","cobbler","cobra","cobweb","cockatoo","cockroach","cocoa","coconut","cod","coelurus","coffee","coil","coin","colby","cold",
      "collar","collarbone","collard","college","collision","colony","color","colour","colossus","colt","column","columnist","comb","comet","comfort","comic","comma","composer","comte","concavenator","conchoraptor","concrete","condition","condor",
      "condorraptor","cone","coneflower","confidence","conga","conifer","conkerberry","consonant","constellation","constrictor","continent","contraption","cook","cookie","copper","coral","cord","coreopsis","coriander","cork","corleggy",
      "cormorant","corn","cornet","cornflower","cornucopia","cosmonaut","cosmos","cost","cotija","cotton","couch","cougar","cough","count","countess","country","course","court","cousin","cover","cow","cowbell","cowl","coyote","crab",
      "crabapple","crafter","crane","crate","crater","crawdad","crayfish","crayon","cream","creator","creature","credit","creek","crepe","cress","crest","crib","cricket","crime","crocodile","crocus","croissant","crop","cross","crow",
      "crowberry","crowd","crowley","crown","cruiser","crush","crustacean","cry","crystal","cub","cuckoo","cucumber","culotte","cup","cupboard","cupcake","curio","curiosity","curler","currant","currency","curtain","curve","cushion",
      "custard","cut","cuticle","cyclamen","cycle","cyclone","cylinder","cymbal","daemonosaurus","daffodil","dahlia","daisy","damselfly","dance","dancer","dandelion","danger","danthus","daphne","darkness","dart","dash","date","daughter",
      "dawn","day","dead","deal","death","debt","decade","decimal","decision","dedication","deer","deerstalker","degree","delivery","delphinium","deltadromeus","den","denim","dentist","deposit","derby","desert","desk","dessert","detail",
      "detective","devourer","dew","dewberry","diabloceratops","diadem","diagnostic","diagram","diamond","dianella","diascia","dibble","dichondra","dietician","digestion","digit","dill","dilophosaurus","dime","dimple","dinghy","dingo",
      "dinner","dinosaur","diplodocus","diploma","direction","dirigible","dirt","discovery","dish","distance","divan","dive","diver","dodo","dog","dogsled","dogwood","doll","dollar","dolomite","dolphin","domain","donkey","donut","doom",
      "door","dormouse","dosa","double","dove","dracopelta","dracorex","dragon","dragonfly","dragonfruit","drain","draw","drawbridge","drawer","dreadnought","dream","dress","dresser","drifter","drill","drink","drip","drive","driver",
      "drizzle","drop","droplet","drug","drum","dry","dryer","dryosaurus","duchess","duck","duckling","dugong","dugout","duke","dumpling","dungeon","durian","dust","eagle","ear","earl","earth","earthquake","earthworm","earwig","ease",
      "eater","echidna","echinacea","echinodon","echium","echo","eclipse","edam","edge","editor","editorial","education","eel","effect","efraasia","egg","eggnog","eggplant","egret","elbow","elderberry","element","elephant","elf","elk",
      "ellipse","elm","emery","emmental","emoji","emperor","empress","emu","end","enemy","energy","engine","engineer","english","enigmosaurus","enquiry","enthusiasm","entrance","entree","environment","eocursor","eoraptor","epoch","epoxy",
      "equinox","equipment","era","erica","erigeron","eris","ermine","error","espadrille","estimate","ethernet","eucalyptus","euphonium","eustoma","evening","event","evergreen","exception","exhaust","existence","exoplanet","expansion",
      "experience","expert","explanation","eye","eyebrow","eyelash","eyeliner","fabrosaurus","face","fact","factory","fahrenheit","failing","fairy","falcon","fall","family","fan","fang","farm","farmer","farmhouse","fascinator","father",
      "faucet","fear","feast","feather","fedora","feeling","feels","feet","felidae","femur","fender","fennel","fenugreek","fern","fernleaf","ferret","ferry","ferryboat","feta","feverfew","fiber","fibre","fibula","fiction","field","fifth",
      "fig","fight","fighter","filament","file","fin","finch","find","fine","fir","fire","firefly","fireman","fireplace","fireplant","firewall","fish","fisher","fisherman","flag","flame","flamingo","flannel","flare","flat","flavor","flax",
      "flea","flier","flight","flock","flood","floor","floss","flower","fluorine","flute","fly","flyaway","flyingfish","foam","foe","fog","fold","fontina","food","football","force","forest","forger","forgery","fork","form","forsythia",
      "fortnight","fossa","foundation","fountain","fowl","fox","foxglove","foxtail","foxtrot","fragrance","frame","freckle","freedom","freesia","freeze","freezer","freighter","freon","friction","friday","fridge","friend","frigate","fright",
      "frill","frog","front","frost","frown","fruit","fruitadens","fuchsia","fuel","fukuiraptor","fur","furniture","fuschia","galaxy","galette","galleon","galley","galliform","gallimimus","gallium","gallon","gambler","game","gander",
      "garage","garden","gardenia","gargoyle","gargoyleosaurus","garlic","garment","garnet","gas","gasoline","gasosaurus","gastonia","gate","gateway","gatsby","gauge","gaura","gazelle","gear","gecko","geese","gem","gemini","geography",
      "geology","geometry","geranium","gerbera","gerbil","germanium","ghost","ghoul","giant","gibbon","giganotosaurus","gigantoraptor","gigantspinosaurus","gilmoreosaurus","ginger","giraffatitan","giraffe","girdle","girl","giver","glade",
      "gladiolus","glass","glasses","glazer","glider","glitter","globe","globeflower","glockenspiel","glove","glue","goal","goat","gojirasaurus","gold","goldenrod","goldfish","golf","gondola","gong","goose","gooseberry","gopher",
      "gorgonzola","gorilla","gosling","gouda","gourd","governor","grade","grain","gram","grandiflora","grandparent","grape","grapple","grass","grasshopper","gravity","gray","grease","green","grenadilla","grey","griffin","grill","grin",
      "grip","ground","group","grouse","growth","gruyere","guan","guanaco","guarantee","guardian","guava","guavaberry","guide","guilty","guitar","gull","gum","guppy","gym","gymnast","hacksaw","haddock","hadrosaurus","hail","hair","haircut",
      "halibut","hall","halloumi","hallway","hamburger","hammer","hamster","handball","handbell","handle","handsaw","handspring","handstand","harbor","hardboard","hardcover","hardhat","hardware","hare","harmonica","harmony","harp",
      "harpymimus","harrier","hat","haumea","havarti","hawk","hawthorn","haze","headlight","headline","headphones","headstand","healer","health","hearing","heart","heat","heath","heather","heaven","hedge","hedgehog","height","helenium",
      "helicona","helicopter","heliotrope","helium","hell","hellebore","helmet","help","hemisphere","hen","henley","hero","heron","herring","hexagon","hibiscus","hickory","hide","hill","hip","hippodraco","hippopotamus","hiss","hisser",
      "hockey","hole","holiday","holly","hollyhock","homburg","homegrown","honesty","honey","honeycrisp","honeycup","honeydew","honeysuckle","hoodie","hoof","hook","hope","horesradish","horn","hornet","horse","hortensia","hose","hospital",
      "hosta","hotel","hound","hour","hourglass","house","houseboat","hovercraft","hoverfly","howler","hub","hubcap","huckleberry","hugger","humerus","humidity","hummingbird","humor","hunter","hurricane","hyacinth","hydrangea","hydrant",
      "hydrofoil","hydrogen","hyena","hygienic","hyssop","iberis","ice","icebreaker","icecream","icicle","icon","idea","iguana","iguanacolossus","iguanadon","iguanodon","impala","impatiens","impulse","inch","income","increase","index",
      "indigo","individual","industry","infinity","ink","innocent","innovation","insect","inspiration","intelligence","interest","iodine","iridium","iris","iron","ironclad","island","isthmus","ixia","ixora","jaborosa","jackal","jacket",
      "jackfruit","jackrabbit","jade","jaguar","jam","jar","jasmine","jasper","jaw","jaxartosaurus","jay","jeep","jelly","jellyfish","jersey","jester","jet","jewel","jingle","jitterbug","jobaria","jodhpur","joggers","join","joke","jonquil",
      "journey","judge","judo","juice","jujube","jumbo","jump","jumper","jumpsuit","juniper","jupiter","juravenator","jury","justice","jute","kale","kangaroo","kayak","keeper","ketch","ketchup","kettle","kettledrum","key","keyboard",
      "khaan","kick","kicker","kidney","kileskus","kilogram","kilometer","king","kingfisher","kip","kiss","kitchen","kite","kitten","kitty","kiwi","knave","knee","knife","knight","knot","knuckle","koala","koi","kookaburra","kosmoceratops",
      "krill","krypton","kryptops","kumquat","laborer","lace","lady","ladybug","lake","lamb","lamp","lamprey","lan","lancer","land","language","lantana","lantern","larch","lark","larkspur","lasagna","laser","latency","lathe","laugh",
      "launch","laundry","lavender","law","lawyer","layer","lead","leader","leaf","learning","leather","leech","leek","legal","legend","legume","lemming","lemon","lemonade","lemongrass","lemur","lens","lentil","leo","leopard","leopon",
      "leotard","leptoceratops","letter","lettuce","level","libra","library","license","licorice","lifeboat","lift","lifter","light","lighter","lightning","lightyear","lilac","lillipilli","lily","limburger","lime","limit","limpet","line",
      "linen","lingonberry","link","linseed","lint","lion","lip","lipstick","liquid","list","literature","litter","liver","lizard","llama","loaf","loan","lobe","lobster","lock","locket","locust","lodge","log","loganberry","longan",
      "longship","look","lord","lotus","louse","lumber","lunaria","lunch","lung","lunge","lungfish","lupin","lute","lychee","lycra","lynx","lyre","lyric","macadamia","macaroni","macaroon","macaw","machine","mackerel","macrame","magazine",
      "magic","magician","magnesium","magnolia","magnosaurus","magpie","mahogany","maiasaura","mail","mailbox","mailman","maize","makemake","makeup","mall","mallet","mallow","mambo","mammal","manager","manatee","manchego","mandarin",
      "mandevilla","mandible","mandolin","mandrill","mango","mangosteen","manicure","manta","mantis","manuscript","manx","map","maple","mapusaurus","maraca","marble","march","mare","margin","marigold","marimba","marionberry","marjoram",
      "market","marlin","marmoset","marmot","marquess","marquis","mars","marscapone","marshmallow","marsupial","marten","mascara","mask","mass","mastodon","mat","match","math","maxilla","may","mayflower","mayonnaise","meadow","meadowlark",
      "meal","measure","meat","mechanic","medicine","medusaceratops","meerkat","meeting","megalosaurus","megaraptor","melody","melon","memory","menu","mercury","message","metacarpal","metal","metatarsal","meteor","meteorite","meteoroid",
      "meteorology","meter","methane","mice","microceratops","microraptor","microwave","middle","midnight","mile","milk","milkshake","millennium","mimosa","mind","mine","minibus","mink","minnow","minotaurasaurus","mint","minute","mirror",
      "mist","mistake","mitten","moat","mochi","mockingbird","modem","mojoceratops","mole","molecule","mollusk","molybdenum","monarch","monday","money","mongoose","monitor","monkey","month","moon","moonflower","moonstone","moose","morning",
      "morocco","mortarboard","mosquito","moss","moth","motion","motorcycle","mountain","mouse","mousepad","moustache","mouth","move","mozzarella","muenster","mulberry","mule","mum","munchkin","muscari","muscle","muse","museum","mushroom",
      "music","musician","muskmelon","muskox","mustang","mustard","myrtle","myth","nail","name","nannyberry","nape","napkin","naranja","narcissus","narwhal","nasturtium","nation","nautilus","navy","nebula","nectarine","need","neem",
      "neighbor","neighborhood","nemophila","neon","nephew","neptune","nerine","nerve","nest","net","network","newsboy","newsprint","newsstand","newt","nickel","niece","nigella","night","nightingale","nightshade","ninja","nitrogen","node",
      "noise","noodle","nose","note","notebook","notify","nova","novel","november","number","numeric","nurse","nut","nutmeg","nutria","nyala","nylon","nymphea","oak","oatmeal","objective","oboe","observation","observatory","ocarina",
      "occupation","ocean","ocelot","ocicat","octagon","octave","october","octopus","odometer","offer","office","ogre","oil","okapi","okra","olive","olivine","omelet","onion","onyx","opal","open","opera","operation","ophthalmologist",
      "opinion","opossum","opportunity","option","orange","orangutan","orbit","orca","orchestra","orchid","order","oregano","organ","organization","origami","oriole","ornament","ostrich","othnielia","otter","ounce","output","outrigger",
      "oval","overcoat","oviraptor","owl","owner","ox","oxygen","oyster","ozraraptor","package","packet","paddleboat","page","pail","paint","painter","pair","pajama","palladium","palm","pamphlet","pan","panama","pancake","pancreas","panda",
      "paneer","pangolin","pansy","panther","pantry","pantydraco","papaya","paper","paperback","paprika","papyrus","parade","paradox","parakeet","parallelogram","paranthodon","parcel","parent","parenthesis","park","parka","parmesan",
      "parrot","parrotfish","parsley","parsnip","part","particle","partner","partridge","party","passbook","passenger","passionfruit","passive","pasta","paste","pastry","patch","patella","path","patient","patio","paw","pawpaw","payment",
      "pea","peace","peach","peacock","peak","peanut","pear","pearl","pecorino","pedestrian","pediatrician","pegasus","pelican","pen","penalty","pencil","pendulum","penguin","pentaceratops","pentagon","peony","people","pepper",
      "pepperberry","perch","perfume","peridot","perigee","period","periodical","peripheral","periwinkle","persimmon","pest","pet","petalite","petroleum","petunia","pewter","phalange",
      "pharaoh","pheasant","philodendron","philosophy","phlox","phone","phosphorus","physician","piano","piccolo","pick","pickle","picture","pie","pig","pigeon","pigment","pike","pillow","pilot","pin","pincushion","pine","pineapple","ping",
      "pink","pint","pipe","piper","piranha","pirate","pisces","pixie","pizza","place","plain","planarian","plane","planet","plant","plantain","plaster","plastic","plate","platinum","platypus","play","player","playground","playroom",
      "pleasure","plier","plot","plough","plow","plum","plume","pluto","plutonium","plywood","pocket","podium","poet","poinsettia","point","poison","polish","politician","polka","polo","polonium","polyanthus","polyester","pomegranate",
      "pomelo","pond","pony","popcorn","poppy","poppyseed","porch","porcupine","porkpie","porpoise","port","porter","position","possum","postage","postbox","pot","potassium","potato","potential","poultry","pound","powder","power",
      "practice","pram","prawn","preface","prepared","pressure","price","primrose","primula","prince","princess","principal","principle","print","printer","process","produce","product","production","professor","profit","promise",
      "promotion","property","prose","prosecution","protest","protoceratops","protocol","provelone","prune","pruner","psychiatrist","psychology","ptarmigan","puck","pudding","pufferfish","puffin","pull","pullover","pulsar","puma","pump",
      "pumpkin","punch","punishment","puppet","puppy","purchase","purple","purpose","push","pyjama","pyramid","pyrite","pyroraptor","python","quail","quality","quark","quart","quarter","quartz","quasar","queen","quesadilla","question",
      "quicksand","quiet","quill","quilt","quince","quit","quiver","quokka","quotation","rabbit","raccoon","racer","raclette","radar","radiator","radio","radish","radium","radius","radon","raft","ragamuffin","ragdoll","rail","railway",
      "rain","rainbow","raincoat","rainforest","rainstorm","raisin","raja","rake","rambutan","random","range","ranunculus","raptor","raptorex","rat","rate","rattlesnake","raven","raver","ravioli","ray","rayon","reaction","reading","reaper"
      ,"reason","receipt","recess","record","recorder","red","redcurrant","regnosaurus","reindeer","relation","relative","relish","reminder","repair","replace","reply","report","reptile","request","resistance","resolution","resonance",
      "respect","responsibility","rest","restaurant","result","revolve","reward","rhinoceros","rhodium","rhubarb","rhythm","rib","rice","ricotta","riddle","ridge","rifle","ring","ringer","rise","risk","river","riverbed","road","roadrunner",
      "roadway","roar","roarer","roast","robe","robin","rock","rocket","rodent","roll","romano","rondeletia","roof","rook","room","rooster","root","roquefort","rose","rosehip","rosemary","rotate","roundworm","route","router","rover",
      "rowboat","rubidium","ruby","rudbeckia","rugby","rule","rumba","run","runner","rutabaga","safflower","saffron","saga","sage","sagittarius","saguaro","sail","sailboat","sailfish","sailor","salad","salamander","salary","sale",
      "salesman","salmon","salmonberry","salsa","salt","saltasaurus","salto","saltopus","salute","samba","sand","sandal","sandalwood","sandpaper","sandwich","santanaraptor","sapphire","sarahsaurus","sardine","sassafras","satellite",
      "satin","saturday","saturn","saturnalia","sauce","sauroposeidon","save","saver","savory","saw","sawfish","saxophone","scabiosa","scaffold","scale","scallion","scallop","scapula","scar","scarecrow","scarer","scarf","scene","scent",
      "sceptre","school","schooner","science","scilla","scion","scissor","scooter","scorpio","scorpion","scourge","scowl","scraper","screen","screw","screwdriver","scribe","script","sea","seagull","seahorse","seal","seaplane","search",
      "seashore","season","seat","seatbelt","second","secretary","secure","sedum","seed","seeder","seeker","seer","seismosaurus","selenium","sense","september","serpent","servant","server","sesame","session","settee","shad","shade",
      "shadow", // Oh, look.  ‘Shadow’ is in here.
      "shake","shaker","shallot","shame","shampoo","shamrock","shape","share","shark","shawl","shear","sheep","sheet","shelf","shell","sherbet","shield","shift","shingle","ship","shirt","shock","shoe","shoemaker","shop","shoulder","shovel",
      "show","shrew","shrimp","shrine","shroud","side","sidecar","sidewalk","sight","sign","silence","silene","silica","silicon","silk","silkworm","silver","silverfish","sing","singer","single","singularity","sink","situation","skate",
      "skateboard","ski","skiff","skink","skipjack","skirt","skull","skunk","sky","slash","slayer","sled","sleep","sleet","slice","slicer","slime","slip","slipper","sloop","slope","sloth","slouch","slug","smartphone","smash","smell",
      "smelt","smile","smoke","snagglefoot","snail","snake","snap","snapdragon","snapper","snarl","sneeze","sneezeweed","snickerdoodle","snipe","snout","snow","snowboard","snowdrop","snowflake","snowman","snowplow","snowshoe","snowstorm",
      "soap","soapwort","soarer","soccer","society","sociology","sock","socks","soda","sodalite","sodium","sofa","softball","soil","soldier","sole","sombrero","somersault","son","song","soprano","sorrel","sort","soul","sound","soup",
      "source","soursop","sousaphone","sovereign","soy","soybean","space","spade","spaghetti","spandex","spark","sparrow","spatula","spear","specialist","spectacles","spectrograph","spectroscope","spectrum","speedboat","speedwell","spell",
      "sphere","sphynx","spice","spider","spike","spinach","spinosaurus","spirit","splash","spleen","split","sponge","spoon","spoonbill","spot","spring","sprint","sprite","sprout","spruce","spur","spy","square","squash","squid","squirrel",
      "stag","stage","staircase","stallion","stamp","star","starburst","starfish","starflower","stargazer","station","statistic","stay","stealer","steam","steed","steel","stegosaurus","stem","step","sternum","stetson","stew","stick",
      "stilton","sting","stinger","stingray","stitch","stoat","stock","stocking","stomach","stone","stool","stop","stoplight","store","stork","storm","story","stove","strand","stranger","straw","strawflower","stream","street","streetcar",
      "stretch","string","structure","study","sturgeon","stygimoloch","submarine","substance","subway","success","suede","sugar","suggestion","suit","sulfur","sumac","summer","sun","sundae","sunday","sundial","sunfish","sunflower",
      "sunscreen","sunset","sunshine","sunspot","sunstone","supermarket","supernova","supply","surf","surfboard","surgeon","surprise","sushi","swallow","swamp","swan","sweater","sweatpants","sweatshirt","swift","swim","swing","switch",
      "swoop","sword","swordfish","swordtail","sycamore","syringa","syrup","system","syzygy","table","tablecloth","tabletop","tachometer","tadpole","tail","tailor","taker","taleggio","talk","talon","talos","tamarillo","tamarind","tang",
      "tangelo","tangerine","tango","tank","tanker","tapir","tarantula","tarascosaurus","target","tarn","tarp","tarragon","tarsal","tarsier","tartan","taste","taurus","tax","taxi","taxicab","tea","teacher","teal","team","technician",
      "technosaurus","teeth","telephone","telescope","television","teller","tellurium","temper","temperature","temple","tempo","tendency","tennis","tenor","tent","termite","tern","terrier","territory","text","textbook","texture","theater",
      "theory","thief","thimbleberry","thing","thistle","thorium","thorn","thought","thread","thrill","throat","throne","thrush","thumb","thunbergia","thunder","thursday","thyme","tiara","tibia","tick","ticket","tie","tiger","tiglon",
      "tilapia","tile","timbale","time","timer","timimus","timpani","tin","tip","tire","titanium","titanoceratops","titanosaurus","tithonia","title","toad","toast","toaster","tomato","ton","toothbrush","toothpaste","top","topaz","toque",
      "tornado","torta","tortellini","tortoise","tote","toucan","touch","tourmaline","tower","town","toy","track","tracker","tractor","trade","trader","traffic","trail","train","trampoline","transport","trapezoid","trawler","tray",
      "treatment","tree","triangle","triceratops","trick","tricorne","trigonometry","trilby","trillium","trip","trollius","trombone","troodon","trouble","trouser","trout","trowel","truck","truffle","trumpet","trunk","trust","tsunami",
      "tub","tuba","tuberose","tuck","tuesday","tugboat","tulip","tumble","tumbleweed","tuna","tune","tungsten","turkey","turn","turner","turnip","turnover","turquoise","turret","turtle","tv","twig","twilight","twill","twine","twist",
      "twister","typhoon","tyrannosaurus","ulna","umbra","umbrella","uncle","unicorn","universe","uranium","ursinia","utahceratops","utahraptor","utensil","vacation","vacuum","valley","value","van","vanadium","vanilla","variraptor",
      "vase","vault","vegetable","vegetarian","veil","vein","velociraptor","velvet","venom","venus","verbena","verdict","vermicelli","verse","vertebra","vessel","vest","veterinarian","vibraphone","viburnum","vicuna","vinca","vinyl",
      "viola","violet","violin","viper","virgo","visage","viscose","viscount","viscountess","vise","vision","visitor","visor","voice","volcano","vole","volleyball","voyage","vulcanodon","vulture","waiter","waitress","wakeboard","walk",
      "walker","walkover","wall","wallaby","wallet","walleye","wallflower","walnut","walrus","waltz","wanderer","wandflower","wannanosaurus","war","warbler","warlock","warrior","wasabi","wash","washer","wasp","waste","watch","watcher",
      "watchmaker","water","watercress","waterfall","waterlily","wave","wavelength","wax","waxflower","way","wealth","weather","weaver","web","wedelia","wedge","wednesday","weeder","week","weight","whale","wheel","whimsey","whip",
      "whippet","whippoorwill","whistle","whitefish","wholesaler","wildcat","wildebeest","wilderness","wildflower","william","willow","wind","windflower","windscreen","windshield","wineberry","wing","winter","winterberry","wire","wish",
      "wishbone","wisteria","witch","witness","wizard","wok","wolf","wolfberry","wolfsbane","wolverine","wombat","wood","woodpecker","woodwind","wool","woolen","word","work","workshop","worm","wormhole","wound","wren","wrench","wrinkle",
      "wrist","writer","xenon","xenoposeidon","xylocarp","xylophone","yacht","yak","yam","yamamomo","yard","yarn","yarrow","year","yellowhorn","yew","yogurt",
      "yoke","yttrium","yumberry","yuzu","zebra","zebu","zenith","zenobia","zephyr","ziconium","zinc","zinnia","zipper","zircon","zone","zoo","zucchini","zydeco"
    ],

    "predicates":[
      "aback","abaft","abalone","abiding","ablaze","able", "aboard",
      "abounding","abrasive","abrupt","absorbed","absorbing","abstracted","abundant","abyssinian","accessible","accidental","accurate","achieved","acidic","acoustic","actually","acute","adaptable","adaptive","adhesive","adjoining",
      "admitted","adorable","adventurous","aeolian","aerial","agate","aged","agreeable","ahead","airy","ajar","alabaster","alder","alert","alike","alive","alkaline","alluring","almond","almondine","alpine","aluminum","amazing","amber",
      "ambiguous","ambitious","amenable","amethyst","amplified","amused","amusing","ancient","angry","animated","antique","apple","apricot","aquamarine","aquatic","aromatic","arrow","artistic","ash","aspiring","assorted","astonishing",
      "atlantic","atom","attractive","auspicious","automatic","autumn","available","awake","aware","awesome","axiomatic","azure","balanced","bald","ballistic","balsam","band","basalt","battle","bead","beaded","beautiful","bedecked",
      "befitting","bejewled","believed","beneficial","berry","beryl","best","better","bevel","big","billowy","bird","bitter","bittersweet","bloom","blossom","blue","blush","blushing","boatneck","boggy","boiled","boiling","bold","bolder",
      "bony","boom","booming","bottlenose","boulder","bouncy","boundless","bow","brainy","bramble","branch","branched","brash","brass","brassy","brave","brawny","brazen","breezy","brick","brief","bright","brindle","bristle","broad",
      "broadleaf","broken","bronze","bronzed","brook","bubble","bubbly","bumpy","burly","burnt","bush","bustling","busy","butter","buttercup","buttered","butternut","buttery","button","buttoned","cactus","cake","calico","calm","canary",
      "candied","candle","candy","canyon","capable","capricious","caramel","carbonated","careful","caring","carnation","carnelian","carpal","cat","caterwauling","catkin","catnip","cautious","cedar","celestial","certain","cerulean","chain",
      "chalk","chambray","changeable","charm","charmed","charming","chartreuse","chatter","checker","checkered","cheddar","cheerful","chemical","cherry","chestnut","chief","childish","childlike","chill","chip","chipped","chisel","chiseled",
      "chivalrous","chlorinated","chocolate","chrome","circular","citrine","clammy","classic","classy","clean","clear","clever","cliff","climbing","closed","cloud","cloudy","clover","clumsy","coal","cobalt","coconut","coffee","coherent",
      "cold","colorful","colossal","comet","comfortable","common","complete","complex","concise","concrete","confirmed","confused","confusion","congruous","conscious","continuous","cooing","cooked","cookie","cool","cooperative",
      "coordinated","copper","coral","cord","cosmic","cotton","cottony","courageous","crawling","cream","creative","crimson","crocus","crystal","crystalline","cubic","cuboid","cuddly","cultured","cumbersome","curious","curly","curse",
      "curved","curvy","cut","cute","cyan","cyber","cyclic","cypress","daffodil","daffy","daily","daisy","dandelion","dandy","dapper","dark","darkened","dashing","dawn","dazzling","deadpan","dear","debonair","deciduous","decisive","decorous",
      "deep","deeply","defiant","delicate","delicious","delightful","delirious","deluxe","denim","dent","dented","descriptive","desert","deserted","destiny","detailed","determined","developing","diagnostic","diamond","different","difficult",
      "diligent","dirt","disco","discovered","discreet","distinct","dog","dolomite","dorian","dot","dour","dramatic","dull","dune","dust","dusty","dynamic","eager","early","earthy","east","eastern","easy","ebony","economic","educated",
      "efficacious","efficient","eggplant","eight","elastic","elated","elderly","electric","elegant","elemental","elfin","elite","ember","emerald","eminent","emphasized","empty","enchanted","enchanting","encouraging","endurable","energetic",
      "enormous","enshrined","entertaining","enthusiastic","equable","equal","equatorial","equinox","erratic","ethereal","evanescent","even","evening","evergreen","everlasting","excellent","excessive","excited","exciting","exclusive",
      "expensive","experienced","extreme","exuberant","exultant","fabulous","faceted","factual","faint","fair","faithful","fallacious","false","familiar","famous","fan","fanatical","fancy","fantastic","fantasy","far","fascinated","fast","fate",
      "fearless","feather","feline","fern","festive","few","field","fierce","fifth","fine","fir","fire","first","fish","fishy","five","fixed","flame","flannel","flash","flashy","flat","flawless","flax","flaxen","flicker","flint","florentine",
      "flossy","flower","flowery","fluff","fluffy","fluorescent","fluoridated","fluttering","flying","foam","foamy","fog","foggy","foil","foregoing","foremost","forest","forested","fork","fortunate","fortune","fossil","foul","four","fourth",
      "fragrant","freckle","free","freezing","frequent","fresh","friendly","frill","fringe","frost","frosted","fuchsia","full","functional","funky","funny","furry","furtive","fuschia","future","futuristic","fuzzy","gabby","gainful","galvanized",
      "gamy","garnet","garrulous","gaudy","gelatinous","gem","general","generated","gentle","geode","giant","giddy","gifted","gigantic","gilded","ginger","glacier","glamorous","glass","glaze","gleaming","glen","glib","glimmer","glistening",
      "glitter","glittery","global","glorious","glory","glossy","glow","glowing","gold","golden","goldenrod","good","goofy","gorgeous","gossamer","graceful","grand","grandiose","granite","grape","grass","grateful","gratis","grave","gravel",
      "gray","great","green","gregarious","grey","grizzled","grizzly","groovy","grove","guiltless","gusty","guttural","habitual","hail","half","hallowed","halved","hammerhead","handsome","handsomely","handy","happy","harmless","harmonious",
      "harsh","harvest","hazel","heady","healthy","heartbreaking","heather","heathered","heavenly","heavy","held","heliotrope","helix","helpful","hexagonal","hickory","highfalutin","hilarious","hill","hip","hissing","historical","holistic",
      "hollow","holly","holy","honey","honeysuckle","honorable","honored","horn","horse","hospitable","hot","hulking","humane","humble","humdrum","humorous","hungry","hurricane","hushed","husky","hyper","hypnotic","iced","icy","illustrious",
      "imaginary","immediate","immense","imminent","impartial","important","imported","impossible","incandescent","inconclusive","incongruous","incredible","indecisive","indigo","industrious","inexpensive","infrequent","ink","inky","innate",
      "innovative","inquisitive","insidious","instinctive","intelligent","interesting","intermediate","internal","intriguing","invented","invincible","invited","iodized","ionian","ionized","iridescent","iris","iron","irradiated","island",
      "ivory","ivy","jade","jagged","jasper","jazzy","jealous","jelly","jet","jewel","jeweled","jolly","joyous","judicious","juicy","jumbled","jumpy","jungle","juniper","just","juvenile","kaput","keen","kind","kindhearted","kindly","kiwi",
      "knotty","knowing","knowledgeable","lace","laced","lackadaisical","lacy","lake","languid","lapis","large","laser","lateral","lava","lavender","lavish","lead","leaf","lean","learned","leather","leeward","legend","legendary","lemon",
      "level","liberating","light","lightning","like","likeable","lilac","lily","lime","linen","literate","little","lively","living","lizard","local","locrian","lofty","long","longhaired","longing","lopsided","loud","lovely","loving","low",
      "lowly","luck","lucky","ludicrous","lumbar","luminous","lumpy","lunar","lush","luxuriant","luxurious","lydian","lying","lyrical","maddening","magenta","magic","magical","magnetic","magnificent","mahogany","maize","majestic","malachite",
      "malleable","mammoth","mango","mangrove","maple","marble","marbled","marked","marmalade","maroon","marred","married","marsh","marshy","marvelous","massive","material","materialistic","mature","maze","meadow","mellow","melodic","melodious",
      "melon","melted","meowing","merciful","mercurial","mercury","mesquite","messy","metal","meteor","mewing","mica","midi","midnight","mighty","military","mini","miniature","mint","mirage","mire","mirror","misty","mixed","mixolydian","modern",
      "momentous","moored","morning","motley","mountain","mountainous","mousy","mud","muddy","mulberry","mysterious","narrow","nasal","natural","navy","near","neat","nebula","nebulous","necessary","neighborly","neon","nervous","nettle","nice",
      "nickel","nifty","night","nimble","nine","ninth","noble","noiseless","noisy","nonchalant","nonstop","noon","north","northern","nostalgic","nosy","notch","nova","numerous","nutritious","oasis","observant","obsidian","obtainable",
      "obvious","occipital","oceanic","octagonal","odd","oil","olive","olivine","omniscient","onyx","opalescent","opaque","open","opposite","orange","orchid","ordinary","organic","organized","ossified","outgoing","outrageous","outstanding",
      "oval","overjoyed","oxidized","pacific","paint","painted","pale","palm","panoramic","paper","parallel","past","pastoral","patch","pattern","peaceful","peach","pear","peat","pebble","pentagonal","pepper","peppered","peppermint",
      "perfect","peridot","periodic","periwinkle","perpetual","persistent","petal","petalite","petite","pewter","phantom","phase","phrygian","picayune","pickle","pickled","picturesque","pie","pine","pineapple","pinnate","pinto","piquant",
      "pitch","placid","plaid","plain","planet","plant","plastic","platinum","plausible","playful","pleasant","plucky","plum","plume","plump","pointed","pointy","poised","polar","polarized","polished","polite","political","pollen",
      "polydactyl","polyester","pond","pool","positive","possible","potent","pouncing","power","powerful","prairie","precious","pretty","pricey","prickle","prickly","principled","prism","private","probable","productive","profuse","prong",
      "protective","proud","proximal","psychedelic","puddle","puffy","pumped","purple","purrfect","purring","pushy","puzzle","puzzled","puzzling","pyrite","quaint","quark","quartz","quasar","quick","quickest","quiet","quill","quilled",
      "quilt","quilted","quintessential","quirky","quiver","quixotic","radial","radical","rain","rainbow","rainy","rambunctious","rapid","rare","raspy","rattle","real","rebel","receptive","recondite","rectangular","reflective","regal","regular","reinvented",
      "reliable","relic","relieved","remarkable","reminiscent","repeated","resilient","resisted","resolute","resonant","respected","responsible","rhetorical","rhinestone","ribbon","rich","rift","right","righteous","rightful","rigorous",
      "ring","ringed","ripe","ripple","ritzy","river","road","roan","roasted","robust","rocky","rogue","romantic","roomy","root","rose","rough","round","rounded","rowan","royal","ruby","ruddy","rumbling","rune","rural","rust","rustic",
      "saber","sable","safe","sage","salt","salty","same","sand","sandy","sapphire","sassy","satin","satisfying","savory","scalloped","scandalous","scarce","scarlet","scented","scientific","scintillating","scratch","scratched","scrawny",
      "screeching","scythe","season","seasoned","second","secret","secretive","sedate","seed","seemly","seen","selective","separate","separated","sepia","sequoia","serious","shade","shaded","shadow","shadowed","shard","shared","sharp",
      "sheer","shell","shelled","shimmer","shimmering","shine","shining","shiny","shocking","shore","short","shorthaired","showy","shrouded","shrub","shy","sideways","silent","silicon","silk","silken","silky","silly","silver","simple",
      "simplistic","sincere","six","sixth","skillful","skinny","skitter","sky","slash","sleepy","sleet","slender","slime","slow","sly","small","smart","smiling","smoggy","smooth","snapdragon","sneaky","snow","snowy","soapy","soft","solar",
      "solid","solstice","somber","sophisticated","sordid","sore","sour","south","southern","spangle","spangled","spark","sparkling","sparkly","special","speckle","speckled","spectacled","spectacular","spectrum","sphenoid","spice","spiced",
      "spicy","spiffy","spiky","spiny","spiral","spiritual","splashy","splendid","sponge","spot","spotless","spotted","spotty","spring","sprinkle","sprout","spurious","square","standing","star","statuesque","steadfast","steady","stealth",
      "steel","steep","stellar","sticky","stingy","stirring","stitch","stone","storm","stormy","stream","strengthened","stripe","striped","strong","stump","stupendous","sturdy","suave","subdued","subsequent","substantial","successful",
      "succinct","succulent","sudden","sudsy","sugar","sugared","sugary","sulfuric","sulky","summer","sumptuous","sun","sunny","sunrise","sunset","super","superb","superficial","supreme","surf","sustaining","swamp","swanky","sweet",
      "sweltering","swift","synonymous","tabby","talented","tall","tame","tan","tangible","tangy","tar","tarry","tartan","tasteful","tasty","tattered","teal","telling","temporal","ten","tender","terrific","tested","thankful","therapeutic",
      "thin","thinkable","third","thirsty","thoracic","thorn","thoughtful","thread","three","thrilling","thunder","thundering","tidal","tide","tidy","time","tin","tinted","tiny","titanium","toothsome","topaz","torch","torpid",
      "tortoiseshell","tough","tourmaline","towering","trail","tranquil","translucent","transparent","trapezoidal","traveling","treasure","tree","tremendous","triangular","tricky","tricolor","trite","tropical","troubled","trusted",
      "trusting","truth","truthful","tulip","tundra","tungsten","turquoise","twilight","twisty","typhoon","typical","ubiquitous","ultra","uncovered","understood","unequaled","uneven","unexpected","unique","universal","unleashed",
      "unmarred","unruly","upbeat","useful","utopian","uttermost","vagabond","valiant","valley","valuable","vanilla","various","vast","vaulted","veil","veiled","verbena","verbose","verdant","versed","victorious","vigorous","vine","vintage",
      "violet","viridian","vivacious","vivid","volcano","voltaic","voracious","waiting","wakeful","walnut","wandering","warm","warp","wary","water","watery","wave","wax","weak","wealthy","well","west","western","wheat","whimsical","whip",
      "whispering","wholesale","wide","wiggly","wild","wind","windy","winter","wirehaired","wiry","wise","wistful","witty","wobbly","wonderful","wood","wooded","wooden","wool","woolen","woolly","woozy","workable","working","worried","wry",
      "yellow","yielding","young","youthful","yummy","zany","zealous","zenith","zest","zesty","zigzag","zinc","zippy","zircon"
    ],

    "teams":[ // Sysonyms for ‘team’
      "aerie","alliance","assembly",
      "bale","band","barrel","batch","bed","bevy","board","brood","building","bunch","business",
      "cackle","camp","cast","catch","cauldron","charm","chattering","chime","choir","circle","clan","class","clattering","cloud","clowder","club","cluster","coalition","colony","combination","committee","company","conglomerate",
      "congregation","congress","conspiracy","convocation","corporation","coven","crew","culture",
      "dazzle","descent","doctrine","drift","drove",
      "exaltation","faction","faculty","family","flight","fling","flock","flush",
      "gaggle","galaxy","game","gathering","gobble","group","gulp",
      "herd","hive","intrigue","jury",
      "kettle","kit","knot","labor","lamentation","league","lease","lineup","litter",
      "murmuration","mustering","nest","orchestra","order","organization","ostentation","outfit",
      "pace","pack","pandemonium","parade","parliament","party","phalanx","piteousness","pod","posse","prickle","pride",
      "quiver","raffle","romp","rookery",
      "sawt","school","scoop","scream","scury","sedge","sentence","shadow"/*Again.*/,"shiver","shrewdness","sleuth","sloth","squad","staff","suit","swarm",
      "team","thunder","tower","troop","troupe","trust",
      "unit","venue","whisp","whiting","wisdom","zeal"
    ]
  };

  var wordList = wordListObj.collections.concat(wordListObj.objects, wordListObj.predicates, wordListObj.teams);
}
catch (err) {
  failures.words = err;
}
// </WORD LIST>



// ꧁ঔৣ༺Ṡḩäḋøw-¢ħäṅ༻️ঔৣ꧂ | tm!help | s!test

	
	
	
	//                  _.,-*~'`^`'~*-,._ Sounds _.,-*~'`^`'~*-,._
var sounds = {
  Undertale: {
    HisTheme: {
      sound: `+j7    F    X    7    S      S      X    w    7    X    7    S      S      X    47    F    X    7    S      S      X    5    7    X    G    F      X      F    `,
      tempo: 90,
    }
  },

  Pokemon: {
  	LevelUp: {
  		sound: `1wt 1wt 1wt tAXWT`,
  		tempo: 130,
  	}
  },

  // a bunch of concept Windows versions and their respective startup
  // and shutdown sounds: https://www.youtube.com/watch?v=6Luzwj8WinE

  system: {
    startup: {
      //sound: `--j+j+j  1  4  7  --4+4+A  F  J  !  --1+1+%  +@  -$  %  --2+2++!  --!  [@  ]$    +2]5\\5%[+@`,
      //sound: `""""""""""--j+j+j+j-  1  4  7 _____j24""""" _____j24"""""--4+4+A _____j24""""" _____j24"""""F _____j24""""" _____j24"""""J _____j24""""" _____j24"""""! _____j24""""" --1+1+%_____j25""""" _____j25""""" +@-_____j25""""" _____j25""""" $_____j25"""""  %  --2+2++!  --!  [@  ]$    +2][5\\5%[+@+@`,
      sound: `--j+j+j  1  4  7 _____j24""""" _____j24"""""--4+4+A _____j24""""" _____j24"""""F _____j24""""" _____j24"""""J _____j24""""" _____j24"""""! [_____j24""""" [_____j25"""""--1+1+% [_____j25""""" [_____j25"""""+@ [-_____j25""""" [_____j25"""""$  [%  --2+2++!  --!  [@  []$    +2]5\\5%[+@+@`,
      tempo: 230, // KDE Oxygen
    },

    error: {
      sound: `f  42`,
      tempo: 160, // KDE Oxygen
    },

    error_serious: {
      sound: `f  42 42`,
      tempo: 160, // KDE Oxygen
    },

    error_serious_very: {
      sound: `f  42 42 42`,
      tempo: 160, // KDE Oxygen
    },

    error_low: {
      sound: `s  j2`,
      tempo: 160, // my extension
    },

    error_low_serious: {
      sound: `s  j2 j2`,
      tempo: 160, // my extension
    },

    error_low_serious_very: {
      sound: `s  j2 j2 j2`,
      tempo: 160, // my extension
    },

    error_crit: {
      sound: `g  52`,
      tempo: 140, // KDE Oxygen
    },

    error_crit_serious: {
      sound: `g  52 52`,
      tempo: 140, // my extension
    },

    error_crit_serious_very: {
      sound: `g  52 52 52`,
      tempo: 140, // my extension
    },

    warning: {
      sound: `A S F`,
      tempo: 80, // KDE Oxygen
    },

    message: {
      sound: `7`,
      tempo: 100, // KDE Oxygen
    },

    message_high: {
      sound: `S`,
      tempo: 100, // my extension
    },

    message_low: {
      sound: `4`,
      tempo: 100, // my extension
    },

    message_important: {
      sound: `57`,
      tempo: 100, // KDE Oxygen
    },

    message_important_high: {
      sound: `7S`,
      tempo: 100, // my extension
    },

    message_important_low: {
      sound: `24`,
      tempo: 100, // my extension
    },

    positive: {
      sound: `+5 7 A F`,
      tempo: 45, // KDE Oxygen
    },//589=

    positive_high: {
      sound: `+5 7 A F`,
      tempo: 45, // KDE Oxygen
    },

    positive_low: {
      sound: `+4 5 7 S`,
      tempo: 45, // extension
    },

    negative: {
      sound: `F 4 7 A`,
      tempo: 140, // KDE Oxygen
    },

    negative_low: {
      sound: `A 1 4 5`,
      tempo: 140, // extension
    },

    alarm: {
      //sound: `+w X 7 ____w X 7""" t  X                w X 7    t  X W                w X 7    t  X                w X 7    t  X W                `,
      sound: `""""++w X 7 ____w X 7"""" t  X  ____t X  ____t X""""""""         w X 7 ____w X 7"""" t  X W  ____X W  ____X W""""""""         w X 7 ____w X 7"""" t  X  ____t X  ____t X""""""""         w X 7 ____w X 7"""" t  X W  ____X W  ____X W""""""""         `,
      tempo: 145, // from Windows 10
    }
  },


  Linux: {
    KDE: {
      Oxygen: {
        login: {
          //sound: `--j+j+j  1  4  7  --4+4+A  F  J  !  --1+1+%  +@  -$  %  --2+2++!  --!  [@  ]$    +2]5\\5%[+@`,
          //sound: `""""""""""--j+j+j+j-  1  4  7 _____j24""""" _____j24"""""--4+4+A _____j24""""" _____j24"""""F _____j24""""" _____j24"""""J _____j24""""" _____j24"""""! _____j24""""" --1+1+%_____j25""""" _____j25""""" +@-_____j25""""" _____j25""""" $_____j25"""""  %  --2+2++!  --!  [@  ]$    +2][5\\5%[+@+@`,
          sound: `--j+j+j  1  4  7 _____j24""""" _____j24"""""--4+4+A _____j24""""" _____j24"""""F _____j24""""" _____j24"""""J _____j24""""" _____j24"""""! [_____j24""""" [_____j25"""""--1+1+% [_____j25""""" [_____j25"""""+@ [-_____j25""""" [_____j25"""""$  [%  --2+2++!  --!  [@  []$    +2]5\\5%[+@+@`,
          tempo: 230,
        },

        error: {
          sound: `f  42`,
          tempo: 150,
        },

        error_crit: {
          sound: `g  52`,
          tempo: 150,
        },

        error_serious: {
          sound: `f  42 42`,
          tempo: 150,
        },

        error_serious_very: {
          sound: `f  42 42 42`,
          tempo: 150,
        },

        warning: {
          sound: `A S F`,
          tempo: 80,
        },

        message: {
          sound: `7`,
          tempo: 100
        },

        positive: {
          sound: `5 7 A F`,
          tempo: 90,
        },

        negative: {
          sound: ` F 4 7 A`,
          tempo: 300
        },
      },
    },
  },


  Windows: {
    Fakes: {
      Whistler: {
        //   the Windows Whistler startup and shutdown sounds commonly seen in
        // Windows History videos are both fake. startup is a combination of
        // 98's shutdown reversed, 2000's startup reversed, and a sound from
        // the plus pack; while the shutdown is from beOS

        startup: {
          //                 1/8 rest              1/4 rest             1/2 rest            whole rest         2 whole rests        4 whole rests
          // /advnotes 100 aaaaa[a[a[a[a        aaaaa]a]a]a]a        aaaaa\a\a\a\a        aaaaa|a|a|a|a        aaaaa{a{a{a{a        aaaaa}a}a}a}a

          //sound: `@ N @ E Y E @ N @ N @ Y E @ N @ N -s2S  g5  g5G    __________"e\\"e\\"e\\"e\\"e\\"e\\"e\\"e\\"e\\"e\\e\\e\\e\\e\\"Ce\\"Ce\\"Ce\\Ce\\eyqC\\eyq\\ye\\-e \\\\\\]++C--]C\\\\\\]Y]y\\\\\\]E]e`,

          sound: `yZC           Z  X \C      G    S     N @ N @ E Y @ _N _@ _N _@ _E _Y _E _@ _N _@`,
          tempo: 110,
        },

        shutdown: {
          sound: `+e]mb]c      ________y   r   e m e m e _m e m e`,
          tempo: 200,
        },

      },
    },

    w3_1: {
      startup: {
        sound: `cbmeetuCCBME cbmeetuCCBME`,
        tempo: 130,
      },

      shutdown: {
        sound: `UM RV EC Mu`,
        tempo: 62,
      }

    },

    w95: {
      startup: {
        sound: `mu   rV     uU][Z+Q-][X+W-][C+E-][V+R-][B+T-][M+U-[ ________nmq""""""""[     ++wW        __wW     __wW   "wW     __wW   "wW     __wW   "wW`,
        tempo: 110,
      },

      shutdown: {
        sound: `cbmeetuCCBME cbmeetuCCBME`,
        tempo: 130,
      }

    },

    w98: {
      startup: {
        sound: `_____T++T--][%++%--][R++R--][$++$--][E++E--][#++#--][W++W--][@++@--][Q++Q--][!++!--][M+U-][J+&-][N+Y-][H+^-][B+T-][G+%-][V+R-][F+$-][C+E-][D+#-][X+W-""""" \{c b r t >}}}}b B W J T +W- &`,
        tempo: 70,
      },

      shutdown: {
        sound: `e[E[]]]y[Y[]]]C[++C--[]]] -e]ye]eyq]eyqC]Ce]_Ce]_Ce]_Ce]e]e]e]e]_e]_e]_e]_e]_e]_e]_e]_e]_e]_e`,
        tempo: 420,

        reversed: {
          //sound: `e[E[]]]y[Y[]]]C[++C--[]]] -e]ye]eyq]eyqC]Ce]_Ce]_Ce]_Ce]e]e]e]e]_e]_e]_e]_e]_e]_e]_e]_e]_e]_e`,
          sound: `__________"e]"e]"e]"e]"e]"e]"e]"e]"e]"e]e]e]e]e]"Ce]"Ce]"Ce]Ce]eyqC]eyq]ye]-e ]]][++C--[C]]][Y[y]]][E[e`,
          tempo: 420,
        }
      },

      beta: {
        startup: {
          sound: `_____T++T--][%++%--][R++R--][$++$--][E++E--][#++#--][W++W--][@++@--][Q++Q--][!++!--][M+U-][J+&-][N+Y-][H+^-][B+T-][G+%-][V+R-][F+$-][C+E-][D+#-][X+W-""""" \{c b r t >}}}}b B W J T +W- &`,
          tempo: 70,
        },

        shutdown: {
          sound: `w[W[]]]t[T[]]]X[++X--[]]] -w]tw]wt1]wt1X]Xw]_Xw]_Xw]_Xw]w]w]w]w]_w]_w]_w]_w]_w]_w]_w]_w]_w]_w`,
          tempo: 440,
        },

      },

    },

    w2000: {
      startup: {
        sound: `@ N @ E Y E @ N @ N @ Y E @ N @ N -s2S  g5  g5G      nyN`,
        tempo: 110,
      },

      shutdown: {
        sound: `gmeyN 5 r mruM`,
        tempo: 333,
      }
    },

    XP: {
      startup: {
        sound: `ne1GG  5G S@   g11AK  5G  GG  g21S@`,
        tempo: 135,
      },

      shutdown: {
        sound: `s2SL! G%5 A!1 g15GS`,
        tempo: 250,
      },
    },

    Vista7: {
      startup: {
        sound: `B]W\\]T]!\\] W]&\\]T]+W-\\]xb[xb[xb[xb[xb[xb[xb[xb[xb[x[x`,
        tempo: 250,
      },

      shutdown: {
        sound: `+B X +B]X]T`,
        tempo: 125,
      },
      Longhorn: {
        startup: {
          sound: `____2"""" S  C   u  i  qB qB __qB qB __qB qB __qB qB`,
          tempo: 200,
        },

        shutdown: {
          sound: `____2"""" S  C   i  qB qB __qB qB __qB qB __qB qB`,
          tempo: 200,
        },
      },
    },

    w8: {
      startup: {
        sound: `muMU  nyNY cCCE  ____cC`,
        tempo: 200,
      },

      shutdown: {
        sound: `+B X +B]X]T`,
        tempo: 125,
      },
    },

    w10: {
      startup: {
        //sound: `un  y Ce`,
        sound: `muMU  nyNY cCCE ____cC ____cC`,
        tempo: 210,
      },

      shutdown: {
        sound: `+B X +B]X]T`,
        tempo: 125,
      },

      background: {
        sound: `y u C`,
        tempo: 70,
      },

      foreground: {
        sound: `V t Z`,
        tempo: 140
      },

      UAC: {
        sound: `u V C`,
        tempo: 140,
      },

      alarm5: {
        sound: `+w X 7    t  X                w X 7    t  X W                w X 7    t  X                w X 7    t  X W                `,
        tempo: 150,
      }
    },
  },

  macOS: {
    startup: {
      sound: `7SFj24-j24`,
      tempo: 100
    },


  }
}
	
	
//    _.,-*~'`^`'~*-,._ Change your default settings here _.,-*~'`^`'~*-,._

var botDefaults = {

  // Let people know that it's “/help” and not, say for example, “!help”
  // Default: false
  itsSlashHelp: false,


  // `I don't recognize that command, ${name}.`
  unknownCmds: false,


  // Main, non-admin commands
  // Set by the bot
  power: true,


  // Turn this off and reload to get it on again
  // Can only be set by the JS relay
  fullPower: true,


  // Indev and unsafe commands
  // Set by the bot
  safeMode: false,

  // There's kids around with schoolwork, don't disturb 'em.
  // Default: false
  schoolMode: false,


  // Give full access to everyone
  // Default: false
  anarchyMode: false,


  // need I explain?
  // Defaults to true, but here it's false so I don't have the potential
  // to get requests while my bot's starting up
  takingRequests: false,


  // Hi, DadBot, I'm Dad.
  // Default: true
  dadBot: false,


  // Where to put bot messages
  // "separate" is default, anything else puts them in the chat
  botMessageLocation: "separate",


  // Enable compatibility with other Google Chrome clients at the cost of
  // halving the bot's note quota
  chromeCompatibility: true,


  // `${botSettings.botName} version ${botSettings.ver} has started up.`
  // Default: false
  sayStartupMessage: false,


  // Lock it down to me only
  // Has to be set by the JS relay
  lockdownMode: false,

  sendChatOnLockdown: false,


  // /Start /commands /with /this /character
  // Default: `/`
  prefix: 'x!',

  newPrefix: `/`,



  defaultRank: 0,


  greetFriends: false,
  // this'll be set after 20 seconds


  // ‘I found you, faker!’
  // Default: false
  allowFakers: false,


  // JavaScript Relay command
  // Default: `si!js`
  jsCmd: `i!js`,


  // Should I color the room to whoever last chatted?
  // true, `inward`, `outward`, `flat`, `andBlack`
  roomColorLastChat: true,


  // Should I use the chatbuffer or just immediately
  // send messages?
  // Default: true
  useChatbuffer: true,


  CSS: {
    // Default: false
    applyOnStart: false,

    // i've got too many.
    // anything unrecognized goes to the default style

    style: ``
  },


  startupSound: {
    enable: true,
    //sound: sounds.system.startup.sound,
    //tempo: sounds.system.startup.tempo,
    sound: sounds.system.startup,
  },


  info: {
    // Bot version
    ver: "10.0.0",

    // Username to default to
    username: '[ShadowUsername]',


    usernames: [
      `[ShadowUsername1]`,
      `[ShadowUsername2]`,
    ],

    // Color to default to
    color: `#381724`,

    // What to call the bot
    botName: '[DefaultShadowOSXBotName]',

    // Show the version?
    showVer: true,

    // For the /about command
    aboutText: `[Insert some text about this bot here!]`,

    // The name suffix, usually showing /help
    showSuffix: true,
  },


  greeterBot: {
    enable: true,

    messageStart: `Hello, `,
    /*             name       */
    messageMiddle: ` `,

    showColor: true,

    messageColorStart: `(`,
    /*               color */
    messageColorEnd: `)`,

    messageColorSepEnd: ``,

    messageEnd: `!`,
  },


  log: {

    // Trace lines:

    // Trace lines should be used whenever something executes.
    // THESE WILL CLOG UP THE CHAT. Consider turning them on
    // only in the debug console.
    trace: {chat: false, console: false},

    // Verbose lines:

    // Verbose lines should be used as a finer-grained version
    // of debug lines, but not as trace lines.  Use these more
    // often than debug lines, but less than trace lines.
    verbose: {chat: false, console: false},

    // Debug lines:

    // Implement these whenever something doesn't go as expected.
    // These have the potential to clog up the chat and, by
    // default, are only enabled for the console.
    debug: {chat: false, console: true},

    // Information lines:

    // Use these to show the program's execution flow.
    info: {chat: false, console: true},

    // Mark lines:

    // Use these a little more than info lines but less
    // than notification lines.
    mark: {chat: false, console: true},

    // Notification lines:

    // Use these whenever something important happens but
    // it's not a warning.
    notification: {chat: false, console: true},

    // Warning lines:

    // Warnings are notifications about potentially
    // harmful events
    warning: {chat: true, console: true},

    // Error lines:

    // Errors can harm the program's flow.  Log all errors!
    error: {chat: true, console: true},

    // Critical lines:

    // Critical errors can potentially cause your bot to
    // crash or otherwise go unstable.
    critical: {chat: true, console: true},

    // Alert lines:

    // For when immediate action is required
    alert: {chat: true, console: true},

    // Emergency lines:

    // And we're unstable.
    emergency: {chat: true, console: true},
  },


  cursorBot: {

    enable: true,

    mode: `roughFollow`,


    followOnePerson: {
      enable: true,
      //_id: `e687a73935e2e3fa9380fce6` // Nebula
      _id: `5c5bbb65bae2b3e7321ddfa6` // Grant Loves Cream the Rabbit
      // https://stackoverflow.com/a/37401010 for a random value from an object, without using a function
    },


    ballOnString: {
      // How heavy is the cursor?  As usual, larger is heavier
      mass: 100,

      // How hard should gravity affect my cursor?  Larger is harder
      gravity: 5,

      // How... friction-y my cursor is.  Larger is harder to move
      friction: 4,
    },

    bounce: {
      Xspeed: 4,
      Yspeed: 3.14,
      Zspeed: 6.28,
    },

    trig: {
      // Trigonometric-specific settings:

      direction: `y`,

      // sin, cos, tan, sec, csc, cot
      function: `sin`,

      speed: 4,
    },

    battlingCursor: {
      radiusX: 6,
      radiusY: 10,
    },

    goCrazy: {
      Xmin: 0,
      Xmax: 100,
      Ymin: 0,
      Ymax: 100,
    },

    screensaver: {
      Xmin: 0,
      Xmax: 100,
      Ymin: 0,
      Ymax: 100,
    }
  },


  rainbowLines: {
    enable: true,

    gradient: `rainbow`,

    gradients: {
      rainbow: [
        [`#ff0000`, `#ffff00`],
        [`#ffff00`, `#00ff00`],
        [`#00ff00`, `#00ffff`],
        [`#00ffff`, `#0000ff`],
        [`#0000ff`, `#ff00ff`],
        [`#ff00ff`, `#ff0000`],
      ]
    },

    speed: 25, // updates between colors

    updateSpeed: 1000, // milliseconds
  },


  PSAs: {
    enable: true,
    enableMulti: true,
    text: `If you see Grant/Casey/ChaseLovesCreamTheRabbit, ban him instantly. They've impersonated others, stole rooms, cyberbullied Hri7566 on YouTube, and is now using a bot website to show fake Gate Keepers.  GRANT DOESN'T DESERVE ANOTHER CHANCE.  EVER.`,
    texts: [
        `͏If you see Grant/Casey/ChaseLovesCreamTheRabbit, ban him instantly and tell Brandon to ban him from this site until he learns better.  They've impersonated others, stole rooms, cyberbullied Hri7566 on YouTube, has used a bot website to show fake Gate Keepers, and has receltly BANNED ME AND HRI7566.  GRANT DOESN'T DESERVE ANOTHER CHANCE.  EVER.\n | AGAIN, ＩＦ　ＹＯＵ　ＳＥＥ　ＧＲＡＮＴ，　ＴＥＬＬ　ＢＲＡＮＤＯＮ　ＴＨＡＴ　ＨＥ　ＳＨＯＵＬＤ　ＢＥ　ＢＡＮＮＥＤ　ＦＲＯＭ　ＴＨＩＳ　ＷＥＢＳＩＴＥ　ＵＮＴＩＬ　ＨＥ　ＬＥＡＲＮＳ　ＢＥＴＴＥＲ．`,
        `If you see any impersonation going on, ban only the fakers immediately.`,
        `Don't forget to check out the other bots!`,
        `Type /help if you want to see my commands!`,
    ]
  }
}

// I have to apply these after the rest as JS doesn't finish setting up the
// botSettings variable until a }

// Default:
botDefaults.startupMessage = `${botDefaults.info.botName} ${botDefaults.info.ver} has started up.`;


var botSettings = Object.assign({}, botDefaults);

// What to say, what to say...
// Default: `${name}, if you wish to see my commands, type ${botSettings.prefix}help instead.`
botDefaults.itsSlashHelpText = `, if you wish to see my commands, type ${botSettings.prefix}help instead.`;


botSettings = Object.assign({}, botDefaults);
// i've gotta do this twice apparently
	
	
// Set this to True if you're actively developing this.
var isDeveloping = true;


var botPresets = {
  TwilightSparkle: {
    username: `✨ Twilight Sparkle ✨`,

    usernames: [
      `✨ Twilight Sparkle ✨`
    ],

    botName: `Twilight Sparkle\'s MPP Bot`,

    aboutText: ``,

    showVer: false,

    color: `#C11CE9`,
    // 8823ed

    showSuffix: false,
  },

  Shadow: {
    username: `꧁ঔৣ༺ Ṡḩäḋøw ༻️ঔৣ꧂`,

    usernames: [
      `꧁ঔৣ༺ Ṡḩäḋøw ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡʜäᴅøw ༻️ঔৣ꧂`,
      `Ṫḣë Øņę ąńḋ Øņłÿ ꧁ঔৣ༺ Ṡḩäḋøw ༻️ঔৣ꧂`,
      `Ṫʜë Øɴę ąɴᴅ ØɴLÿ ꧁ঔৣ༺ Ṡʜäᴅøw ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡḩäḋøw-¢ħäṅ ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡʜäᴅøw-¢ʜäɴ ༻️ঔৣ꧂`,
      `Ṫḣë Øņę ąńḋ Øņłÿ ꧁ঔৣ༺ Ṡḩäḋøw-¢ħäṅ ༻️ঔৣ꧂`,
      `Ṫʜë Øɴę ąɴᴅ ØɴLÿ ꧁ঔৣ༺ Ṡʜäᴅøw-¢ʜäɴ ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡḩäḋøw-¢ħäṅ∴∵sḩäḋøwOS Classic ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡʜäᴅøw-¢ʜäɴ∴∵sʜäḋøwOS Classic ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡḩäḋøw-¢ħäṅ ∴∵ șħäḋøwOS Z 10 ༻️ঔৣ꧂`,
      `꧁ঔৣ༺ Ṡʜäᴅøw-¢ʜäɴ ∴∵ șʜäᴅøwOS Z 10 ༻️ঔৣ꧂`,
      `꧁ঔৣ༺Ṡḩäḋøw ⁘ ṀṔⱣṠẹ¢üṙiṭẏ Ċṙẹäṭøṙ༻️ঔৣ꧂`,
      `꧁ঔৣ༺Ṡʜäᴅøw ⁘ ṀṔⱣṠẹ¢üʀiṭẏ Ċʀẹäṭøʀ༻️ঔৣ꧂`,
      `꧁ঔৣ༺Ṡḩäḋøw-¢ħäṅ⁘ṀṔⱣṠẹ¢üṙiṭẏ Ċṙẹäṭøṙ༻️ঔৣ꧂`,
      `꧁ঔৣ༺Ṡʜäᴅøw-¢ʜäɴ⁘ṀṔⱣṠẹ¢üʀiṭẏ Ċʀẹäṭøʀ༻️ঔৣ꧂`,
      `Shadow-chanLovesAmyRose47480794257635487`,
      `Shadow-chanLovesCreamTheRabbit0234672345`,
      `ṪḣëØņęĄńḋØņłÿṠḩäḋøw-¢ħäṅĹõvęś₡ŕėàṁ274873`,
      `꧁ঔৣ༺ Ṡḩäḋøw The Hedgehog | 50 ༻️ঔৣ꧂`,
    ],

    botName: `shadowOS Z`,

    aboutText: `I'm the main developer of \ud835\ude82\ud835\ude91\ud835` +
    `\ude8a\ud835\ude8d\ud835\ude98\ud835\udea0\ud835\ude7e\ud835\ude82.`,

    showVer: false,

    color: `#381724`,

    showSuffix: false,
  },

  ShadowOS: {
    username: `꧁ঔৣ༺ ṠḩäḋøwŌȘ ༻️ঔৣ꧂`,

    usernames: [
      `꧁ঔৣ༺ ṡḩäḋøwŌȘ Z ༻️ঔৣ꧂`,
      `Ṫḣë Øņę ąńḋ Øņłÿ ꧁ঔৣ༺ ṡḩäḋøwŌȘ Z ༻️ঔৣ꧂`,
    ],

    botName: `shadowOS Z`,

    aboutText: `Previously known as \u0e56\u06e3\u06dc\u2845\u28f0\u2802`+
    `\u2894\u2846\u2894\u2846\u2894\u2842\u288e\u2806\u28ca\u2805.`,

    showVer: true,

    color: `#381724`,

    showSuffix: true,
  },

  MilesPrower: {
    username: `Miles Prower`,

    usernames: [
      `Miles Prower`,
    ],

    botName: `MilesOS`,

    aboutText: ``,

    showVer: true,

    color: `#F7AA1C`,

    showSuffix: true,
  },

  isaacOS: {
    username: `:: i s a a c O S ::`,

    usernames: [
      `:: i s a a c O S ::`,
      `<isaacOS>`,
    ],

    botName: `isaacOS`,

    aboutText: ``,

    showVer: true,

    color: `#381724`,

    showSuffix: true,
  }
}

var ranks = {
  ultralow: [

  ],

  extralow: [

  ],

  low: [

  ],

  normal: [

  ],

  high: [
    `5ce52c6017d5e600cc9e100a`, // Hri7566

    `e687a73935e2e3fa9380fce6`, // Nebula

    `a9467aa984555146132f6993`, // Cmds
    `3d34d4352eca294aa727412c`, 
  ],

  extrahigh: [

  ],

  ultrahigh: [

  ],
}

function checkRank(_id) {
  if (bannedIds.includes(_id)) {
    return -10
  }
  else if (_id == gClient.getOwnParticipant()._id) {
    return 10
  }
  else if (ranks.ultralow.includes(_id)) {
    return -3
  }
  else if (ranks.extralow.includes(_id)) {
    return -2
  }
  else if (ranks.low.includes(_id)) {
    return -1
  }
  else if (ranks.normal.includes(_id)) {
    return 0
  }
  else if (ranks.high.includes(_id)) {
    return 1
  }
  else if (ranks.extrahigh.includes(_id)) {
    return 2
  }
  else if (ranks.ultrahigh.includes(_id)) {
    return 3
  }
  else {
    return botSettings.defaultRank
  }
}

var friends = [
  //`5c5bbb65bae2b3e7321ddfa6`, // GrantLoves

  `5ce52c6017d5e600cc9e100a`, // Hri7566

  `e687a73935e2e3fa9380fce6`, // Nebula
  `9876d96dade79d41bcba32e9`,

  `b6940da279813d0f5cc3536b`, // Jimbo

  `a9467aa984555146132f6993`, // Cmds
  `3d34d4352eca294aa727412c`,

  `8d7c5b3b45abe1be9455c4c7`, // Intel

  `2be5ee032bb30dbe2b4afbb6`, // Fishi

  `f627cfa7f19de955afa0fccb`, // AsCody94

  `33e3ee4db4e942163a46edf9`, // Rem0n
  `34318c015506c2bc0d8a8779`,

  `97517d91995c29e9ae8d6a9a`, // Zynx92
]





function loadPreset(settings) {

  // Object.assign(target, ...sources)

  if (settings === 'Twilight Sparkle') {

    //botSettings.info.username = `\u2B50\uD835\uDDB3\uD835\uDDD0\uD835\uDDC2\uD835\uDDC5\uD835`+
    //  `\uDDC2\uD835\uDDC0\uD835\uDDC1\uD835\uDDCD\u0020\uD835\uDDB2\uD835\uDDC9`+
    //  `\uD835\uDDBA\uD835\uDDCB\uD835\uDDC4\uD835\uDDC5\uD835\uDDBE\u2B50`

    botSettings.info = Object.assign(botSettings.info, botPresets.TwilightSparkle)
    infoLine(`loadPreset()`, `Loaded Twilight Sparkle's presets`)
  }

  // Shad preset
  else if (settings === 'Shadow') {
    //botSettings.info.username = `\uD835\uDE82\uD835\uDE91\uD835\uDE8A\uD835\uDE8D\uD835\uDE98` +
    //  `\uD835\uDEA0`

    //botSettings.info.username = `[{-ShadowOS-}]`

    botSettings.info = Object.assign(botSettings.info, botPresets.Shadow)
    infoLine(`loadPreset()`, `Loaded Shadow's settings`)
  }

  // isaacOS preset
  else if (settings === 'isaacOS') {
    botSettings.info = Object.assign(botSettings.info, botPresets.isaacOS)
    infoLine(`BotSettingsloadPreset() `, `Loaded isaacOS's settings`)
  }

  // Tails
  else if (settings === 'Miles Prower') {
    botSettings.info = Object.assign(botSettings.info, botPresets.MilesPrower)
    infoLine(`loadPreset()`, `Loaded Miles's settings`)
  }

  // shadowOS preset, active by default
  else {
    //botSettings.username = `\ud835\ude82\ud835\ude91\ud835\ude8a\ud835\ude8d\ud835\ude98`+
    //  `\ud835\udea0\ud835\ude7e\ud835\ude82`

    botSettings.info = Object.assign(botSettings.info, botPresets.ShadowOS)
    infoLine(`loadPreset()`, `Loaded the default ShadowOS settings`)
  }
}

// The preset to load on startup:
setTimeout(loadPreset('Shadow'), 5000)
//setTimeout(botSettings.info = Object.assign(botSettings.info, botPresets.Shadow))

function noop() {}




//                               <CHATBUFFER>
failures.chatbuffer = false;
try {
  // --------------------- < CHAT BUFFER > ---------------------------
  // Edited for "camelCase" conventions and to speed things up if I'm owner

  var chatBuffer = [];
  var interv = 1900;
  var chatInt = setInterval(function() {
    var msg = chatBuffer.shift();
    if (msg) {
      gClient.sendArray([{ m: 'a', message: msg }]);

    }
    //        console.log(`ChatBuffer: [${chatBuffer}]`)
  }, interv);

  var chatBufferAdmin = [];
  var intervAdmin = 500;
  var chatIntAdmin = setInterval(function() {
    var msg = chatBufferAdmin.shift();
    if (msg) {
      gClient.sendArray([{ m: 'a', message: msg }]);
    }
    //        console.log(`ChatBufferAdmin: [${chatBuffer}]`)
  }, intervAdmin);

  function sendChat(msg, chainPreventBool) {
    if (botSettings.lockdownMode === false
        || (botSettings.lockdownMode === true
            && botSettings.sendChatOnLockdown == true)) {
      msg += ''
      if (chainPreventBool != false) {
      	msg = `\u034f` + msg;
      }
      msg.match(/.{0,500}/g).forEach(function(x, i) {
        if (x === '') {return}
        if (i !== 0) {x = '...' + x}

        if (botSettings.useChatbuffer == true) {
          if (MPP.client.isOwner()) {
            chatBufferAdmin.push(x);
            infoLine(`sendChat | pushed to admin`, `${x}`)
          } else {
            chatBuffer.push(x);
            infoLine(`sendChat | pushed to main`, `${x}`)
          }
        }
        else {
          gClient.sendArray([{ m: 'a', message: msg }]);
        }
      });

    } else {
      receiveChat('#ffffff', botSettings.info.botName, `${msg}`)
    }
  }

  function clearBuffer() {
    chatBuffer = [];
    chatBufferAdmin = [];
    infoLine(`clearBuffer`, `Chat buffers cleared`)
  }

  infoLine(`Loaded`, `Chat Buffer is now loaded`)
}
catch (err) {
  function sendChat(msg) {
    MPP.client.sendArray([{ m: 'a', message: '\u034F' + msg }]);
  }
  errLine(`Chatbuffer`, `Electrashave's Chatbuffer failed to load. | ${err}`)
  warnLine(`Chatbuffer`, `Output will be pre-processed and won't be buffered.`)
  sendChat(`Unfortunately, Electrachave's Chatbuffer failed to load for some reason.  This means my bot's output will be pre-processed and won't be buffered.`);
  sendChat(`${err}`)

  failures.chatbuffer = err;
}
//                               </CHATBUFFER>
	
	
	
	
//                            <TEXT MANIPULATION>
failures.text = false;
try {

	/*function translate(char, style) {
		if (style == "script") {
            var upperCase = '𝒜';
            var lowerCase = '𝒶';
            console.log(`got script style ready`)
		}

        var diff;
        if (/[A-Z]/.test (char)) {
            diff = upperCase.codePointAt(0) - "A".codePointAt (0);
            console.log(`capital letter`)
        } else {
            diff = lowerCase.codePointAt(0) - "a".codePointAt (0);
            console.log(`assuming lowercase letter`)
        }
        return String.fromCodePoint(char.codePointAt (0) + diff);
	}

	function fontStyle(text, style) {
		var translatedString = text.split(``);
		var stringToOutput = ``;
        for (const letter of translatedString) {
        	console.log(letter)
        	console.log(translate(letter), `script`)
            stringToOutput += translate(letter, `script`)
        }
        return stringToOutput
	}*/

	function fontStyle(text, style) {
		if (style == `script`) {
			return text
			.switchTwoChars(`A`, `𝒜`)
			.switchTwoChars(`B`, `𝒜`)
			.switchTwoChars(`C`, `𝒜`)
			.switchTwoChars(`D`, `𝒜`)
			.switchTwoChars(`E`, `𝒜`)
			.switchTwoChars(`F`, `𝒜`)
			.switchTwoChars(`G`, `𝒜`)
			.switchTwoChars(`H`, `𝒜`)
			.switchTwoChars(`I`, `𝒜`)
			.switchTwoChars(`J`, `𝒜`)
			.switchTwoChars(`K`, `𝒜`)
			.switchTwoChars(`L`, `𝒜`)
			.switchTwoChars(`M`, `𝒜`)
			.switchTwoChars(`N`, `𝒜`)
			.switchTwoChars(`O`, `𝒜`)
			.switchTwoChars(`P`, `𝒜`)
			.switchTwoChars(`Q`, `𝒜`)
			.switchTwoChars(`R`, `𝒜`)
			.switchTwoChars(`S`, `𝒜`)
			.switchTwoChars(`T`, `𝒜`)
			.switchTwoChars(`U`, `𝒜`)
			.switchTwoChars(`V`, `𝒜`)
			.switchTwoChars(`W`, `𝒜`)
			.switchTwoChars(`X`, `𝒜`)
			.switchTwoChars(`Y`, `𝒜`)
			.switchTwoChars(`Z`, `𝒜`)

			.switchTwoChars(`a`, `𝒜`)
			.switchTwoChars(`b`, `𝒜`)
			.switchTwoChars(`c`, `𝒜`)
			.switchTwoChars(`d`, `𝒜`)
			.switchTwoChars(`e`, `𝒜`)
			.switchTwoChars(`f`, `𝒜`)
			.switchTwoChars(`g`, `𝒜`)
			.switchTwoChars(`h`, `𝒜`)
			.switchTwoChars(`i`, `𝒜`)
			.switchTwoChars(`j`, `𝒜`)
			.switchTwoChars(`k`, `𝒜`)
			.switchTwoChars(`l`, `𝒜`)
			.switchTwoChars(`m`, `𝒜`)
			.switchTwoChars(`n`, `𝒜`)
			.switchTwoChars(`o`, `𝒜`)
			.switchTwoChars(`p`, `𝒜`)
			.switchTwoChars(`q`, `𝒜`)
			.switchTwoChars(`r`, `𝒜`)
			.switchTwoChars(`s`, `𝒜`)
			.switchTwoChars(`t`, `𝒜`)
			.switchTwoChars(`u`, `𝒜`)
			.switchTwoChars(`v`, `𝒜`)
			.switchTwoChars(`w`, `𝒜`)
			.switchTwoChars(`x`, `𝒜`)
			.switchTwoChars(`y`, `𝒜`)
			.switchTwoChars(`z`, `𝒜`)
			
		}
	}

  function nameGen(amount) {

    var word = wordList[random(0,wordList.length,true)].split(``);
    debugLine(`nameGen`, `got word and split it up | ${word}`)

    word[0] = word[0].toUpperCase();
    debugLine(`nameGen`, `word[0] now capitalized | ${word}`)

    word=word.join(``);
    debugLine(`nameGen`, `joined word together | ${word}`)

    var addThe = random(0, 1, true) == 1? "The" : "";
    debugLine(`nameGen`, `addThe: ${addThe}`)
    var numBefore = (random(0, 1, true) == 1 && addThe == "")? `${random(100, 9999, true)}` : "";
    debugLine(`nameGen`, `numBefore: ${numBefore}`)
    var numAfter = (random(0, 1, true) == 1 || (numBefore == "" && addThe == ""))? `${random(100, 9999, true)}` : "";
    debugLine(`nameGen`, `numAfter: ${numAfter}`)
    var secondWord = random(0, 2, true) == 1? wordList[random(0,wordList.length,true)] : "";
    debugLine(`nameGen`, `secondWord: ${secondWord}`)
		if (secondWord == word) {
      secondWord = wordList[random(0,wordList.length,true)];
      debugLine(`nameGen`, `regenerated secondWord: ${secondWord}`)
    }
		if (secondWord) {
			secondWord = secondWord.split(``);
			debugLine(`nameGen`, `split secondWord | ${secondWord}`)
			
			secondWord[0] = secondWord[0].toUpperCase();
			debugLine(`nameGen`, `secondWord: ${secondWord}`)
			
			secondWord = secondWord.join(``);
			debugLine(`nameGen`, `secondWord: ${secondWord}`)
		}

    

    var thirdWord = (random(0, 2, true) == 1 && secondWord != "")? wordList[random(0,wordList.length,true)] : "";
debugLine(`nameGen`, `thirdWord: ${thirdWord}`)

    if (thirdWord == word || (thirdWord == secondWord && thirdWord != "" && secondWord != "")) {
      thirdWord = wordList[random(0,wordList.length,true)];
      debugLine(`nameGen`, `regenerated thirdWord: ${thirdWord}`)
    }
    
    if (thirdWord) {
			thirdWord = thirdWord.split(``);
			debugLine(`nameGen`, `thirdWord: ${thirdWord}`)
			
			thirdWord[0] = thirdWord[0].toUpperCase();
			debugLine(`nameGen`, `thirdWord: ${thirdWord}`)
			
			thirdWord=thirdWord.join(``);
			debugLine(`nameGen`, `thirdWord: ${thirdWord}`)
		}


    return numBefore + addThe + word + secondWord + thirdWord + numAfter;
  }

  function multiNameGen(amount) {
  	var finalArray = [];
  	for (i = 0; i < amount; i++) {
  		debugLine(`multiNameGen`, `LOOP FOR ${i}:`)
  		finalArray[i] = nameGen();
  	}
  	return finalArray
  }

  function linuxSplit(string) {
    var arrayElement = 0
    var resultArray = []
    var override = false
    var backslashOverride = false
    var quoteOverride = false
    for (var i = 0; i < string.length; i++) {
      if ((string.charAt(i) == ` `) && (override != true)) {

        if (string.charAt(i - 1) == "\\") {
          resultArray[arrayElement] = resultArray[arrayElement] + string.charAt(i)

          infoLine(`linuxSplit`, `space found but overridden, adding a space`)
        }
        else {
          arrayElement += 1

          infoLine(`linuxSplit`, `space found, time for next element`)
        }

      }
      else if (string.charAt(i) == `"`) {
        if (string.charAt(i - 1) == `\\`) {

          if (!resultArray[arrayElement]) {
            resultArray[arrayElement] = ``
          }
          resultArray[arrayElement] += `"`

          infoLine(`linuxSplit`, `backslash next to a double quote, overridden`)
        } else {
          override = !override
          quoteOverride = !quoteOverride

          infoLine(`linuxSplit`, `double quote detected, ${override == true? `now` : `no longer`} overriding`)
        }
      }
      else if (string.charAt(i) == `#` && quoteOverride == false) {
        infoLine(`linuxSplit`, `hash detected outside of a quote, returning early`)

      	// # is a comment in bash, so
      	return resultArray 
      	// early
      }
      else if (string.charAt(i) == `\\`) {
        // lol no-op
      }
      else {
        if (!resultArray[arrayElement]) {
          resultArray[arrayElement] = ``
        }
        resultArray[arrayElement] += string.charAt(i)
      }
    }
    infoLine(`linuxSplit`, `returning ${resultArray}`)
    return resultArray
  }

  function switchTwoChars(charOne, charTwo, string) {
  	string = string.split(``);
  	for (i = 0; i < string.length; i++) {
  	    if (string[i] == charOne) {string[i] = charTwo}
  	    else if (string[i] == charTwo) {string[i] = charOne};
  	}
  	return string.join(``)
  }

  String.prototype.switchTwoChars = function(charOne, charTwo) {
  	return switchTwoChars(charOne, charTwo, this)
  }

  function upsideDown(string) {
// zʎxʍʌnʇsɹbdouɯlʞɾıɥɓɟǝpɔqɐ

    return string.switchTwoChars(`a`, `ɐ`)
    .switchTwoChars(`b`, `q`)
    .switchTwoChars(`c`, `ɔ`)
    .switchTwoChars(`d`, `p`)
    .switchTwoChars(`e`, `ə`)
    .switchTwoChars(`f`, `ɟ`)
    .switchTwoChars(`g`, `ɓ`)
    .switchTwoChars(`h`, `ɥ`)
    .switchTwoChars(`i`, `ı`)
    .switchTwoChars(`j`, `ɾ`)
    .switchTwoChars(`k`, `ʞ`)
    .switchTwoChars(`m`, `ɯ`)
    .switchTwoChars(`r`, `ɹ`)
    .switchTwoChars(`t`, `ʇ`)
    .switchTwoChars(`u`, `n`)
    .switchTwoChars(`v`, `ʌ`)
    .switchTwoChars(`w`, `ʍ`)
    .switchTwoChars(`y`, `ʎ`)

// Z⅄XMΛ∩⊥SᴚΌԀONW˥⋊ſIH⅁ℲƎᗡƆᙠ∀

.switchTwoChars(`A`, `∀`)
.switchTwoChars(`B`, `ᙠ`)
.switchTwoChars(`C`, `Ɔ`)
.switchTwoChars(`D`, `ᗡ`)
.switchTwoChars(`E`, `Ǝ`)
.switchTwoChars(`F`, `Ⅎ`)
.switchTwoChars(`G`, `⅁`)
.switchTwoChars(`J`, `ſ`)
.switchTwoChars(`K`, `⋊`)
.switchTwoChars(`L`, `˥`)
.switchTwoChars(`M`, `W`)
.switchTwoChars(`P`, `Ԁ`)
.switchTwoChars(`Q`, `Ό`)
.switchTwoChars(`R`, `ᴚ`)
.switchTwoChars(`T`, `⊥`)
.switchTwoChars(`U`, `∩`)
.switchTwoChars(`V`, `Λ`)
.switchTwoChars(`Y`, `⅄`)

// 68ㄥ9ގㄣƐᄅ⇂0

.switchTwoChars(`1`, `⇂`)
.switchTwoChars(`2`, `↊`)
.switchTwoChars(`3`, `Ɛ`)
.switchTwoChars(`4`, `ㄣ`)
//.switchTwoChars(`5`, `5`)
.switchTwoChars(`6`, `9`)
.switchTwoChars(`7`, `ㄥ`)

// `!^&*(_[;'",.?
// ¿˙'„,؛]¯)*⅋ ̮¡ ̖

.switchTwoChars(`\``, ` ̖`)
.switchTwoChars(`!`, `¡`)
.switchTwoChars(`^`, ` ̮`)
.switchTwoChars(`&`, `⅋`)
.switchTwoChars(`(`, `)`)
.switchTwoChars(`_`, `¯`)
.switchTwoChars(`[`, `]`)
.switchTwoChars(`;`, `؛`)
.switchTwoChars(`'`, `,`)
.switchTwoChars(`"`, `„`)
.switchTwoChars(`.`, `˙`)
.switchTwoChars(`?`, `¿`)
.switchTwoChars(`{`, `}`)


    .newReverse()
  }

String.prototype.newReverse = function() {
	return newReverse(this)
}

  function longFlagTest(flagToTest, string, argCount) {
    var testArray = linuxSplit(string)

    if (argCount == undefined || argCount == null) {
      argCount = 0;
      debugLine(`longFlagTest`, `argCount can't be null or undefined, was set to 0 now`)
    }

    if (testArray.includes(`--${flagToTest}`)) {
      var flagLocation = testArray.indexOf(`--${flagToTest}`)
      debugLine(`longFlagTest`, `found "--${flagToTest}" in testArray, at location ${flagLocation}`)
      for (var i = 0; i <= argCount; i++) {
        debugLine(`longFlagTest`, `## start of loop for ${i}`)
        if (testArray[flagLocation] == undefined
            || testArray[flagLocation + i].startsWith(`-`)) {
          return `Error - too few arguments.  Expected ${argCount}, but got ${i - 1}`
        }
      }

      // if execution gets here, we know we have enough arguments, so
      infoLine(`longFlagTest`, `returning ${flagLocation}`)
      return flagLocation
    }
  }

  function shortFlagTest(flagToTest, string, argCount) {
    var testArray = linuxSplit(string)
    infoLine(`shortFlagTest`, `testArray init to ${testArray}`)

    if (argCount == undefined || argCount == null) {
      argCount = 0;
      infoLine(`shortFlagTest`, `argCount wasn't defined, is now 0`)
    }

    if (flagToTest.length > 1) {
      return `Error: Short flags are only one character long`
    }

    if (argCount > 0) {
      // return to longFlagTest's method and require the flag be separate

      var flagLocation = testArray.indexOf(`-${flagToTest}`)
      infoLine(`shortFlagTest`, `found -${flagToTest} at index ${flagLocation}`)
      for (var i = 1; i <= argCount; i++) {
      	console.log(`linuxSplit: loop for ${i}`)
        if (testArray[flagLocation] == undefined
            || testArray[flagLocation + i].startsWith(`-`)) {
          return `Error - too few arguments.  Expected ${argCount}, but got ${i - 1}`
        }
      }

      // if execution gets here, we know we have enough arguments, so
      return flagLocation
    } else {
      for (var i = 0; 1 < testArray.length; i++) {
        infoLine(`shortFlagTest`, `loop for ${i} / ${testArray[i]}`)
        if (testArray[i] == undefined) {
          infoLine(`is undefined, returning null`)
          return null
        }
        else if (testArray[i].startsWith(`-`) && (testArray[i].indexOf(flagToTest) > -1)) {
          infoLine(`shortFlagTest`, `found -${flagToTest} at index ${i}`)
          return i
        }
      }
    }
  }

  function flagTest(shortFlag, longFlag, string, argCount) {
    if (shortFlag != ``) {
      var sft = shortFlagTest(shortFlag, string, argCount)
      if (sft !== undefined) {
        return sft
      }
    }
    return longFlagTest(longFlag, string, argCount)
  }

  // This and the next three are used by the two following them.
  function charsToBytes(chars) {

    return chars.map(function(char) {

      return char.charCodeAt(0);

    });

  }

  //
  function bytesToChars(bytes) {
    return bytes.map(function(byte) {
      return String.fromCharCode(parseInt(byte, 10));
    });
  }

  //
  function decToBaseBytes(decBytes, base) {
    return decBytes.map(function(dec) {
      return (dec.toString(base)).substr(0 - (dec.toString(base)));
    });
  }

  //
  function baseToDecBytes(octBytes, base) {
    return octBytes.map(function(oct) {
      return parseInt(oct, base);
    });
  }



  //Take a string and break it into its codepoints in whatever base is specified
  function encode(str, base) {
    return decToBaseBytes(charsToBytes(str.split('')), base).join(' ');
  }

  // The reverse of encode() - takes codepoints and base and builds the string.
  function decode(octBytes, base) {
    return bytesToChars(baseToDecBytes(octBytes.split(' '), base)).join('');
  }

  // Will find a string and replace it with another. Can be case-sensitive.
  function findReplace(find, replace, caseSensitiveBool, string, failsafeBool) {



    if (caseSensitiveBool === false) {
      var esc = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      var reg = new RegExp(esc, 'ig');
      // case-insensitive is fixed
      var result = string.replace(reg, replace);
    } else {
      if (string.search(find) === -1 && failsafeBool === true) {
        return 'No matches found.'
      }

      var result = string.split(find).join(replace);
    }
    console.log(`findReplace(${find}, ${replace}, ${caseSensitiveBool}, ` +
                `${string}, ${failsafeBool}) was called. It returned ${result}.`)
    return result;
  }

  // this was needed for the "'/////help' works but prefix is '/'" bugfix.
  function findReplaceFirst(find, replace, string) {

    // This code was added to fix the /////help bug.
    if (string.search(find) === -1) {
      return 'No matches found.'
    }

    var result = string.replace(find, replace);
    console.log(`findReplaceFirst(${find}, ${replace}, ${string}) was called. It returned ${result}.`)
    return result;
  }

  // Find/replace right on a string
  String.prototype.findReplace = function(find, replace, caseSensitiveBool, failsafeBool) {
    return findReplace(find, replace, caseSensitiveBool, this, failsafeBool);
  }

  // Turn your text into dots
  function dotStyle(string) {
    var dottedString = string;

    function f(char, dots) {
      dottedString = dottedString.findReplace(char, dots, true, false);
      debugLine(`dotStyle() > f()`, `replacing ${char} with ${dots}`)
    }

    f(`A`, `⡮⡆`); f(`B`, `⣟⠅`); f(`C`, `⢎⡁`); f(`D`, `⣏⠆`);
    f(`E`, `⣟⡁`); f(`F`, `⡯⠁`); f(`G`, `⢎⡅`); f(`H`, `⡗⡇`);
    f(`I`, `⣹⡁`); f(`J`, `⢌⠇`); f(`K`, `⡗⡅`); f(`L`, `⣇⡀`);
    f(`M`, `⡟⡆`); f(`N`, `⡏⡆`); f(`O`, `⢎⠆`); f(`P`, `⡯⠂`);
    f(`Q`, `⢎⡆`); f(`R`, `⡯⡂`); f(`S`, `⣊⠅`); f(`T`, `⢹⠁`);
    f(`U`, `⢇⡇`); f(`V`, `⢇⠇`); f(`W`, `⣧⠇`); f(`X`, `⡕⡅`);
    f(`Y`, `⢱⠁`); f(`Z`, `⣝⡁`); f(` `, `⠀`);

    f(`a`, `⢔⡆`); f(`b`, `⣗⠄`); f(`c`, `⢔⡂`); f(`d`, `⢔⡇`);
    f(`e`, `⢶⡂`); f(`f`, `⢼⠅`); f(`g`, `⣲⠆`); f(`h`, `⡗⡄`);
    f(`i`, `⡅`);  f(`j`, `⣀⠅`); f(`k`, `⡧⡂`); f(`l`, `⠹⡀`);
    f(`m`, `⡖⡖⡄`);f(`n`, `⡖⡄`); f(`o`, `⢔⠄`); f(`p`, `⡶⠄`);
    f(`q`, `⠴⡆`); f(`r`, `⡖⠄`); f(`s`, `⣰⠂`); f(`t`, `⢺⡂`);
    f(`u`, `⢆⡆`); f(`v`, `⢆⠆`); f(`w`, `⣦⠆`); f(`x`, `⡢⡂`);
    f(`y`, `⡢⠂`); f(`z`, `⢲⡀`);

    f(`0`, `⢏⡆`); f(`1`, `⣺⡀`);
    f(`2`, `⣩⡂`); f(`3`, `⣙⠅`);
    f(`4`, `⠧⡇`); f(`5`, `⣛⠅`);
    f(`6`, `⢮⡅`); f(`7`, `⢩⠃`);
    f(`8`, `⢝⠅`); f(`9`, `⣛⠆`);

    f(`!`, `⡃`);  f(`"`, `⠃⠃`); f(`#`, `⡷⡇`); f(`$`, `⢼⠂`);
    f(`%`, `⠵⡂`); f(`&`, `⣪⠅`); f(`'`, `⠃`);  f(`\\(`, `⠰⡁`);
    f(`\\)`, `⢈⠆`); f(`\\*`, `⠕⠅`); f(`\\+`, `+`);  f(`,`, `⡄`);
    f(`-`, `-`);  f(`\\.`, `⡀`);  f(`/`, `⡰⠁`); f(`:`, `⡂`);
    f(`;`, `;`); f(`<`, `⠤⡂`); f(`=`, `⣒⡂`); f(`>`, `⡢⠄`);
    f(`\\?`, `⢩⠂`); f(`@`, `⣭⡆`); f(`\\[`, `⢸⡁`); f(`\\\\`, `⠱⡀`);
    f(`\\]`, `⢈⡇`); f(`^`, `⠊⠂`); f(`_`, `⣀⡀`); f("`", `⠈⠂`);
    f(`{`, `⢺⡁`); f(`|`, `⡇`); f(`}`, `⣹⠂`); f(`~`, `⠖⠃`);

    return dottedString
  }

  // Make your text  b i g   l i k e   t h i s  using fullwidth characters
  function FWtoASCII(string) {
    console.log(`FWtoASCII(${string}) was called.`)
    return findReplace(
      "\u3000", ' ', false, string.replace(
        /[\uff01-\uff5e]/g,
        function(ch) {
          return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
        }
      )
      , false
    )
  }

  // Convert  f u l l w i d t h  to ASCII equivalents
  function ASCIItoFW(string) {
    console.log(`ASCIItoFW(${string}) was called.`)
    return findReplace(
      ' ', '\u3000', false, string.replace(/[\u0021-\u007e]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
      })
      , false
    )
  }


  function reverseString(str) {
    return str.split("").reverse().join("");
  }

  // From Nebula:
  /* Some code used from Cmds */
  //function meowReverse(string) {
  //  if (string == /[a-zA-Z0-9À-ž]/) {
  //      return string.replace(/([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\uFE00-\uFE0F]+)/g, ($0, $1, $2) => $2.split("").reverse().join("") + $1)
  //  }
  //  return string.replace(/([\uD800-\uDBFF])([\uDC00-\uDFFF])/g, "$2$1").split("").reverse().join("");
  //};

  // from Warning Sign
  function newReverse(text) {
    return text
      .replace(/([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\uFE00-\uFE0F]+)/g, ($0, $1, $2) => $2.split("").reverse().join("") + $1)
      .replace(/([\uD800-\uDBFF])([\uDC00-\uDFFF])/g, "$2$1").split("").reverse().join("");
  }

}
catch (err) {
  sendChat(`Couldn't load the text-manipulation functions | ${err}`)
  failures.text = err;
}
//                            </TEXT MANIPULATION>



//                           <COLOR MANIPULATION>
failures.color = false;
try {
  // Pattern to detect hexcodes of any format
  var pattern = new RegExp("^\#?([0-9a-fA-F]{3}){1,2}$");

  // Pattern to detect #aBcDeF-style hexcodes.
  var pattern2 = new RegExp("^\#[0-9a-fA-F]{6}$");

  // Unified function for color names
  function getColorName(color) {
    var col = new Color(color)
    return col.getName().toLowerCase().findReplace('spanish', 'Spanish', true).findReplace('ms-dos', 'MS-DOS', true).findReplace('microsoft', 'Microsoft', true).findReplace('google', 'Google', true).findReplace(`miles prower`, `Miles Prower`, true).findReplace(`windows classic`, `Windows Classic`, true).findReplace(`windows 7`, `Windows 7`, true)
  }

  /* Take a hexcode of any format, and convert it to #abcdef (all lowercase).
	'#abcdef' -> '#abcdef'
	'abcdef' -> '#abcdef'
	'#abc' -> '#aabbcc'
	'abc' -> '#aabbcc'
	Thanks to .toLowerCase():
	'#ABCDEF' -> '#abcdef'
	'ABCDEF' -> '#abcdef'
	'#ABC' -> '#aabbcc'
	'ABC' -> '#aabbcc'
	*/
  function expandHexcode(hexcode) {
    if (pattern.test(hexcode)) {
      hexcode = hexcode.toLowerCase();
      if (hexcode.length === 4) {
        return `#${hexcode.charAt(1)}${hexcode.charAt(1)}${hexcode.charAt(2)}
${hexcode.charAt(2)}${hexcode.charAt(3)}${hexcode.charAt(3)}`
      } else if (hexcode.length === 3) {
        return `#${hexcode.charAt(0)}${hexcode.charAt(0)}${hexcode.charAt(1)}
${hexcode.charAt(1)}${hexcode.charAt(2)}${hexcode.charAt(2)}`
      } else if (hexcode.length === 6) {
        return `#${hexcode.charAt(0)}${hexcode.charAt(1)}${hexcode.charAt(2)}
${hexcode.charAt(3)}${hexcode.charAt(4)}${hexcode.charAt(5)}`
      } else {
        return hexcode
      }
    }
    // This is required by ESLint's consistent-return option
    return;
  }

  //Take a #abcdef-style hexcode and return an array of its bytes (in lowercase)
  function splitHexcode(hexcode) {
    hexcode= hexcode.toLowerCase();
    if (pattern2.test(hexcode)) {
      return [`${hexcode.charAt(1)}${hexcode.charAt(2)}`, `${hexcode.charAt(3)}${hexcode.charAt(4)}`, `${hexcode.charAt(5)}${hexcode.charAt(6)}`]
    }
    // This is required by ESLint's consistent-return option
    return;
  }

  /* Takes a hexcode...
			 ...expands it to #abcdef in lowercase...
					...splits it into an array of its bytes...
						...splits that array into three variables...
							 ...converts those string-vars from hex to decimal...
									...and wraps that in one string, as the RGB representation. */
  function hexcodeToRGB(hexcode) {
    if (pattern.test(hexcode)) {
      var expandedHex = expandHexcode(hexcode);
      var splitHex = splitHexcode(expandedHex);
      var hexRed = splitHex[0];
      var asciiRed = decode(hexRed, 16);
      var decRed = encode(asciiRed, 10);
      var hexGreen = splitHex[1];
      var asciiGreen = decode(hexGreen, 16);
      var decGreen = encode(asciiGreen, 10);
      var hexBlue = splitHex[2];
      var asciiBlue = decode(hexBlue, 16);
      var decBlue = encode(asciiBlue, 10);
      return `${decRed} ${decGreen} ${decBlue}`;
    } else {
      return `That's not a proper hexcode.`;
    }
  }

  // Take a color in RGB and convert it to hex
  /*function rgbToHexcode(rgbString) {
    var testPattern = new RegExp("^(\d[1-3])[3]$")
    if (testPattern.test(rgbString)) {
      var splitRGB = rgbString.split(' ')
      var decRed = splitRGB[0];
      var asciiRed = decode(decRed, 10);
      var hexRed = encode(asciiRed, 16);
      if (hexRed.length === 1) {
        hexRed = `0${hexRed}`
      }
      var decGreen = splitRGB[1];
      var asciiGreen = decode(decGreen, 10);
      var hexGreen = encode(asciiGreen, 16);
      if (hexGreen.length === 1) {
        hexGreen = `0${hexGreen}`
      }
      var decBlue = splitRGB[2];
      var asciiBlue = decode(decBlue, 10);
      var hexBlue = encode(asciiBlue, 16);
      if (hexBlue.length === 1) {
        hexBlue = `0${hexBlue}`
      }
      return `#${hexRed}${hexGreen}${hexBlue}`
    }
    // This is required by ESLint's consistent-return option
    return;
  }*/
  function rgbToHexcode(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;

    return "#" + r + g + b;
  };

  function invertHex(hexcode) {
  	return hexcode.switchTwoChars(`0`, `f`).switchTwoChars(`1`, `e`).switchTwoChars(`2`, `d`).switchTwoChars(`3`, `c`).switchTwoChars(`4`, `b`).switchTwoChars(`5`, `a`).switchTwoChars(`6`, `9`).switchTwoChars(`7`, `8`)
  }
}
catch (err) {
  sendChat(`Couldn't load the color-manipulation functions | ${err}`)
  failures.color = err;
}
//                           </COLOR MANIPULATION>



//                                 <SOUNDS>
failures.sound = false;
try {

  function press(note, vol) {
    if (botSettings.chromeCompatibility == true) {
      if (!vol && vol !== 0) {
        vol = 1
        debugLine(`chromeCompat...`, `chrome compatibility is enabled, setting note volume to 1`)
      }
    }
    MPP.press(note, vol)
  }

  // Play every note
  function boom(times, vol) {
    for (var i=1;i<=times;i++){
      for (var keys in MPP.piano.keys) {
        press(keys, vol)
      }

      console.log(`boom(${times}, ${vol} was called.)`);
    }
  }


  function wave(wavetime){
    Object.keys(MPP.piano.keys).forEach((note, i) => setTimeout(MPP.press, wavetime * i, note, 0.01));
  };
  // thanks, Fishi!

  function playSound(soundObj) {
    advNotes(soundObj.sound, soundObj.tempo)
  }

  function Note(n, d) {
    return {n: n, v: 1, d: d || 0}
  }


  function SNotes(d) {
    var arr = [];
    for (var k in MPP.piano.keys) {
      arr.push(new Note(k, d))
    }
    return arr
  }



  // Spam notes more than I can boom()
  function spam(s, d) {
    spamPacks = [];
    display = d;
    for (var i = 0;i < s;i++) {
      spamPacks.push(new SNotes(i * 860));
    }
    spamPacks.forEach(function(a, b){
      setTimeout(function(){
        if (b % display == 0) {MPP.chat.send("Charged: "+(100 * (s-b)/s)+"%")}
        MPP.client.sendArray([{m: "n", n: a, t: Date.now()}])
      }, (s - b) * 860)
    });
  }


  // A large function to play some music
  function playNotes(text, tempo) {
    console.log(`playNotes(${text}, ${tempo}) was called.`)
    var i=0;    //test    dont forget caps ( works but Make this loop later)
    var A=0;    //6                 //skips the !p part
    var B=1;    //7                 //skips the !p part
    var Speed=parseInt(tempo); //     substr(start, length) vs substring(start, end)
    if (text === '') {
      sendChat('Tip: [Space] can be used multiple times, even though it doesn\'t space out in chat. ` produces a 50 ms delay, ~ at 25 ms, \\ at 200, and | at 400.')
    }
    while (i <= text.length + 5) {                           //times it loops through
      if (text.substring(A, B) == "/") {setTimeout(function() { press("a-1")}, Speed);}
      if (text.substring(A, B) == "/") {setTimeout(function() { press("as-1")}, Speed);}
      if (text.substring(A, B) == "z") {setTimeout(function() { press("a1")}, Speed);}
      if (text.substring(A, B) == "a") {setTimeout(function() { press("gs1")}, Speed);}
      if (text.substring(A, B) == "s") {setTimeout(function() { press("as1")}, Speed);}
      if (text.substring(A, B) == "f") {setTimeout(function() { press("cs2")}, Speed);}
      if (text.substring(A, B) == "g") {setTimeout(function() { press("ds2")}, Speed);}
      if (text.substring(A, B) == "x") {setTimeout(function() { press("b1")}, Speed);}
      if (text.substring(A, B) == "c") {setTimeout(function() { press("c2")}, Speed);}
      if (text.substring(A, B) == "v") {setTimeout(function() { press("d2")}, Speed);}
      if (text.substring(A, B) == "b") {setTimeout(function() { press("e2")}, Speed);}
      if (text.substring(A, B) == "n") {setTimeout(function() { press("f2")}, Speed);}
      if (text.substring(A, B) == "j") {setTimeout(function() { press("fs2")}, Speed);}
      if (text.substring(A, B) == "k") {setTimeout(function() { press("gs2")}, Speed);}
      if (text.substring(A, B) == "1") {setTimeout(function() { press("gs2")}, Speed);}
      if (text.substring(A, B) == "l") {setTimeout(function() { press("as2")}, Speed);}
      if (text.substring(A, B) == "2") {setTimeout(function() { press("as2")}, Speed);}
      if (text.substring(A, B) == "m") {setTimeout(function() { press("g2")}, Speed);}
      if (text.substring(A, B) == ",") {setTimeout(function() { press("a2")}, Speed);}
      if (text.substring(A, B) == ".") {setTimeout(function() { press("b2")}, Speed);}
      if (text.substring(A, B) == "/") {setTimeout(function() { press("c3")}, Speed);}
      if (text.substring(A, B) == "q") {setTimeout(function() { press("a2")}, Speed);}
      if (text.substring(A, B) == "w") {setTimeout(function() { press("b2")}, Speed);}
      if (text.substring(A, B) == "e") {setTimeout(function() { press("c3")}, Speed);}
      if (text.substring(A, B) == "4") {setTimeout(function() { press("cs3")}, Speed);}
      if (text.substring(A, B) == "5") {setTimeout(function() { press("ds3")}, Speed);}
      if (text.substring(A, B) == "7") {setTimeout(function() { press("fs3")}, Speed);}
      if (text.substring(A, B) == "8") {setTimeout(function() { press("gs3")}, Speed);}
      if (text.substring(A, B) == "9") {setTimeout(function() { press("as3")}, Speed);}
      if (text.substring(A, B) == "-") {setTimeout(function() { press("cs4")}, Speed);}
      if (text.substring(A, B) == "=") {setTimeout(function() { press("ds4")}, Speed);}
      if (text.substring(A, B) == "r") {setTimeout(function() { press("d3")}, Speed);}
      if (text.substring(A, B) == "t") {setTimeout(function() { press("e3")}, Speed);}
      if (text.substring(A, B) == "y") {setTimeout(function() { press("f3")}, Speed);}
      if (text.substring(A, B) == "u") {setTimeout(function() { press("g3")}, Speed);}
      if (text.substring(A, B) == "i") {setTimeout(function() { press("a3")}, Speed);}
      if (text.substring(A, B) == "o") {setTimeout(function() { press("b3")}, Speed);}
      if (text.substring(A, B) == "p") {setTimeout(function() { press("c4")}, Speed);}
      if (text.substring(A, B) == "[") {setTimeout(function() { press("d4")}, Speed);}
      if (text.substring(A, B) == "]") {setTimeout(function() { press("e4")}, Speed);}

      //shift
      if (text.substring(A, B) == "Z") {setTimeout(function() { press("a2")}, Speed);}
      if (text.substring(A, B) == "A") {setTimeout(function() { press("gs2")}, Speed);}
      if (text.substring(A, B) == "S") {setTimeout(function() { press("as2")}, Speed);}
      if (text.substring(A, B) == "F") {setTimeout(function() { press("cs3")}, Speed);}
      if (text.substring(A, B) == "G") {setTimeout(function() { press("ds3")}, Speed);}
      if (text.substring(A, B) == "X") {setTimeout(function() { press("b2")}, Speed);}
      if (text.substring(A, B) == "C") {setTimeout(function() { press("c3")}, Speed);}
      if (text.substring(A, B) == "V") {setTimeout(function() { press("d3")}, Speed);}
      if (text.substring(A, B) == "B") {setTimeout(function() { press("e3")}, Speed);}
      if (text.substring(A, B) == "N") {setTimeout(function() { press("f3")}, Speed);}
      if (text.substring(A, B) == "J") {setTimeout(function() { press("fs3")}, Speed);}
      if (text.substring(A, B) == "K") {setTimeout(function() { press("gs3")}, Speed);}
      if (text.substring(A, B) == "!") {setTimeout(function() { press("gs3")}, Speed);}
      if (text.substring(A, B) == "L") {setTimeout(function() { press("as3")}, Speed);}
      if (text.substring(A, B) == "@") {setTimeout(function() { press("as3")}, Speed);}
      if (text.substring(A, B) == "M") {setTimeout(function() { press("g3")}, Speed);}
      if (text.substring(A, B) == "<") {setTimeout(function() { press("a3")}, Speed);}
      if (text.substring(A, B) == ">") {setTimeout(function() { press("b3")}, Speed);}
      if (text.substring(A, B) == "?") {setTimeout(function() { press("c4")}, Speed);}
      if (text.substring(A, B) == "Q") {setTimeout(function() { press("a3")}, Speed);}
      if (text.substring(A, B) == "W") {setTimeout(function() { press("b3")}, Speed);}
      if (text.substring(A, B) == "E") {setTimeout(function() { press("c4")}, Speed);}
      if (text.substring(A, B) == "$") {setTimeout(function() { press("cs4")}, Speed);}
      if (text.substring(A, B) == "%") {setTimeout(function() { press("ds4")}, Speed);}
      if (text.substring(A, B) == "&") {setTimeout(function() { press("fs4")}, Speed);}
      if (text.substring(A, B) == "*") {setTimeout(function() { press("gs4")}, Speed);}
      if (text.substring(A, B) == "(") {setTimeout(function() { press("as4")}, Speed);}
      if (text.substring(A, B) == "_") {setTimeout(function() { press("cs5")}, Speed);}
      if (text.substring(A, B) == "+") {setTimeout(function() { press("ds5")}, Speed);}
      if (text.substring(A, B) == "R") {setTimeout(function() { press("d4")}, Speed);}
      if (text.substring(A, B) == "T") {setTimeout(function() { press("e4")}, Speed);}
      if (text.substring(A, B) == "Y") {setTimeout(function() { press("f4")}, Speed);}
      if (text.substring(A, B) == "U") {setTimeout(function() { press("g4")}, Speed);}
      if (text.substring(A, B) == "I") {setTimeout(function() { press("a4")}, Speed);}
      if (text.substring(A, B) == "O") {setTimeout(function() { press("b4")}, Speed);}
      if (text.substring(A, B) == "P") {setTimeout(function() { press("c5")}, Speed);}
      if (text.substring(A, B) == "{") {setTimeout(function() { press("d5")}, Speed);}
      if (text.substring(A, B) == "}") {setTimeout(function() { press("e5")}, Speed);}
      if (text.substring(A, B) == " ") {setTimeout(function() { noop() }, Speed);Speed+=tempo;}
      if (text.substring(A, B) == "`") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 0.5;}
      if (text.substring(A, B) == "~") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 0.25;}
      if (text.substring(A, B) == "\\"){setTimeout(function() { noop() }, Speed);Speed+=tempo * 2;}
      if (text.substring(A, B) == "|") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 4;}
      A+=1; B+=1;
      i++;
    }//loop
  }


  function advNotes(text, tempo) {
    console.log(`advNotes(${text}, ${tempo}) was called.`)
    var i=0;    //test  dont forget caps ( works but Make this loop later)
    var A=0;    //6                 //skips the !p part
    var B=1;    //7                 //skips the !p part
    var Speed=parseInt(tempo); //     substr(start, length) vs substring(start, end)
    var lowestOctave = 2;
    var volume = 1;
    // 3rd octave for  as fg j   zxcvbnm
    // 4th octave for  12 45 7   qwertyu
    // 5th octave for  AS FG J   ZXCVBNM
    // 6th octave for  !@ $% &   QWERTYU
    if (text === '' || !text) {
      sendChat("Advanced Notes command: [Space] can be used multiple times though it " +
               "doesn't space out in chat. | is also the same length"+
               "of delay. \\ is a 50% delay, ] is 25%, [ is 12.5%," +
               "{ is 200%, and } is 400%. + and - change the octave range, and \" and _ increase and decrease volume respectively.")
    }


    while (i<=text.length+5) {                    //times it loops through


      setTimeout(function() {
        if (lowestOctave >= 4) {
          lowestOctave = 4;
        }
        if (lowestOctave <= 0) {
          lowestOctave = 0;
        }
        if (volume < 0.1) {
          volume = 0.1;
        }
        if (volume > 2) {
          volume = 2;
        }}
                 , Speed); // Nailed it.
      if (text.substring(A, B) == "z") {setTimeout(function() { press(`a${lowestOctave - 1}`, volume)}, Speed);}
      if (text.substring(A, B) == "x") {setTimeout(function() { press(`b${lowestOctave - 1}`, volume)}, Speed);}
      if (text.substring(A, B) == "c") {setTimeout(function() { press(`c${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "v") {setTimeout(function() { press(`d${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "b") {setTimeout(function() { press(`e${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "n") {setTimeout(function() { press(`f${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "m") {setTimeout(function() { press(`g${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "a") {setTimeout(function() { press(`gs${lowestOctave - 1}`, volume)}, Speed);}
      if (text.substring(A, B) == "s") {setTimeout(function() { press(`as${lowestOctave - 1}`, volume)}, Speed);}
      if (text.substring(A, B) == "f") {setTimeout(function() { press(`cs${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "g") {setTimeout(function() { press(`ds${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "j") {setTimeout(function() { press(`fs${lowestOctave}`, volume)}, Speed);}

      if (text.substring(A, B) == "q") {setTimeout(function() { press(`a${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "w") {setTimeout(function() { press(`b${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "e") {setTimeout(function() { press(`c${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "r") {setTimeout(function() { press(`d${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "t") {setTimeout(function() { press(`e${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "y") {setTimeout(function() { press(`f${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "u") {setTimeout(function() { press(`g${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "1") {setTimeout(function() { press(`gs${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "2") {setTimeout(function() { press(`as${lowestOctave}`, volume)}, Speed);}
      if (text.substring(A, B) == "4") {setTimeout(function() { press(`cs${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "5") {setTimeout(function() { press(`ds${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "7") {setTimeout(function() { press(`fs${lowestOctave+1}`, volume)}, Speed);}

      if (text.substring(A, B) == "Z") {setTimeout(function() { press(`a${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "X") {setTimeout(function() { press(`b${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "C") {setTimeout(function() { press(`c${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "V") {setTimeout(function() { press(`d${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "B") {setTimeout(function() { press(`e${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "N") {setTimeout(function() { press(`f${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "M") {setTimeout(function() { press(`g${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "A") {setTimeout(function() { press(`gs${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "S") {setTimeout(function() { press(`as${lowestOctave+1}`, volume)}, Speed);}
      if (text.substring(A, B) == "F") {setTimeout(function() { press(`cs${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "G") {setTimeout(function() { press(`ds${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "J") {setTimeout(function() { press(`fs${lowestOctave+2}`, volume)}, Speed);}

      if (text.substring(A, B) == "Q") {setTimeout(function() { press(`a${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "W") {setTimeout(function() { press(`b${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "E") {setTimeout(function() { press(`c${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "R") {setTimeout(function() { press(`d${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "T") {setTimeout(function() { press(`e${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "Y") {setTimeout(function() { press(`f${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "U") {setTimeout(function() { press(`g${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "!") {setTimeout(function() { press(`gs${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "@") {setTimeout(function() { press(`as${lowestOctave+2}`, volume)}, Speed);}
      if (text.substring(A, B) == "$") {setTimeout(function() { press(`cs${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "%") {setTimeout(function() { press(`ds${lowestOctave+3}`, volume)}, Speed);}
      if (text.substring(A, B) == "&") {setTimeout(function() { press(`fs${lowestOctave+3}`, volume)}, Speed);}

      if (text.substring(A, B) == " ") {setTimeout(function() { noop() }, Speed);Speed+=tempo;}        //can be used multiple times even though it doesn't space out in chat
      if (text.substring(A, B) == "\\"){setTimeout(function() { noop() }, Speed);Speed+=tempo * 0.5;}
      if (text.substring(A, B) == "]") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 0.25;}
      if (text.substring(A, B) == "[") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 0.125;}
      if (text.substring(A, B) == "|") {setTimeout(function() { noop() }, Speed);Speed+=tempo;}
      if (text.substring(A, B) == "{") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 2;}
      if (text.substring(A, B) == "}") {setTimeout(function() { noop() }, Speed);Speed+=tempo * 4;}
      if (text.substring(A, B) == "+") {setTimeout(function() {lowestOctave+=1}, Speed);}
      if (text.substring(A, B) == "-") {setTimeout(function() {lowestOctave-=1}, Speed);}
      if (text.substring(A, B) == "\""){setTimeout(function() {volume+=0.1}, Speed);}
      if (text.substring(A, B) == "_") {setTimeout(function() {volume-=0.1}, Speed);}
      A+=1; B+=1;
      i++;
    }//loop
  }


}
catch (err) {
  sendChat(`Couldn't load the sound functions | ${err}`)
  failures.sound = err;
}
//                                 </SOUNDS>



//                                  <MATH>
failures.math = false;
try {
  function round(number, accuracy) {

    var multiplier = '1'

    for (var i = 0; i < accuracy; i++) {

      multiplier += '0';

    }

    multiplier = Number(multiplier);

    return Math.round(number * multiplier) / multiplier

  }

  function random(min, max, integerBool) {

    if (integerBool === true) {

      return Math.round(Math.random() * (max - min + 1) + min)

    }

    return Math.random() * (max - min + 1) + min;

  }

  function constructPythTriple(m, n) {

    if (m < n) {

      var a = n*n - m*m
      var b = 2*n*m
      var c = n*n + m*m

      return `Side lengths: ${a}, ${b}, ${c}`

    } else {

      return `Invalid numbers - m is greater than or equal to n.`

    }

  }

  // Factorial: x! = x * (x-1) * ... * 3 * 2
  function factorial(num) {
    if (num < 0 || parseInt(num) !== parseFloat(num) ) {
      return `Error: Cannot factorialise ${num}.`;
    } else if (num == 0) {
      return 1;
    } else {
      return (num * factorial(num - 1));
    }
  }

  // Calculate the factors of a number
  function advFactors(n, includeSums) {

    // Does 0 have any factors?  I'm using infinity here, correct me if I'm wrong.
    if (n === 0) {
      return "Infinity.";
    }

    // Non-integers don't have factors.
    if (n % 1 !== 0) {
      return "The input must be an integer, as non-integers don't have factors.";
    }

    // Check only up to the square root of the absolute value of n.
    // All factors above that will pair with factors below that.
    var absvalOfN = Math.abs(n),
        sqrtOfN = Math.sqrt(absvalOfN),
        numbersToCheck = [];
    for (var i=1; i <= sqrtOfN; i++) {
      numbersToCheck.push(i);
    }

    // Create an array of factor pairs.
    var factors = [];
    for (var i=0; i <= numbersToCheck.length; i++) {
      if (absvalOfN % i === 0) {
        // Include both positive and negative factors
        if (n>0) {
          factors.push([i, absvalOfN / i]);
          if (includeSums == true) {
            factors.push(`${i + (absvaOfN / i)} ::`)
          }
          factors.push([-i, -absvalOfN / i]);
          if (includeSums == true) {
            factors.push(`${-i + (-absvaOfN / i)} ::`)
          }
        } else {
          factors.push([-i, absvalOfN / i]);
          if (includeSums == true) {
            factors.push(`${-i + (absvaOfN / i)} ::`)
          }
          factors.push([i, -absvalOfN / i]);
          if (includeSums == true) {
            factors.push(`${i + (-absvaOfN / i)} ::`)
          }
        }
      }
    }

    // Test for the console
    console.log(`[advFactors] FACTORS OF "+n+":\n`+
                `[advFactors] There are ${factors.length} factor pairs.`);
    for (var i=0; i<factors.length; i++) {
      console.log(factors[i]);
    }

    return factors.join(' :: ');
  }
  // end: function advFactors(n)

  // Calculate coords for directed line seg. from (x1,y1) to (x2,y2) w/ m:n ratio
  function directSegment(x1, y1, x2, y2, m, n) {
    var x = ((m)/(m+n))*(x2-x1)+x1
    var y = ((m)/(m+n))*(y2-y1)+y1
    return `Coords for directed line segment from (${x1}, ${y1}) to (${x2}, ${y2}) split ${m}:${n}: (${x}, ${y})`
  }

  // Heron's Formula - Calculate a triangle's area from side lengths
  function heronsFormula(a, b, c) {
    var s = (a+b+c)/2
    return Math.sqrt(s*(s-a)*(s-b)*(s-c))
  }

  // Two-Point formula, originally a TI-BASIC program I got from a video.
  function twoPoint(x1, y1, x2, y2) {
    var slope = (y2-y1)/(x2-x1)
    var step1 = slope * (0 - x1)
    var step2 = 0 - y1
    var yInt = step1 - step2
    return `Slope-Intercept: y = ${slope}x + (${yInt}) ||| Point-Slope: y-${y1} = ${slope}(x-${x1})`
    //      \\ will show as \ in a string
  }

  // 'Three sides, no diagram - what triangle is this?' function
  function triangleTest(a, b, c) {

    var string = []

    // If the side lengths are good...
    if (a + b > c
        && a + c > b
        && b + c > a) {

      // ...then determine if we have an equilateral,
      // 30-60-90, isoceles, or scalene triangle.

      // If two sides equal in length...
      if (a == b || a == c || b == c) {

        // ...and if all three equal, then it's equilateral.
        if (a == b == c) {
          return 'equilateral triangle'
        }

        // Otherwise, it's isoceles.
        else {
          string[1] = 'isoceles'
        }
      }

      // No sides equal in length.
      // Check if this is a 30-60-90 triangle.
      else
        if ( (b == Math.sqrt(3)*a && c == 2*a)
            ||
            (a == Math.sqrt(3)*b && c == 2*b)

            ||

            (b == Math.sqrt(3)*c && a == 2*a)
            ||
            (c == Math.sqrt(3)*b && a == 2*b)

            ||

            (c == Math.sqrt(3)*a && b == 2*a)
            ||
            (a == Math.sqrt(3)*c && b == 2*b)
           ) {
          return '30-60-90 right triangle'
        }
      // If it isn't, then it's just plain scalene.
      else {
        string[1] = 'scalene'
      }


      // Right, obtuse, or acute triangle

      // Now we need to check the angles.

      if (a*a+b*b==c*c || c*c+b*b==a*a || a*a+c*c==b*b) {
        // sum of squares of shorter sides equal to square of largest
        //   (aka Pythagorean theorem)
        string[0] = 'right'
      } else if (a*a+b*b!=c*c || c*c+b*b!=a*a || a*a+c*c!=b*b) {

        if (a*a+b*b<c*c || c*c+b*b<a*a || a*a+c*c<b*b) {
          // sum of squares of shorter sides smaller than square of largest
          string[0] = 'obtuse'
        } else if (a*a+b*b>c*c || c*c+b*b>a*a || a*a+c*c>b*b) {
          // sum of squares of shorter sides larger than square of largest
          string[0] = 'acute'
        }

      }

      //                couldn't make a triangle? here's why

    } else if (a + b == c || a + c == b || c + b == a) {

      // sum of two shorter sides equal to longest
      return 'The triangle would be flattened out'

    } else {

      // sum of two shorter sides less than longest
      return 'A triangle is not possible with the lengths you chose'

    }

    return string.join(' ')
  }

  // two legs of a right triangle - calculate the hypotenuse (uses Math)
  function hypotenuse(leg1, leg2) {

    return Math.hypot(leg1, leg2)

  }

  // conversion function - semi-manual but all-encompassing
  function omniConvert(x, multBefore, add, mult) {

    try {
      if (!(mult)) {
        mult = 1;
      }
      x = parseFloat(x);
      multBefore = parseFloat(multBefore);
      add = parseFloat(add);
      mult = parseFloat(mult);
      return ((x * multBefore) + add) * (mult);
    } catch (err) {
      if (!(add)) {
        sendChat(`Temperature conversion error: variable "add" wasn't defined`)
      }
    }
    // This is required by ESLint's consistent-return option
    return;

  }
}
catch (err) {
  sendChat(`Couldn't load the math functions | ${err}`)
  failures.math = err;
}
//                                  </MATH>



//                            <GENERAL FUNCTIONS>
failures.generalFunctions = false;
try {

	

var eightballResponses = [
    `+ It is certain.`,
    `+ It is decidedly so.`,
    `+ Without a doubt.`,
    `+ Yes – definitely.`,
    `+ You may rely on it.`,
    `+ As I see it, yes.`,
    `+ Most likely.`,
    `+ Outlook good.`,
    `+ Yes.`,
    `+ Signs point to yes.`,
    `: Reply hazy, try again.`,
    `: Ask again later.`,
    `: Better not tell you now.`,
    `: Cannot predict now.`,
    `: Concentrate and ask again.`,
    `– Don't count on it.`,
    `– My reply is no.`,
    `– My sources say no.`,
    `– Outlook not so good.`,
    `– Very doubtful.`,
]

function eightball() {
	return eightballResponses[random(0, 19, true)]
}

function jsSandbox(code) {aozsandbox = window.open(); return aozsandbox.eval( `setTimeout( window.close(), 10000 );` + code ) }
	function secToTime(sec) {

		var seconds = sec % 60

		sec = Math.floor(sec / 60);

		var minutes = sec % 60

		sec = Math.floor(sec / 60);

		var hours = sec % 24

		return `${`${hours}`.length == 1? `0${hours}` : hours}:${`${minutes}`.length == 1? `0${minutes}` : minutes}:${`${seconds}`.length == 1? `0${seconds}` : seconds}`
	}

	// from Hri7566:
	function g_uptime(int){var date = new Date(0);date.setSeconds(int);var timeString = date.toISOString().substr(11, 8);return (timeString)}
var secondsUptime = 0;

	setInterval(function() {
		++secondsUptime;
	}, 1000)

	function unban(player_IDToUnban) {MPP.client.sendArray([{m: "unban", _id: "${player_IDToUnban}"}]);}

  function testLogs() {
    traceLine(`trce`, `Trace lines look like this`)
    verboseLine(`vrbs`, `Verbose lines look like this`)
    debugLine(`dbug`, `Debug lines look like this`)
    infoLine(`info`, `Info lines look like this`)
    markLine(`mark`, `Mark lines look like this`)
    noteLine(`note`, `Notification lines look like this`)
    warnLine(`warn`, `Warning lines look like this`)
    errLine(`fail`, `Error lines look like this`)
    critLine(`crit`, `Critical lines look like this`)
    alertLine(`alrt`, `Alert lines look like this`)
    emerLine(`emer`, `Emergency lines look like this`)
  }

  function setLogLevel(area, level) {
    if (area == `console`) {
      if (level == `trace`) {
        botSettings.log.trace.console = true;
        botSettings.log.verbose.console = true;
        botSettings.log.debug.console = true;
        botSettings.log.info.console = true;
        botSettings.log.mark.console = true;
        botSettings.log.notification.console = true;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `verbose`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = true;
        botSettings.log.debug.console = true;
        botSettings.log.info.console = true;
        botSettings.log.mark.console = true;
        botSettings.log.notification.console = true;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `debug`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = true;
        botSettings.log.info.console = true;
        botSettings.log.mark.console = true;
        botSettings.log.notification.console = true;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `info`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = true;
        botSettings.log.mark.console = true;
        botSettings.log.notification.console = true;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `mark`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = true;
        botSettings.log.notification.console = true;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `note`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = false;
        botSettings.log.notification.console = true;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `warn`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = false;
        botSettings.log.notification.console = false;
        botSettings.log.warning.console = true;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `error`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = false;
        botSettings.log.notification.console = false;
        botSettings.log.warning.console = false;
        botSettings.log.error.console = true;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `crit`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = false;
        botSettings.log.notification.console = false;
        botSettings.log.warning.console = false;
        botSettings.log.error.console = false;
        botSettings.log.critical.console = true;
        botSettings.log.alert.console = true;
        botSettings.log.emergency.console = true;
      }
      else if (level == `alert`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = false;
        botSettings.log.notification.console = false;
        botSettings.log.warning.console = false;
        botSettings.log.error.console = false;
        botSettings.log.critical.console = false;
        botSettings.log.alert.console = false;
        botSettings.log.emergency.console = true;
      }
      else if (level == `emer`) {
        botSettings.log.trace.console = false;
        botSettings.log.verbose.console = false;
        botSettings.log.debug.console = false;
        botSettings.log.info.console = false;
        botSettings.log.mark.console = false;
        botSettings.log.notification.console = false;
        botSettings.log.warning.console = false;
        botSettings.log.error.console = false;
        botSettings.log.critical.console = false;
        botSettings.log.alert.console = false;
        botSettings.log.emergency.console = true;
      }
    }



    else
      if (area == `chat`) {
        if (level == `trace`) {
          botSettings.log.trace.chat = true;
          botSettings.log.verbose.chat = true;
          botSettings.log.debug.chat = true;
          botSettings.log.info.chat = true;
          botSettings.log.mark.chat = true;
          botSettings.log.notification.chat = true;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `verbose`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = true;
          botSettings.log.debug.chat = true;
          botSettings.log.info.chat = true;
          botSettings.log.mark.chat = true;
          botSettings.log.notification.chat = true;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `debug`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = true;
          botSettings.log.info.chat = true;
          botSettings.log.mark.chat = true;
          botSettings.log.notification.chat = true;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `info`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = true;
          botSettings.log.mark.chat = true;
          botSettings.log.notification.chat = true;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `mark`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = true;
          botSettings.log.notification.chat = true;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `note`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = false;
          botSettings.log.notification.chat = true;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `warn`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = false;
          botSettings.log.notification.chat = false;
          botSettings.log.warning.chat = true;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `error`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = false;
          botSettings.log.notification.chat = false;
          botSettings.log.warning.chat = false;
          botSettings.log.error.chat = true;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `crit`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = false;
          botSettings.log.notification.chat = false;
          botSettings.log.warning.chat = false;
          botSettings.log.error.chat = false;
          botSettings.log.critical.chat = true;
          botSettings.log.alert.chat = true;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `alert`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = false;
          botSettings.log.notification.chat = false;
          botSettings.log.warning.chat = false;
          botSettings.log.error.chat = false;
          botSettings.log.critical.chat = false;
          botSettings.log.alert.chat = false;
          botSettings.log.emergency.chat = true;
        }
        else if (level == `emer`) {
          botSettings.log.trace.chat = false;
          botSettings.log.verbose.chat = false;
          botSettings.log.debug.chat = false;
          botSettings.log.info.chat = false;
          botSettings.log.mark.chat = false;
          botSettings.log.notification.chat = false;
          botSettings.log.warning.chat = false;
          botSettings.log.error.chat = false;
          botSettings.log.critical.chat = false;
          botSettings.log.alert.chat = false;
          botSettings.log.emergency.chat = true;
        }
      }
    testLogs()
  }

  //infoLine(`localStorage.botSettings`, `local storage's bot settings: ${localStorage.botSettings}`)

  function noCussing(setting) {
    if (setting === true) {
      gClient.setChannelSettings({"no cussing": true});
    }
    else if (setting === false) {
      gClient.setChannelSettings({"no cussing": false});
    }
    else if (setting === 'get') {
      return gClient.channel.settings["no cussing"];
    }
    else if (setting === 'reset') {
      gClient.setChannelSettings({"no cussing": false});
    }
    else {
      if (MPP.client.channel.settings["no cussing"] === true) {
        gClient.setChannelSettings({"no cussing": false});
      }
      else if (MPP.client.channel.settings["no cussing"] === false) {
        gClient.setChannelSettings({"no cussing": true});
      }
    }
  }


  function nameSetting(setting, para) {
    if (setting == `set`) {
      if (para) {
        infoLine(`nameSetting`, `New name: ${para}`);
        gClient.sendArray([{m: "userset", set: {name: para}}]);
      }
      else {
        warnLine(`nameSetting()`, `Can't set an empty or non-existent name, keeping older one`)
      }
    }
    if (setting == `array`) {

      debugLine(`nameSetting`, `para === undefined --> ${para === undefined}`)
      debugLine(`nameSetting`, `para === null --> ${para === null}`)
      debugLine(`nameSetting`, `!(para === undefined || para === null) --> ${!(para === undefined || para === null)}`)
      debugLine(`nameSetting`, `para === 0 --> ${para === 0}`)
      debugLine(`nameSetting`, `!(para === undefined || para === null) || para === 0 --> ${!(para === undefined || para === null) || para === 0}`)

      if ( !(para === undefined || para === null) || para === 0) {
        infoLine(`nameSetting`, `${para} isn't undefined or null`);
        gClient.sendArray([{m: "userset", set: {
          name:botSettings.info.usernames[para]?botSettings.info.usernames[para]:botSettings.info.usernames[random(0,botSettings.info.usernames.length,true)]
        }}]);
      }
      else {
        infoLine(`nameSetting`, `${para} is undefined or null`);

        var newNameIndex = random(0, botSettings.info.usernames.length, true)

        infoLine(`nameSetting`, `newNameIndex init to ${newNameIndex}`)

        gClient.sendArray([{m: "userset", set: {
          name: botSettings.info.usernames[ newNameIndex ]
        }}]);
      }
    }
    if (setting == `get`) {
      return gClient.getOwnParticipant().name
    }
    if (setting == `save`) {
      if (newName) {
        botSettings.info.username = para
        infoLine(`nameSetting()`, `saving name of ${para} to settings`)
      }
      else {
        infoLine(`nameSetting()`, `saving current name of ${gClient.getOwnParticipant().name} to settings`)
        botSettings.info.username = MPP.client.getOwnParticipant().name
      }
    }
    if (setting == `reset`) {
      var newName2 = `${botSettings.info.username}`;
      debugLine(`nameSetting()`, `resetting name, starting off with the username`)

      //*
      if (botSettings.showVer === true) {

        newName2 += ` ${botSettings.info.ver}`;
        debugLine(`nameSetting()`, `added version to newName2`)

      }

      if (botSettings.showSuffix === true) {

        newName2 += ` ${botSettings.info.nameSuffix}`;
        debugLine(`nameSetting()`, `added name suffix to newName2`)

      }

      // */
      gClient.sendArray([{m: "userset", set: {
        name: botSettings.info.usernames[ newName2 ]
      }}]);

      infoLine(`nameSetting()`, `Name reset to ${newName2}`)

    }
  }


  function colorSetting(setting, newColor) {
    if (setting == `set`) {
      if (newColor) {
        infoLine(`New color: ${newColor}`);
        gClient.sendArray([{m: "userset", set: {color: newColor}}]);
      }
      else {
        warnLine(`colorSetting()`, `Can't set an empty or non-existent color, keeping older one`)
      }
    }
    if (setting == `get`) {
      return gClient.getOwnParticipant().color
    }
    if (setting == `save`) {
      if (newName) {
        botSettings.info.color = newColor
        infoLine(`nameSetting()`, `saving color of ${newColor} to settings`)
      }
      else {
        infoLine(`nameSetting()`, `saving current color of ${gClient.getOwnParticipant().color} to settings`)
        botSettings.info.color = MPP.client.getOwnParticipant().color
      }
    }
    if (setting == `reset`) {
      gClient.sendArray([{m: "userset", set: {color: botSettings.info.color}}]);
      infoLine(`colorSetting()`, `reset color to ${botSettings.info.color}`)
    }
  }

  // Name suffix and function to change it
  function setNameSuffix(text) {

    console.log(`New name suffix: ${text}`)

    botSettings.info.nameSuffix = `${text}`

  }




  // ==============================================

  // Forces me to chat.  Can easily reach chatquota
  function forceChat(text, ignoreCommandsBool) {
    warnLine(`ForcedChat`, `Forced chat line!`)
    chat.send((ignoreCommandsBool != false? `\u034F` : "") + text);
  }


  function addSoundPack(name, ext, link) {
    if (gSoundSelector) {
      warnLine(`Just don't use addSoundPack()`, `You can add the sound packs at the ‘function SoundSelector()’ bit instead`)
      MPP.soundSelector.addPack({name:name, keys: Object.keys(MPP.piano.keys), ext: ext, url: link});
    }
  }
/*
  if (MPP.soundSelector) {
    addSoundPack(`Extras: Great and soft`, `.mp3`, `https://ledlamp.github.io/piano-sounds/GreatAndSoftPiano/`)
    addSoundPack(`Extras: Hard and tough`, `.mp3`, `https://ledlamp.github.io/piano-sounds/HardAndToughPiano/`)
    addSoundPack(`Extras: Hard`, `.mp3`, `https://ledlamp.github.io/piano-sounds/HardPiano/`)
    addSoundPack(`Extras: Harpsicord`, `.mp3`, `https://ledlamp.github.io/piano-sounds/Harpsicord/`)
    addSoundPack(`Extras: Loud and proud`, `.mp3`, `https://ledlamp.github.io/piano-sounds/LoudAndProudPiano/`)
    addSoundPack(`Extras: MLG`, `.wav`, `https://ledlamp.github.io/piano-sounds/MLG/`)
    addSoundPack(`Extras: NewPiano`, `.mp3`, `https://ledlamp.github.io/piano-sounds/NewPiano/`)
    addSoundPack(`Extras: Orchestra`, `.wav`, `https://ledlamp.github.io/piano-sounds/Orchestra/`)
    addSoundPack(`Extras: Piano 2`, `.mp3`, `https://ledlamp.github.io/piano-sounds/Piano2/`)
    addSoundPack(`Extras: PianoSounds`, `.mp3`, `https://ledlamp.github.io/piano-sounds/PianoSounds/`)
    addSoundPack(`Extras: Rhodes MK1`, `.mp3`, `https://ledlamp.github.io/piano-sounds/Rhodes_MK1/`)
    addSoundPack(`Extras: Soft`, `.mp3`, `https://ledlamp.github.io/piano-sounds/SoftPiano/`)
    addSoundPack(`Extras: Vintage Upright (soft)`, `.mp3`, `https://ledlamp.github.io/piano-sounds/Vintage_Upright_Soft/`)
    addSoundPack(`Extras: Piano 2 Extended`, `.mp3`, `http://127.0.0.1:8887/Piano2/`)
  }
*/

  // Get info about a player.
  function info(name) {
    try {
      var array = [];
      debugLine(`info()`, `array init to []`)
      for (var pl in gClient.ppl) {
        verboseLine(`info()`, `loop for ${pl}`)
        if (gClient.ppl[pl].name.toLowerCase().includes(name.toLowerCase())){
          array.push(gClient.ppl[pl]);
          debugLine(`info()`, `search for ${name} found ${pl}, added to array`)
        }
      }
      debugLine(`info()`, `returned array`)
      return array[Math.floor(Math.random() * array.length)];
    } catch (err) {
      errLine(`info()`, `${err}`)
      sendChat(`Error: ${err}`)
    }

    // This is required by ESLint's consistent-return option
    return;
  }



  // If botSettings.safeMode is True, then the following will not be available
  // to anyone below Level 2 (Extra-high):
  // - Various commands that (are|might be) unsafe and/or are a work in progress
  // - /notes and variants

  // In addition, the cursor bot is turned off by default there.

  // States: Safe Mode, fully on, system commands only, or off
  var state;

  // switch between full, safe mode, system commands-only, or off
  function setMode(mode, quietBool) {

    if (mode === 'full') {

      botSettings.power = true;
      botSettings.fullPower = true;
      botSettings.safeMode = false;
      botSettings.cursorBot.enable = true;
      enableBoom = false;
      if (quietBool != true) {
        sendChat(`${botSettings.info.botName} has fully turned on.`);
      }


      state = 'full';

      setNameSuffix(`[ ${botSettings.prefix}help ]`)

    } else if (mode === 'safe') {

      botSettings.power = true;
      botSettings.fullPower = true;
      botSettings.safeMode = true;
      botSettings.cursorBot.enable = false;
      enableBoom = false;
      if (quietBool != true) {
        sendChat(`${botSettings.info.botName} has gone into Safe Mode.`);
      }


      state = 'safe';

      setNameSuffix(`[ Safe Mode ]`)

    } else if (mode === 'cmd') {

      botSettings.power = false;
      botSettings.fullPower = true;
      botSettings.safeMode = false;
      botSettings.cursorBot.enable = false;
      enableBoom = false;
      if (quietBool != true) {
        sendChat(`${botSettings.info.botName} has turned off all non-admin commands.`);
      }

      infoLine(`Non-admin commands only...`, `...How about you start debugging this?`)

      state = 'cmd';

      setNameSuffix(`[ Sys Cmds only ]`)

    } else if (mode === 'off') {

      botSettings.power = false;
      botSettings.fullPower = false;
      botSettings.safeMode = false;
      botSettings.cursorBot.enable = false;
      enableBoom = false;
      if (quietBool != true) {
        sendChat(`${botSettings.info.botName} has turned off.`);
      }

      infoLine(`Turned off`, `${botSettings.info.botName} has shut down.  Reload to get it back on.`)

      state = 'off';

      setNameSuffix(`[ No Bot ]`)
    }
  }

  // Set the new command prefix.
  function setPrefix(text) {
    botSettings.prefix = text;
    setNameSuffix(`[ ${botSettings.prefix}help ]`)
  }

  // 'Error on attempt to coerce' function.  Yeah.
  function nonCoercible(val) {

    if (val === null) {
      throw TypeError('nonCoercible shouldn\'t be called with null or undefined');
    }

    // Turn the arguement into an object
    const res = Object(val);

    // If this is coerced...
    res[Symbol.toPrimitive] = () => {
      throw TypeError('Trying to coerce non-coercible object');
    }

    // otherwise return the original thing
    return res;
  }
  // For example, nonCoercible(5) + '5' returns an error.










  // Is some string very clearly spam?
  function isSpam(text) {
    if (
      text.match(/(.)\1{100,}/) || text.match(/\S{100,}/)
    ) {
      return true
    } else {
      return false
    }
  }


  function kickban(id, ms) {
    gClient.sendArray([{m: "kickban", _id: id, ms: ms}]);
  }


  function giveId(n) {
    var ids = [];
    for (var p in dataBase) {
      if (Array.isArray(dataBase[p])) {
        if (dataBase[p][dataBase[p].length - 1].includes(n)) {
          ids.push(" "+p);
        }
      }
    }
    return ids;
  }


  function removeFromArray(array, value) {
    var idx = array.indexOf(value);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    return array;
  }


  // Creates a file and downloads it.
  function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";
    debugLine(`download()`, `variables prepared`);

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);
    debugLine(`download()`, `link built`);

    // For IE10
    if (window.MSBlobBuilder) {
      var bb = new MSBlobBuilder();
      bb.append(strData);
      return navigator.msSaveBlob(bb, strFileName);
    }


    // Firefox 20, Chrome(?) 19
    if ('download' in a) {
      a.setAttribute("download", n);
      debugLine(`download()`, `attribute set for a (${a})`);
      a.innerHTML = "downloading...";
      debugLine(`download()`, `link text set`);
      D.body.appendChild(a);
      debugLine(`download()`, `added link to page`);
      setTimeout(function() {
        var e = D.createEvent("MouseEvents");
        debugLine(`download()`, `mouse event created`);
        e.initMouseEvent("click", true, false, Window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        debugLine(`download()`, `mouse event initiated`);
        a.dispatchEvent(e);
        debugLine(`download()`, `mouse event dispatched`);
        D.body.removeChild(a);
        debugLine(`download()`, `link removed`);
      }, 200);
      debugLine(`download()`, `END`);
      return true;
    }



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
      D.body.removeChild(f);
    }, 333);
    return true;

    // End function download()
  }


  function commandRequest(name, request) {
    download(
      `${name} has requested: ${request}`, `MPP Bot request from ${name}`,
      `text/plain`
    )
  }

  String.prototype.trim = function() {
    return this.replace(/^s+|s+$/g, "");
  };
}
catch (err) {
  errLine(`Functions`, `Functions couldn't load — bot won't work right.`)
  sendChat(`There was a problem loading the general functions — this thing might not work.`);
  sendChat(`${err}`)
  failures.generalFunctions = err;
}
//                            </GENERAL FUNCTIONS>



//                               <CURSOR BOT>
failures.cursorBot = false;
try {
  //                   BallOnString.js, expanded by me.


  function moveCursor(x, y) {

    gClient.sendArray([
      {m: "m", x: MPP.client.getOwnParticipant().x = x,
       y: MPP.client.getOwnParticipant().y = y}
    ]);

    gClient.emit("m", {m: "m", id: MPP.client.participantId, x: x, y: y });

  }


  function moveCursor3d(x,y,z) {
    z /= 100;
    z += 1;
    x -= 50;
    y -= 50;
    x /= z;
    y /= z;
    x += 50;
    y += 50;
    moveCursor(x,y)
  } // from Shadow

  // Reset the cursor bot to its defaults, in case something goes wrong
  function resetCursor() {

    moveCursor(0, 0); // Reset position

    if (state === 'full') {
      botSettings.cursorBot.enable = true;
    }
    else {
      botSettings.cursorBot.enable = false;
    }

    botSettings.cursorBot.mode = botDefaults.cursorBot.mode
    botSettings.cursorBot.ballOnString.mass = botDefaults.cursorBot.ballOnString.mass;
    botSettings.cursorBot.ballOnString.gravity = botDefaults.cursorBot.ballOnString.gravity
    botSettings.cursorBot.ballOnString.friction = botDefaults.cursorBot.ballOnString.friction;
    botSettings.cursorBot.bounce.Xspeed = botDefaults.cursorBot.bounce.Xspeed
    botSettings.cursorBot.bounce.Yspeed = botDefaults.cursorBot.bounce.Yspeed
    botSettings.cursorBot.bounce.Zspeed = botDefaults.cursorBot.bounce.Zspeed

    pos = {x: 50, y: 50}
    pos2 = {x: 50, y: 50};
    acc = {x: 0, y: 0};
    vel = {x: 0, y: 0};
    follower = "7504f8a8bb9e7c39ddbcbd27";
    followPos = {x: 50, y: 50};

  }



  var pos = {x: 50, y: 50, z: 100},
      pos2 = {x: 50, y: 50},
      acc = {x: 0, y: 0},
      vel = {x: 0, y: 0},
      follower = "7504f8a8bb9e7c39ddbcbd27",
      followPos = {x: 50, y: 50},


      bounceXnegate = 1,
      bounceYnegate = 1,
      bounceZnegate = 1,

      Xoffset = botSettings.cursorBot.bounce.Xspeed,
      Yoffset = botSettings.cursorBot.bounce.Yspeed,

      screensaverX = random(1,99),
      screensaverY = random(1,99)

  // On every cursor move...
  gClient.on("m", function(msg) {

    // Get the participant's info from their ID.
    var part = MPP.client.findParticipantById(msg.id);

    // If it's me, return early.
    if (part._id == MPP.client.user._id) {

      return

    }

    if (botSettings.cursorBot.followOnePerson.enable == true) {

      if (part._id == botSettings.cursorBot.followOnePerson._id) {

        followPos.x = +msg.x;
        followPos.y = +msg.y;

      }

    }

    else {

      followPos.x = +msg.x;
      followPos.y = +msg.y;

    }

  });
  var lastchatter;
  gClient.on('a', function (msg) {lastchatter = msg;});
  setInterval(function(){

  }, 10);
  var updateInt = setInterval(function() {
    traceLine(`cursorBot`, `exec of updateInt starts`)

    if (botSettings.fullPower == true && botSettings.cursorBot.enable == true) {
      if (botSettings.cursorBot.mode == 'hatLastChatter') {
        moveCursor(lastchatter.x, lastchatter.y + 5);
        traceLine(`cursorBot`, `hatLastChatter moved cursor`)
      } else {

        if (botSettings.cursorBot.mode == "ballOnString") {
          Xoffset = 0;
          Yoffset = 0;

          pos2.x = followPos.x;
          pos2.y = followPos.y;
          acc.x = ((pos2.x-pos.x) - (botSettings.cursorBot.ballOnString.friction*vel.x))/botSettings.cursorBot.ballOnString.mass;
          acc.y = ((pos2.y-pos.y) - (botSettings.cursorBot.ballOnString.friction*vel.y) + botSettings.cursorBot.ballOnString.gravity)/botSettings.cursorBot.ballOnString.mass;
          vel.x += acc.x;
          vel.y += acc.y;

          pos.x += vel.x;
          pos.y += vel.y;
          traceLine(`cursorBot`, `ballOnString prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == "roughFollow") {
          Xoffset = 0;
          Yoffset = 0;

          //pos.x = pos2.x
          //pos.y = pos2.y

          pos.x = followPos.x;
          pos.y = followPos.y;

          traceLine(`cursorBot`, `roughFollow prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == "battlingCursor") {
          Xoffset = 0;
          Yoffset = 0;

          pos.x = followPos.x + random(-6, 6);
          pos.y = followPos.y + random(-10, 10);
          traceLine(`cursorBot`, `battlingCursor prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == "goCrazy") {
          Xoffset = 0;
          Yoffset = 0;

          pos.x = random(1, 99);
          pos.y = random(1, 99);
          traceLine(`cursorBot`, `goCrazy prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == "screensaver") {
          Xoffset = 0;
          Yoffset = 0;

          pos.x = screensaverX;
          pos.y = screensaverY;
          traceLine(`cursorBot`, `screensaver prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == `bounce`) {
          pos.x += bounceXnegate * (botSettings.cursorBot.bounce.Xspeed / 10);
          pos.y += bounceYnegate * (botSettings.cursorBot.bounce.Yspeed / 10);

          Xoffset = botSettings.cursorBot.bounce.Xspeed;
          Yoffset = botSettings.cursorBot.bounce.Yspeed;

          if (pos.x + botSettings.cursorBot.bounce.Xspeed >= 100) {
            bounceXnegate = -1;
            debugLine(`bounce`, `right edge hit`)
          }
          if (pos.x + botSettings.cursorBot.bounce.Xspeed <= 0) {
            bounceXnegate = 1;
            debugLine(`bounce`, `left edge hit`)
          }
          if (pos.y + botSettings.cursorBot.bounce.Yspeed >= 100) {
            bounceYnegate = -1;
            debugLine(`bounce`, `bottom edge hit`)
          }
          if (pos.y + botSettings.cursorBot.bounce.Yspeed <= 0) {
            bounceYnegate = 1;
            debugLine(`bounce`, `top edge hit`)
          }
          traceLine(`cursorBot`, `bounce prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == `trig`) {
          pos.x += bounceXnegate * (botSettings.cursorBot.bounce.Xspeed / 10);
          pos.y += bounceYnegate * (botSettings.cursorBot.bounce.Yspeed / 10);
          traceLine(`cursorBot`, `trig prepared cursor position`)
        }

        if (botSettings.cursorBot.mode == `bounce3d`) {
          pos.x += bounceXnegate * (botSettings.cursorBot.bounce.Xspeed / 10);
          pos.y += bounceYnegate * (botSettings.cursorBot.bounce.Yspeed / 10);
          pos.z += bounceZnegate * (botSettings.cursorBot.bounce.Zspeed / 10);


          if (pos.x + botSettings.cursorBot.bounce.Xspeed >= 100) {
            bounceXnegate = -1;
            debugLine(`bounce`, `right edge hit`)
          }
          if (pos.x + botSettings.cursorBot.bounce.Xspeed <= 0) {
            bounceXnegate = 1;
            debugLine(`bounce`, `left edge hit`)
          }
          if (pos.y + botSettings.cursorBot.bounce.Yspeed >= 100) {
            bounceYnegate = -1;
            debugLine(`bounce`, `bottom edge hit`)
          }
          if (pos.y + botSettings.cursorBot.bounce.Yspeed <= 0) {
            bounceYnegate = 1;
            debugLine(`bounce`, `top edge hit`)
          }
          if (pos.z + botSettings.cursorBot.bounce.Zspeed >= 100) {
            bounceZnegate = -1;
            debugLine(`bounce`, `far Z edge hit`)
          }
          if (pos.z + botSettings.cursorBot.bounce.Zspeed <= 0) {
            bounceZnegate = 1;
            debugLine(`bounce`, `near Z edge hit`)
          }
          traceLine(`cursorBot`, `bounce3d prepared cursor position`)
        }

        if (botSettings.cursorBot.mode != `bounce3d`) {
          moveCursor(pos.x + Xoffset, pos.y + Yoffset);
          traceLine(`cursorBot`, `mode isn't bounce3d, moved cursor in 2d`)
        }
        else {
          moveCursor3d(pos.x, pos.y, pos.z)
          traceLine(`cursorBot`, `moved cursor in 3d`)
        }
      }
    }
  }, 15);


  setInterval( function() {
    if (botSettings.cursorBot.mode == `screensaver`) {
      screensaverX = random(1, 99)
      screensaverY = random(1, 99)
    }
  }, 60 * 1000)



  console.log(`Cursor Bot has loaded.`)

  // -------------------- < / CURSOR BOT > ---------------------------

}
catch (err) {
  errLine(`Couldn't load the cursor bot: ${err}`)
  warnLine(`This shouldn't affect much, but ${botSettings.prefix}settings may end up trying to set undefined variables.`)
  sendChat(`There was a problem loading the cursor bot. Oh well. | ${err}`);
  failures.cursorBot = err;
}
//                               </CURSOR BOT>



//                            <ADDITIONAL STUFF>
try {

  // Blacklisted: can't join my rooms
  // Banned: can't use my bot

  // BlackListed NAMES
  var blNames = ['OmegaBot sucks ass'];


  var bannedNames = ['OmegaBot sucks ass'];

  // BlackListed user IDS
  var blIds = ['fdab76d52c3b6d2ca103f510'];


  var bannedIds = ['fdab76d52c3b6d2ca103f510'];

  // Who can use the javascript relay?   IDs only
  var trustedUsers = [];

  // who can use AntiTroll commands?     IDs only
  var admins = [
    "6b874e79d90d6a968caf27db",
    "78cf7b91bfe59137b8b45851"
  ];








  //                    <NAME+ID DETECTION AND LOGGING>

  // If you don't already have dataBase created, this creates it for you.
  var dataBase = {"totalnames": 0};

  var addName = (pp) => {
    //if (pp.name !== "Anonymous") {
    if (!dataBase[pp._id]) {
      dataBase[pp._id] = [pp.name];
      dataBase.totalnames += 1;
    } else if (!dataBase[pp._id].includes(pp.name)) {
      dataBase[pp._id].push(pp.name);
    }
    //}
  };

  // Record names on someone joining, leaving, and being renamed
  MPP.client.on("participant added", addName);
  MPP.client.on("participant removed", addName);
  MPP.client.on("participant update", addName);

  //                   </NAME+ID DETECTION AND LOGGING>






  //                 moved to shadowOS Z's Color.js
  /*(function () {
    Color.addToMap("#4285F4", "Google blue")
    Color.addToMap("#34A853", "Google green")
    Color.addToMap("#EA4335", "Google red")
    Color.addToMap("#FBBC05", "Google yellow")

    Color.addToMap("#00aaff", "isaacOS futuristic cyan")
    Color.addToMap(`#381724`, `shadowOS's default dark sienna`)
    Color.addToMap(`#dd7cb1`, `PJiggles pink`)

    Color.addToMap("#00a5ef", "Microsoft blue")
    Color.addToMap("#f24f1c", "Microsoft red")
    Color.addToMap("#80bb00", "Microsoft green")

    Color.addToMap("#0019b6", "MS-DOS dark blue")
    Color.addToMap("#00b6b8", "MS-DOS dark cyan")
    Color.addToMap("#686868", "MS-DOS dark gray")
    Color.addToMap("#00b41d", "MS-DOS dark green")
    Color.addToMap("#c12bb6", "MS-DOS dark magenta")
    Color.addToMap("#c41f0c", "MS-DOS dark red")
    Color.addToMap("#c16a14", "MS-DOS dark yellow")
    Color.addToMap("#5f6efc", "MS-DOS blue")
    Color.addToMap("#24fcfe", "MS-DOS cyan")
    Color.addToMap("#b8b8b8", "MS-DOS gray")
    Color.addToMap("#3afa6f", "MS-DOS green")
    Color.addToMap("#ff76fd", "MS-DOS magenta")
    Color.addToMap("#ff706a", "MS-DOS red")
    Color.addToMap("#fffd71", "MS-DOS yellow")

    Color.addToMap("#C3C3C3", "MS Paint gray")
    Color.addToMap("#880015", "MS Paint dark red")
    Color.addToMap("#ED1C24", "MS Paint red")
    Color.addToMap("#FF7F27", "MS Paint orange")
    Color.addToMap("#FFF200", "MS Paint yellow")
    Color.addToMap("#22B14C", "MS Paint green")
    Color.addToMap("#00A2E8", "MS Paint turquoise")
    Color.addToMap("#3F48CC", "MS Paint blue")
    Color.addToMap("#A349A4", "MS Paint purple")
    Color.addToMap("#7F7F7F", "MS Paint dark gray")
    Color.addToMap("#B97A57", "MS Paint brown")
    Color.addToMap("#FFAEC9", "MS Paint rose")
    Color.addToMap("#FFC90E", "MS Paint gold")
    Color.addToMap("#EFE4B0", "MS Paint light yellow")
    Color.addToMap("#B5E61D", "MS Paint lime green")
    Color.addToMap("#99D9EA", "MS Paint light turquoise")
    Color.addToMap("#7092BE", "MS Paint blue-gray")
    Color.addToMap("#C8BFE7", "MS Paint lavender")

    Color.addToMap("#fdf6e3", "Solarized tan")
    Color.addToMap("#eee8d5", "Solarized dark tan")
    Color.addToMap("#24fcfe", "Solarized black")
    Color.addToMap("#073642", "Solarized bright black")
    Color.addToMap("#586e75", "Solarized gray (darkest)")
    Color.addToMap("#657b83", "Solarized gray (dark)")
    Color.addToMap("#839496", "Solarized gray (light)")
    Color.addToMap("#93a1a1", "Solarized gray (lightest)")
    Color.addToMap("#b58900", "Solarized yellow")
    Color.addToMap("#cb4b16", "Solarized orange")
    Color.addToMap("#dc322f", "Solarized red")
    Color.addToMap("#d33682", "Solarized magenta")
    Color.addToMap("#6c71c4", "Solarized violet")
    Color.addToMap("#268bd2", "Solarized blue")
    Color.addToMap("#2aa198", "Solarized cyan")
    Color.addToMap("#859900", "Solarized green")

    Color.addToMap("#d4d0c8", "Windows Classic grey")
    Color.addToMap("#3a6ea5", "Windows Classic background blue")
    Color.addToMap("#0a246a", "Windows Classic dark blue")
    Color.addToMap("#a6caf0", "Windows Classic light blue")

    Color.addToMap(`#F7AA1C`, `Miles Prower`)

    Color.addToMap(`#05b07b`, `Windows 7 Leaves`)

    Color.addToMap(`#663399`, `Rebecca Purple`)
  })(); */


  //                         Boom Timer
  var enableBoom = false;
  var boomTimer = 0;
  var boomTimerLength = 60 * 5;
  var boomsPerMinute = 5
  var boomInterval = boomTimerLength / boomsPerMinute * 1000

  setInterval(function() {
    if (boomTimer <= 0) {
      boomTimer = 0;
    }
    else {
      boomTimer -= 1;
      debugLine(`boomTimer`, `boomTimer lowered to ${boomTimer}`)
    }
  }, boomInterval)



  // Help me! | ¡Ayúdame!


  //             Commands first shown in /help:
  var commandsMain = [
    `help`,
    `test`,
    `about`,
    `changelog`,
    `motd`,
  ].sort();
  var commandsMainEs = [
    `ayúdame`,
    `prueba`,
    //`about`,
    //`changelog`,
    //`motd`,
  ].sort()

  var commandsMath = [
    `factorial`,
    `factors`,
    `make_pyth_triple`,
    `directsegment`,
    `heronsformula`,
    `round`,
    `twopoint`,
    `triangletest`,
    `hypotenuse`,
    `convert | ${botSettings.prefix}conv`,
  ].sort();
  var commandsMathEs = [
    //`factorial`,
    //`factors`,
    //`make_pyth_triple`,
    //`directsegment`,
    //`heronsformula`,
    //`round`,
    //`twopoint`,
    //`triangletest`,
    //`hypotenuse`,
    //`convert | ${botSettings.prefix}conv`,
  ].sort()

  var commandsRP = [
    `me`,
    `hug`,
    `poke`,
    `grouphug`,
    `screech`,
    `lick`,
    `slap`,
    `kill`,
    `highfive`,
    `cuddle`,
    `party`,
    `applaud`,
    `facepalm`,
    `die`,
    `meow`
  ].sort()
  var commandsRPEs = [
    `yo`,
    `abraza`,
    //`poke`,
    //`grouphug`,
    //`screech`,
    //`lick`,
    //`slap`,
    `mato`,
    //`highfive`,
    //`cuddle`,
    `fiesta`,
    //`applaud`,
    //`facepalm`,
    `muero`,
    //`meow`
  ].sort()

  var commandsText = [
    `say`,
    `fw | ${botSettings.prefix}fullwidth | ${botSettings.prefix}big`,
    `bw | ${botSettings.prefix}backward | ${botSettings.prefix}reverse`,
    `fancy`,
    `encode`,
    `decode`,
    `unicode`,

    `bin`, `unbin`,
    `oct`, `unoct`,
    `dec`, `undec`,
    `hex`, `unhex`,
  ].sort()
  var commandsTextEs = [
    //`say`,
    //`fw`,
    //`bw`,
    //`fancy`,
    //`encode`,
    //`decode`,
    `unicode`,

    //`bin`, `unbin`,
    //`oct`, `unoct`,
    //`dec`, `undec`,
    //`hex`, `unhex`,
  ].sort()

  var commandsOther = [
    `dice`,
    `info`,
    `quote`,
    `funnyquote`,
    `tip`,
    `time`,
    `millis`,
    `boom`,
    `convert | ${botSettings.prefix}conv`,
    `coinflip`,
    `request | ${botSettings.prefix}suggest`,
    `settings`,
    `ping`,
    `owo`,
    `uwu`,
    `sandbox | ${botSettings.prefix}sb`
  ].sort();
  var commandsOtherEs = [
    //`dice`,
    //`info`,
    //`quote`,
    //`funnyquote`,
    //`tip`,
    //`time`,
    //`millis`,
    //`boom`,
    //`convert`,
    //`coinflip`,
    //`request`,
    //`cursorbot`,
    //`ping`,
  ].sort();

  var commands = commandsMain.concat(commandsMath).concat(commandsRP).concat(commandsText).concat(commandsOther)
  .concat(commandsMainEs).concat(commandsMathEs).concat(commandsRPEs).concat(commandsTextEs).concat(commandsOther);

  //                    Commands shown in the unsafe cmds part of /help:
  var nonSafeModeCmds = [
    `color | ${botSettings.prefix}colour`,
    `notes`,
    `allcolors | ${botSettings.prefix}allcolours`,
    `temponotes`,
    `advnotes`,
  ].sort()




  //var cmds = botSettings.prefix + commands[0];
  var cmdsMain = botSettings.prefix + commandsMain[0];
  var cmdsMath = botSettings.prefix + commandsMath[0];
  var cmdsRP = botSettings.prefix + commandsRP[0];
  var cmdsText = botSettings.prefix + commandsText[0];
  var cmdsOther = botSettings.prefix + commandsOther[0];

  var cmdsMainEs = botSettings.prefix + commandsMainEs[0];
  var cmdsMathEs = botSettings.prefix + commandsMathEs[0];
  var cmdsRPEs = botSettings.prefix + commandsRPEs[0];
  var cmdsTextEs = botSettings.prefix + commandsTextEs[0];
  var cmdsOtherEs = botSettings.prefix + commandsOtherEs[0];

  var cmdsUnsafe = botSettings.prefix + nonSafeModeCmds[0];

  /*for (var j = 1; j < commands.length; j++) {
			cmds += ", " + botSettings.prefix + commands[j];
		  }*/
  for (var j = 1; j < commandsMain.length; j++) {
    cmdsMain += ", " + botSettings.prefix + commandsMain[j];
  }
  for (var j = 1; j < commandsMath.length; j++) {
    cmdsMath += ", " + botSettings.prefix + commandsMath[j];
  }
  for (var j = 1; j < commandsRP.length; j++) {
    cmdsRP += ", " + botSettings.prefix + commandsRP[j];
  }
  for (var j = 1; j < commandsText.length; j++) {
    cmdsText += ", " + botSettings.prefix + commandsText[j];
  }
  for (var j = 1; j < commandsOther.length; j++) {
    cmdsOther += ", " + botSettings.prefix + commandsOther[j];
  }

  for (var j = 1; j < commandsMainEs.length; j++) {
    cmdsMainEs += ", " + botSettings.prefix + commandsMainEs[j];
  }
  for (var j = 1; j < commandsMathEs.length; j++) {
    cmdsMathEs += ", " + botSettings.prefix + commandsMathEs[j];
  }
  for (var j = 1; j < commandsRPEs.length; j++) {
    cmdsRPEs += ", " + botSettings.prefix + commandsRPEs[j];
  }
  for (var j = 1; j < commandsTextEs.length; j++) {
    cmdsTextEs += ", " + botSettings.prefix + commandsTextEs[j];
  }
  for (var j = 1; j < commandsOtherEs.length; j++) {
    cmdsOtherEs += ", " + botSettings.prefix + commandsOtherEs[j];
  }

  for (var j = 1; j < nonSafeModeCmds.length; j++) {
    cmdsUnsafe += ", " + botSettings.prefix + nonSafeModeCmds[j];
  }
  // <eslint> no-redeclare - 'j' is already defined.
  // <Aoz0ra> No it isn't!



  var cmdCount = commands.length + nonSafeModeCmds.length + 56 /*temp conv*/;
}
catch (err) {
  sendChat(`There was an error while loading the additional stuff: ${err}`)
  sendChat(`The bot probably won't work at all.  Sorry about that.`)

  console.log(`A try{}catch(){} has caught this error: ${err}`)
}
//                            </ADDITIONAL STUFF>



//                              <ANTI-TROLL>
try {
  //                 -------------- Josh's MPP Anti-Troll Script, slight edits ---------------

  MPP.client.on('a', function (m) {
    if (m.a.startsWith(botSettings.prefix + 'nameban')) { // add name to blacklist
      if (admins.includes(m.p._id) || botSettings.anarchyMode == true) {
        var name2ban = m.a.slice(9);
        if (name2ban !== "") {
          bannedNames.push(name2ban);
          MPP.chat.send("Blacklisted name: " + name2ban);
        } else {
          MPP.chat.send("Usage: /nameban name");
        }
      } else {
        MPP.chat.send(`I'm sorry, but you can't use ${botSettings.prefix}nameban right now.`);
      }
    } else if (m.a.startsWith(botSettings.prefix + 'idban')) { // add id to blacklist
      if (admins.includes(m.p._id) || botSettings.anarchyMode == true) {
        var id2ban = m.a.slice(7);
        if (id2ban !== "") {
          blIds.push(id2ban);
          MPP.chat.send("Blacklisted _id: " + id2ban);
        } else {
          MPP.chat.send("Usage: /idban _id");
        }
      } else {
        MPP.chat.send(`I'm sorry, but you can't use ${botSettings.prefix}idban right now.`);
      }
    } else if (m.a.startsWith(botSettings.prefix + 'unban')) { // remove user from blacklist
      if (admins.includes(m.p._id) || botSettings.anarchyMode == true) {
        var user2unban = m.a.slice(7);
        if (user2unban !== "") {
          if (bannedNames.includes(user2unban)) {
            removeFromArray(blNames, user2unban);
            MPP.chat.send("Un-Blacklisted: " + user2unban);
          } else if (id_blacklist.includes(user2unban)) {
            removeFromArray(blIds, user2unban);
            MPP.chat.send("Un-Blacklisted: " + user2unban);
          }
        } else {
          MPP.chat.send("Usage: /unban [name or _id]");
        }
      } else {
        MPP.chat.send(`I'm sorry, but you can't use ${botSettings.prefix}unban right now.`);
      }
    } /*else if (m.a.startsWith(botSettings.prefix + 'id')) { // provide id for given name
      if (admins.includes(m.p._id) || botSettings.anarchyMode == true) {
        var name = m.a.slice(4);
        if (name !== "") {
          MPP.chat.send(name+"'s _ids are: "+giveId(name));
        } else {
          MPP.chat.send("Usage: /id name");
        }
      } else {
        MPP.chat.send(`I'm sorry, but you can't use ${botSettings.prefix}id right now.`);
      }
    }*/ else if (m.a.startsWith(botSettings.prefix + 'admin')) { // makes user an admin, given the _id
      if (m.p._id == MPP.client.getOwnParticipant()._id || botSettings.anarchyMode == true) {
        admins.push(m.a.slice(7));
        MPP.chat.send("Made "+m.a.slice(7)+" an admin.");
      } else {
        MPP.chat.send(`I'm sorry, but you can't use ${botSettings.prefix}admin.`);
      }
    } else if (m.a == botSettings.prefix + 'dbclear') { // clear database
      if (m.p._id == MPP.client.getOwnParticipant()._id || botSettings.anarchyMode == true) {
        window.dataBase = {"totalnames": 0};
        MPP.chat.send("Database Cleared");
      } else {
        MPP.chat.send(`I'm sorry, but you can't use ${botSettings.prefix}dbclear.`);
      }
    }
  });



  //             _.,-*~'`^`'~*-,._.,-*~'`^`'~*-,._.,-*~'`^`'~*-,._.,-*~'`^`'~*-,._.,-*~'`^`'~*-,.
  //                                      Bottom Setup      !Mandatory!
  //             _.,-*~'`^`'~*-,._.,-*~'`^`'~*-,._.,-*~'`^`'~*-,._.,-*~'`^`'~*-,._.,-*~'`^`'~*-,.
  setInterval(function() {
    for (var p in dataBase) {
      if (Array.isArray(dataBase[p])) {
        if (MPP.client.isOwner()) {
          if (bannedIds.includes(p)) {
            kickban(p, 600000); // ban id if on blacklist
            MPP.chat.send("Autobanning _id: " + p);
            delete dataBase[p];
          } else if (blNames.includes(dataBase[p][dataBase[p].length - 1])) {
            kickban(p, 600000); // ban name if on blacklist
            MPP.chat.send("Autobanning name: " + dataBase[p][dataBase[p].length - 1]);
            delete dataBase[p];
          }
        }
      }
    }

    if (!(admins.includes(MPP.client.getOwnParticipant()._id))) {
      admins.push(MPP.client.getOwnParticipant()._id);
    }
  });
}
catch (err) {
  sendChat(`There was an error loading Josh's MPP Anti-Troll Script.  This error will likely break a few things.`);
  sendChat(`${err}`);
}
//                              </ANTI-TROLL>



botSettings.takingRequests = true;
setMode('full', true)
/*
if (botSettings.sayStartupMessage === true) {
  sendChat(botSettings.startupMessage);
  if (isDeveloping === true) {
    sendChat(`I'm actively developing and testing new features, so sorry if you see me say "${botSettings.info.botName} ${botSettings.info.ver} has started up." a lot.  Every time I say that, I have reloaded.  When I do that, I lose all my settings and go right back to the defaults.`)
  }
}
else {
  if (isDeveloping === true) {
    sendChat(`I'm actively developing and testing new features right now and have just (re)started.  When I restart, I lose all my settings and go right back to the defaults.`)
  }
}
*/
setTimeout( function() {
  testLogs()
}, 5000)

setInterval( function() {
  if (botSettings.PSAs.enable == true) {
    sendChat( botSettings.PSAs.enableMulti == true? botSettings.PSAs.texts[random(0, botSettings.PSAs.texts.length - 2, true) ] : botSettings.PSAs.text)
  }
}, 1000 /* ms in 1sec */ * 60 /* sec in 1min */ * 10 /* minutes */)



function applyFont(fontToApply) {
  var css = "";
  if (false || (new RegExp("^https?://(?!(www.your-sites-here.com|forum.example.com)).*$")).test(document.location.href) || (document.location.href.indexOf("ftp://") == 0) || (document.location.href.indexOf("file://") == 0) || (document.location.href.indexOf("about") == 0) || (document.location.href.indexOf("javascript") == 0))
    css += [
      `html, body {font-family: ${fontToApply}, sans-serif;}`
    ].join("\n");
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
}

function addCSS(cssToAdd, ignoreCustomBool) {
  var css = "";
  if (false || (new RegExp("^https?://(?!(www.your-sites-here.com|forum.example.com)).*$")).test(document.location.href) || (document.location.href.indexOf("ftp://") == 0) || (document.location.href.indexOf("file://") == 0) || (document.location.href.indexOf("about") == 0) || (document.location.href.indexOf("javascript") == 0)) {
    css += [`${cssToAdd}`].join("\n");
  }

  if (typeof GM_addStyle != "undefined") {
    infoLine(`addCSS()`, `css added via GM_addStyle()`)
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    infoLine(`addCSS()`, `css added via PRO_addStyle()`)
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    infoLine(`addCSS()`, `css added via addStyle()`)
    addStyle(css);
  } else {
  	infoLine(`addCSS`, `custom css detected, replacing it — ignoreCustomBool is ${ignoreCustomBool}`)
    if (document.getElementById(`customcss`) && (!!ignoreCustomBool == false || !ignoreCustomBool)) { // if i've already applied a custom css file...
      $(`#customcss`).text(css); // replace it
    }
    else {
      // create the style element
      var node = document.createElement("style");
      node.type = "text/css";
      node.id = "customcss"
      node.appendChild(document.createTextNode(css));

      var heads = document.getElementsByTagName("head"); // get the head element
      if (heads.length > 0) {
        heads[0].appendChild(node);
      }
      else {
        // no head (yet), stick it wherever
        document.documentElement.appendChild(node);
      }
    }
  }
}



function applyCSS(style) {
	
	
	
	// MY OWN:
  if (style == `Compact`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:0;left:0;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:0 3px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:24px;text-align:center;cursor:pointer;line-height:1rem;box-shadow:0 -45px 20px -50px #0004 inset,-51px -51px 0 -50px #0004 inset}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.5rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-2px);-webkit-transform:translateY(-2px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:15px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:0 3px;font-size:.6rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:100px;font-size:8px;padding:0;margin:0;border-radius:0}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:10px;text-align:center;line-height:10px;font-size:6px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:1px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:15px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:0;top:-15px;padding:0 8px;width:170px;height:15px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:.7rem;transition:.2s}#room:hover{background:#fff3}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:calc(100vh - 33px);border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 8px;width:100%;line-height:1.85em;height:15px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:15px;font-size:.5rem;background:#fff2;border:1px solid #0000;padding:0 0;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:50px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:170px;width:15px;top:-15px;font-size:0}#new-room-btn:before{content:"+";font-size:9px}#play-alone-btn{position:absolute;left:185px;width:15px;top:-15px;font-size:0;line-height:1rem}#play-alone-btn:before{content:"-";font-size:8px}#sound-btn{position:absolute;left:100px;top:0}#room-settings-btn{position:absolute;left:200px;top:0;display:none}#midi-btn{position:absolute;left:0;top:0}#record-btn{position:absolute;left:50px;top:0}#synth-btn{position:absolute;left:150px;top:0}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:20px;width:170px;height:1rem;padding:0;font-size:0;font-weight:300;line-height:1rem;pointer-events:none;text-align:right}#status .number{font-size:.7rem}#volume{position:absolute;right:0;top:0;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax)`+
    ` contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:18px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 8px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1px}#chat li .name{font-weight:700;margin-right:8px}#chat li .message{margin-right:0;line-height:1em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:15px;font:inherit;width:calc(100vw - 200px);position:relative;left:200px;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc0}#chat input:-moz-placeholder{color:#ccc0}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 33px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Inspired`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0004 inset,0 -54px 0 -50px #0004 inset}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-3px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:2px 8px;font-size:.8rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:0;top:-30px;padding:8px 16px;width:200px;height:30px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:1rem;transition:.2s}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:400px;border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 16px;width:100%;line-height:2em;height:30px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:30px;font-size:1rem;background:#fff2;border:1px solid #0000;padding:8px 6px;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:100px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:0;width:30px;top:0;font-size:0}#new-room-btn:before{content:"+";font-size:24px}#play-alone-btn{position:absolute;left:30px;width:85px;top:0}#sound-btn{position:absolute;left:200px;top:0}#room-settings-btn{position:absolute;left:115px;top:0;display:none}#midi-btn{position:absolute;left:200px;top:30px}#record-btn{position:absolute;left:300px;top:30px}#synth-btn{position:absolute;left:300px;top:0}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:-1px;bottom:10px;width:200px;height:1rem;padding:0;font-size:1rem;font-weight:300;line-height:1rem;pointer-events:none;text-align:center}#status .number{font-size:1.5rem}#volume{position:absolute;right:0;top:30px;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;`+
    `margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:93px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;position:relative;bottom:-30px;margin:0 0;padding:0 16px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:16px}#chat li .message{margin-right:8px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:30px;font:inherit;width:calc(100vw - 200px);position:relative;left:200px;top:30px;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 93px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Metro`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0004 inset,0 -54px 0 -50px #0004 inset}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-3px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:2px 8px;font-size:.8rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:0;top:00px;padding:8px 16px;width:270px;height:30px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:1rem;transition:.2s}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:400px;border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 16px;width:100%;line-height:2em;height:30px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:30px;font-size:1rem;background:#fff2;border:1px solid #0000;padding:8px 6px;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:100px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:270px;width:30px;top:0;font-size:0}#new-room-btn:before{content:"+";font-size:24px}#play-alone-btn{position:absolute;left:300px;top:0}#sound-btn{position:absolute;left:400px;top:0}#room-settings-btn{position:absolute;left:500px;top:0;display:none}#midi-btn{position:absolute;left:200px;top:30px}#record-btn{position:absolute;left:300px;top:30px}#synth-btn{position:absolute;left:400px;top:30px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:-1px;bottom:10px;width:200px;height:1rem;padding:0;font-size:1rem;font-weight:300;line-height:1rem;pointer-events:none;text-align:center}#status .number{font-size:1.5rem}#volume{position:absolute;right:0;top:30px;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;`+
    `margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:63px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 16px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:16px}#chat li .message{margin-right:8px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:30px;font:inherit;width:100vw;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 96px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Nano`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:0;left:0;font-size:1em;width:80%;height:15px;overflow:hidden;opacity:.3}#names:hover{overflow:initial;opacity:1}#names .name{box-sizing:border-box;float:left;position:relative;padding:0 3px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:24px;text-align:center;cursor:pointer;line-height:1rem;box-shadow:0 -45px 20px -50px #0004 inset,-51px -51px 0 -50px #0004 inset}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.5rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-1px);-webkit-transform:translateY(-1px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:8px;height:13px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:15px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:0 3px;font-size:.6rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:100px;font-size:8px;padding:0;margin:0;border-radius:0}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:10px;text-align:center;line-height:10px;font-size:6px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:1px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:15px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:30px;top:0;padding:0 8px;width:70px;height:15px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:.7rem;transition:.2s}#room:hover{background:#333f;width:200px;z-index:1}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:calc(100vh - 33px);border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 8px;width:100%;line-height:1.85em;height:15px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:15px;font-size:.5rem;background:#fff2;border:1px solid #0000;padding:0 0;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:50px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:0;width:15px;top:0;font-size:0}#new-room-btn:before{content:"+";font-size:9px}#play-alone-btn{position:absolute;left:15px;width:15px;top:0;font-size:0;line-height:1rem}#play-alone-btn:before{content:"-";font-size:8px}#sound-btn{position:absolute;left:200px;top:0}#room-settings-btn{position:absolute;left:300px;top:0;display:none}#midi-btn{position:absolute;left:100px;top:0}#record-btn{position:absolute;left:150px;top:0}#synth-btn{position:absolute;left:250px;width:25px;top:0}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:20px;width:170px;height:1rem;padding:0;font-size:0;font-weight:300;line-height:1rem;pointer-events:none;text-align:right}#status .number{font-size:.7rem}#volume{position:absolute;right:0;top:0;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;`+
    `-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:18px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:-15px 0;padding:0 8px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1px}#chat li .name{font-weight:700;margin-right:8px}#chat li .message{margin-right:0;line-height:1em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 8px;box-sizing:border-box;height:15px;font:inherit;width:calc(100vw - 375px);position:relative;left:275px;top:15px;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc0}#chat input:-moz-placeholder{color:#ccc0}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 18px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:50}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Unsaved`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:6px;left:6px;font-size:1em;width:80%}#names .name{float:left;position:relative;padding:3px 6px;margin:1.5px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;min-width:72px;text-align:center;cursor:pointer;line-height:18px}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-3px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:3px;-moz-border-radius:3px;white-space:nowrap;padding:3px 6px;font-size:.8rem;line-height:1rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{position:absolute;left:4px;top:-2px;padding:6px;width:240px;height:12px;background:#fff2;border:1px solid #fff0;border-radius:4px;cursor:default;margin:6px 36px;font-size:1rem}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.no-cussing{color:#ace}#room .info.not-visible{color:#ffffff88}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:1px solid #0000;max-height:400px;border-radius:4px;backdrop-filter:blur(4px) contrast(.7) saturate(1.4)}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:1.5rem}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a61}#room .more .new:hover{background:#3a68}.ugly-button{height:12px;font-size:1rem;background:#fff2;border:1px solid #0000;padding:5px 6px;cursor:default;line-height:1rem;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:9px;width:320px;height:1rem;padding:6px;font-size:1.5rem;font-weight:300;line-height:1rem;pointer-events:none}#status .number{font-size:3rem}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:.7rem;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#1234;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(.4vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(.4vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:1px solid #0000;overflow:hidden;border-radius:9px;-webkit-border-radius:9px;-moz-border-radius:9px;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:9px;font-size:1rem}.dialog input.text{font-size:1.5rem;`+
    `font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:6px;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 12px;background-attachment:local}#chat li{padding:6px;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:12px}#chat li .message{margin-right:6px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:6px;font:inherit;width:calc(100vw - 18px);border:1px solid #fff0;background:#0002;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:1px solid #fff2}#chat.chatting{background:#8888;backdrop-filter:blur(.4vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .7s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px}#chat.chatting ul{max-height:calc(100vh - 96px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}#extraInfo{position:fixed;width:256px;height:256px;background:#0000;top:0;right:0;color:#fff}`)
  }
  else if (style == `Hydrogen`) {
    addCSS(`:root{--background:#ddd;--backgroundHilight:#eee;--backgroundFaint:#ccc;--foreground:#444;--foregroundHilight:#111;--foregroundFaint:#444c;--border:#fefefe;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--borderRadius:3px;--red:#c44;--orange:#ca4;--yellow:#cc4;--lime:#ac4;--green:#4c4;--aquagreen:#4ca;--cyan:#4bc;--skyblue:#4ac;--blue:#44c;--purple:#a4c;--pink:#c4c;--hotpink:#c4a;--redHilight:#f22;--orangeHilight:#fc2;--yellowHilight:#ff2;--limeHilight:#bf2;--greenHilight:#2f2;--aquagreenHilight:#2fb;--cyanHilight:#2ef;--skyblueHilight:#2bf;--blueHilight:#22f;--purpleHilight:#b2f;--pinkHilight:#f2f;--hotpinkHilight:#f2b;--redFaint:#c44a;--orangeFaint:#ca4a;--yellowFaint:#cc4a;--limeFaint:#ac4a;--greenFaint:#4c4a;--aquagreenFaint:#4caa;--cyanFaint:#4bca;--skyblueFaint:#4aca;--blueFaint:#44ca;--purpleFaint:#a4ca;--pinkFaint:#c4ca;--hotpinkFaint:#c4aa;--hilight:var(--cyanHilight);--hilightHilight:#fff;--hilightFaint:var(--cyan);--DEFAULT_ACCENT:var(--blue);--DEFAULT_ACCENT_HILIGHT:var(--blueHilight);--accent:var(--DEFAULT_ACCENT);--accentHilight:var(--DEFAULT_ACCENT_HILIGHT);--headerPaddingTop:24px;--headerPaddingLeft:calc(18px + 1vw);--headerPaddingRight:calc(18px + 1vw);--headerPaddingBottom:12px;--pagePaddingTop:24px;--pagePaddingLeft:calc(18px + 1vw);--pagePaddingRight:calc(18px + 1vw);--pagePaddingBottom:36px;--borderWidth:0.5px;--fontSize:1rem;--fontSizeH1:2rem;--fontSizeH2:1.8rem;--fontSizeH3:1.6rem;--fontSizeH4:1.4rem;--fontSizeH5:1.3rem;--fontSizeH6:1.2rem;--sansSerifFont:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;--animationDuration:0.3s;--animationDurationSlide:0.4s;--animationDurationFade:0.3s;--animationFunction:cubic-bezier(0.4,0,0.4,1)}*{box-sizing:border-box}*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:var(--fontSize) var(--sansSerifFont);color:#fff;text-shadow:0 1px 2px #0005,0 2px 2px #0003}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:var(--red);transition:color .25s}a:hover{color:var(--redHilight);transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:var(--yellow)}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:var(--fontSize);width:80%}#names .name{--foreground:#fff;--borderTop:#fff8;--borderLeft:#fefefe88;--borderRight:#fefefe88;--borderBottom:#eee8;--decoration:#0000;--paddingTop:0.35rem;--paddingLeft:0.5rem;--paddingRight:0.5rem;--paddingBottom:0.3rem;transition:box-shadow var(--animationDurationFade,.3s) var(--animationFunction,ease)!important;font-family:var(--sansSerifFont);border:var(--borderWidth) solid;border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);border-radius:var(--borderRadius,3px);box-shadow:0 0 10px 1px var(--decoration),0 1px 2px 0 #0005,0 2px 2px -2px #0003,0 60px 30px -60px #fff4 inset,0 -60px 30px -60px #0004 inset;padding:var(--paddingTop) var(--paddingLeft) var(--paddingBottom) var(--paddingLeft);color:var(--foreground);float:left;position:relative;margin:2px;min-width:80px;text-align:center;cursor:pointer;line-height:1rem}#names .name:hover{--foreground:#fff;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:var(--hilight);box-shadow:0 0 1px 1px var(--decoration),0 1px 2px 0 #0000,0 2px 2px -2px #0000}#names .name.me:after{content:"Me";position:absolute;top:-4px;left:10%;font-size:.7rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-3px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:30px;height:33px;background:url(https://cdn.discordapp.com/attachments/692183242979409961/719167468471582750/anonygoldcursor.png);background-position:135% 100%;position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{--foreground:#fff;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:#0000;--paddingTop:0.12rem;--paddingLeft:0.4rem;--paddingRight:0.4rem;--paddingBottom:0.12rem;transition:box-shadow var(--animationDurationFade,.3s) var(--animationFunction,ease)!important;font-family:var(--sansSerifFont);font-size:.9rem;background:var(--background);background:linear-gradient(to bottom,var(--backgroundTop) 0,var(--backgroundBottom) 100%);border:var(--borderWidth) solid;border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);border-radius:var(--borderRadius,3px);box-shadow:0 0 10px 1px var(--decoration),0 1px 2px 0 #0005,0 2px 2px -2px #0003,0 60px 30px -60px #fff4 inset,0 -60px 30px -60px #0004 inset;padding:var(--paddingTop) var(--paddingLeft) var(--paddingBottom) var(--paddingLeft);color:var(--foreground);min-width:40px;text-align:center;line-height:1rem;display:inline;position:relative;left:16px;top:8px;pointer-events:none;background:#000;white-space:nowrap}.cursor.owner .name:after{content:url(/3c6e5433c69c48145e6a6e2cf16ea0fbe9be9c1e/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .15s linear,left .15s linear}.participant-menu{--foreground:#fff;--borderTop:#fff8;--borderLeft:#fefefe88;--borderRight:#fefefe88;--borderBottom:#eee8;--decoration:#0000;--paddingTop:0.35rem;--paddingLeft:0.5rem;--paddingRight:0.5rem;--paddingBottom:0.3rem;transition:var(--animationDurationFade,.3s) var(--animationFunction,ease)!important;font-family:var(--sansSerifFont);border:var(--borderWidth) solid;border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);border-radius:var(--borderRadius,3px);box-shadow:0 0 10px 1px var(--decoration),0 1px 4px 0 #000a,0 2px 4px -2px #0007,0 30px 15px -30px #fff4 inset,0 -30px 15px -30px #0004 inset;padding:var(--paddingTop) var(--paddingLeft) var(--paddingBottom) var(--paddingLeft);color:var(--foreground);display:none;position:fixed;background:#000;width:150px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{--foregroundFaint:#fffc;height:1.6rem;text-align:center;line-height:1.6rem;font-size:.6rem;color:var(--foregroundFaint);overflow:hidden;opacity:0;transition:opacity var(--animationDurationFade) var(--animationFunction);user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity var(--animationDurationFade) var(--animationFunction)}.participant-menu .menu-item{cursor:default;margin:0;padding:5px 5px;transition:var(--animationDurationFade) var(--animationFunction);border-top:0 solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.3)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.7)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{--background:#0004;--backgroundTop:#000c;--backgroundBottom:#0008;--foreground:#fff;--borderTop:#fff;--decoration:#0000;color:var(--foreground);border-top:var(--borderWidth) solid var(--borderTop);position:fixed;bottom:0;left:0;width:100%;height:60px;background:linear-gradient(to bottom,var(--backgroundTop) 0,var(--backgroundBottom) 100%)!important;margin-bottom:3px}#room,#room *{cursor:pointer}#room{--background:#0004;--backgroundTop:#fff4;--backgroundBottom:#0004;--foreground:#ddd;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:#0000;--paddingTop:0.15rem;--paddingLeft:0.5rem;--paddingRight:0rem;--paddingBottom:0.15rem;transition:var(--animationDurationFade,.3s) var(--animationFunction,ease)!important;font-family:var(--sansSerifFont);font-size:var(--fontSize,1rem);background:var(--background);background:linear-gradient(to bottom,`+
    `var(--backgroundTop) 0,var(--backgroundBottom) 100%);border:var(--borderWidth) solid;border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);border-radius:var(--borderRadius,3px);box-shadow:0 0 10px 1px var(--decoration),0 1px 2px 0 #0005,0 2px 2px -2px #0003;padding:var(--paddingTop) var(--paddingLeft) var(--paddingBottom) var(--paddingLeft);color:var(--foreground);height:1.5rem;position:absolute;left:24px;top:4px;width:240px;margin:0 0}#room .info{white-space:nowrap;line-height:1.2rem;overflow:hidden;height:1.2rem}#room .info.lobby{color:var(--yellow)}#room .info.not-visible{color:var(--blueFaint)}#room .info.banned{color:var(--red)}#room .expand{--background:#ddd4;--backgroundTop:#fff4;--backgroundBottom:#0004;width:24px;height:100%;position:absolute;right:0;top:0;background:var(--background) url(/9d01ae37e98e2209b213da5d3c0b3bb050aa9553/arrow.png) no-repeat center 0}#room .more{--background:#000a;display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:var(--background,#0004);border:var(--borderWidth) solid var(--borderTop);border-color:var(--borderTop) var(--borderRight) var(--borderBottom) var(--borderLeft);max-height:calc(100vh - 100px)}#room .more>div{margin:0;padding:var(--paddingTop) var(--paddingRight) var(--paddingBottom) var(--paddingLeft);width:100%;height:1.5rem}#room .more .info,#room .more .new{transition:var(--animationDurationFade) var(--animationFunction)}#room .more .info:hover{background:#fff4}#room .more .new{background:#0000}#room .more .new:hover{background:var(--greenFaint)}.ugly-button{--background:#ddd4;--backgroundTop:#fff4;--backgroundBottom:#0004;--foreground:#ddd;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:#0000;--paddingTop:0.15rem;--paddingLeft:0.5rem;--paddingRight:0.5rem;--paddingBottom:0.15rem;transition:var(--animationDurationFade,.3s) var(--animationFunction,ease)!important;font-family:var(--sansSerifFont);font-size:var(--fontSize,1rem);background:var(--background);background:linear-gradient(to bottom,var(--backgroundTop) 0,var(--backgroundBottom) 100%);border:var(--borderWidth) solid;border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);border-radius:var(--borderRadius,3px);box-shadow:0 0 10px 1px var(--decoration),0 1px 2px 0 #0005,0 2px 2px -2px #0003;padding:var(--paddingTop) var(--paddingLeft) var(--paddingBottom) var(--paddingLeft);color:var(--foreground);height:1.5rem;line-height:1.2rem;width:114px;white-space:nowrap;text-align:center}.ugly-button:hover{--background:#ddd7;--backgroundTop:#fff7;--backgroundBottom:#0007;--foreground:#eee;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:var(--hilight);box-shadow:0 0 1px 1px var(--decoration),0 1px 2px 0 #0000,0 2px 2px -2px #0000}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(/698c7dccb9222c42d205fe8bbc28b5ce65d9fee0/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:0 1px 2px #0005,0 2px 2px #0003;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:bolder}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:0 1px 2px #0005,0 2px 2px #0003;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;transition:var(--animationDurationFade) var(--animationFunction);bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:0 1px 2px #fff5,0 2px 2px #0003}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .emote{width:32px;height:32px;vertical-align:bottom;image-rendering:auto}#chat li .quote{color:#789922}#chat input{--background:#ddd1;--backgroundBottom:#fff1;--backgroundTop:#0001;--foreground:#ddd;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:#0000;--paddingTop:0.15rem;--paddingLeft:0.5rem;--paddingRight:0.5rem;--paddingBottom:0.15rem;transition:var(--animationDurationFade,.3s) var(--animationFunction,ease)!important;font-family:var(--sansSerifFont);font-size:var(--fontSize);background:var(--background);background:linear-gradient(to bottom,var(--backgroundTop) 0,var(--backgroundBottom) 100%);border:var(--borderWidth) solid;border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);border-radius:var(--borderRadius,3px);box-shadow:0 0 10px 1px var(--decoration),0 1px 2px 0 #0005,0 2px 2px -2px #0003;padding:var(--paddingTop) var(--paddingLeft) var(--paddingBottom) var(--paddingLeft);color:var(--foreground);text-shadow:0 1px 2px #0005,0 2px 2px #0003;margin:3px 4px;width:calc(100vw - 8px)}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus,#chat input:hover{outline:0;border:var(--borderWidth) solid var(--border);border-color:var(--borderTop) var(--borderLeft) var(--borderBottom) var(--borderRight);--background:#ddd2;--backgroundBottom:#fff2;--backgroundTop:#0002;--foreground:#eee;--borderTop:#fff;--borderLeft:#fefefe;--borderRight:#fefefe;--borderBottom:#eee;--decoration:var(--hilight);box-shadow:0 0 1px 1px var(--decoration),0 1px 2px 0 #0000,0 2px 2px -2px #0000}#chat.chatting{transition:var(--animationDurationFade) var(--animationFunction);background:#0009;border-radius:var(--borderRadius);box-shadow:1px 1px 5px #888;--decoration:var(--hilight);box-shadow:0 0 10px 1px var(--decoration),0 1px 2px 0 #0005,0 2px 2px -2px #0003}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:0 1px 2px #fff5,0 2px 2px #0003}#chat.chatting ul{max-height:`+
    `calc(100vh - 91px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  else if (style == `Cleaned Up`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:none}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s;text-decoration:none}a:hover{color:#e05;transition:color .25s;text-decoration:none}.link{text-decoration:none;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:0 solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:0 solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#898;border:0 solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:0 solid #aba;max-height:calc(100vh - 200px)}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:0 solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:0 solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:0 solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:0 solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:0 solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:none;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;`+
    `-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:none}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:0 solid #fff;background:0 0;text-shadow:none;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:0 solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:none}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:0 solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:0 solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Mobile`) {
  	addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#242464;background:-moz-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#242464),color-stop(100%,#000024));background:-webkit-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-o-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-ms-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:radial-gradient(ellipse at center,#242464 0,#000024 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-lines{color:#f88}#names .name.muted-lines:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{position:absolute;pointer-events:none;margin-left:-1px;margin-top:-2px;left:200%;top:100%;background-position:2px 1px}.cursor .name{display:inline;position:relative;left:12px;top:10px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:92px;background:#000024;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:33.333vw;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:0;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(crownsolo.png);position:relative;top:2px;margin-left:4px}#room .info.no-chat:after{content:url(no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:calc(100vh - 100px)}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:calc(66.667vw + 12px);width:calc(33.333vw - 24px);top:0}#play-alone-btn{position:absolute;left:calc(66.667vw + 12px);width:calc(33.333vw - 24px);top:28px}#sound-btn{position:absolute;left:12px;width:calc(33.333vw - 24px);top:28px}#room-settings-btn{position:absolute;left:calc(33.333vw + 18px);width:calc(33.333vw - 24px);top:0;display:none}#midi-btn{position:absolute;left:calc(33.333vw + 12px);width:calc(33.333vw - 24px);top:56px}#record-btn{position:absolute;left:12px;width:calc(33.333vw - 24px);top:56px}#synth-btn{position:absolute;left:calc(33.333vw + 12px);width:calc(33.333vw - 24px);top:28px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:calc(33.333vw - 30px);bottom:64px;width:320px;height:20px;padding:5px;font-size:0;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:12px}#volume{position:absolute;right:20px;top:36px;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:`+
  	`0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:96px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Focused`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%;opacity:0;height:24px;overflow:hidden}#names:hover{opacity:1;overflow:scroll}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-2px)}#names .name.muted-notes{color:#f88;opacity:.1}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88;opacity:.1}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{opacity:.1}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px;opacity:0}#bottom:hover{opacity:.4}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;`+
    `-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:.2}#chat{position:fixed;bottom:4px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:0 8px;width:99%;border:0 solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;opacity:0;height:0;box-sizing:border-box!important}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{margin:4px 8px;outline:0;border:1px solid #ff8;opacity:1;height:.8rem}#chat.chatting{background:#002b36;border-radius:5px;box-shadow:1px 1px 5px 200px #002b36;transition:all .1s;opacity:1}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px;display:none}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Ultra-Focused`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%;opacity:0;height:24px;overflow:hidden}#names:hover{opacity:1;overflow:scroll}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px;opacity:.1;background:#0000!important}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.me{opacity:1}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:none}#names .name.muted-notes{color:#f88;opacity:.05}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88;opacity:.05}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%;opacity:50%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{opacity:0}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px;opacity:0}#bottom:hover{opacity:.4}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;`+
    `-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:0}#chat{position:fixed;bottom:4px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0;color:#999!important;text-shadow:none}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:0 8px;width:99%;border:0 solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;opacity:0;height:0;box-sizing:border-box!important}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{margin:4px 8px;outline:0;border:1px solid #ff8;opacity:1;height:.8rem}#chat.chatting{background:#002b36;border-radius:5px;box-shadow:1px 1px 5px 200px #002b36;transition:all .1s;opacity:1}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:none}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px;display:none}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  else if (style == `Sidebar`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0004 inset,0 -54px 0 -50px #0004 inset}#names:hover{z-index:9999999999999999999999999999999!important}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:2px 8px;font-size:.8rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:30px;background:#9a9;margin-bottom:0}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:30px;top:00px;padding:8px 16px;width:170px;height:30px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:1rem;transition:.2s}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-30px;width:calc(100% + 30px);overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:400px;border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 16px;width:100%;line-height:2em;height:30px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:30px;font-size:1rem;background:#fff2;border:1px solid #0000;padding:8px 6px;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:30px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3;width:150px}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:0;width:30px;top:0;font-size:0}#new-room-btn:before{content:"+";font-size:24px}#play-alone-btn{position:absolute;left:0;top:-30px;font-size:0}#play-alone-btn:before{content:"-";font-size:1rem}#play-alone-btn:hover{font-size:1rem}#play-alone-btn:hover:before{font-size:0}#sound-btn{position:absolute;left:0;top:-60px;font-size:0}#sound-btn:before{content:"Sd";font-size:1rem}#sound-btn:hover{font-size:1rem}#sound-btn:hover:before{font-size:0}#room-settings-btn{position:absolute;right:100px;top:0;display:none}#midi-btn{position:absolute;left:0;top:-90px}#record-btn{position:absolute;left:0;top:-120px}#synth-btn{position:absolute;left:0;top:-150px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:199px;bottom:10px;width:200px;height:1rem;padding:0;font-size:1rem;font-weight:300;line-height:1rem;pointer-events:none;text-align:center}#status .number{font-size:1.5rem}#volume{position:absolute;right:0;top:0;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#fff0;pointer-events:none}#quota .value{width:100%;height:100%;display:block;background:#fff2 pointer-events: none}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;`+
    `background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:30px;left:30px;width:calc(100% - 30px);vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 16px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:16px}#chat li .message{margin-right:8px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:30px;font:inherit;width:100vw;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;border-radius:0;box-shadow:0 0 100px 200px #9998;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 96px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Sidebar Mini`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0004 inset,0 -54px 0 -50px #0004 inset}#names:hover{z-index:9999999999999999999999999999999!important}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:2px 8px;font-size:.8rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:0;background:#9a9;margin-bottom:0}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:30px;top:-30px;padding:8px 16px;width:170px;height:30px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:1rem;transition:.2s}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-30px;width:calc(100% + 30px);overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:400px;border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 16px;width:100%;line-height:2em;height:30px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:30px;font-size:1rem;background:#fff2;border:1px solid #0000;padding:8px 6px;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:30px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3;width:150px}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:0;width:30px;top:-30px;font-size:0}#new-room-btn:before{content:"+";font-size:24px}#play-alone-btn{position:absolute;left:0;top:-60px;font-size:0}#play-alone-btn:before{content:"-";font-size:1rem}#play-alone-btn:hover{font-size:1rem}#play-alone-btn:hover:before{font-size:0}#sound-btn{position:absolute;left:0;top:-90px;font-size:0}#sound-btn:before{content:"Sd";font-size:1rem}#sound-btn:hover{font-size:1rem}#sound-btn:hover:before{font-size:0}#room-settings-btn{position:absolute;right:100px;top:-30px;display:none}#midi-btn{position:absolute;left:0;top:-120px}#record-btn{position:absolute;left:0;top:-150px}#synth-btn{position:absolute;left:0;top:-180px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:200px;height:1rem;padding:0;font-size:0;font-weight:300;line-height:1rem;pointer-events:none;text-align:right}#status .number{font-size:1rem}#volume{position:absolute;right:0;top:-30px;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#fff0;pointer-events:none}#quota .value{width:100%;height:100%;display:block;background:#fff2 pointer-events: none}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;`+
    `background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:0;left:30px;width:calc(100% - 30px);vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 16px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:16px}#chat li .message{margin-right:8px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;left:170px;position:relative;box-sizing:border-box;height:30px;font:inherit;width:calc(100% - 270px);border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;border-radius:0;box-shadow:0 0 100px 200px #9998;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 96px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  // RECREATIONS:
  else if (style == `Fishing Around`) { // Fishi's current CSS (Jun 22 '20)
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#242464;background:-moz-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#242464),color-stop(100%,#000024));background:-webkit-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-o-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-ms-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:radial-gradient(ellipse at center,#242464 0,#000024 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px}#names .name{float:left;position:relative;padding:4px;margin:1px;border-radius:1px!important;-webkit-border-radius:1px!important;-moz-border-radius:1px!important;min-width:50px;text-align:center;cursor:pointer;line-height:15px;font-family:"Segoe UI","Open Sans","Noto Sans",sans-serif;font-weight:600;text-shadow:none;box-shadow:0 -45px 20px -50px #0008 inset,0 60px 40px -80px #fff8 inset,0 -54px 0 -50px #fff3 inset}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-lines{color:#f88}#names .name.muted-lines:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:23px;height:30px;background:url(https://cdn.discordapp.com/attachments/692183242979409961/719464113817780314/newcursor.svg);position:absolute;pointer-events:none;margin-left:-5px;margin-top:-5px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:15px;top:10px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:3px;font-size:10px;font-family:"Segoe UI","Open Sans","Noto Sans",sans-serif;font-weight:600;box-shadow:0 -45px 20px -50px #0008 inset,0 60px 40px -80px #fff8 inset,0 -54px 0 -50px #fff3 inset}.cursor.owner .name:after{content:url(crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#000024;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:-28px;padding:5px;width:280px;height:16px;background:#898;border:1px solid #aba;cursor:pointer;margin:0 0;font-size:12px;background:rgba(255,255,255,.14);border-color:transparent}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#7ecaff}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(crownsolo.png);position:relative;top:2px;margin-left:4px}#room .info.no-chat:after{content:url(no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:rgba(0,0,0,0);overflow:hidden}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;border:1px solid #aba0;background-color:rgba(0,0,0,.36);max-height:100000%;height:3500%;-webkit-size:200%}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:rgba(255,255,255,.28)}#room .more .new{background:#9a90;border-color:transparent;background-color:rgba(0,0,0,0)}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:0 0;border:1px solid #0000;padding:5px;cursor:pointer;line-height:12px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:100px;overflow:hidden;white-space:nowrap;display:inline-block}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px;color:#fff}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea;-webkit-border-radius:0;background:rgba(0,0,0,.62)}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline;color:#fff;text-shadow:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;`+
    `opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px;font-family:"Segoe UI","Open Sans","Noto Sans",sans-serif;font-weight:600}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0;font-size:14px;background:rgba(0,0,0,.05);text-shadow:none;text-emphasis-color:#fff color: red}#chat li .name{font-weight:600;margin-right:10px}#chat li .message{margin-right:6px;color:#fff}#chat li .quote{color:#789922}#chat input{margin:4px;width:calc(99% - 280px);border:1px solid #0000;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;position:relative;left:298px;font-family:"Segoe UI","Open Sans","Noto Sans",sans-serif;font-weight:600}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}.chatting .translate{border-color:transparent}}`)
  }
  else if (style == `Golden`) {
    addCSS(`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800');*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em 'Open Sans','Noto Sans',sans-serif;color:#fff;text-shadow:#4448 0 1px 0}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0008 inset,0 -54px 0 -50px #0003 inset}#names .name.me:after{content:"Me";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width: 30px;height: 33px;background: url(https://cdn.discordapp.com/attachments/692183242979409961/719167468471582750/anonygoldcursor.png);background-position: 135% 100%;position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:2px 8px;font-size:.8rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:72px;background:#0008!important;margin-bottom:3px}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:0;top:-36px;padding:8px 16px;width:290px;height:36px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:.9rem;transition:.2s}#room:hover{background:#fff3}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:36px;height:100%;position:absolute;right:0;top:0;background:#0006 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:400px;border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 16px;width:100%;line-height:36px;height:36px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:36px;font-size:.9rem;line-height:36px!important;background:#fff2;border:1px solid #0000;padding:0 0;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:125px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:0;width:36px;top:0;font-size:0}#new-room-btn:before{content:"+";font-size:24px}#play-alone-btn{position:absolute;left:36px;width:125px;top:0}#sound-btn{position:absolute;left:290px;top:0}#room-settings-btn{position:absolute;left:150px;top:0;display:none}#midi-btn{position:absolute;left:290px;top:36px}#record-btn{position:absolute;left:415px;top:36px}#synth-btn{position:absolute;left:415px;top:0}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:-1px;bottom:10px;width:285px;height:18px;padding:0;font-size:1rem;font-weight:700;line-height:1rem;pointer-events:none;text-align:center}#status .number{font-size:1.7rem}#volume{position:absolute;right:0;top:30px;width:100px;height:30px;padding-bottom:10px;background:url(/volume2.png) no-repeat;background-position:50% 50%;margin:0;box-sizing:border-box;transition:.2s}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;`+
    `height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:111px;left:0;width:100%;vertical-align:bottom;font-size:.9rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;position:relative;bottom:-36px;margin:0 0;padding:0 18px;background-attachment:local}#chat li{padding:9px 0;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:18px}#chat li .message{margin-right:8px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:36px;font:inherit;width:calc(100vw - 290px);position:relative;left:290px;top:36px;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 93px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
    // i!js addCSS('.cursor .name {box-shadow:0 -45px 20px -50px #0008 inset,0 -54px 0 -50px #0003 inset}')
  }
  else if (style == `Golden2`) { // Anonygold
    addCSS(`@import url(https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800);*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em 'Open Sans','Noto Sans',sans-serif;color:#fff;text-shadow:#4448 0 1px 0}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0008 inset,0 -54px 0 -50px #0003 inset}#names .name.me:after{content:"Me";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);filter:contrast(.7) brightness(1.5);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:30px;height:33px;background:url(https://cdn.discordapp.com/attachments/692183242979409961/719167468471582750/anonygoldcursor.png);background-position:135% 100%;position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:2px 8px;font-size:.8rem;line-height:1.4rem;box-shadow:0 1px 3px 0 #0004,0 -70px 50px -100px #000 inset}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:72px;background:#0008!important;margin-bottom:3px;backdrop-filter:blur(12px)}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:0;top:-36px;padding:8px 8px;width:290px;height:36px;background:#444a;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:.85rem;transition:.2s;text-shadow:0 1px 0 #0008}#room:hover{background:#fff3}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem;text-align:right}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px;text-align:right}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:36px;height:100%;position:absolute;right:0;top:0;background:#0006 url(/arrow.png) no-repeat center 7px}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:calc(100vh - 111px);border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 8px;width:100%;line-height:36px;height:36px}#room .more:before{content:"Room list";font-size:1.3rem;line-height:2.8rem;padding:8px 8px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60;display:none}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:36px;font-size:.9rem;line-height:36px!important;background:#fff2;border:1px solid #0000;padding:0 0;cursor:default;line-height:.9rem;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:125px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s;text-shadow:0 1px 0 #0008}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:0;width:36px;top:0;font-size:0}#new-room-btn:before{content:"+";font-size:24px}#play-alone-btn{position:absolute;left:36px;width:125px;top:0}#sound-btn{position:absolute;left:290px;top:0}#room-settings-btn{position:absolute;left:150px;top:0;display:none}#midi-btn{position:absolute;left:290px;top:36px}#record-btn{position:absolute;left:415px;top:36px}#synth-btn{position:absolute;left:415px;top:0}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:-1px;bottom:10px;width:285px;height:18px;padding:0;font-size:1rem;font-weight:700;line-height:1rem;pointer-events:none;text-align:center}#status .number{font-size:1.7rem}#volume{position:absolute;right:0;top:30px;width:100px;height:30px;padding-bottom:10px;background:url(/volume2.png) no-repeat;background-position:50% 50%;margin:0;box-sizing:border-box;transition:.2s}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0}#quota .value{width:100%;height:100%;display:block}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}`+
    `.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:111px;left:0;width:100%;vertical-align:bottom;font-size:.9rem;color:#fff}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;position:relative;bottom:-36px;margin:0 0;padding:0 8px;background-attachment:local}#chat li{padding:4px 0;opacity:0;line-height:0}#chat li .name{font-weight:700;margin-right:12px}#chat li .message{margin-right:8px;line-height:1.4em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:36px;font:inherit;width:calc(100vw - 290px);position:relative;left:290px;top:36px;border:0 solid #fff0;background:#0002;text-shadow:#0008 0 1px 0;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#375050cc;border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting input{background:#264040cc}#chat.chatting li{display:list-item!important;opacity:1!important}#chat.chatting ul{max-height:calc(100vh - 93px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px;display:none}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:5000}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Galaxy`) { // Recreation of Nebula's CSS, aside from the cat cursors
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt Consolas,Menlo,monospaced;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;min-width:50px;text-align:center;cursor:pointer;line-height:15px;color:#fff;border:3px #000 solid;text-shadow:none}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#ff0}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#ff0}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;white-space:nowrap;padding:5px;font-size:13px;line-height:1em;font-family:Verdana,"DejaVu Sans",sans-serif}.cursor { width: 24px; height: 24px; background: url("https://cdn.discordapp.com/attachments/372196271928246272/742888375379558461/nebula_cursor.png") !important; position: absolute; pointer-events: none; margin-left: -2px; margin-top: -2px; left: 200%; top: 100%;}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#0000!important;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#000;border:1px solid #000;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:10px;font-size:12px;background:#000;background:-moz-linear-gradient(left,#000 0,#a8a7ac 100%);background:-webkit-linear-gradient(left,#000 0,#a8a7ac 100%);background:linear-gradient(to right,#000 0,#a8a7ac 100%);border:2px solid #000;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:103px;overflow:hidden;white-space:nowrap;font-family:"Arial Black"}.ugly-button:hover{background:#000;background:-moz-linear-gradient(left,#000 0,#b8b7bc 100%);background:-webkit-linear-gradient(left,#000 0,#b8b7bc 100%);background:linear-gradient(to right,#000 0,#b8b7bc 100%)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{`+
    `margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:16px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:8px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:32px 24px;width:95%;border:1px solid #0008;background:#fff8;text-shadow:none;color:#000;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#0008}#chat input:-moz-placeholder{color:#0008}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px;display:none}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  // MPP CLONES:
  else if (style == `Pianowo`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#242464;background:-moz-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#242464),color-stop(100%,#000024));background:-webkit-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-o-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-ms-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:radial-gradient(ellipse at center,#242464 0,#000024 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-lines{color:#f88}#names .name.muted-lines:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:23px;height:30px;background:url(cursor.png);position:absolute;pointer-events:none;margin-left:-5px;margin-top:-5px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:12px;top:10px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#000024;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(crownsolo.png);position:relative;top:2px;margin-left:4px}#room .info.no-chat:after{content:url(no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;`+
    `-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}.ugly-button{-webkit-border-radius:0;display:inline-block;background:0 0;border-color:transparent}#room{background:rgba(255,255,255,.14);border-color:transparent}#room .expand{background:rgba(0,0,0,0);overflow:hidden}#room .more{border-color:transparent;background-color:rgba(0,0,0,.36);max-height:100000%;height:3500%;-webkit-size:200%}#names .name{-webkit-border-radius:0;text-shadow:none}#chat li{text-shadow:none;text-emphasis-color:: #fff}#room .more .new{border-color:transparent;background-color:rgba(0,0,0,0)}#room .info.lobby{color:#7ecaff}#room .more .info:hover{background:rgba(255,255,255,.28)}.notification.classic .notification-body{-webkit-border-radius:0;background:rgba(0,0,0,.62)}h1{color:#fff;text-shadow:transparent}.title{color:#fff}#chat input{border-color:transparent}li{font-size:14px;background:rgba(0,0,0,.05)}.chatting .translate{border-color:transparent}li{color:red}`)
  }
  else if (style == `Lamp Clone`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#242464;background:-moz-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#242464),color-stop(100%,#000024));background:-webkit-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-o-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:-ms-radial-gradient(center,ellipse cover,#242464 0,#000024 100%);background:radial-gradient(ellipse at center,#242464 0,#000024 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-lines{color:#f88}#names .name.muted-lines:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:23px;height:30px;background:url(cursor.png);position:absolute;pointer-events:none;margin-left:-5px;margin-top:-5px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:12px;top:10px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#000024;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(crownsolo.png);position:relative;top:2px;margin-left:4px}#room .info.no-chat:after{content:url(no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;`+
    `-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `MPP Default`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;`+
    `-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Wolfbound`) { // Wolfy's clone
    addCSS(`*{image-rendering:auto}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}@keyframes rainbow{0%{border-color:red}25%{border-color:#ef0}50%{border-color:#00ff1e}75%{border-color:#00d5ff}100%{border-color:#4000ff}}@keyframes emex_rainbow{0%{border-color:#ffa031}100%{border-color:#4abdff}}.rainbow_border{border:2px solid #adff2f;-webkit-animation:rainbow 5s infinite alternate;-moz-animation:rainbow 5s infinite alternate;animation:rainbow 5s infinite alternate}.emex_border{border:2px solid #ffa031;-webkit-animation:emex_rainbow 5s infinite alternate;-moz-animation:emex_rainbow 5s infinite alternate;animation:emex_rainbow 5s infinite alternate}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border:2px solid;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/3c6e5433c69c48145e6a6e2cf16ea0fbe9be9c1e/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/a08484f60ed96b78cfae1dbcade6d5298036f081/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;border:2px solid;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/3c6e5433c69c48145e6a6e2cf16ea0fbe9be9c1e/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/3c6e5433c69c48145e6a6e2cf16ea0fbe9be9c1e/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/9d01ae37e98e2209b213da5d3c0b3bb050aa9553/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(/698c7dccb9222c42d205fe8bbc28b5ce65d9fee0/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:bolder}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;`+
    `-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .emote{width:32px;height:32px;vertical-align:bottom;image-rendering:auto}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }



  // NON-MPP-BASED MPP CLONES:
  else if (style == `Rhythmic`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt "Lucida Grande",verdana,"DejaVu Sans",sans-serif;color:#fff;text-shadow:none}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:35px;left:0;font-size:19px;width:190px;background:#456a;height:calc(100vh - 70px);overflow-y:scroll;overflow-x:hidden}#names:before{content:"PEOPLE";font-size:13px;position:fixed;left:0;top:0;width:95px;height:35px;background:#456a;line-height:35px;text-align:center}#names::-webkit-scrollbar{display:none}#names .name{box-sizing:border-box;float:left;position:relative;width:calc(100% - 8px);padding:15px 30px;margin:3px 4px;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;min-width:50px;text-align:left;cursor:pointer;line-height:15px;background:#4440!important;height:60px;box-shadow:0 1px 0 0 #fff4 inset,0 2px 3px 0 #0008;overflow:hidden}#names .name:hover{background:#fff8!important}#names .name.me:after{content:"ME";position:absolute;top:2px;right:6%;font-size:12px}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-2px);-webkit-transform:translateY(-2px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%;transform:scale(.75);transform-origin:100% 50%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:32px;background:#456a!important;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:fixed;left:95px;top:0;padding:0;width:95px;height:35px;background:#333f;border:none;cursor:pointer;margin:0;font-size:0;text-align:center;line-height:35px;overflow:hidden}#room:before{font-size:12px;content:"ROOMS"}#room .info{white-space:nowrap;line-height:32px;overflow:hidden;font-size:18px;text-align:left}#room .info.lobby{color:#dd0}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:0 0}#room .more{display:none;position:fixed;bottom:35px;left:0;width:190px;overflow:hidden;overflow-y:scroll;background:#456e;border:none;max-height:none;height:calc(100vh - 70px)}#room .more::-webkit-scrollbar{display:none}#room .more>div{margin:0;padding:0 6px 0 16px;width:96%;border-radius:5px;margin:6px 4px;height:55px;box-sizing:border-box;background:0 0;box-shadow:0 1px 0 0 #fff4 inset,0 2px 3px 0 #0008}#room .more .info:hover{background:#fff8}#room .more .new{background:#9a9;display:none}#room .more .new:hover{background:#cdc}.ugly-button{height:32px;font-size:16px;background:#0000;border:none;padding:0 4px;cursor:pointer;line-height:36px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;width:unset;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#fff8}.ugly-button.stuck{background:#8888}#new-room-btn{position:absolute;left:30px;top:0}#play-alone-btn{position:absolute;left:136px;top:0}#sound-btn{position:absolute;left:225px;top:0}#room-settings-btn{position:absolute;left:600px;top:0;display:none}#midi-btn{position:absolute;left:332px;top:0}#record-btn{position:absolute;left:431px;top:0}#synth-btn{position:absolute;left:530px;top:0}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;display:none;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#4444}#quota .value{width:100%;height:100%;display:block;background:#aaa4}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:none;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:none;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{box-sizing:border-box;padding:0 0 0 200px;position:fixed;bottom:35px;left:0;width:100%;vertical-align:bottom;font-size:16px;color:#fff;text-shadow:none;opacity:.5}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:8px;margin:2px;width:fit-content;opacity:0;background:#fff;border-radius:20px;opacity:1!important}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px;color:#333!important}#chat li .quote{color:#789922}#chat input{margin:24px 8px 8px 8px;padding:8px;width:99%;border:3px solid #444;background:#fff;text-shadow:none;color:#444;border-radius:10px;-webkit-border-radius:10px;-moz-border-radius:10px;font-family:inherit}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:3px solid #444}#chat.chatting{background:#000a;border-radius:0;box-shadow:none;transition:all .1s;opacity:1}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:none}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:80}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  
  // OLD VERSIONS OF MPP:
  else if (style == `Apr 2012`) {
    addCSS(`*{margin:0;cursor:default}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 2px 2px}body{position:absolute}body{background:#f7fbfc;background:-moz-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#f7fbfc),color-stop(40%,#d9edf2),color-stop(100%,#add9e4));background:-webkit-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:-o-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:-ms-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%)}#social{position:fixed;top:2px;left:2px;font-size:12px}#social>span{float:left}#piano{width:90%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;z-index:1;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;z-index:2;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{background:#ee6;transition:background 0s;-webkit-transition:background 0s;-moz-transition:background 0s;-o-transition:background 0s;-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}#piano .key.sharp.play{background:#7af}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.enemy{width:16px;height:24px;background:url(/web/20120518104514im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;z-index:101;pointer-events:none}.enemy .name{display:none;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;text-shadow:none;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.enemy.owner .name:before{content:url(/web/20120518104514im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:4px}.enemy.named .name{display:inline}.enemy.owner .name{display:inline}#crown{position:absolute;z-index:20;width:16px;height:16px;background:url(/web/20120518104514im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px;z-index:50}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20120518104514im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;background:#898;border:1px solid #aba}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:#aba;border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#bca}.ugly-button.stuck{background:#cba}#new-room-btn{position:absolute;left:300px;top:9px}#midi-btn{position:absolute;left:420px;top:9px}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:40px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20120518104514im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#transport{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute;z-index:100}.notification-body{background:#fea;border-color:#fea;width:400px;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:10000;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}.dialog{background:#cdc;width:400px;height:120px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-60px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog,.dialog *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px}#chat li span.name{font-weight:700;margin-right:10px}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#midi-connections .half h2{margin:5px}#midi-connections .half{width:50%;float:left;text-align:center}#midi-connections .half select{width:80%;height:20px;margin:2px}#midi-connections .half button.remove{width:10%;height:20px;margin:2px;padding:0}#midi-connections .half button.add{width:50%;height:20px;margin:2px}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)}
  else if (style == `Feb 2012`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 2px 2px}body{position:absolute}body{background:#f7fbfc;background:-moz-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#f7fbfc),color-stop(40%,#d9edf2),color-stop(100%,#add9e4));background:-webkit-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:-o-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:-ms-radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%);background:radial-gradient(center,ellipse cover,#f7fbfc 0,#d9edf2 40%,#add9e4 100%)}#social{position:fixed;top:2px;left:2px;font-size:12px}#piano{width:90%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;z-index:1;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;z-index:2;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{background:#ee6;transition:background 0s;-webkit-transition:background 0s;-moz-transition:background 0s;-o-transition:background 0s;-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}#piano .key.sharp.play{background:#7af}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.enemy{width:16px;height:24px;background:url(/web/20120316204328im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;z-index:101;pointer-events:none}.enemy .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;text-shadow:none;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px;z-index:3}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20120316204328im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;background:#898;border:1px solid #aba}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:40px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20120316204328im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#transport{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute;z-index:100}.notification-body{background:#fea;border-color:#fea;width:300px;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:10000;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog,.dialog *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}`)
  }
  else if (style == `Mar 2013`) {
    addCSS(`*{margin:0;cursor:default}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 2px 2px}body{position:absolute}body{background:#feffe8;background:-moz-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#feffe8),color-stop(100%,#d6dbbf));background:-webkit-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-o-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-ms-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:radial-gradient(ellipse at center,#feffe8 0,#d6dbbf 100%)}a{cursor:pointer}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20130426103638im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{-webkit-transform:translateY(-4px)}#social{position:fixed;top:8px;right:2px;font-size:12px}#social>span{float:right}#social #links{margin-top:20px;margin-right:10px}#like{position:fixed;right:88px}#cwsbadge{position:fixed;right:-44px}#piano{width:90%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;z-index:1;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;z-index:2;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.enemy{width:16px;height:24px;background:url(/web/20130426103638im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;z-index:101;pointer-events:none}.enemy .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.enemy.owner .name:after{content:url(/web/20130426103638im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.enemy .name{display:inline-block}.enemy .enemySpotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;border:4px solid #fff;-webkit-border-radius:100%}#crown{position:absolute;z-index:20;width:16px;height:16px;background:url(/web/20130426103638im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px;z-index:50}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.owner:before{content:url(/web/20130426103638im_/http://www.multiplayerpiano.com/crown.png)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20130426103638im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:#aba;border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#bca}.ugly-button.stuck{background:#cba}#new-room-btn{position:absolute;left:300px;top:9px}#midi-btn{position:absolute;left:420px;top:9px}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:40px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20130426103638im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#transport{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute;z-index:100}.notification-body{background:#fea;border-color:#fea;width:400px;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;z-index:10000;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}.dialog{background:#cdc;width:400px;height:120px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-60px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog,.dialog *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#midi-connections .half h2{margin:5px}#midi-connections .half{width:50%;float:left;text-align:center}#midi-connections .half select{width:80%;height:20px;margin:2px}#midi-connections .half button.remove{width:10%;height:20px;margin:2px;padding:0}#midi-connections .half button.add{width:50%;height:20px;margin:2px}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Oct 2013`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#feffe8;background:-moz-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#feffe8),color-stop(100%,#d6dbbf));background:-webkit-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-o-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-ms-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:radial-gradient(ellipse at center,#feffe8 0,#d6dbbf 100%)}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20131229150345im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20131229150345im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20131229150345im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20131229150345im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20131229150345im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20131229150345im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20131229150345im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:#aba;border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#bca}.ugly-button.stuck{background:#cba}#new-room-btn{position:absolute;left:300px;top:9px}#midi-btn{position:absolute;left:420px;top:9px}#play-alone-btn{position:absolute;left:540px;top:9px}#room-settings-btn{position:absolute;left:660px;top:9px;display:none}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20131229150345im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;width:400px;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:`+
    `1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#midi-connections .half h2{margin:5px}#midi-connections .half{width:50%;float:left;text-align:center}#midi-connections .half select{width:80%;height:20px;margin:2px}#midi-connections .half button.remove{width:10%;height:20px;margin:2px;padding:0}#midi-connections .half button.add{width:50%;height:20px;margin:2px}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20131229150345im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20131229150345im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:0}#cursors{z-index:1}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
    /* input[type=color]{display:none} */
  }
  else if (style == `Jan 2015`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#feffe8;background:-moz-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#feffe8),color-stop(100%,#d6dbbf));background:-webkit-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-o-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:-ms-radial-gradient(center,ellipse cover,#feffe8 0,#d6dbbf 100%);background:radial-gradient(ellipse at center,#feffe8 0,#d6dbbf 100%)}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20150114160036im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20150114160036im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20150114160036im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20150114160036im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20150114160036im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20150114160036im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20150114160036im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:#aba;border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#bca}.ugly-button.stuck{background:#cba}#new-room-btn{position:absolute;left:300px;top:9px}#midi-btn{position:absolute;left:420px;top:9px}#play-alone-btn{position:absolute;left:540px;top:9px}#room-settings-btn{position:absolute;left:660px;top:9px;display:none}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20150114160036im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;width:400px;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}`+
    `#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#midi-connections .half h2{margin:5px}#midi-connections .half{width:50%;float:left;text-align:center}#midi-connections .half select{width:80%;height:20px;margin:2px}#midi-connections .half button.remove{width:10%;height:20px;margin:2px;padding:0}#midi-connections .half button.add{width:50%;height:20px;margin:2px}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20150114160036im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20150114160036im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:0}#cursors{z-index:1}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Feb 2015`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#ecfaed;background:-moz-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfaed),color-stop(100%,#c5d5c8));background:-webkit-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:radial-gradient(ellipse at center,#ecfaed 0,#c5d5c8 100%)}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;overflow:hidden;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20150315080009im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20150315080009im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20150315080009im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20150315080009im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20150315080009im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20150315080009im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20150315080009im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:#aba;border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#bca}.ugly-button.stuck{background:#cba}#new-room-btn{position:absolute;left:300px;top:9px}#midi-btn{position:absolute;left:420px;top:9px}#play-alone-btn{position:absolute;left:540px;top:9px}#room-settings-btn{position:absolute;left:660px;top:9px;display:none}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20150315080009im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;width:400px;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:`+
    `-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#midi-connections .half h2{margin:5px}#midi-connections .half{width:50%;float:left;text-align:center}#midi-connections .half select{width:80%;height:20px;margin:2px}#midi-connections .half button.remove{width:10%;height:20px;margin:2px;padding:0}#midi-connections .half button.add{width:50%;height:20px;margin:2px}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20150315080009im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20150315080009im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:0}#cursors{z-index:1}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Oct 2015`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#ecfaed;background:-moz-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfaed),color-stop(100%,#c5d5c8));background:-webkit-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfaed 0,#c5d5c8 100%);background:radial-gradient(ellipse at center,#ecfaed 0,#c5d5c8 100%)}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20151023151439im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20151023151439im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20151023151439im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20151023151439im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20151023151439im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20151023151439im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20151023151439im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:#aba;border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#bca}.ugly-button.stuck{background:#cba}#new-room-btn{position:absolute;left:300px;top:9px}#play-alone-btn{position:absolute;left:420px;top:9px}#midi-btn{position:absolute;left:540px;top:9px;display:none}#room-settings-btn{position:absolute;left:660px;top:9px;display:none}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:478px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20151023151439im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:488px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:`+
    `#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#midi-connections .half h2{margin:5px}#midi-connections .half{width:50%;float:left;text-align:center}#midi-connections .half select{width:80%;height:20px;margin:2px}#midi-connections .half button.remove{width:10%;height:20px;margin:2px;padding:0}#midi-connections .half button.add{width:50%;height:20px;margin:2px}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20151023151439im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20151023151439im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:0}#cursors{z-index:1}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Jan 2016`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#ecfafd;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20160112130532im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20160112130532im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20160112130532im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20160112130532im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:9px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20160112130532im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20160112130532im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20160112130532im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:#cba2}#new-room-btn{position:absolute;left:300px;top:9px}#play-alone-btn{position:absolute;left:420px;top:9px}#midi-btn{position:absolute;left:540px;top:9px}#room-settings-btn{position:absolute;left:660px;top:9px;display:none}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20160112130532im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px`+
    `}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20160112130532im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20160112130532im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Jul 2016`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#ecfafd;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20160824232414im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20160824232414im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20160824232414im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20160824232414im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20160824232414im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20160824232414im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20160824232414im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#room-settings-btn{position:absolute;left:540px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20160824232414im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:`+
    `all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20160824232414im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social #inclinations{margin-top:20px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20160824232414im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Nov 2016`) {
    addCSS(`*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt verdana;color:#fff;text-shadow:#444 1px 1px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:4px;margin:2px;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;min-width:50px;text-align:center;cursor:pointer;line-height:15px}#names .name.me:after{content:"Me";position:absolute;top:-4px;right:50%;font-size:10px}#names .name.owner:before{content:url(/web/20161205190953im_/http://www.multiplayerpiano.com/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/web/20161205190953im_/http://www.multiplayerpiano.com/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:10px}.cursor.owner .name:after{content:url(/web/20161205190953im_/http://www.multiplayerpiano.com/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}//.cursor .spotlight{display:none;position:relative;left:-14px;top:-9px;width:32px;height:32px;-webkit-border-radius:100%}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.4)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/web/20161205190953im_/http://www.multiplayerpiano.com/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:20px;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0,top: 0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:12px}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#def}//#room .info.crownsolo:after{content:url(/web/20161205190953im_/http://www.multiplayerpiano.com/crownsolo.png);position:relative;top:2px;margin-left:4px}//#room .info.no-chat:after{content:url(/web/20161205190953im_/http://www.multiplayerpiano.com/no-chat.png);position:relative;top:2px;margin-left:4px}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/web/20161205190953im_/http://www.multiplayerpiano.com/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:12px;font-size:12px;background:rgba(170,187,170,.35);border:1px solid #898;padding:5px;cursor:pointer;line-height:12px;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:rgba(187,204,170,.35)}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#room-settings-btn{position:absolute;left:540px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:10px;width:320px;height:20px;padding:5px;font-size:20px;font-weight:800;line-height:20px;pointer-events:none}#status .number{font-size:35px}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}.volume-slider{width:100%;height:100%;background:url(/web/20161205190953im_/http://www.multiplayerpiano.com/volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:10px;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:#ccc 1px 1px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:16px;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:`+
    `all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(/web/20161205190953im_/http://www.multiplayerpiano.com/kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social #inclinations{margin-top:20px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font:15px sans-serif;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(/web/20161205190953im_/http://www.multiplayerpiano.com/envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  
  // MY ATTEMPTS AT MAKING MPP USE ANOTHER FRAMEWORK:
  else if (style == `Material`) {
    addCSS(`@import url(https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700);*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:1rem Roboto,Arial,"Helvetica Neue",Helvetica,sans-serif;color:#fff;text-shadow:none}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:calc(14rem * .0625);width:80%}#names .name{float:left;position:relative;padding:4px;margin:3px 4.5px;border-radius:4px;min-width:72px;text-align:center;cursor:pointer;line-height:24px;letter-spacing:.25px}#names .name.me:after{content:"ME";position:absolute;top:-6px;left:3px;font-size:calc(10rem * .0625);letter-spacing:calc(1.5rem / 10)}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-8px;left:4px}#names .name.play{transform:translateY(-4px);-webkit-transform:translateY(-4px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:calc(10rem * .0625);letter-spacing:calc(1.5rem / 10)}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:calc(10rem * .0625);letter-spacing:calc(1.5rem / 10)}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:16px;top:8px;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;white-space:nowrap;padding:1px;font-size:calc(12rem * .0625);letter-spacing:calc(.4rem / 12)}.cursor.owner .name:after{content:url(/crown.png);position:relative;top:-8px;left:0}.cursor .name{display:inline-block}.cursor{transition:top .1s,left .1s}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:calc(14rem / 16);letter-spacing:calc(.25rem / 14);padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:.5rem;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:pointer;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:initial}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:calc(12rem / 16);letter-spacing:calc(.4rem / 12)}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:calc(24rem / 16);pointer-events:none;display:none}#room-notice p{margin:1em}#bottom{position:fixed;bottom:0;left:0;width:100%;height:96px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:0;top:0;padding:5px;width:240px;height:12px;background:#898;border:1px solid #aba;cursor:pointer;margin:4px 24px;font-size:calc(14rem / 16);letter-spacing:calc(.25rem / 14)}#room .info{white-space:nowrap;line-height:12px;overflow:hidden;height:20px}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:1px solid #aba;max-height:600px}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:20px}#room .more .info:hover{background:#aba}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:24px;font-size:calc(14rem / 16);letter-spacing:calc(1.25rem / 14);background:rgba(170,187,170,0);border:1px solid #2962ff;padding:5px;cursor:pointer;line-height:24px;border-radius:4px;width:120px;overflow:hidden;white-space:nowrap;text-transform:uppercase;color:#2962ff;text-align:center}.ugly-button:hover{background:#fff2}.ugly-button.stuck{background:#fff0}#new-room-btn{position:absolute;left:300px;top:6px}#play-alone-btn{position:absolute;left:440px;top:6px}#sound-btn{position:absolute;left:580px;top:6px}#room-settings-btn{position:absolute;left:720px;top:6px;display:none}#midi-btn{position:absolute;left:300px;top:48px}#record-btn{position:absolute;left:440px;top:48px}#synth-btn{position:absolute;left:580px;top:48px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:0;width:320px;height:18px;padding:5px;font-size:calc(16rem / 16);letter-spacing:calc(.5rem / 16);font-weight:400;line-height:20px;pointer-events:none}#status .number{font-size:1rem}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:calc(12rem / 16);letter-spacing:calc(.4rem / 16);color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:#fea;padding:10px;position:relative;left:0;top:0;color:#444;font-size:12px;text-shadow:none;border-radius:6px;box-shadow:2px 2px 5px rgba(0,0,0,.25)}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #f84;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:8px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:20px;color:#f84;text-shadow:none}.notification .x:hover{font-weight:700}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:14px;font-weight:700;padding-top:8px;padding-bottom:8px;text-decoration:underline}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84;cursor:pointer;font-family:monospace}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-200px;margin-top:-50px;padding:10px;border:1px solid #9a9;overflow:hidden;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:`+
    `0 0 8px #000;-webkit-box-shadow:0 0 8px #000;-moz-box-shadow:0 0 8px #000}.dialog p{margin:10px;font-size:20px}.dialog input.text{font-size:20px;height:20px;width:75%}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fe4;border:none;padding:7px 40px 20px 30px;font-size:20px;color:#fff;text-shadow:#444 2px 2px 2px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;box-shadow:inset 0 0 4px #000;-webkit-box-shadow:inset 0 0 4px #000;-moz-box-shadow:inset 0 0 4px #000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-10px;right:-10px}.dialog .submit:hover{background:#ff8;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:13px;color:#fff;text-shadow:#888 1px 1px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:4px;padding:0;background-attachment:local}#chat li{padding:2px;opacity:0}#chat li .name{font-weight:700;margin-right:10px}#chat li .message{margin-right:6px}#chat li .quote{color:#789922}#chat input{font-family:inherit;margin:4px;width:99%;border:1px solid #fff;background:0 0;text-shadow:#888 1px 1px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:0;border:1px solid #ff8}#chat.chatting{background:rgba(64,80,80,.75);border-radius:5px;box-shadow:1px 1px 5px #888;transition:all .1s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#aaa 1px 1px}#chat.chatting ul{max-height:50em;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Fluent`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:14px/20px "Segoe UI",Segoe,"Webly Sleek UI","Frutiger Next",Frutiger,"Open Sans","Noto Sans",sans-serif;color:#fff;text-shadow:#000a 0 0 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:4px;left:4px;font-size:1em;width:80%}#names .name{box-sizing:border-box;float:left;position:relative;padding:4px 12px;margin:0;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;min-width:72px;text-align:center;cursor:pointer;line-height:18px;box-shadow:0 -45px 20px -50px #0004 inset,0 -54px 0 -50px #0004 inset}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-3px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;white-space:nowrap;padding:2px 8px;font-size:.8rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:72px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{box-sizing:border-box;position:absolute;left:8px;top:4px;padding:8px 16px;width:260px;height:30px;background:#fff2;border:0 solid #fff0;border-radius:0;cursor:default;margin:0 0;font-size:1rem;transition:.2s}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.not-visible{color:#def}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{display:none;width:24px;height:100%;position:absolute;right:5px;top:5px;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:0;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:0 solid #0000;max-height:400px;border-radius:0;backdrop-filter:blur(20px) contrast(.7) saturate(1.4)}#room .more>div{transition:.2s;margin:0;padding:0 0 0 16px;width:100%;line-height:2em;height:30px}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a60}#room .more .new:hover{background:#3a64}.ugly-button{box-sizing:border-box;height:30px;font-size:1rem;background:#fff0;border:1px solid #888f;padding:8px 6px;cursor:default;line-height:.9rem;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;width:120px;overflow:hidden;white-space:nowrap;text-align:center;transition:.2s}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:276px;top:4px;font-size:0}#new-room-btn:before{content:"Create room";font-size:14px}#play-alone-btn{position:absolute;left:404px;top:4px;font-size:0}#play-alone-btn:before{content:"Play alone";font-size:14px}#sound-btn{position:absolute;left:532px;top:4px;font-size:0}#sound-btn:before{content:"Select sound";font-size:14px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:276px;top:36px}#record-btn{position:absolute;left:404px;top:36px}#synth-btn{position:absolute;left:532px;top:36px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:-1px;bottom:10px;width:200px;height:1rem;padding:0;font-size:1rem;font-weight:400;line-height:1rem;pointer-events:none;text-align:center}#status .number{font-size:1.5rem}#volume{position:absolute;right:0;top:30px;width:100px;height:30px;padding-bottom:10px;background:#fff2;margin:0;box-sizing:border-box;transition:.2s}#volume:hover{background:#fff3}#volume-slider{width:100%;height:100%;background:#fff0;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:0;bottom:0;font-size:.5rem;color:#ccc8;height:10px;width:100px;padding-left:10px;box-sizing:border-box}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#fff 0 0 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#0004;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{`+
    `user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:0 solid #0000;overflow:hidden;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:12px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:0;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#000 0 0 2px;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:63px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#fff8 0 0 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 16px;background-attachment:local}#chat li{padding:8px 0;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:16px}#chat li .message{margin-right:8px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:0;padding:0 16px;box-sizing:border-box;height:30px;font:inherit;width:100vw;border:0 solid #fff0;background:#0002;text-shadow:#fff4 0 0 2px;color:#fff;border-radius:0;-webkit-border-radius:0;-moz-border-radius:0}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:0 solid #fff2}#chat.chatting{background:#9998;backdrop-filter:blur(1vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .5s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#fff8 0 0 2px}#chat.chatting ul{max-height:calc(100vh - 96px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  else if (style == `Minimal`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt sans-serif;color:#fff;text-shadow:none}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:none}a:hover{color:#e05;transition:none}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:initial;left:initial;font-size:12px;width:80%}#names .name{float:left;position:relative;padding:initial;margin:initial;border-radius:initial;-webkit-border-radius:initial;-moz-border-radius:initial;min-width:50px;text-align:center;cursor:initial;line-height:20px}#names .name.me:after{content:"Me";position:absolute;top:0;right:0;font-size:initial}#names .name.owner:before{content:url(/crown.png);position:absolute;top:initial;left:initial}#names .name.play{transform:none;-webkit-transform:none}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:initial;margin-top:initial;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:initial;top:initial;pointer-events:none;color:#fff;background:#000;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;white-space:nowrap;padding:initial;font-size:initial}.cursor.owner .name:after{content:none;position:initial;top:initial;left:initial}.cursor .name{display:inline-block}.cursor{transition:none}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:initial;text-align:initial;line-height:initial;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:none;user-select:text}.participant-menu .info:hover{opacity:1;transition:none}.participant-menu .menu-item{cursor:initial;margin:initial;padding:initial;border-top:none}.participant-menu .menu-item:hover{background:initial}.participant-menu .menu-item.clicked{background:initial}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:initial;opacity:initial;font-size:initial;pointer-events:none;display:none}#room-notice p{margin:initial}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:initial;top:initial;padding:initial;width:240px;height:initial;background:#898;border:1px solid #aba;cursor:initial;margin:initial;font-size:initial}#room .info{white-space:nowrap;line-height:initial;overflow:hidden;height:initial}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.banned{color:#ff4040}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#aba url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:initial;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:none;max-height:400px}#room .more>div{margin:initial;padding:initial;width:100%;height:initial}#room .more .info:hover{background:initial}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:initial;font-size:initial;background:unset;border:unset;padding:none;cursor:initial;line-height:initial;border-radius:unset;-webkit-border-radius:unset;-moz-border-radius:unset;width:initial;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:initial}.ugly-button.stuck{background:initial}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:initial}.switched-on{background:#ff8}#status{position:absolute;left:initial;bottom:0;width:320px;height:initial;padding:initial;font-size:initial;font-weight:initial;line-height:initial;pointer-events:none}#status .number{font-size:initial}#volume{position:absolute;right:0;top:0;width:100px;height:40px;margin:0}#volume-slider{width:100%;height:100%;background:0 0;background-position:50% 50%;-webkit-appearance:default}#volume-label{position:absolute;right:0;bottom:0;font-size:initial;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:18px;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fea;border-color:none;padding:initial;position:relative;left:initial;top:initial;color:#444;font-size:initial;text-shadow:none;border-radius:none;box-shadow:none}.notification-body:after{content:"";position:absolute;top:initial;left:initial;margin-left:initial;border-top:none;border-top-color:none;border-left:none;border-right:none}.title{border-bottom:none;font-size:initial;font-weight:initial;padding-bottom:initial;margin-bottom:initial}.notification .x{position:absolute;right:0;top:0;cursor:pointer;font-size:initial;color:initial;text-shadow:none}.notification .x:hover{font-weight:initial}.notification.classic .notification-body{width:400px;background:#fea;border-color:#fea}.notification.short .title{display:none}.notification h1{font-size:initial;font-weight:initial;padding-top:initial;padding-bottom:initial;text-decoration:initial}.notification .connection{padding:initial;margin:initial;background:#fed;border:none;cursor:initial;font-family:initial}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:1px;padding:4px;background:0 0;border:1px solid #f84;border-radius:4px;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:#dfd;cursor:not-allowed;font-weight:bolder}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}.notification .pack:hover{font-weight:700}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:.5;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#cdc;width:initial;height:100px;position:fixed;left:initial;top:initial;margin-left:none;margin-top:none;padding:none;border:none;overflow:hidden;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none}.dialog p{margin:initial;font-size:initial}.dialog input.text{font-size:initial;height:initial;width:initial}.dialog input.checkbox{margin:initial}.dialog .submit{background:#fe4;border:none;padding:none;font-size:initial;color:#fff;text-shadow:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none;transition:none;-webkit-transition:none;-moz-transition:none;-o-transition:none;position:absolute;bottom:initial;right:initial}.dialog .submit:hover{background:#ff8;transition:none;-webkit-transition:none;-moz-transition:none;-o-transition:none}#room-settings{height:`+
    `400px;margin-top:initial}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:initial;color:#fff;text-shadow:none}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:none;padding:0;background-attachment:local}#chat li{padding:none;opacity:0}#chat li .name{font-weight:initial;margin-right:initial}#chat li .message{margin-right:initial}#chat li .quote{color:#789922}#chat input{margin:initial;width:100%;border:none;background:0 0;text-shadow:none;color:#fff;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none}#chat input::-webkit-input-placeholder{color:#ccc}#chat input:-moz-placeholder{color:#ccc}#chat input:focus{outline:initial;border:initial}#chat.chatting{background:#405050;border-radius:none;box-shadow:none;transition:none}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:none}#chat.chatting ul{max-height:none;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Minimal2`) {
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt sans-serif;color:#fff;text-shadow:none}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:none}a:hover{color:#e05;transition:none}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:initial;left:initial;font-size:initial;width:80%}#names .name{float:left;position:relative;padding:initial;margin:initial;border-radius:initial;-webkit-border-radius:initial;-moz-border-radius:initial;min-width:initial;text-align:center;cursor:initial;line-height:initial}#names .name.me:after{content:"Me";position:absolute;top:initial;right:0;font-size:initial}#names .name.owner:before{content:"*";position:absolute;top:initial;left:initial}#names .name.play{transform:none;-webkit-transform:none}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:initial}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:-4px;right:50%;font-size:initial}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:0 0;position:absolute;pointer-events:none;margin-left:initial;margin-top:initial;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:initial;top:initial;pointer-events:none;color:#fff;background:#000;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;white-space:nowrap;padding:initial;font-size:initial}.cursor.owner .name:after{content:none;position:initial;top:initial;left:initial}.cursor .name{display:inline-block}.cursor{transition:none}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:initial;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:initial;text-align:initial;line-height:initial;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:none;user-select:text}.participant-menu .info:hover{opacity:1;transition:none}.participant-menu .menu-item{cursor:initial;margin:initial;padding:initial;border-top:none}.participant-menu .menu-item:hover{background:initial}.participant-menu .menu-item.clicked{background:initial}#crown{position:absolute;width:16px;height:16px;background:"*";cursor:pointer;font-size:initial}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:initial;opacity:initial;font-size:initial;pointer-events:none;display:none}#room-notice p{margin:initial}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:pointer}#room{position:absolute;left:initial;top:initial;padding:initial;width:240px;height:initial;background:0 0;border:initial;cursor:initial;margin:initial;font-size:initial}#room .info{white-space:initial;line-height:initial;overflow:initial;height:initial}#room .info.lobby{color:#efb}#room .info.not-visible{color:#0d3761}#room .info.crownsolo:after{content:"|Crownsolo"}#room .info.no-chat:after{content:"|No Chat"}#room .info.banned{color:#ff4040}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:0 0}#room .more{display:none;position:absolute;bottom:100%;left:initial;width:100%;overflow:hidden;overflow-y:scroll;background:#898;border:none;max-height:400px}#room .more>div{margin:initial;padding:initial;width:100%;height:initial}#room .more .info:hover{background:initial}#room .more .new{background:#9a9}#room .more .new:hover{background:#cdc}.ugly-button{height:initial;font-size:initial;background:unset;border:unset;padding:none;cursor:initial;line-height:initial;border-radius:unset;-webkit-border-radius:unset;-moz-border-radius:unset;width:initial;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:initial}.ugly-button.stuck{background:initial}#new-room-btn{position:absolute;left:250px;top:4px}#play-alone-btn{position:absolute;left:370px;top:4px}#sound-btn{position:absolute;left:490px;top:4px}#room-settings-btn{position:absolute;left:510px;top:4px;display:none}#midi-btn{position:absolute;left:250px;top:32px}#record-btn{position:absolute;left:370px;top:32px}#synth-btn{position:absolute;left:490px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:initial}.knob{cursor:initial}.switched-on{background:#ff8}#status{position:absolute;left:initial;bottom:0;width:320px;height:initial;padding:initial;font-size:initial;font-weight:initial;line-height:initial;pointer-events:none}#status .number{font-size:initial}#volume{position:absolute;right:0;top:0;width:initial;height:initial;margin:0}#volume-slider{width:initial;height:initial;background:0 0;-webkit-appearance:default}#volume-label{position:absolute;right:0;bottom:0;font-size:initial;color:initial}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:initial;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#f80}#quota .value{width:100%;height:100%;display:block;background:#fd0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fff;border-color:none;padding:initial;position:relative;left:initial;top:initial;color:initial;font-size:initial;text-shadow:none;border-radius:none;box-shadow:none}.notification-body:after{content:"";position:absolute;top:initial;left:initial;margin-left:initial;border-top:none;border-top-color:none;border-left:none;border-right:none}.title{border-bottom:none;font-size:initial;font-weight:initial;padding-bottom:initial;margin-bottom:initial}.notification .x{position:absolute;right:0;top:0;cursor:pointer;font-size:initial;color:initial;text-shadow:none}.notification .x:hover{font-weight:initial}.notification.classic .notification-body{width:400px;background:#fff;border-color:#fff}.notification.short .title{display:none}.notification h1{font-size:initial;font-weight:initial;padding-top:initial;padding-bottom:initial;text-decoration:initial}.notification .connection{padding:initial;margin:initial;background:initial;border:none;cursor:initial;font-family:initial}.notification .connection.enabled{background:initial}.notification .connection:after{content:"OFF";font-size:initial;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:initial;color:#4a4;float:right}.notification .connection:hover{font-weight:700}.notification ul{list-style-type:upper-roman}.notification .pack{margin:initial;padding:initial;background:0 0;border:none;border-radius:initial;cursor:pointer;font-family:monospace}.notification .pack.enabled{background:initial;cursor:initial;font-weight:700}.notification .pack:after{content:"";font-size:initial;color:#a44;float:right}.notification .pack.enabled:after{content:"<";font-size:initial;color:#4a4;float:right}.notification .pack:hover{font-weight:initial}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#48a;opacity:initial;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:initial;width:initial;height:100px;position:fixed;left:initial;top:initial;margin-left:none;margin-top:none;padding:none;border:none;overflow:hidden;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none}.dialog p{margin:initial;font-size:initial}.dialog input.text{font-size:initial;height:initial;width:initial}.dialog input.checkbox{margin:initial}.dialog .submit{background:initial;border:none;padding:none;font-size:initial;color:#fff;text-shadow:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none;transition:none;-webkit-transition:none;-moz-transition:none;-o-transition:none;position:absolute;bottom:initial;right:initial}.dialog .submit:hover{background:initial;transition:none;-webkit-transition:none;`+
    `-moz-transition:none;-o-transition:none}#room-settings{height:400px;margin-top:initial}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:initial;width:100%;vertical-align:bottom;font-size:initial;color:#fff;text-shadow:none}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:none;padding:initial;background-attachment:local}#chat li{padding:none;opacity:initial}#chat li .name{font-weight:initial;margin-right:initial}#chat li .message{margin-right:initial}#chat li .quote{color:#789922}#chat input{margin:initial;width:initial;border:none;background:0 0;text-shadow:none;color:#fff;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none}#chat input::-webkit-input-placeholder{color:initial}#chat input:-moz-placeholder{color:initial}#chat input:focus{outline:initial;border:initial}#chat.chatting{background:#455;border-radius:none;box-shadow:none;transition:none}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:none}#chat.chatting ul{max-height:none;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Minimal3`) {
    addCSS(`*{image-rendering:pixelated}*{margin:initial}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:20pt sans-serif;color:#fff;text-shadow:none}body{position:initial}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:initial;color:initial;transition:none}a:hover{color:initial;transition:none}.link{text-decoration:underline;cursor:pointer;color:initial}table{border:0;padding:0;margin:0}#names{position:fixed;top:initial;left:initial;font-size:initial;width:initial}#names .name{float:left;position:relative;padding:initial;margin:initial;border-radius:initial;-webkit-border-radius:initial;-moz-border-radius:initial;min-width:initial;text-align:initial;cursor:initial;line-height:initial;color:initial}#names .name.me:after{content:"Me";position:absolute;top:initial;right:0;font-size:initial}#names .name.owner:before{content:"*";position:absolute;top:initial;left:initial}#names .name.play{transform:none;-webkit-transform:none;color:#0000}#names .name.muted-notes{color:initial}#names .name.muted-notes:after{content:"MUTE";position:absolute;top:initial;right:0;font-size:initial}#names .name.muted-chat{color:initial}#names .name.muted-chat:after{content:"MUTE";position:absolute;top:initial;right:0;font-size:initial}#piano{width:initial;height:initial;margin:auto;position:relative;overflow:hidden;padding-left:initial}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:initial;height:initial;background:initial;position:absolute;pointer-events:initial;margin-left:initial;margin-top:initial;left:200%;top:100%}.cursor .name{display:initial;position:initial;left:initial;top:initial;pointer-events:none;color:initial;background:initial;border-radius:initial;-webkit-border-radius:initial;-moz-border-radius:initial;white-space:initial;padding:initial;font-size:initial}.cursor.owner .name:after{content:none;position:initial;top:initial;left:initial}.cursor{transition:none}.participant-menu{display:none;position:fixed;background:initial;width:initial;font-size:initial;padding:initial;margin:initial;border-radius:initial}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:initial;text-align:initial;line-height:initial;font-size:initial;color:initial;overflow:hidden;opacity:0;transition:none;user-select:text}.participant-menu .info:hover{opacity:1;transition:none}.participant-menu .menu-item{cursor:initial;margin:initial;padding:initial;border-top:none}.participant-menu .menu-item:hover{background:initial}.participant-menu .menu-item.clicked{background:initial}#crown{position:absolute;width:16px;height:16px;background:"*";cursor:pointer;font-size:initial}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:initial;opacity:initial;font-size:initial;pointer-events:none;display:none}#room-notice p{margin:initial}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:initial}#room,#room *{cursor:pointer}#room{position:absolute;left:initial;top:initial;padding:initial;width:240px;height:initial;background:initial;border:initial;cursor:initial;margin:initial;font-size:initial}#room .info{white-space:initial;line-height:initial;overflow:initial;height:initial}#room .info.lobby{color:initial}#room .info.not-visible{color:initial}#room .info.crownsolo:after{content:" (Crownsolo)"}#room .info.no-chat:after{content:" (No Chat)"}#room .info.banned{color:red}#room .expand{width:initial;height:100%;position:absolute;right:0;top:0;background:0 0}#room .more{display:none;position:absolute;bottom:100%;left:initial;width:initial;overflow:hidden;overflow-y:scroll;background:#fff;border:none;max-height:400px;color:initial}#room .more>div{margin:initial;padding:initial;width:100%;height:initial}#room .more .info:hover{background:initial}#room .more .new{background:initial}#room .more .new:hover{background:initial}.ugly-button{height:initial;font-size:initial;background:unset;border:unset;padding:none;cursor:initial;line-height:initial;border-radius:unset;-webkit-border-radius:unset;-moz-border-radius:unset;width:initial;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:initial}.ugly-button.stuck{background:initial}#new-room-btn{position:absolute;left:250px;top:4px}#play-alone-btn{position:absolute;left:370px;top:4px}#sound-btn{position:absolute;left:490px;top:4px}#room-settings-btn{position:absolute;left:510px;top:4px;display:none}#midi-btn{position:absolute;left:250px;top:32px}#record-btn{position:absolute;left:370px;top:32px}#synth-btn{position:absolute;left:490px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:initial}.knob{cursor:initial}.switched-on{background:#ff8}#status{position:absolute;left:initial;bottom:0;width:320px;height:initial;padding:initial;font-size:initial;font-weight:initial;line-height:initial;pointer-events:none}#status .number{font-size:initial}#volume{position:absolute;right:0;top:0;width:initial;height:initial;margin:initial}#volume-slider{width:initial;height:initial;background:#fff;-webkit-appearance:default}#volume-label{position:absolute;right:0;bottom:0;font-size:initial;color:#fff}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:initial;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:red}#quota .value{width:100%;height:100%;display:block;background:#0f0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fff;border-color:none;padding:initial;position:relative;left:initial;top:initial;color:initial;font-size:initial;text-shadow:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none}.notification-body:after{content:"";position:absolute;top:initial;left:initial;margin-left:initial;border-top:none;border-top-color:none;border-left:none;border-right:none}.title{border-bottom:none;font-size:initial;font-weight:initial;padding-bottom:initial;margin-bottom:initial}.notification .x{position:absolute;right:0;top:0;cursor:unset;font-size:initial;color:initial;text-shadow:none}.notification .x:hover{font-weight:initial}.notification.classic .notification-body{width:initial;background:#fff;border-color:#fff}.notification.short .title{display:none}.notification h1{font-size:initial;font-weight:initial;padding-top:initial;padding-bottom:initial;text-decoration:initial}.notification .connection{padding:initial;margin:initial;background:initial;border:none;cursor:initial;font-family:initial}.notification .connection.enabled{background:initial}.notification .connection:after{content:"OFF";font-size:initial;color:red;float:right}.notification .connection.enabled:after{content:"ON";font-size:initial;color:#0f0;float:right}.notification .connection:hover{font-weight:initial}.notification ul{list-style-type:upper-roman}.notification .pack{margin:initial;padding:initial;background:initial;border:none;border-radius:initial;cursor:pointer;font-family:initial}.notification .pack.enabled{background:initial;cursor:initial;font-weight:initial}.notification .pack:after{content:"";font-size:initial;color:initial;float:right}.notification .pack.enabled:after{content:"<<";font-size:initial;color:initial;float:initial}.notification .pack:hover{font-weight:initial}#modal{width:100%;height:100%;position:fixed;left:50%;top:50%;display:none}#modal .bg{width:100%;height:100%;background:initial;opacity:initial;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:initial;width:initial;height:100px;position:fixed;left:initial;top:initial;margin-left:none;margin-top:none;padding:none;border:none;overflow:hidden;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none}.dialog p{margin:initial;font-size:initial}.dialog input.text{font-size:initial;height:initial;width:initial}.dialog input.checkbox{margin:initial}.dialog .submit{background:initial;border:none;padding:none;font-size:initial;color:initial;text-shadow:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none;transition:none;`+
    `-webkit-transition:none;-moz-transition:none;-o-transition:none;position:absolute;bottom:initial;right:initial}.dialog .submit:hover{background:initial;transition:none;-webkit-transition:none;-moz-transition:none;-o-transition:none}#room-settings{height:400px;margin-top:initial}#chat{display:none;opacity:1}#chat{position:fixed;bottom:60px;left:initial;width:100%;vertical-align:bottom;font-size:initial;color:initial;text-shadow:none}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:none;padding:initial;background-attachment:local}#chat li{padding:none;opacity:initial}#chat li .name{font-weight:initial;margin-right:initial}#chat li .message{margin-right:initial}#chat li .quote{color:#792}#chat input{margin:initial;width:initial;border:none;background:initial;text-shadow:none;color:#fff;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none}#chat input::-webkit-input-placeholder{color:initial}#chat input:-moz-placeholder{color:initial}#chat input:focus{outline:initial;border:initial}#chat.chatting{background:initial;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;transition:none}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:none}#chat.chatting ul{max-height:none;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  else if (style == `Minimal4`) {
  	addCSS(`*{image-rendering:unset}*{margin:unset font-smooth: never;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:none}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:unset;color:unset;text-shadow:unset}body{position:unset}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:unset;color:unset;transition:unset}a:hover{color:unset;transition:unset}.link{text-decoration:unset;cursor:unset;color:unset}table{border:unset;padding:unset;margin:unset}#names{position:fixed;top:initial;left:initial;font-size:initial;width:initial}#names .name{float:left;position:unset;padding:unset;margin:unset;border-radius:unset;-webkit-border-radius:unset;-moz-border-radius:unset;min-width:unset;text-align:unset;cursor:unset;line-height:unset;color:unset}#names .name.me:after{content:"Me";position:unset;top:unset;right:unset;font-size:unset}#names .name.owner:before{content:"*";position:unset;top:unset;left:unset}#names .name.play{transform:left;-webkit-transform:left;color:#0000}#names .name.muted-notes{color:unset}#names .name.muted-notes:after{content:"MUTE";position:unset;top:unset;right:unset;font-size:unset}#names .name.muted-chat{color:unset}#names .name.muted-chat:after{content:"MUTE";position:unset;top:unset;right:unset;font-size:unset}#piano{width:unset;height:unset;margin:unset;position:relative;overflow:unset;padding-left:unset}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:unset;height:unset;background:unset;position:absolute;pointer-events:unset;margin-left:unset;margin-top:unset;left:unset;top:unset}.cursor .name{display:unset;position:unset;left:unset;top:unset;pointer-events:none;color:unset;background:unset;border-radius:unset;-webkit-border-radius:unset;-moz-border-radius:unset;white-space:unset;padding:unset;font-size:unset}.cursor.owner .name:after{content:none;position:unset;top:unset;left:unset}.cursor{transition:unset}.participant-menu{display:none;position:fixed;background:unset;width:unset;font-size:unset;padding:unset;margin:unset;border-radius:unset}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:unset;border-bottom-right-radius:unset}.participant-menu .info{height:unset;text-align:unset;line-height:unset;font-size:unset;color:unset;overflow:unset;opacity:0;transition:unset;user-select:text}.participant-menu .info:hover{opacity:unset;transition:unset}.participant-menu .menu-item{cursor:unset;margin:unset;padding:unset;border-top:none}.participant-menu .menu-item:hover{background:unset}.participant-menu .menu-item.clicked{background:unset}#crown{position:absolute;width:16px;height:16px;background:#ff0;cursor:unset;font-size:unset}#crown span{margin-left:16px;margin-top:2px}#room-notice{position:fixed;top:20%;width:100%;text-align:unset;opacity:unset;font-size:unset;pointer-events:none;display:none}#room-notice p{margin:unset}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:unset;margin-bottom:unset}#room,#room *{cursor:pointer}#room{position:absolute;left:unset;top:unset;padding:unset;width:240px;height:unset;background:unset;border:unset;cursor:unset;margin:unset;font-size:unset}#room .info{white-space:unset;line-height:unset;overflow:unset;height:unset}#room .info.lobby{color:unset}#room .info.not-visible{color:unset}#room .info.crownsolo:after{content:" (Crownsolo)"}#room .info.no-chat:after{content:" (No Chat)"}#room .info.banned{color:red}#room .expand{width:unset;height:unset;position:unset;right:unset;top:unset;background:unset}#room .more{display:none;position:absolute;bottom:100%;left:initial;width:initial;overflow:hidden;overflow-y:scroll;background:#fff;border:none;max-height:400px;color:initial}#room .more>div{margin:unset;padding:unset;width:100%;height:unset}#room .more .info:hover{background:unset}#room .more .new{background:unset}#room .more .new:hover{background:unset}.ugly-button{height:initial;font-size:initial;background:unset;border:unset;padding:none;cursor:initial;line-height:initial;border-radius:unset;-webkit-border-radius:unset;-moz-border-radius:unset;width:initial;overflow:hidden;white-space:unset}.ugly-button:hover{background:initial}.ugly-button.stuck{background:initial}#new-room-btn{position:absolute;left:250px;top:4px}#play-alone-btn{position:absolute;left:370px;top:4px}#sound-btn{position:absolute;left:490px;top:4px}#room-settings-btn{position:absolute;left:510px;top:4px;display:none}#midi-btn{position:absolute;left:250px;top:32px}#record-btn{position:absolute;left:370px;top:32px}#synth-btn{position:absolute;left:490px;top:32px}#tooltip{position:absolute;pointer-events:none;background:unset;color:unset;font-size:initial}.knob{cursor:initial}.switched-on{background:unset}#status{position:absolute;left:initial;bottom:0;width:320px;height:initial;padding:initial;font-size:initial;font-weight:initial;line-height:initial;pointer-events:none}#status .number{font-size:initial}#volume{position:absolute;right:0;top:0;width:initial;height:initial;margin:initial}#volume-slider{width:initial;height:initial;background:unset;-webkit-appearance:unset}#volume-label{position:absolute;right:0;bottom:0;font-size:initial;color:unset}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:initial;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:red}#quota .value{width:100%;height:100%;display:block;background:#0f0}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:unset;border-color:none;padding:initial;position:relative;left:initial;top:initial;color:initial;font-size:initial;text-shadow:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none}.notification-body:after{content:"";position:absolute;top:initial;left:initial;margin-left:initial;border-top:none;border-top-color:none;border-left:none;border-right:none}.title{border-bottom:none;font-size:initial;font-weight:initial;padding-bottom:initial;margin-bottom:initial}.notification .x{position:absolute;right:0;top:0;cursor:unset;font-size:initial;color:initial;text-shadow:none}.notification .x:hover{font-weight:initial}.notification.classic .notification-body{width:initial;background:unset;border-color:unset}.notification.short .title{display:none}.notification h1{font-size:unset;font-weight:unset;padding-top:unset;padding-bottom:unset;text-decoration:unset}.notification .connection{padding:unset;margin:unset;background:unset;border:unset;cursor:unset;font-family:unset}.notification .connection.enabled{background:initial}.notification .connection:after{content:"OFF";font-size:unset;color:unset;float:unset}.notification .connection.enabled:after{content:"ON";font-size:unset;color:#unset;float:unset}.notification .connection:hover{font-weight:unset}.notification ul{list-style-type:unset}.notification .pack{margin:unset;padding:unset;background:unset;border:unset;border-radius:unset;cursor:unset;font-family:unset}.notification .pack.enabled{background:unset;cursor:unset;font-weight:unset}.notification .pack:after{content:"";font-size:unset;color:unset;float:unset}.notification .pack.enabled:after{content:"<<";font-size:unset;color:unset;float:unset}.notification .pack:hover{font-weight:initial}#modal{width:100%;height:100%;position:fixed;left:50%;top:50%;display:none}#modal .bg{width:100%;height:100%;background:initial;opacity:initial;position:absolute;left:0;top:0}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:initial;width:initial;height:100px;position:fixed;left:initial;top:initial;margin-left:none;margin-top:none;padding:none;border:none;overflow:hidden;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none}.dialog p{margin:initial;font-size:initial}.dialog input.text{font-size:initial;height:initial;width:initial}.dialog input.checkbox{margin:initial}.dialog .submit{background:initial;border:none;padding:none;font-size:initial;color:initial;text-shadow:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none;transition:none;-webkit-transition:unset;-moz-transition:none;-o-transition:none;position:absolute;bottom:initial;right:initial}.dialog .submit:hover{background:initial;transition:none;-webkit-transition:none;-moz-transition:none;-o-transition:none}#room-settings{height:400px;margin-top:initial}#chat{display:none;opacity:1}#chat{position:fixed;bottom:60px;left:initial;width:100%;vertical-align:bottom;font-size:initial;color:initial;text-shadow:none}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:none;padding:initial;background-attachment:local}#chat li{padding:none;opacity:initial}#chat li .name{font-weight:initial;margin-right:initial}#chat li .message{margin-right:initial}#chat li .quote{color:#792}#chat input{margin:initial;width:initial;border:none;background:initial;text-shadow:none;color:unset;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none}#chat input::-webkit-input-placeholder{color:initial}#chat input:-moz-placeholder{color:initial}#chat input:focus{outline:initial;border:initial}#chat.chatting{background:unset;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;box-shadow:none;transition:none}#chat.chatting li{display:unset;opacity:unset;text-shadow:none}#chat.chatting ul{max-height:none;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{display:none;position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#room-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}`)
  }
  
  
  // TWEAKS:
  else if (style == `Breeze Snow Cursors`) {
    addCSS(`.cursor{width: 16px; height: 24px; background: url('https://cdn.discordapp.com/attachments/692183242979409961/719464113817780314/newcursor.svg'); position: absolute; pointer-events: none; margin-left: -2px; margin-top: -2px; left: 200%; top: 100%;}`, true)
  }
  else if (style == `Old Text Shadow`) {
    addCSS(`* {text-shadow: #444 2px 2px;}`, true)
  }
  else if (style == `Nebula Cursors`) {
  	addCSS(`.cursor { width: 24px; height: 24px; background: url("https://cdn.discordapp.com/attachments/372196271928246272/742888375379558461/nebula_cursor.png") !important; position: absolute; pointer-events: none; margin-left: -2px; margin-top: -2px; left: 200%; top: 100%;}`)
  }




  else { // my defaults
    addCSS(`*{image-rendering:pixelated}*{margin:0}*{user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}body,html{width:100%;height:100%;overflow:hidden;font:.88em system-ui,sans-serif;color:#fff;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px}body{position:absolute}body{background:#3b5054;background:-moz-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,#ecfafd),color-stop(100%,#c5d5d8));background:-webkit-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-o-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:-ms-radial-gradient(center,ellipse cover,#ecfafd 0,#c5d5d8 100%);background:radial-gradient(ellipse at center,#ecfafd 0,#c5d5d8 100%);-webkit-transition:background 1s linear}a{cursor:pointer;color:#f46;transition:color .25s}a:hover{color:#e05;transition:color .25s}.link{text-decoration:underline;cursor:pointer;color:#fe0}table{border:0;padding:0;margin:0}#names{position:fixed;top:6px;left:6px;font-size:1em;width:80%}#names .name{float:left;position:relative;padding:3px 6px;margin:1.5px;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;min-width:72px;text-align:center;cursor:pointer;line-height:18px}#names .name.me:after{content:"Me!";position:absolute;top:-6px;right:70%;font-size:.667rem}#names .name.owner:before{content:url(/crown.png);position:absolute;top:-9px;left:3px}#names .name.play{transform:translateY(-3px);-webkit-transform:translateY(-3px)}#names .name.muted-notes{color:#f88}#names .name.muted-notes:after{content:"Muted notes";position:absolute;top:-4px;right:50%;font-size:8px}#names .name.muted-chat{color:#f88}#names .name.muted-chat:after{content:"Muted chat";position:absolute;top:-4px;right:50%;font-size:8px}#piano{width:95%;height:20%;margin:auto;position:relative;overflow:hidden;padding-left:1%}#piano .key{float:left;width:1.8%;height:90%;border:1px solid #000;background:#fff;margin-left:-.5%;margin-bottom:100%;box-shadow:1px 2px 5px #000;-webkit-box-shadow:1px 2px 5px #000;-moz-box-shadow:1px 2px 5px #000;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;transition:background 4s ease-out;-webkit-transition:background 4s ease-out;-moz-transition:background 4s ease-out;-o-transition:background 4s ease-out;padding:0;overflow:hidden}#piano .key.c,#piano .key.f{margin-left:0}#piano .key.sharp{width:1.2%;height:50%;background:#000;margin-left:-.9%;position:relative}#piano .key.loading{background:#888}#piano .key.play{transform:translateY(1%);-webkit-transform:translateY(1%);-webkit-box-shadow:0 1px 2px #000}.ease-out{transition:left .1s ease-out;-webkit-transition:left .1s ease-out;-moz-transition:left .1s ease-out;-o-transition:left .1s ease-out}.ease-in{transition:left .1s ease-in;-webkit-transition:left .1s ease-in;-moz-transition:left .1s ease-in;-o-transition:left .1s ease-in}.slide-left{left:-100%}.slide-right{left:100%}.cursor{width:16px;height:24px;background:url(/cursor.png);position:absolute;pointer-events:none;margin-left:-2px;margin-top:-2px;left:200%;top:100%}.cursor .name{display:inline;position:relative;left:18px;top:0;pointer-events:none;color:#fff;background:#000;border-radius:2px;-webkit-border-radius:3px;-moz-border-radius:3px;white-space:nowrap;padding:3px 6px;font-size:.8rem;line-height:1rem}.cursor.owner .name:after{content:url(/crown.png);position:absolute;top:-9px;left:3px}.cursor .name{display:inline-block}.cursor{transition:top 150ms linear,left 150ms linear}.participant-menu{display:none;position:fixed;background:#000;width:150px;font-size:12px;padding:0;margin:0;border-radius:2px}.participant-menu:last-child .menu-item:hover{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.participant-menu .info{height:40px;text-align:center;line-height:40px;font-size:9px;color:rgba(255,255,255,.9);overflow:hidden;opacity:0;transition:opacity .2s ease-out;user-select:text}.participant-menu .info:hover{opacity:1;transition:opacity .2s ease-out}.participant-menu .menu-item{cursor:default;margin:0;padding:15px 5px;border-top:1px solid rgba(255,255,255,.3)}.participant-menu .menu-item:hover{background:rgba(255,255,255,.1)}.participant-menu .menu-item.clicked{background:rgba(255,255,255,.5)}#crown{position:absolute;width:16px;height:16px;background:url(/crown.png) no-repeat;cursor:pointer;font-size:10px}#crown span{margin-left:16px;margin-top:2px}#crownsolo-notice{position:fixed;top:20%;width:100%;text-align:center;opacity:.5;font-size:2rem;pointer-events:none;display:none}#bottom{position:fixed;bottom:0;left:0;width:100%;height:60px;background:#9a9;margin-bottom:3px}#room,#room *{cursor:default}#room{position:absolute;left:4px;top:-2px;padding:6px;width:240px;height:12px;background:#fff2;border:1px solid #fff0;border-radius:4px;cursor:default;margin:6px 36px;font-size:1rem}#room .info{white-space:nowrap;line-height:1rem;overflow:hidden;height:1rem}#room .info.lobby{color:#dea}#room .info.no-cussing{color:#ace}#room .info.not-visible{color:#ffffff88}#room .info.crownsolo:after{content:url(/crownsolo.png);position:relative;top:.1rem;margin-left:.4rem}#room .info.no-chat:after{content:url(/no-chat.png);position:relative;top:2px;margin-left:4px}#room .info.banned{color:rgba(255,64,64,.5)}#room .expand{width:24px;height:100%;position:absolute;right:0;top:0;background:#0000 url(/arrow.png) no-repeat center 0}#room .more{display:none;position:absolute;bottom:100%;left:-1px;width:100%;overflow:hidden;overflow-y:scroll;background:#222e;border:1px solid #0000;max-height:400px;border-radius:4px;backdrop-filter:blur(4px) contrast(.7) saturate(1.4)}#room .more>div{margin:0;padding:3px 6px 0 6px;width:100%;height:1.5rem}#room .more .info:hover{background:#fff1}#room .more .new{background:#3a61}#room .more .new:hover{background:#3a68}.ugly-button{height:12px;font-size:1rem;background:#fff2;border:1px solid #0000;padding:5px 6px;cursor:default;line-height:1rem;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:100px;overflow:hidden;white-space:nowrap}.ugly-button:hover{background:#fff3}.ugly-button.stuck{background:rgba(204,187,170,.35)}#new-room-btn{position:absolute;left:300px;top:4px}#play-alone-btn{position:absolute;left:420px;top:4px}#sound-btn{position:absolute;left:540px;top:4px}#room-settings-btn{position:absolute;left:660px;top:4px;display:none}#midi-btn{position:absolute;left:300px;top:32px}#record-btn{position:absolute;left:420px;top:32px}#synth-btn{position:absolute;left:540px;top:32px}#tooltip{position:absolute;pointer-events:none;background:#000;color:#fff;font-size:10px}.knob{cursor:pointer}.switched-on{background:#ff8}#status{position:absolute;left:0;bottom:9px;width:320px;height:1rem;padding:6px;font-size:1.5rem;font-weight:300;line-height:1rem;pointer-events:none}#status .number{font-size:3rem}#volume{position:absolute;right:20px;top:0;width:100px;height:40px;margin:10px}#volume-slider{width:100%;height:100%;background:url(volume2.png) no-repeat;background-position:50% 50%;-webkit-appearance:none}#volume-label{position:absolute;right:30px;bottom:10px;font-size:.7rem;color:#ccc}#banner{width:468px;height:60px;position:absolute;right:0;top:0;font-size:1rem;display:none}#banner a{color:#fd0}#quota{width:100%;height:3px;position:fixed;bottom:0;left:0;background:#e44}#quota .value{width:100%;height:100%;display:block;background:#3a7}.relative{position:relative;width:100%;height:100%}.notification{position:absolute}.notification-body{background:#fffa;border-color:#0000;padding:12px;position:relative;left:0;top:0;color:#444;font-size:.88rem;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px}.notification-body:after{content:"";position:absolute;top:100%;left:50%;margin-left:-3px;border-top:10px solid transparent;border-top-color:inherit;border-left:6px solid transparent;border-right:6px solid transparent}.title{border-bottom:1px solid #0002;font-size:1.2rem;font-weight:400;padding-bottom:6px;margin-bottom:3px}.notification .x{position:absolute;right:4px;top:0;cursor:pointer;font-size:1rem;color:#f84;text-shadow:none}.notification.classic .notification-body{width:400px;background:#fffc;border-color:#fea;backdrop-filter:blur(5px) contrast(.7) saturate(1.4)}.notification.short .title{display:none}.notification h1{font-size:1.1rem;font-weight:400;padding-top:9px;padding-bottom:9px;text-decoration:none}.notification .connection{padding:8px;margin:8px;background:#fed;border:1px solid #f84}.notification .connection.enabled{background:#dfd}.notification .connection:after{content:"OFF";font-size:10px;color:#a44;float:right}.notification .connection.enabled:after{content:"ON";font-size:10px;color:#4a4;float:right}.notification ul{list-style-type:upper-roman}.notification .pack{padding:0;margin:2px;background:#fdd;border:1px solid #f84;border-radius:4px;cursor:pointer}.notification .pack.enabled{background:#dfd;cursor:not-allowed}.notification .pack:after{content:"";font-size:10px;color:#a44;float:right}.notification .pack.enabled:after{content:"Selected";font-size:10px;color:#4a4;float:right}#modal{width:100%;height:100%;position:fixed;left:0;top:0;display:none}#modal .bg{width:100%;height:100%;background:#1234;opacity:1;position:absolute;left:0;top:0;backdrop-filter:blur(.4vmax) contrast(.7) saturate(1.4);transition:all 1s!important}#modal,#modal *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.dialog{background:#222d;backdrop-filter:blur(.4vmax) contrast(.7) saturate(1.4);width:400px;height:100px;position:fixed;left:50%;top:50%;margin-left:-210px;margin-top:-50px;padding:10px;border:1px solid #0000;overflow:hidden;border-radius:9px;-webkit-border-radius:9px;-moz-border-radius:9px;box-shadow:0 0 18px #2229;-webkit-box-shadow:0 0 18px #2229;-moz-box-shadow:0 0 18px #2229}.dialog p{margin:9px;font-size:1rem}.dialog input.text{font-size:1.5rem;font-family:`+
    `inherit;height:2rem;width:75%;background:#fff2;border:1px solid #0000;border-radius:6px;color:#fff;padding:3px 9px}.dialog input.checkbox{margin:0 5px}.dialog .submit{background:#fff1;border:none;padding:9px 40px 20px 30px;font-size:1.5rem;font-family:inherit;color:#fff;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px;border-radius:6px;-webkit-border-radius:6px;-moz-border-radius:6px;box-shadow:inset 0 0 4px #0000;-webkit-box-shadow:inset 0 0 4px #0000;-moz-box-shadow:inset 0 0 4px #0000;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s;position:absolute;bottom:-9px;right:-9px}.dialog .submit:hover{background:#fff2;transition:all .25s;-webkit-transition:all .25s;-moz-transition:all .25s;-o-transition:all .25s}#room-settings{height:400px;margin-top:-200px}#chat{display:none;opacity:1}#chat{position:fixed;bottom:64px;left:0;width:100%;vertical-align:bottom;font-size:1rem;color:#fff;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px}#chat,#chat *{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}#chat ul{list-style:none;margin:0 0;padding:0 12px;background-attachment:local}#chat li{padding:6px;opacity:0;line-height:1.5px}#chat li .name{font-weight:700;margin-right:12px}#chat li .message{margin-right:6px;line-height:1.5em}#chat li .quote{color:#789922}#chat input{margin:6px;font:inherit;width:calc(100vw - 18px);border:1px solid #fff0;background:#0002;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px;color:#fff;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px}#chat input::-webkit-input-placeholder{color:#ccc8}#chat input:-moz-placeholder{color:#ccc8}#chat input:focus{outline:0;border:1px solid #fff2}#chat.chatting{background:#8888;backdrop-filter:blur(.4vmax) contrast(.7) saturate(1.4);border-radius:0;box-shadow:1px 1px 5px #8880;transition:all .7s}#chat.chatting li{display:list-item!important;opacity:1!important;text-shadow:#0004 0 .5px 4px,#fff8 0 .2px 2px}#chat.chatting ul{max-height:calc(100vh - 96px);overflow-y:scroll;overflow-x:hidden;word-wrap:break-word}#social{position:fixed;top:4px;right:6px;width:80px;font-size:12px}#social #more-button{margin-top:4px;width:77px;height:90px;border-radius:5px;border:1px solid #abb;cursor:pointer;transition:all .25s;box-shadow:1px 1px 8px #bb9;color:#788;text-shadow:none;background:url(kitten1.png) 0 4px no-repeat;background-color:#dee}#social #more-button:hover{color:#899;background-color:#e8f8f0;transition:background-color .25s}#social .fb-like{position:absolute;right:0}#social #inclinations{margin-top:50px;margin-bottom:20px}#more{display:none;width:1250px;margin:0 auto;padding:0;border-radius:10px;font-size:15px;border:1px solid #b0c0c0;color:#566;background:#bcc;box-shadow:1px 1px 8px #899;position:fixed;top:50px;right:50px;text-shadow:none}#more div{margin:0;padding:0}#more .items{margin-left:1%}#more .items .item{width:33%;float:left;background:#cdd;transition:background .25s}#more .items .item:hover{background:#d0e0e0;transition:background .25s}#more .items .item .content{height:200px;padding:10px;border-right:1px solid #bcc;border-bottom:1px solid #bcc}#more .items .item .content p{margin-top:1em;margin-bottom:1em}#more .header{padding:5px 10px}#more .footer{clear:both;padding:5px 10px;font-size:12px}#email:before{content:url(envelope.png);margin:4px}#crownsolo-notice{z-index:1}#cursors{z-index:2}#chat{z-index:100}#social{z-index:200}#names{z-index:300}#piano{z-index:400}#piano .key{z-index:401}#piano .key.sharp{z-index:402}#bottom{z-index:500}#crown{z-index:600}.notification{z-index:700}#cursors .cursor{z-index:800}#chat.chatting{z-index:900}.participant-menu{z-index:1000}#modal{z-index:10000}#tooltip{z-index:20000}.clear{clear:both}.spin{animation:spin 1s linear infinite;-webkit-animation:spin 1s linear infinite;-moz-animation:spin 1s linear infinite;-o-animation:spin 1s linear infinite;-ms-animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@-moz-keyframes spin{0%{-moz-transform:rotate(0)}100%{-moz-transform:rotate(360deg)}}@-o-keyframes spin{0%{-o-transform:rotate(0)}100%{-o-transform:rotate(360deg)}}@-ms-keyframes spin{0%{-ms-transform:rotate(0)}100%{-ms-transform:rotate(360deg)}}#extraInfo{position:fixed;width:256px;height:256px;background:#0000;top:0;right:0;color:#fff}`)
  }
};if (botSettings.CSS.applyOnStart === true) {
  applyCSS(botSettings.CSS.style);
}

if (botSettings.startupSound.enable == true) {
  playSound(botSettings.startupSound.sound)
}









// This version's nearly at 10,000 lines, though that's including the script.js
// mods.







	







	


});










// SHADOW'S EXTRA BUTTONS

// My first, failed attempt:
// function() {$(`#bottom`).html($(`#bottom`).innerHTML + `<button class="ugly-button">test</button>`) }

// from Neb:
// $("body").append('<div id="1-btn" class="ugly-button" style="bottom: 22px; right: 940px; position: fixed; z-index: 500;">Name here</div>'); $("#1-btn").on("click", function(evt) { });
$("body").append('<div id="1-btn" class="ugly-button" style="position: fixed; bottom: 35px !important; left: 660px !important; z-index: 500;">Clear chat</div>'); $("#1-btn").on("click", function(evt) { MPP.chat.clear(); });










// misc

////////////////////////////////////////////////////////////////

// analytics	
window.google_analytics_uacct = "UA-882009-7";
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-882009-7']);
_gaq.push(['_trackPageview']);
_gaq.push(['_setAllowAnchor', true]);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	// var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
/*
// twitter
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;
	js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

// fb
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// non-ad-free experience
/*(function() {
	function adsOn() {
		if(window.localStorage) {
			var div = document.querySelector("#inclinations");
			div.innerHTML = "Ads:<br>ON / <a id=\"adsoff\" href=\"#\">OFF</a>";
			div.querySelector("#adsoff").addEventListener("click", adsOff);
			localStorage.ads = true;
		}
		// adsterra
		var script = document.createElement("script");
		script.src = "//pl132070.puhtml.com/68/7a/97/687a978dd26d579c788cb41e352f5a41.js";
		document.head.appendChild(script);
	}

	function adsOff() {
		if(window.localStorage) localStorage.ads = false;
		document.location.reload(true);
	}

	function noAds() {
		var div = document.querySelector("#inclinations");
		div.innerHTML = "Ads:<br><a id=\"adson\" href=\"#\">ON</a> / OFF";
		div.querySelector("#adson").addEventListener("click", adsOn);
	}

	if(window.localStorage) {
		if(localStorage.ads === undefined || localStorage.ads === "true")
			adsOn();
		else
			noAds();
	} else {
		adsOn();
	}
})();*/
