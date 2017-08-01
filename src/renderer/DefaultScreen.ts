import { rendererUtil } from 'electron-base';

import { ElectronSampleApp } from '../app';
import { DefaultWindow } from '../main/DefaultWindow';


export class DefaultScreen {
	
	private _$body: JQuery;

	constructor() {
		
	}

	public start(): void {
		// jQuery can be referenced in html file, or `import` in this file.
		// jQuery definition for TypeScript must be installed with `npm i --save-dev @types/jquery`
		$(() => this.onDomReady());
	}
	
	public showOverlay() {
		if (!this._$body) { return; }

		this._$body.addClass('blurred');
	}
	
	public hideOverlay() {
		if (!this._$body) { return; }

		this._$body.removeClass('blurred');
	}


	private onDomReady(): void {
		let logger = rendererUtil.logger;

		// Writes to browser console
		logger.debug('On DOM ready message, only appears on browser console!');
		
		// Writes to browser console AND to app error file.
		logger.error('An example of renderer error that is written to file!');

		$('h1').html('Hello Electron JS!');

		let $body = this._$body = $('body:first');
		$body.on('click', () => this.hideOverlay());

		$('#btnConfirm').on('click', () => {
			rendererUtil.parentWindow.showConfirmBox('Sure?', 'Bạn có chắc không?', 'Nếu không chắc thì đừng làm!')
				.then(answer => {
					logger.debug('Button index:' + answer);
				});
		});

		$('#btnMessage').on('click', () => {
			rendererUtil.parentWindow.showMessageBox({
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
			rendererUtil.parentWindow.showOpenDialog({
				title: 'Custom title',
				buttonLabel: 'Custom action',
				properties: ['openDirectory', 'multiSelections']
			})
			.then((paths: string[]) => {
				logger.debug('Selected paths:' + paths);
			});
		});

		this.callParentWindow();
		this.callMainApp();
	}

	/**
	 * Calls a method in parent window class asynchronously.
	 */
	private async callParentWindow(): Promise<void> {
		try {
			// We can use `fs` to read file here (renderer process),
			// but in this case, I tell the main process to read file to keep UI responsive.
			let fileContent = await rendererUtil.callRemoteWindow('readFile');

			$('#fileContent').text(fileContent);
		} catch (ex) {
			console.error(ex);
		}
	}

	/**
	 * Calls a method in main app class.
	 */
	private callMainApp(): void {
		try {
			// We can use `fs` to read file here (renderer process),
			// but in this case, I tell the main process to read file to keep UI responsive.
			let window: DefaultWindow = <any>rendererUtil.callRemoteMainSync('getDefaultWindow');
			$('#mainApp').text(`Get an object from another process: ${window.saySomething()}`);
		} catch (ex) {
			console.error(ex);
		}
	}
}

window['defaultScreen'] = new DefaultScreen();
window['defaultScreen'].start();