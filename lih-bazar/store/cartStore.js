"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCartStore = void 0;
var zustand_1 = require("zustand");
exports.useCartStore = (0, zustand_1.create)(function (set) { return ({
    cartItems: [],
    addToCart: function (item) {
        return set(function (state) {
            var existingItem = state.cartItems.find(function (i) { return i.id === item.id; });
            if (existingItem) {
                return {
                    cartItems: state.cartItems.map(function (i) {
                        return i.id === item.id ? __assign(__assign({}, i), { quantity: i.quantity + 1 }) : i;
                    }),
                };
            }
            return { cartItems: __spreadArray(__spreadArray([], state.cartItems, true), [__assign(__assign({}, item), { quantity: 1 })], false) };
        });
    },
    removeFromCart: function (id) {
        return set(function (state) { return ({
            cartItems: state.cartItems.filter(function (item) { return item.id !== id; }),
        }); });
    },
    updateQuantity: function (id, quantity) {
        return set(function (state) { return ({
            cartItems: state.cartItems.map(function (item) {
                return item.id === id ? __assign(__assign({}, item), { quantity: quantity }) : item;
            }),
        }); });
    },
    clearCart: function () { return set({ cartItems: [] }); },
}); });
