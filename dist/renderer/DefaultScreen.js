"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_base_1 = require("electron-base");
class DefaultScreen {
    constructor() {
    }
    start() {
        // jQuery can be referenced in html file, or `import` in this file.
        // jQuery definition for TypeScript must be installed with `npm i --save-dev @types/jquery`
        $(() => this.onDomReady());
    }
    showOverlay() {
        if (!this._$body) {
            return;
        }
        this._$body.addClass('blurred');
    }
    hideOverlay() {
        if (!this._$body) {
            return;
        }
        this._$body.removeClass('blurred');
    }
    onDomReady() {
        let logger = electron_base_1.rendererUtil.logger;
        // Writes to browser console
        logger.debug('On DOM ready message, only appears on browser console!');
        // Writes to browser console AND to app error file.
        logger.error('An example of renderer error that is written to file!');
        $('h1').html('Hello Electron JS!');
        let $body = this._$body = $('body:first');
        $body.on('click', () => this.hideOverlay());
        $('#btnConfirm').on('click', () => {
            electron_base_1.rendererUtil.parentWindow.showConfirmBox('Sure?', 'Bạn có chắc không?', 'Nếu không chắc thì đừng làm!')
                .then(answer => {
                logger.debug('Button index:' + answer);
            });
        });
        $('#btnMessage').on('click', () => {
            electron_base_1.rendererUtil.parentWindow.showMessageBox({
                buttons: ['One', 'Two', 'Three', 'Four', 'Five'],
                message: 'Choose your fate!',
                title: 'Warning?',
                detail: 'What team do you want to join!',
                checkboxLabel: 'Remember my choice',
                type: 'warning'
            })
                .then(answer => {
                logger.debug('Button index:' + answer);
            });
        });
        $('#btnOpen').on('click', () => {
            electron_base_1.rendererUtil.parentWindow.showOpenDialog({
                title: 'Custom title',
                buttonLabel: 'Custom action',
                properties: ['openDirectory', 'multiSelections']
            })
                .then((paths) => {
                logger.debug('Selected paths:' + paths);
            });
        });
        this.callParentWindow();
        this.callMainApp();
    }
    /**
     * Calls a method in parent window class asynchronously.
     */
    async callParentWindow() {
        try {
            // We can use `fs` to read file here (renderer process),
            // but in this case, I tell the main process to read file to keep UI responsive.
            let fileContent = await electron_base_1.rendererUtil.callRemoteWindow('readFile');
            $('#fileContent').text(fileContent);
        }
        catch (ex) {
            console.error(ex);
        }
    }
    /**
     * Calls a method in main app class.
     */
    callMainApp() {
        try {
            // We can use `fs` to read file here (renderer process),
            // but in this case, I tell the main process to read file to keep UI responsive.
            let window = electron_base_1.rendererUtil.callRemoteMainSync('getDefaultWindow');
            $('#mainApp').text(`Get an object from another process: ${window.saySomething()}`);
        }
        catch (ex) {
            console.error(ex);
        }
    }
}
exports.DefaultScreen = DefaultScreen;
window['defaultScreen'] = new DefaultScreen();
window['defaultScreen'].start();

//# sourceMappingURL=DefaultScreen.js.map
