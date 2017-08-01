"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_base_1 = require("electron-base");
class SlaveWindow extends electron_base_1.ElectronWindowBase {
    constructor(name) {
        super(name, {
            triggerGlobalClose: true // Closing this window quits the app.
        });
    }
    /**
     * @override
     */
    start() {
        this.loadView('slave.html');
    }
}
exports.SlaveWindow = SlaveWindow;

//# sourceMappingURL=SlaveWindow.js.map
