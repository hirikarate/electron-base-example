import * as fs from 'fs';
import * as path from 'path';

import { ElectronWindowBase, BrowserWindowConstructorOptions } from 'electron-base';

// This import is for TypeScript typing only, 
// this line will be removed from output .js file,
// hence the script in app.ts is not executed by this import.
import { ElectronSampleApp } from '../app';


export class DefaultWindow 
	extends ElectronWindowBase {

	constructor(name: string) {
		super(name, {
			triggerGlobalClose: true,
			autoHideMenuBar: true,
			fullscreen: false,
			webPreferences: {
				//nodeIntegration: true, // If `false`, only web JS functionalities are available. NodeJS features will be disabled.
				webSecurity: false // Disable same-origin policy
			}
		});

	}

	/**
	 * @override
	 */
	public start(): void {
		this.native.maximize();
		this.render();

		let app = <ElectronSampleApp>this.app;
		app.logger.error('A dummy error by DefaultWindow! Check out /logs/error.txt!');
		app.doSomethingSpecial();
	}

	public readFile(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			// Let `path.join` decide "/" (Linux) or "\" (Windows).
			fs.readFile(path.join(global.appRoot, 'example.txt'), 'utf8', (err, text) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(text);
			});
		});
	}

	public saySomething(): string {
		return 'Only serializable JSON objects can only be passed with properties of primary types.';
	}

	/**
	 * @override
	 */
	protected onBlur(): void {
		super.onBlur(); // ALWAYS call parent's method!

		this.native.webContents.executeJavaScript('if(window.defaultScreen) window.defaultScreen.showOverlay()');
	}


	private render(): void {
		if (this.app.isDebug()) {
			// Load view after dev tools has opened.
			this.native.webContents
				.on('devtools-opened', () => {
					// Clear cache.
					this.clearCache()
						.then(() => this.loadView('default.html'));
				})
				.openDevTools();
		} else {
			this.setFullScreen(true);

			// Same with: this.loadURL(`${global.appRoot}/views/default.html`);
			this.loadView('default.html');
			// Change view location: this._viewRoot = `${global.appRoot}/new-views/`;
			// this.loadView('default.html') same with: this.loadURL(`${global.appRoot}/new-views/default.html`);
		}
	}
}