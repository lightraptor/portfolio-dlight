/*! (C) 2016-2020 Hakim El Hattab, http://hakim.se */
!function() {
    "use strict";
    function c(i, t) {
        var e;
        if (t = t || {},
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        this.targetElement = null,
        this.touchStartX = 0,
        this.touchStartY = 0,
        this.lastTouchIdentifier = 0,
        this.touchBoundary = t.touchBoundary || 10,
        this.layer = i,
        this.tapDelay = t.tapDelay || 200,
        this.tapTimeout = t.tapTimeout || 700,
        !c.notNeeded(i)) {
            for (var n = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], o = this, r = 0, a = n.length; r < a; r++)
                o[n[r]] = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                }(o[n[r]], o);
            s && (i.addEventListener("mouseover", this.onMouse, !0),
            i.addEventListener("mousedown", this.onMouse, !0),
            i.addEventListener("mouseup", this.onMouse, !0)),
            i.addEventListener("click", this.onClick, !0),
            i.addEventListener("touchstart", this.onTouchStart, !1),
            i.addEventListener("touchmove", this.onTouchMove, !1),
            i.addEventListener("touchend", this.onTouchEnd, !1),
            i.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (i.removeEventListener = function(t, e, n) {
                var o = Node.prototype.removeEventListener;
                "click" === t ? o.call(i, t, e.hijacked || e, n) : o.call(i, t, e, n)
            }
            ,
            i.addEventListener = function(t, e, n) {
                var o = Node.prototype.addEventListener;
                "click" === t ? o.call(i, t, e.hijacked || (e.hijacked = function(t) {
                    t.propagationStopped || e(t)
                }
                ), n) : o.call(i, t, e, n)
            }
            ),
            "function" == typeof i.onclick && (e = i.onclick,
            i.addEventListener("click", function(t) {
                e(t)
            }, !1),
            i.onclick = null)
        }
    }
    var t = 0 <= navigator.userAgent.indexOf("Windows Phone")
      , s = 0 < navigator.userAgent.indexOf("Android") && !t
      , a = /iP(ad|hone|od)/.test(navigator.userAgent) && !t
      , u = a && /OS 4_\d(_\d)?/.test(navigator.userAgent)
      , l = a && /OS [6-7]_\d/.test(navigator.userAgent)
      , o = 0 < navigator.userAgent.indexOf("BB10");
    c.prototype.needsClick = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (t.disabled)
                return !0;
            break;
        case "input":
            if (a && "file" === t.type || t.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }
    ,
    c.prototype.needsFocus = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !s;
        case "input":
            switch (t.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !t.disabled && !t.readOnly;
        default:
            return /\bneedsfocus\b/.test(t.className)
        }
    }
    ,
    c.prototype.sendClick = function(t, e) {
        var n;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(),
        n = e.changedTouches[0],
        (e = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t), !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null),
        e.forwardedTouchEvent = !0,
        t.dispatchEvent(e)
    }
    ,
    c.prototype.determineEventType = function(t) {
        return s && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }
    ,
    c.prototype.focus = function(t) {
        var e;
        a && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length,
        t.setSelectionRange(e, e)) : t.focus()
    }
    ,
    c.prototype.updateScrollParent = function(t) {
        var e, n = t.fastClickScrollParent;
        if (!n || !n.contains(t)) {
            e = t;
            do {
                if (e.scrollHeight > e.offsetHeight) {
                    n = e,
                    t.fastClickScrollParent = e;
                    break
                }
            } while (e = e.parentElement)
        }
        n && (n.fastClickLastScrollTop = n.scrollTop)
    }
    ,
    c.prototype.getTargetElementFromEventTarget = function(t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }
    ,
    c.prototype.onTouchStart = function(t) {
        var e, n, o;
        if (1 < t.targetTouches.length)
            return !0;
        if (e = this.getTargetElementFromEventTarget(t.target),
        n = t.targetTouches[0],
        a) {
            if ((o = window.getSelection()).rangeCount && !o.isCollapsed)
                return !0;
            if (!u) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier)
                    return t.preventDefault(),
                    !1;
                this.lastTouchIdentifier = n.identifier,
                this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0,
        this.trackingClickStart = t.timeStamp,
        this.targetElement = e,
        this.touchStartX = n.pageX,
        this.touchStartY = n.pageY,
        t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(),
        !0
    }
    ,
    c.prototype.touchHasMoved = function(t) {
        var e = t.changedTouches[0]
          , t = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > t || Math.abs(e.pageY - this.touchStartY) > t
    }
    ,
    c.prototype.onTouchMove = function(t) {
        return this.trackingClick && (this.targetElement === this.getTargetElementFromEventTarget(t.target) && !this.touchHasMoved(t) || (this.trackingClick = !1,
        this.targetElement = null)),
        !0
    }
    ,
    c.prototype.findControl = function(t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }
    ,
    c.prototype.onTouchEnd = function(t) {
        var e, n, o, i, r = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1,
        this.lastClickTime = t.timeStamp,
        e = this.trackingClickStart,
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        l && (i = t.changedTouches[0],
        (r = document.elementFromPoint(i.pageX - window.pageXOffset, i.pageY - window.pageYOffset) || r).fastClickScrollParent = this.targetElement.fastClickScrollParent),
        "label" === (n = r.tagName.toLowerCase())) {
            if (i = this.findControl(r)) {
                if (this.focus(r),
                s)
                    return !1;
                r = i
            }
        } else if (this.needsFocus(r))
            return 100 < t.timeStamp - e || a && window.top !== window && "input" === n ? this.targetElement = null : (this.focus(r),
            this.sendClick(r, t),
            a && "select" === n || (this.targetElement = null,
            t.preventDefault())),
            !1;
        return !(!a || u || !(o = r.fastClickScrollParent) || o.fastClickLastScrollTop === o.scrollTop) || (this.needsClick(r) || (t.preventDefault(),
        this.sendClick(r, t)),
        !1)
    }
    ,
    c.prototype.onTouchCancel = function() {
        this.trackingClick = !1,
        this.targetElement = null
    }
    ,
    c.prototype.onMouse = function(t) {
        return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0,
        t.stopPropagation(),
        t.preventDefault(),
        !1))))
    }
    ,
    c.prototype.onClick = function(t) {
        return this.trackingClick ? (this.targetElement = null,
        !(this.trackingClick = !1)) : "submit" === t.target.type && 0 === t.detail || ((t = this.onMouse(t)) || (this.targetElement = null),
        t)
    }
    ,
    c.prototype.destroy = function() {
        var t = this.layer;
        s && (t.removeEventListener("mouseover", this.onMouse, !0),
        t.removeEventListener("mousedown", this.onMouse, !0),
        t.removeEventListener("mouseup", this.onMouse, !0)),
        t.removeEventListener("click", this.onClick, !0),
        t.removeEventListener("touchstart", this.onTouchStart, !1),
        t.removeEventListener("touchmove", this.onTouchMove, !1),
        t.removeEventListener("touchend", this.onTouchEnd, !1),
        t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }
    ,
    c.notNeeded = function(t) {
        var e, n;
        if (void 0 === window.ontouchstart)
            return !0;
        if (n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!s)
                return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no"))
                    return !0;
                if (31 < n && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (o && (n = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),
        10 <= n[1] && 3 <= n[2] && (e = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== e.content.indexOf("user-scalable=no"))
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (!!(27 <= +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction))
    }
    ,
    c.attach = function(t, e) {
        return new c(t,e)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return c
    }) : "undefined" != typeof module && module.exports ? (module.exports = c.attach,
    module.exports.FastClick = c) : window.FastClick = c
}();
"use strict";
function _classCallCheck(e, t) {
    if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function")
}
function _defineProperties(e, t) {
    for (var i = 0; i < t.length; i++) {
        var n = t[i];
        n.enumerable = n.enumerable || !1,
        n.configurable = !0,
        "value"in n && (n.writable = !0),
        Object.defineProperty(e, n.key, n)
    }
}
function _createClass(e, t, i) {
    return t && _defineProperties(e.prototype, t),
    i && _defineProperties(e, i),
    e
}
var TWO_COLUMN_GRID_THRESHOLD = 1300
  , ONE_COLUMN_GRID_THRESHOLD = 500
  , Hakim = function() {
    function e() {
        _classCallCheck(this, e),
        this.config = {
            history: !1,
            scrollEffects: !1,
            imageHost: "production" === window.HE_ENV ? "https://d1835mevib0k1p.cloudfront.net/portfolio/v2/images/" : "/images/"
        },
        this.header = new Header,
        this.setupFocus(),
        this.setupScrolling(),
        this.setupHoverEffects(),
        this.setupVisitedLinks(),
        this.setupExpandableContent(),
        Util.isTouchDevice() ? this.setupTouch() : this.setupMouse(),
        this.bind(),
        this.layout(),
        this.show(),
        FastClick.attach(document.body)
    }
    return _createClass(e, [{
        key: "show",
        value: function() {
            var e = this.readURL();
            window.scrollY < 10 || e ? setTimeout(function() {
                return document.body.classList.add("ready")
            }, 1) : (document.body.classList.add("skip-intro"),
            document.body.classList.add("ready"))
        }
    }, {
        key: "bind",
        value: function() {
            this.writeURL = Util.debounce(this.writeURL.bind(this), 100),
            window.addEventListener("resize", this.layout.bind(this))
        }
    }, {
        key: "layout",
        value: function() {
            this.padGrids()
        }
    }, {
        key: "setupFocus",
        value: function() {
            var t = document.createElement("style");
            document.querySelector("head").appendChild(t);
            function e(e) {
                t.styleSheet ? t.styleSheet.cssText = e : t.innerHTML = e
            }
            document.addEventListener("mousedown", function() {
                e("a, button, a:after, button:after { outline: none !important; }")
            }, !1),
            document.addEventListener("keydown", function() {
                e("")
            }, !1)
        }
    }, {
        key: "setupVisitedLinks",
        value: function() {
            if (!Util.isTouchDevice() && Util.supportsLocalStorage()) {
                var i;
                try {
                    i = JSON.parse(localStorage.getItem("he-visit-hash") || "{}")
                } catch (e) {
                    i = {}
                }
                Util.toArray(document.querySelectorAll(".he-text a, a.he-project")).forEach(function(e) {
                    var t = e.getAttribute("href");
                    t.length && "#" !== t && (i[t] && e.classList.add("visited"),
                    e.addEventListener("click", function() {
                        e.classList.add("visited"),
                        i[t] = !0,
                        localStorage.setItem("he-visit-hash", JSON.stringify(i))
                    }, !1))
                }, this)
            }
        }
    }, {
        key: "setupHoverEffects",
        value: function() {
            var t = this;
            Util.toArray(document.querySelectorAll(".he-text a, .he-expand-trigger")).forEach(function(e) {
                e.classList.add("he-anchor"),
                e.innerHTML = '<span class="he-anchor-label">' + e.textContent + '</span><span class="he-anchor-background"></span>'
            }),
            Util.toArray(document.querySelectorAll(".he-anchor")).forEach(function(e) {
                t.bindDirectionalHovers(e, ".he-anchor-background")
            }, this),
            Util.toArray(document.querySelectorAll(".he-project")).forEach(function(e) {
                t.bindDirectionalHovers(e, "h3, p")
            }, this),
            Util.toArray(document.querySelectorAll(".he-social-button")).forEach(function(e) {
                t.bindDirectionalHovers(e, ".he-social-button-background, .he-social-button-label")
            }, this)
        }
    }, {
        key: "setupTouch",
        value: function() {
            var i = this;
            document.body.classList.add("he-touch"),
            Util.toArray(document.querySelectorAll(".he-text a, a.he-project")).forEach(function(e) {
                var t = e.getAttribute("href");
                t.length && "#" !== t && e.removeAttribute("target")
            }),
            Util.toArray(document.querySelectorAll(".he-project")).forEach(function(e) {
                var t = document.createElement("div");
                t.className = "he-project-info-toggle",
                t.innerHTML = '<div class="icon i-icon"></div><div class="icon x-icon"></div>',
                e.appendChild(t);
                t = document.createElement("div");
                t.className = "he-project-info-link",
                t.innerHTML = '<div class="icon link-icon"></div>',
                e.appendChild(t),
                e.addEventListener("click", i.onProjectClicked.bind(i), !1)
            }, this)
        }
    }, {
        key: "setupMouse",
        value: function() {
            var t = this;
            document.body.classList.add("he-mouse"),
            document.addEventListener("mousemove", function() {
                var e, t, i;
                this.lastMouseX && this.lastMouseY && (t = event.pageX - this.lastMouseX,
                e = event.pageY - this.lastMouseY,
                t = t / (i = Math.max(Math.abs(t), Math.abs(e))),
                i = e / i,
                this.pointerDirectionX = t,
                this.pointerDirectionY = i),
                this.lastMouseX = event.pageX,
                this.lastMouseY = event.pageY,
                this.lastScreenX = event.screenX,
                this.lastScreenY = event.screenY
            }
            .bind(this)),
            document.addEventListener("scroll", Util.throttle(function(e) {
                t.lastMouseX = null,
                t.lastMouseY = null,
                t.pointerDirectionX = 0,
                t.pointerDirectionY = 0
            }, 50))
        }
    }, {
        key: "setupScrolling",
        value: function() {
            this.config.scrollEffects && Util.toArray(document.querySelectorAll(".he-project")).forEach(function(e) {
                e.classList.add("he-scrollable")
            }),
            this.cacheScrollElements(),
            this.checkScrolling(),
            window.addEventListener("scroll", Util.throttle(this.checkScrolling.bind(this), 50)),
            window.addEventListener("resize", Util.throttle(this.checkScrolling.bind(this), 50))
        }
    }, {
        key: "setupExpandableContent",
        value: function() {
            Util.toArray(document.querySelectorAll(".he-expand")).forEach(function(t) {
                t.addEventListener("click", function() {
                    var e;
                    t.hasAttribute("data-expand-target-id") ? (e = document.getElementById(t.getAttribute("data-expand-target-id"))) && (e.classList.add("expanded"),
                    setTimeout(function() {
                        return e.classList.add("animate")
                    }, 10)) : (t.querySelector(".he-expand-target").style.minHeight = t.offsetHeight + "px",
                    setTimeout(function() {
                        return t.classList.add("animate")
                    }, 10)),
                    t.classList.add("expanded")
                }, !1)
            })
        }
    }, {
        key: "cacheScrollElements",
        value: function() {
            this.sectionElements = Util.toArray(document.querySelectorAll("[data-section-id]")),
            this.scrollableElements = Util.toArray(document.querySelectorAll(".he-scrollable"))
        }
    }, {
        key: "checkScrolling",
        value: function() {
            var i = this;
            this.updateURL(),
            this.config.scrollEffects && this.scrollableElements.forEach(function(e) {
                var t = Util.getViewPortRelation(e, 60);
                e.classList.toggle("past", t.isAbove),
                e.classList.toggle("future", t.isBelow)
            });
            var e = document.querySelectorAll("[data-src]");
            e.length && Util.toArray(e).forEach(function(t) {
                var e = Util.getViewPortRelation(t, .5 * -window.innerHeight);
                e.isAbove || e.isBelow || (t.addEventListener("load", function(e) {
                    return t.classList.add("loaded")
                }),
                t.setAttribute("src", i.config.imageHost + t.getAttribute("data-src")),
                t.removeAttribute("data-src"),
                (e = document.createElement("div")).className = "he-project-image-loader",
                t.parentNode.appendChild(e))
            })
        }
    }, {
        key: "padGrids",
        value: function() {
            var n = this
              , o = 3;
            window.innerWidth < TWO_COLUMN_GRID_THRESHOLD && (o = 2),
            window.innerWidth < ONE_COLUMN_GRID_THRESHOLD && (o = 1),
            1 < o && o !== this.paddedColumns && (this.paddedColumns = o,
            Util.toArray(document.querySelectorAll(".he-grid")).forEach(function(t) {
                Util.toArray(t.querySelectorAll(".he-project-placeholder")).forEach(function(e) {
                    return t.removeChild(e)
                });
                var e = o - t.querySelectorAll(".he-project").length % o;
                if (0 < e && e < o) {
                    for (; 0 < e--; ) {
                        var i = document.createElement("div");
                        i.className = "he-project he-project-placeholder",
                        i.innerHTML = '<div class="he-project-image-wrapper"></div>',
                        t.appendChild(i)
                    }
                    n.cacheScrollElements()
                }
            }))
        }
    }, {
        key: "bindDirectionalHovers",
        value: function(i, e) {
            var n = Util.toArray(i.querySelectorAll(e));
            i.addEventListener("mouseenter", function(e) {
                var t = this;
                n.forEach(function(e) {
                    e.classList.add("no-transition"),
                    Util.translate(e, -15 * t.pointerDirectionX, -15 * t.pointerDirectionY)
                }, this),
                setTimeout(function() {
                    i.classList.add("hover"),
                    n.forEach(function(e) {
                        e.classList.remove("no-transition"),
                        Util.translate(e, 0, 0)
                    }, this)
                }
                .bind(this), 1)
            }
            .bind(this), !1),
            i.addEventListener("mouseleave", function(e) {
                var t = this;
                i.classList.remove("hover"),
                n.forEach(function(e) {
                    Util.translate(e, 15 * t.pointerDirectionX, 15 * t.pointerDirectionY)
                }, this)
            }
            .bind(this), !1)
        }
    }, {
        key: "updateURL",
        value: function() {
            var n, o;
            this.config.history && (o = Number.MAX_VALUE,
            this.sectionElements.forEach(function(e) {
                var t = e.getBoundingClientRect()
                  , i = Math.abs(t.top);
                i < o && t.top < window.innerHeight && (o = i,
                n = e)
            }),
            n && n.hasAttribute("data-section-id") && this.writeURL(n.getAttribute("data-section-id")))
        }
    }, {
        key: "getURLAnchorID",
        value: function() {
            return document.location.pathname.replace(/\//gi, "")
        }
    }, {
        key: "readURL",
        value: function() {
            if (this.config.history) {
                this.hasReadURL = !0;
                var e = this.getURLAnchorID()
                  , t = document.querySelector('[data-section-id="' + e + '"]');
                document.querySelector('[data-project-id="' + e + '"]');
                if ("" !== e && t)
                    return window.scroll(0, t.offsetTop - 100),
                    !0
            }
        }
    }, {
        key: "writeURL",
        value: function(e) {
            this.config.history && this.hasReadURL && document.location.pathname !== "/" + e && window.history.replaceState({}, "", "/" + e)
        }
    }, {
        key: "toggleProjectInfo",
        value: function(e, t) {
            var i = !e.classList.contains("show-info");
            "boolean" == typeof t && (i = t),
            i ? (e.classList.add("show-info"),
            e.classList.remove("hide-info")) : (e.classList.remove("show-info"),
            e.classList.add("hide-info"))
        }
    }, {
        key: "onProjectClicked",
        value: function(e) {
            var t, i = this;
            e.target.classList.contains("he-project-info-toggle") && (e.preventDefault(),
            t = e.currentTarget,
            this.toggleProjectInfo(t),
            e.target.classList.remove("push"),
            setTimeout(function() {
                return e.target.classList.add("push")
            }, 10),
            Util.toArray(document.querySelectorAll(".he-project.show-info")).forEach(function(e) {
                e !== t && i.toggleProjectInfo(e, !1)
            }))
        }
    }]),
    e
}();
"use strict";
function _classCallCheck(t, e) {
    if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function")
}
function _defineProperties(t, e) {
    for (var i = 0; i < e.length; i++) {
        var a = e[i];
        a.enumerable = a.enumerable || !1,
        a.configurable = !0,
        "value"in a && (a.writable = !0),
        Object.defineProperty(t, a.key, a)
    }
}
function _createClass(t, e, i) {
    return e && _defineProperties(t.prototype, e),
    i && _defineProperties(t, i),
    t
}
var Header = function() {
    function t() {
        _classCallCheck(this, t),
        this.domElement = document.querySelector(".he-header"),
        this.paint = this.paint.bind(this),
        this.layout = this.layout.bind(this),
        this.canvas = document.querySelector(".he-header-canvas"),
        this.canvas && (this.context = this.canvas.getContext("2d"),
        this.time = .5,
        this.layout(),
        this.paint(),
        window.addEventListener("resize", this.layout))
    }
    return _createClass(t, [{
        key: "paint",
        value: function() {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight),
            this.context.fillStyle = "#000",
            this.time += .1;
            for (var t = .13 * Math.min(this.canvasWidth, this.canvasHeight), e = t / 2; e < this.canvasWidth; e += t)
                for (var i = t / 2; i < this.canvasHeight; i += t) {
                    var a = e + 5 * Math.cos(this.time / 4 + (e + i) / 20)
                      , s = i + 5 * Math.sin(this.time / 4 + (e + i) / 20);
                    this.context.fillRect(a, s, 1, 1)
                }
            window.requestAnimationFrame(this.paint)
        }
    }, {
        key: "layout",
        value: function() {
            this.canvasWidth = .2 * this.domElement.offsetWidth,
            this.canvasHeight = .2 * this.domElement.offsetHeight,
            this.canvas.width = this.canvasWidth,
            this.canvas.height = this.canvasHeight
        }
    }]),
    t
}();
"use strict";
function _classCallCheck(e, t) {
    if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function")
}
function _defineProperties(e, t) {
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1,
        r.configurable = !0,
        "value"in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r)
    }
}
function _createClass(e, t, n) {
    return t && _defineProperties(e.prototype, t),
    n && _defineProperties(e, n),
    e
}
var Util = function() {
    function e() {
        _classCallCheck(this, e)
    }
    return _createClass(e, null, [{
        key: "isTouchDevice",
        value: function() {
            return /ipad|iphone|ipod|android|windows\sphone/gi.test(navigator.userAgent)
        }
    }, {
        key: "supportsLocalStorage",
        value: function() {
            var e = "he";
            try {
                return localStorage.setItem(e, e),
                localStorage.removeItem(e),
                !0
            } catch (e) {
                return !1
            }
        }
    }, {
        key: "toArray",
        value: function(e) {
            return Array.prototype.slice.call(e)
        }
    }, {
        key: "getViewPortRelation",
        value: function(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0
              , e = e.getBoundingClientRect();
            return {
                isAbove: e.bottom - t < 0,
                isBelow: e.top + t > window.innerHeight
            }
        }
    }, {
        key: "translate",
        value: function(e, t, n) {
            e.style.webkitTransform = "translate(" + t + "px," + n + "px)",
            e.style.msProperty = "translate(" + t + "px," + n + "px)",
            e.style.transform = "translate(" + t + "px," + n + "px)"
        }
    }, {
        key: "wrapWords",
        value: function(e, t, n) {
            e.innerHTML = t + e.innerHTML.replace(/\s(?=[^[\>]*(\<|$))/g, n + " " + t) + n
        }
    }, {
        key: "typewriter",
        value: function(e, t) {
            var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 1
              , r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 10;
            t = t.split("");
            var a = ""
              , o = setInterval(function() {
                a += t.splice(0, n).join(""),
                e.innerHTML = a,
                0 === t.length && clearInterval(o)
            }, r)
        }
    }, {
        key: "debounce",
        value: function(n, r) {
            var a = null;
            return function() {
                var e = this
                  , t = arguments;
                clearTimeout(a),
                a = setTimeout(function() {
                    n.apply(e, t)
                }, r)
            }
        }
    }, {
        key: "throttle",
        value: function(r, a, o) {
            var i, l;
            return a = a || 250,
            function() {
                var e = o || this
                  , t = +new Date
                  , n = arguments;
                i && t < i + a ? (clearTimeout(l),
                l = setTimeout(function() {
                    i = t,
                    r.apply(e, n)
                }, a)) : (i = t,
                r.apply(e, n))
            }
        }
    }]),
    e
}();
"use strict";
new Hakim;