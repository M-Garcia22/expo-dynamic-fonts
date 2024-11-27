"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const applyGoogleFont = (fontFamily) => (props) => (<react_native_1.Text {...props} style={[props.style, { fontFamily }]}/>);
exports.default = applyGoogleFont;
