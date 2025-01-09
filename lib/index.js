"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFont = exports.createFontComponent = exports.Text = void 0;
require("./utils/suppressFontWarnings");
var Text_1 = require("./components/Text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return Text_1.Text; } });
Object.defineProperty(exports, "createFontComponent", { enumerable: true, get: function () { return Text_1.createFontComponent; } });
var applyGoogleFont_1 = require("./utils/applyGoogleFont");
Object.defineProperty(exports, "useFont", { enumerable: true, get: function () { return __importDefault(applyGoogleFont_1).default; } });
