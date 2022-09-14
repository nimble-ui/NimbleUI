"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.c = exports.e = exports._ = exports.t = void 0;
function noop() { }
function t(str) {
    return function (root) {
        var txt = document.createTextNode(str);
        root.appendChild(txt);
        return {
            unmount: function () {
                root.removeChild(txt);
            },
            update: noop
        };
    };
}
exports.t = t;
function _(sel) {
    return function (root) {
        var prev = "" + sel();
        var txt = document.createTextNode(prev);
        root.appendChild(txt);
        return {
            unmount: function () {
                root.removeChild(txt);
            },
            update: function () {
                var current = "" + sel();
                if (current != prev)
                    txt.textContent = prev = current;
            }
        };
    };
}
exports._ = _;
function e(el, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    function updateAttrs(el, current, $new) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(current.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var k = _d.value;
                if ($new.has(k)) {
                    var v = $new.get(k);
                    if (current.get(k) != v) {
                        el.setAttribute(k, v);
                        current.set(k, v);
                    }
                }
                else {
                    el.removeAttribute(k);
                    current["delete"](k);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values($new.keys()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var k = _f.value;
                if (!current.has(k)) {
                    var v = $new.get(k);
                    el.setAttribute(k, v);
                    current.set(k, v);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function updateEvents(el, current, $new) {
        var e_3, _a, e_4, _b;
        try {
            for (var _c = __values(current.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var k = _d.value;
                if ($new.has(k)) {
                    var v = $new.get(k);
                    if (current.get(k) != v) {
                        el.removeEventListener(k, current.get(k));
                        el.addEventListener(k, v);
                        current.set(k, v);
                    }
                }
                else {
                    el.removeEventListener(k, current.get(k));
                    current["delete"](k);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _e = __values($new.keys()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var k = _f.value;
                if (!current.has(k)) {
                    var v = $new.get(k);
                    el.addEventListener(k, v);
                    current.set(k, v);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    function updateProps(el, currentAttrs, currentEvents) {
        var e_5, _a;
        var a = attrs();
        var newAttrs = new Map();
        var newEvents = new Map();
        try {
            for (var _b = __values(Object.keys(a)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (a[k] == 0 ? true : a[k]) {
                    var v = a[k];
                    if (k.startsWith('on') && (typeof v) == 'function') {
                        newEvents.set(k.slice(2), v);
                    }
                    else {
                        newAttrs.set(k, "" + (v == true ? k : v));
                    }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        updateAttrs(el, currentAttrs, newAttrs);
        updateEvents(el, currentEvents, newEvents);
    }
    return function (root) {
        var e = document.createElement(el);
        var currentAttrs = new Map();
        var currentEvents = new Map();
        updateProps(e, currentAttrs, currentEvents);
        var childNodes = children.map(function (c) { return c(e); });
        root.appendChild(e);
        return {
            update: function () {
                updateProps(e, currentAttrs, currentEvents);
                childNodes.forEach(function (c) { return c.update(); });
            },
            unmount: function () {
                root.removeChild(e);
                childNodes.forEach(function (c) { return c.unmount(); });
            }
        };
    };
}
exports.e = e;
function safe_eq(x, y) {
    if (x === y)
        return true;
    if ((typeof x == 'object' && x != null) &&
        (typeof y == 'object' && y != null)) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;
        for (var prop in x) {
            if (Object.hasOwnProperty.call(x, prop) && Object.hasOwnProperty.call(y, prop)) {
                if (!safe_eq(x[prop], y[prop]))
                    return false;
            }
            else
                return false;
        }
        return true;
    }
    return false;
}
function c(comp, attrs) {
    return function (root) {
        var update = function () { }, props = attrs();
        var instance = comp(props, function () { return update(); });
        function mounted() {
            var _a = instance.mounted, mounted = _a === void 0 ? function () { return function () { }; } : _a;
            var unmount = mounted();
            return unmount || (function () { });
        }
        var rendered = instance.template(root), unmount = mounted();
        update = function () { return rendered.update(); };
        return {
            unmount: function () {
                unmount();
                rendered.unmount();
            },
            update: function () {
                var newProps = attrs();
                if (!safe_eq(props, newProps)) {
                    props = newProps;
                    unmount();
                    instance = comp(props, update);
                    rendered = instance.template(root);
                    unmount = mounted();
                }
                else
                    update();
            }
        };
    };
}
exports.c = c;
__exportStar(require("./types"), exports);
