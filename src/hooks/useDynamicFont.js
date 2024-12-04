var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from 'react';
import { loadFont } from '../utils/applyGoogleFont';
export function useDynamicFont(fontFamily) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [fontLoadTrigger, setFontLoadTrigger] = useState(0);
    useEffect(() => {
        if (!fontFamily) {
            setIsLoaded(true);
            return;
        }
        let isMounted = true;
        function loadFontAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield loadFont(fontFamily);
                    if (isMounted) {
                        setIsLoaded(true);
                        setFontLoadTrigger(prev => prev + 1);
                    }
                }
                catch (error) {
                    if (isMounted)
                        setIsLoaded(false);
                }
            });
        }
        setIsLoaded(false);
        loadFontAsync();
        return () => {
            isMounted = false;
        };
    }, [fontFamily]);
    return isLoaded;
}
