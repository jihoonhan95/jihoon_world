if (typeof nclk == "undefined") {
	nclk = {}
}
if (typeof nclkMaxDepth == "undefined") {
	var nclkMaxDepth = 8
}
if (typeof ccsrv == "undefined") {
	var ccsrv = "cc.naver.com"
}
if (typeof nclkModule == "undefined") {
	var nclkModule = "cc"
}
if (typeof nsc == "undefined") {
	var nsc = "decide.me"
}
if (typeof g_pid == "undefined") {
	var g_pid = ""
}
if (typeof g_sid == "undefined") {
	var g_sid = ""
}
var nclkImg = [];
nclk.version = "1.2.12";
nclk.getScrollBarWidth = function() {
	var e = document.createElement("p");
	e.style.width = "200px";
	e.style.height = "200px";
	var f = document.createElement("div");
	f.style.position = "absolute";
	f.style.top = "0px";
	f.style.left = "0px";
	f.style.visibility = "hidden";
	f.style.width = "200px";
	f.style.height = "150px";
	f.style.overflow = "hidden";
	f.appendChild(e);
	document.body.appendChild(f);
	var b = e.offsetWidth;
	f.style.overflow = "scroll";
	var a = e.offsetWidth;
	if (b == a) {
		a = f.clientWidth
	}
	document.body.removeChild(f);
	return (b - a)
};
nclk.findPos = function(b) {
	var f = curtop = 0;
	try {
		if (b.offsetParent) {
			do {
				f += b.offsetLeft;
				curtop += b.offsetTop
			} while (b = b.offsetParent)
		} else {
			if (b.x || b.y) {
				if (b.x) {
					f += b.x
				}
				if (b.y) {
					curtop += b.y
				}
			}
		}
	} catch (a) {
	}
	return [ f, curtop ]
};
nclk.windowSize = function(e) {
	if (!e) {
		e = window
	}
	var a = 0;
	if (e.innerWidth) {
		a = e.innerWidth;
		if (typeof (e.innerWidth) == "number") {
			var b = nclk.getScrollBarWidth();
			a = e.innerWidth - b
		}
	} else {
		if (document.documentElement && document.documentElement.clientWidth) {
			a = document.documentElement.clientWidth
		} else {
			if (document.body
					&& (document.body.clientWidth || document.body.clientHeight)) {
				a = document.body.clientWidth
			}
		}
	}
	return a
};
nclk.checkIframe = function(i) {
	var f = document.URL;
	var h = i.parentNode;
	var a;
	var b;
	if (h == null || h == undefined) {
		return false
	}
	while (1) {
		if (h.nodeName.toLowerCase() == "#document") {
			if (h.parentWindow) {
				a = h.parentWindow
			} else {
				a = h.defaultView
			}
			try {
				if (a.frameElement != null && a.frameElement != undefined) {
					if (a.frameElement.nodeName.toLowerCase() == "iframe") {
						b = a.frameElement.id;
						if (!b) {
							return false
						}
						return b
					} else {
						return false
					}
				} else {
					return false
				}
			} catch (g) {
				return false
			}
		} else {
			h = h.parentNode;
			if (h == null || h == undefined) {
				return false
			}
		}
	}
};
nclk.absPath = function(a) {
	var e = window.location;
	var f = e.href;
	var b = e.protocol + "//" + e.host;
	if (a.charAt(0) == "/") {
		if (a.charAt(1) == "/") {
			return e.protocol + a
		} else {
			return b + a
		}
	}
	if (/^\.\//.test(a)) {
		a = a.substring(2)
	}
	while (/^\.\./.test(a)) {
		if (b != f) {
			f = f.substring(0, f.lastIndexOf("/"))
		}
		a = a.substring(3)
	}
	if (b != f) {
		if (a.charAt(0) != "?" && a.charAt(0) != "#") {
			f = f.substring(0, f.lastIndexOf("/"))
		}
	}
	if (a.charAt(0) == "/") {
		return f + a
	} else {
		if (a.charAt(0) == "?") {
			f = f.split("?")[0];
			return f + a
		} else {
			if (a.charAt(0) == "#") {
				f = f.split("#")[0];
				return f + a
			} else {
				return f + "/" + a
			}
		}
	}
};
function clickcr(g, H, u, D, E, A, P) {
	if (arguments.length == 1) {
		if (typeof nclk.generateCC != "undefined") {
			nclk.generateCC(arguments[0])
		}
		return
	}
	var F = navigator.userAgent.toLowerCase();
	var k = (F.indexOf("safari") != -1 ? true : false);
	var C = /msie/.test(F) && !/opera/.test(F);
	var l = (window.location.protocol == "https:") ? "https:" : "http:";
	var a = ccsrv.substring(ccsrv.indexOf(".") + 1);
	var t = window.event ? window.event : E;
	var s = -1;
	var q = -1;
	var p = -1;
	var n = -1;
	var S, f, i;
	var r, j, m;
	var M, J, I, L, z, B, w;
	var O;
	var G = 0;
	if (!A) {
		A = "0"
	} else {
		A = String(A)
	}
	if (!P) {
		P = ""
	}
	if (A.indexOf("n") == 0) {
		G = 0
	} else {
		if (window.g_ssc != undefined && window.g_query != undefined) {
			G = 1
		} else {
			G = 0
		}
	}
	try {
		L = nclk.windowSize(window);
		i = nclk.checkIframe(g);
		if (i) {
			var v = nclk.findPos(document.getElementById(i));
			if (t.clientX && t.clientX != undefined) {
				S = document.body;
				if (S.clientLeft && S.clientTop) {
					ifrSx = t.clientX - S.clientLeft;
					ifrSy = t.clientY - S.clientTop
				} else {
					ifrSx = t.clientX;
					ifrSy = t.clientY
				}
			}
			p = v[0] + ifrSx;
			n = v[1] + ifrSy;
			if (document.body
					&& (document.body.scrollTop || document.body.scrollLeft)) {
				S = document.body;
				s = p - S.scrollLeft;
				q = n - S.scrollTop
			} else {
				if (document.documentElement
						&& (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
					f = document.documentElement;
					s = p - f.scrollLeft;
					q = n - f.scrollTop
				} else {
					s = p;
					q = n
				}
			}
		} else {
			if (t.clientX && t.clientX != undefined) {
				S = document.body;
				if (S.clientLeft && S.clientTop) {
					s = t.clientX - S.clientLeft;
					q = t.clientY - S.clientTop
				} else {
					s = t.clientX;
					q = t.clientY
				}
			}
			if (document.body
					&& (document.body.scrollTop || document.body.scrollLeft)) {
				p = document.body.scrollLeft + (s < 0 ? 0 : s);
				n = document.body.scrollTop + (q < 0 ? 0 : q)
			} else {
				if (document.documentElement
						&& (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
					f = document.documentElement;
					if (f.scrollLeft != undefined) {
						p = f.scrollLeft + (s < 0 ? 0 : s)
					}
					if (f.scrollTop != undefined) {
						n = f.scrollTop + (q < 0 ? 0 : q)
					}
				} else {
					p = (s < 0 ? 0 : s);
					n = (q < 0 ? 0 : q)
				}
			}
			if (t.pageX) {
				p = t.pageX
			}
			if (t.pageY) {
				n = t.pageY
			}
		}
	} catch (Q) {
	}
	if (H == "" || typeof H == "undefined") {
		return
	}
	if (A.indexOf("1") != -1) {
		r = 0
	} else {
		if (g.href) {
			z = g.nodeName.toLowerCase();
			B = g.href.toLowerCase();
			if ((g.target && g.target != "_self" && g.target != "_top" && g.target != "_parent")
					|| (B.indexOf("javascript:") != -1)
					|| (g.getAttribute("href", 2) && g.getAttribute("href", 2)
							.charAt(0) == "#")
					|| (B.indexOf("#") != -1 && (B.substr(0, B.indexOf("#")) == document.URL))
					|| z.toLowerCase() == "img"
					|| C
					&& window.location.host.indexOf(a) == -1) {
				r = 0
			} else {
				r = 1
			}
		} else {
			r = 0
		}
	}
	if (g.href && g.href.indexOf(l + "//" + ccsrv) == 0) {
		j = g.href
	} else {
		j = l + "//" + ccsrv + "/" + nclkModule + "?a=" + H + "&r=" + D + "&i="
				+ u;
		j += "&bw=" + L + "&px=" + p + "&py=" + n + "&sx=" + s + "&sy=" + q
				+ "&m=" + r;
		if (G == 0) {
			j += "&nsc=" + nsc
		} else {
			if (G == 1) {
				j += "&ssc=" + g_ssc + "&q=" + encodeURIComponent(g_query)
						+ "&s=" + g_sid + "&p=" + g_pid
			}
		}
		if (P) {
			j += "&g=" + encodeURIComponent(P)
		}
		if (B && B.indexOf(l + "//" + ccsrv) != 0 && z.toLowerCase() != "img") {
			var N = g.href;
			if (g.outerHTML && !window.XMLHttpRequest) {
				N = (/\shref=\"([^\"]+)\"/i.test(g.outerHTML) && RegExp.$1)
						.replace(/\\/g, "\\\\").replace(/%([A-Z0-9]{2})/ig,
								"\\$1");
				(d = document.createElement("div")).innerHTML = N;
				N = d.innerText.replace(/\\([A-Z0-9]{2})/gi, "%$1").replace(
						/\\\\/g, "\\")
			}
			B = N.toLowerCase();
			if (B.indexOf("http:") == 0 || B.indexOf("https:") == 0
					|| B.indexOf("javascript:") == 0) {
				j += "&u=" + encodeURIComponent(N)
			} else {
				w = nclk.absPath(N);
				j += "&u=" + encodeURIComponent(w)
			}
		} else {
			if (g.href) {
				if (g.href.length > 0) {
					j += "&u=" + encodeURIComponent(g.href)
				} else {
					j += "&u=about%3Ablank"
				}
			} else {
				j += "&u=about%3Ablank"
			}
		}
	}
	if (r == 1) {
		O = g.innerHTML;
		g.href = j;
		if (g.innerHTML != O) {
			g.innerHTML = O
		}
	} else {
		if (document.images) {
			var K = new Date().getTime();
			j += "&time=" + K;
			if (k && !g.href) {
				var R = c = new Date();
				while ((R.getTime() - c.getTime()) < 100) {
					R = new Date()
				}
				var M = new Image();
				nclkImg.push(M);
				M.src = j
			} else {
				var M = new Image();
				nclkImg.push(M);
				M.src = j
			}
		}
	}
	return true
};

function nclks(name, obj, event) {
    if (name == "") {
        return;
    }
    try {
        clickcr(obj,name,'','',event);
    } catch(e) {
    }
}
function nclks_clsnm(id, className, name, elseName, obj, event) {
    nclks_if(className == $(id).className, name, elseName, obj, event);
}
function nclks_chk(id, name, elseName, obj, event) {
    nclks_if($(id).checked, name, elseName, obj, event);
}
function nclks_if(success, name, elseName, obj, event) {
    try {
        if (success) {
            nclks(name, obj, event);
        } else {
            nclks(elseName, obj, event);
        }
    } catch(e) {
    }
}
function nclks_select(key, defaultName, nclicksMapJson, obj, event) {
	var name = null;
	try {
		if (nclicksMapJson.hasOwnProperty(key)) {
			nclks(nclicksMapJson[key], obj, event);
		} else {
			nclks(defaultName, obj, event);
		}
	} catch(e) {
	}
}