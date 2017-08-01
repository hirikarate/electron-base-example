"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_base_1 = require("electron-base");
class StandaloneWindow extends electron_base_1.ElectronWindowBase {
    constructor(name, x, y) {
        super(name, {
            x, y,
            triggerGlobalClose: false,
        });
    }
    /**
     * @override
     */
    start() {
        this.loadView('standalone.html');
    }
}
exports.StandaloneWindow = StandaloneWindow;

//# sourceMappingURL=StandaloneWindow.js.map
