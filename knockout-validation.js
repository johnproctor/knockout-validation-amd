define(["knockout"], function(ko) {
    (function() {

        function e(n, t, i) { return t.validator(n(), i.params === undefined ? !0 : i.params) ? !0 : (n.error = ko.validation.formatMessage(i.message || t.message, i.params), n.__valid__(!1), !1) }

        function o(n, t, i) {
            n.isValidating(!0);
            var r = function(r) {
                var u = !1, f = "";
                if (!n.__valid__()) {
                    n.isValidating(!1);
                    return
                }
                r.message ? (u = r.isValid, f = r.message) : u = r;
                u || (n.error = ko.validation.formatMessage(f || i.message || t.message, i.params), n.__valid__(u));
                n.isValidating(!1)
            };
            t.validator(n(), i.params || !0, r)
        }

        var u;
        if (typeof ko === undefined) throw "Knockout is required, please ensure it is loaded before loading this validation plug-in";
        var i = { registerExtenders: !0, messagesOnModified: !0, messageTemplate: null, insertMessages: !0, parseInputAttributes: !1, writeInputAttributes: !1, decorateElement: !1, errorClass: null, errorElementClass: "validationElement", errorMessageClass: "validationMessage", grouping: { deep: !1, observable: !0 } }, t = ko.utils.extend({}, i), r = ["required", "pattern", "min", "max", "step"], f = function(n) { window.setImmediate ? window.setImmediate(n) : window.setTimeout(n, 0) }, n = function() {
            var u = (new Date).getTime(), r = {}, i = "__ko_validation__";
            return {
                isArray: function(n) { return n.isArray || Object.prototype.toString.call(n) === "[object Array]" }, isObject: function(n) { return n !== null && typeof n == "object" },
                values: function(n) {
                    var t = [];
                    for (var i in n) n.hasOwnProperty(i) && t.push(n[i]);
                    return t
                },
                getValue: function(n) { return typeof n == "function" ? n() : n },
                hasAttribute: function(n, t) { return n.getAttribute(t) !== null },
                isValidatable: function(n) { return n.rules && n.isValid && n.isModified },
                insertAfter: function(n, t) { n.parentNode.insertBefore(t, n.nextSibling) },
                newId: function() { return u += 1 },
                getConfigOptions: function(i) {
                    var r = n.contextFor(i);
                    return r || t
                },
                setDomData: function(t, u) {
                    var f = t[i];
                    f || (t[i] = f = n.newId());
                    r[f] = u
                },
                getDomData: function(n) {
                    var t = n[i];
                    return t ? r[t] : undefined
                },
                contextFor: function(t) {
                    switch (t.nodeType) {
                    case 1:
                    case 8:
                        var i = n.getDomData(t);
                        if (i) return i;
                        if (t.parentNode) return n.contextFor(t.parentNode)
                    }
                    return undefined
                },
                isEmptyVal: function(n) { return n === undefined ? !0 : n === null ? !0 : n === "" ? !0 : void 0 }
            }
        }();
        ko.validation = function() {
            var u = 0;
            return {
                utils: n, init: function(n, i) { u > 0 && !i || (n = n || {}, n.errorElementClass = n.errorElementClass || n.errorClass || t.errorElementClass, n.errorMessageClass = n.errorMessageClass || n.errorClass || t.errorMessageClass, ko.utils.extend(t, n), t.registerExtenders && ko.validation.registerExtenders(), u = 1) }, configure: function(n) { ko.validation.init(n) }, reset: function() { t = $.extend(t, i) },
                group: function(i, r) {
                    var r = ko.utils.extend(t.grouping, r), f = ko.observableArray([]), u = null, e = function e(t, i) {
                        var o = [], u = ko.utils.unwrapObservable(t);
                        i = i !== undefined ? i : r.deep ? 1 : -1;
                        ko.isObservable(t) && (t.isValid || t.extend({ validatable: !0 }), f.push(t));
                        u && (n.isArray(u) ? o = u : n.isObject(u) && (o = n.values(u)));
                        i !== 0 && ko.utils.arrayForEach(o, function(n) { n && !n.nodeType && e(n, i + 1) })
                    };
                    return r.observable ? (e(i), u = ko.computed(function() {
                        var n = [];
                        return ko.utils.arrayForEach(f(), function(t) { t.isValid() || n.push(t.error) }), n
                    })) : u = function() {
                        var n = [];
                        return f([]), e(i), ko.utils.arrayForEach(f(), function(t) { t.isValid() || n.push(t.error) }), n
                    }, u.showAllMessages = function(n) {
                        n == undefined && (n = !0);
                        u();
                        ko.utils.arrayForEach(f(), function(t) { t.isModified(n) })
                    }, i.errors = u, i.isValid = function() { return i.errors().length === 0 }, i.isAnyMessageShown = function() {
                        var n = !1;
                        return u(), ko.utils.arrayForEach(f(), function(t) { !t.isValid() && t.isModified() && (n = !0) }), n
                    }, u
                },
                formatMessage: function(n, t) { return n.replace(/\{0\}/gi, t) },
                addRule: function(n, t) { return n.extend({ validatable: !0 }), n.rules.push(t), n },
                addAnonymousRule: function(t, i) {
                    var r = n.newId();
                    i.message === undefined && (rulesObj.message = "Error");
                    ko.validation.rules[r] = i;
                    ko.validation.addRule(t, { rule: r, params: i.params })
                },
                addExtender: function(t) { ko.extenders[t] = function(i, r) { return r.message || r.onlyIf ? ko.validation.addRule(i, { rule: t, message: r.message, params: n.isEmptyVal(r.params) ? !0 : r.params, condition: r.onlyIf }) : ko.validation.addRule(i, { rule: t, params: r }) } },
                registerExtenders: function() { if (t.registerExtenders) for (var n in ko.validation.rules) ko.validation.rules.hasOwnProperty(n) && (ko.extenders[n] || ko.validation.addExtender(n)) },
                insertValidationMessage: function(t) {
                    var i = document.createElement("SPAN");
                    return i.className = n.getConfigOptions(t).errorMessageClass, n.insertAfter(t, i), i
                },
                parseInputValidationAttributes: function(t, i) { ko.utils.arrayForEach(r, function(r) { n.hasAttribute(t, r) && ko.validation.addRule(i(), { rule: r, params: t.getAttribute(r) || !0 }) }) },
                writeInputValidationAttributes: function(n, t) {
                    var i = t(), u;
                    i && i.rules && (u = i.rules(), ko.utils.arrayForEach(r, function(t) {
                        var r, i = ko.utils.arrayFirst(u, function(n) { return n.rule.toLowerCase() === t.toLowerCase() });
                        i && (r = i.params, i.rule == "pattern" && i.params instanceof RegExp && (r = i.params.source), n.setAttribute(t, r))
                    }), u = null)
                }
            }
        }();
        ko.validation.rules = {};
        ko.validation.rules.required = {
            validator: function(n, t) {
                var i;
                return n === undefined || n === null ? !t : (i = n, typeof n == "string" && (i = n.replace(/^\s+|\s+$/g, "")), t && (i + "").length > 0)
            },
            message: "This field is required."
        };
        ko.validation.rules.min = { validator: function(t, i) { return n.isEmptyVal(t) || t >= i }, message: "Please enter a value greater than or equal to {0}." };
        ko.validation.rules.max = { validator: function(t, i) { return n.isEmptyVal(t) || t <= i }, message: "Please enter a value less than or equal to {0}." };
        ko.validation.rules.minLength = { validator: function(t, i) { return n.isEmptyVal(t) || t.length >= i }, message: "Please enter at least {0} characters." };
        ko.validation.rules.maxLength = { validator: function(t, i) { return n.isEmptyVal(t) || t.length <= i }, message: "Please enter no more than {0} characters." };
        ko.validation.rules.pattern = { validator: function(t, i) { return n.isEmptyVal(t) || t.match(i) != null }, message: "Please check this value." };
        ko.validation.rules.step = { validator: function(t, i) { return n.isEmptyVal(t) || t * 100 % (i * 100) == 0 }, message: "The value must increment by {0}" };
        ko.validation.rules.email = { validator: function(t, i) { return n.isEmptyVal(t) || i && /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(t) }, message: "Please enter a proper email address" };
        ko.validation.rules.date = { validator: function(t, i) { return n.isEmptyVal(t) || i && !/Invalid|NaN/.test(new Date(t)) }, message: "Please enter a proper date" };
        ko.validation.rules.dateISO = { validator: function(t, i) { return n.isEmptyVal(t) || i && /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(t) }, message: "Please enter a proper date" };
        ko.validation.rules.number = { validator: function(t, i) { return n.isEmptyVal(t) || i && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(t) }, message: "Please enter a number" };
        ko.validation.rules.digit = { validator: function(t, i) { return n.isEmptyVal(t) || i && /^\d+$/.test(t) }, message: "Please enter a digit" };
        ko.validation.rules.phoneUS = { validator: function(t, i) { return typeof t != "string" ? !1 : n.isEmptyVal(t) ? !0 : (t = t.replace(/\s+/g, ""), i && t.length > 9 && t.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) }, message: "Please specify a valid phone number" };
        ko.validation.rules.equal = {
            validator: function(t, i) {
                var r = i;
                return t === n.getValue(r)
            },
            message: "Values must equal"
        };
        ko.validation.rules.notEqual = {
            validator: function(t, i) {
                var r = i;
                return t !== n.getValue(r)
            },
            message: "Please choose another value."
        };
        ko.validation.rules.unique = {
            validator: function(t, i) {
                var r = n.getValue(i.collection), u = n.getValue(i.externalValue), f = 0;
                return !t || !r ? !0 : (ko.utils.arrayFilter(ko.utils.unwrapObservable(r), function(n) { t === (i.valueAccessor ? i.valueAccessor(n) : n) && f++ }), f < (u !== undefined && t !== u ? 1 : 2))
            },
            message: "Please make sure the value is unique."
        }, function() { ko.validation.registerExtenders() }();
        ko.bindingHandlers.validationCore = function() {
            return {
                init: function(t, i) {
                    var r = n.getConfigOptions(t), u;
                    r.parseInputAttributes && f(function() { ko.validation.parseInputValidationAttributes(t, i) });
                    r.insertMessages && n.isValidatable(i()) && (u = ko.validation.insertValidationMessage(t), r.messageTemplate ? ko.renderTemplate(r.messageTemplate, { field: i() }, null, u, "replaceNode") : ko.applyBindingsToNode(u, { validationMessage: i() }));
                    r.writeInputAttributes && n.isValidatable(i()) && ko.validation.writeInputValidationAttributes(t, i);
                    r.decorateElement && n.isValidatable(i()) && ko.applyBindingsToNode(t, { validationElement: i() })
                },
                update: function() {
                }
            }
        }(), function() {
            var n = ko.bindingHandlers.value.init;
            ko.bindingHandlers.value.init = function(t, i, r, u, f) { return n(t, i, r), ko.bindingHandlers.validationCore.init(t, i, r, u, f) }
        }();
        ko.bindingHandlers.validationMessage = {
            update: function(t, i) {
                var r = i(), s = n.getConfigOptions(t), h = ko.utils.unwrapObservable(r), u = !1, f = !1, e, o;
                r.extend({ validatable: !0 });
                u = r.isModified();
                f = r.isValid();
                e = function() { return !s.messagesOnModified || u ? f ? null : r.error : null };
                o = function() { return u ? !f : !1 };
                ko.bindingHandlers.text.update(t, e);
                ko.bindingHandlers.visible.update(t, o)
            }
        };
        ko.bindingHandlers.validationElement = {
            update: function(t, i) {
                var r = i(), u = n.getConfigOptions(t), s = ko.utils.unwrapObservable(r), f = !1, e = !1, o;
                r.extend({ validatable: !0 });
                f = r.isModified();
                e = r.isValid();
                o = function() {
                    var n = {}, t = f ? !e : !1;
                    return u.decorateElement || (t = !1), n[u.errorElementClass] = t, n
                };
                ko.bindingHandlers.css.update(t, o)
            }
        };
        ko.bindingHandlers.validationOptions = function() {
            return {
                init: function(i, r) {
                    var f = ko.utils.unwrapObservable(r()), u;
                    f && (u = ko.utils.extend({}, t), ko.utils.extend(u, f), n.setDomData(i, u))
                }
            }
        }();
        ko.extenders.validation = function(t, i) { return ko.utils.arrayForEach(n.isArray(i) ? i : [i], function(n) { ko.validation.addAnonymousRule(t, n) }), t };
        ko.extenders.validatable = function(t, i) {
            var r, u;
            return i && !n.isValidatable(t) ? (t.error = null, t.rules = ko.observableArray(), t.isValidating = ko.observable(!1), t.__valid__ = ko.observable(!0), t.isModified = ko.observable(!1), r = ko.computed(function() {
                var n = t(), i = t.rules();
                return ko.validation.validateObservable(t), !0
            }), t.isValid = ko.computed(function() { return t.__valid__() }), u = t.subscribe(function() { t.isModified(!0) }), t._disposeValidation = function() {
                t.isValid.dispose();
                t.rules.removeAll();
                t.isModified._subscriptions.change = [];
                t.isValidating._subscriptions.change = [];
                t.__valid__._subscriptions.change = [];
                u.dispose();
                r.dispose();
                delete t.rules;
                delete t.error;
                delete t.isValid;
                delete t.isValidating;
                delete t.__valid__;
                delete t.isModified
            }) : i === !1 && n.isValidatable(t) && t._disposeValidation && t._disposeValidation(), t
        };
        ko.validation.validateObservable = function(n) {
            for (var r = 0, i, t, u = n.rules(), f = u.length; r < f; r++)
                if (t = u[r], !t.condition || t.condition())
                    if (i = ko.validation.rules[t.rule], i.async || t.async) o(n, i, t);
                    else if (!e(n, i, t)) return !1;
            return n.error = null, n.__valid__(!0), !0
        };
        ko.validatedObservable = function(n) {
            if (!ko.validation.utils.isObject(n)) return ko.observable(n).extend({ validatable: !0 });
            var t = ko.observable(n);
            return t.errors = ko.validation.group(n), t.isValid = ko.computed(function() { return t.errors().length === 0 }), t
        };
        ko.validation.localize = function(n) { for (var t in n) ko.validation.rules.hasOwnProperty(t) && (ko.validation.rules[t].message = n[t]) };
        ko.applyBindingsWithValidation = function(n, t, i) {
            var f = arguments.length, r, u;
            f > 2 ? (r = t, u = i) : f < 2 ? r = document.body : arguments[1].nodeType ? r = t : u = arguments[1];
            ko.validation.init();
            u && ko.validation.utils.setDomData(r, u);
            ko.applyBindings(n, t)
        };
        u = ko.applyBindings;
        ko.applyBindings = function(n, t) {
            ko.validation.init();
            u(n, t)
        }
    })();
});