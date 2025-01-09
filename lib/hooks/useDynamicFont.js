"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDynamicFont = void 0;
const react_1 = require("react");
const applyGoogleFont_1 = require("../utils/applyGoogleFont");
function useDynamicFont(fontFamily) {
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const [fontLoadTrigger, setFontLoadTrigger] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (!fontFamily) {
            setIsLoaded(true);
            return;
        }
        let isMounted = true;
        async function loadFontAsync() {
            try {
                await (0, applyGoogleFont_1.loadFont)(fontFamily);
                if (isMounted) {
                    setIsLoaded(true);
                    setFontLoadTrigger(prev => prev + 1);
                }
            }
            catch (error) {
                if (isMounted)
                    setIsLoaded(false);
            }
        }
        setIsLoaded(false);
        loadFontAsync();
        return () => {
            isMounted = false;
        };
    }, [fontFamily]);
    return isLoaded;
}
exports.useDynamicFont = useDynamicFont;
