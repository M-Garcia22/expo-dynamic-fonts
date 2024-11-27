"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const index_1 = require("../index");
const RobotoText = (0, index_1.applyGoogleFont)('Roboto');
const OpenSansText = (0, index_1.applyGoogleFont)('Open Sans');
const ExampleScreen = () => {
    return (<react_native_1.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <index_1.GoogleFontLoader fontFamily="Roboto">
        <RobotoText style={{ fontSize: 24, marginBottom: 16 }}>
          This text uses Roboto font
        </RobotoText>
      </index_1.GoogleFontLoader>
      <index_1.GoogleFontLoader fontFamily="Open Sans">
        <OpenSansText style={{ fontSize: 18 }}>
          This text uses Open Sans font
        </OpenSansText>
      </index_1.GoogleFontLoader>
    </react_native_1.View>);
};
exports.default = ExampleScreen;
