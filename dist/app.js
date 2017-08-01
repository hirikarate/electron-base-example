"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eltr = require("electron");
const electron_base_1 = require("electron-base");
const DefaultWindow_1 = require("./main/DefaultWindow");
const SlaveWindow_1 = require("./main/SlaveWindow");
const StandaloneWindow_1 = require("./main/StandaloneWindow");
const DEBUG = true;
class ElectronSampleApp extends electron_base_1.ElectronAppBase {
    constructor(appRoot) {
        super(appRoot, {
            globalClose: true,
            //* DEV
            packMode: false
            /* /DEV */
            /*/ PROD
            packMode: true
            /* /PROD */
        });
        if (DEBUG) {
            this.logger.info('Debug mode is ON.');
        }
    }
    /**
     * @override
     */
    isDebug() {
        return DEBUG;
    }
    /**
     * Public method must always have JSDoc comment.
     */
    getDefaultWindow() {
        return this._windows.get('Default');
    }
    /**
     * Public method must always have JSDoc comment.
     */
    doSomethingSpecial() {
        this.logger.debug('Only I have this method, my parent does not!');
    }
    showOpenDialog() {
        return eltr.dialog.showOpenDialog(this.getDefaultWindow().native, {
            title: 'Custom title',
            buttonLabel: 'Custom action',
            properties: ['openDirectory']
        });
    }
    /**
     * @override
     */
    onStarted() {
        this.addWindow(new DefaultWindow_1.DefaultWindow('Default'));
        this.addWindow(new SlaveWindow_1.SlaveWindow('Slave'));
        let secondDisplay = this.getSecondDisplay(), x = 0, y = 0;
        if (secondDisplay) {
            x = secondDisplay.workArea.x;
            y = secondDisplay.workArea.y;
        }
        this.addWindow(new StandaloneWindow_1.StandaloneWindow('Standalone', x, y));
    }
}
exports.ElectronSampleApp = ElectronSampleApp;

//# sourceMappingURL=app.js.map
