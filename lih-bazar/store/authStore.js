"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
var supabaseClient_1 = require("@/lib/supabaseClient");
var react_toastify_1 = require("react-toastify");
exports.useAuthStore = (0, zustand_1.create)(function (set) { return ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, _b, profile, profileError, error_1;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    set({ isLoading: true });
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.signInWithPassword({
                            email: email,
                            password: password,
                        })];
                case 2:
                    _a = _f.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", (_c = data.user) === null || _c === void 0 ? void 0 : _c.id)
                            .single()];
                case 3:
                    _b = _f.sent(), profile = _b.data, profileError = _b.error;
                    if (profileError)
                        throw profileError;
                    set({
                        user: {
                            id: (_d = data.user) === null || _d === void 0 ? void 0 : _d.id,
                            name: profile.name,
                            email: (_e = data.user) === null || _e === void 0 ? void 0 : _e.email,
                            role: profile.role,
                        },
                        isAuthenticated: true,
                    });
                    react_toastify_1.toast.success("Connexion réussie !");
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _f.sent();
                    react_toastify_1.toast.error(error_1.message || "Email ou mot de passe incorrect");
                    return [3 /*break*/, 6];
                case 5:
                    set({ isLoading: false });
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    register: function (name, email, password, role) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, profileError, error_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    set({ isLoading: true });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.signUp({
                            email: email,
                            password: password,
                            options: {
                                data: {
                                    name: name,
                                    role: role,
                                },
                            },
                        })];
                case 2:
                    _a = _d.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from("profiles")
                            .upsert({
                            id: (_b = data.user) === null || _b === void 0 ? void 0 : _b.id,
                            name: name,
                            email: email,
                            role: role,
                        })];
                case 3:
                    profileError = (_d.sent()).error;
                    if (profileError)
                        throw profileError;
                    set({
                        user: {
                            id: (_c = data.user) === null || _c === void 0 ? void 0 : _c.id,
                            name: name,
                            email: email,
                            role: role,
                        },
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    react_toastify_1.toast.success("Inscription réussie ! Vérifiez votre email.");
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _d.sent();
                    set({ isLoading: false });
                    react_toastify_1.toast.error(error_2.message || "Erreur lors de l'inscription");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    logout: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.signOut()];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    react_toastify_1.toast.success("Déconnexion réussie");
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    set({ isLoading: false });
                    react_toastify_1.toast.error(error_3.message || "Erreur lors de la déconnexion");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchUser: function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, profile, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 1:
                    user = (_b.sent()).data.user;
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", user.id)
                            .single()];
                case 2:
                    _a = _b.sent(), profile = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    set({
                        user: {
                            id: user.id,
                            name: profile.name,
                            email: user.email,
                            role: profile.role,
                        },
                        isAuthenticated: true,
                    });
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_4 = _b.sent();
                    set({ isAuthenticated: false, user: null });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); },
    resetPassword: function (email) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ isLoading: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: "".concat(window.location.origin, "/auth/update-password"),
                        })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    react_toastify_1.toast.success("Lien de réinitialisation envoyé à votre email");
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    react_toastify_1.toast.error(error_5.message || "Erreur lors de l'envoi du lien");
                    return [3 /*break*/, 5];
                case 4:
                    set({ isLoading: false });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); },
}); });
