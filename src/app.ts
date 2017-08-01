import * as eltr from 'electron';

import { ElectronAppBase, ElectronAppOptions, ElectronWindowBase } from 'electron-base';

import { DefaultWindow } from './main/DefaultWindow';
import { SlaveWindow } from './main/SlaveWindow';
import { StandaloneWindow } from './main/StandaloneWindow';


const DEBUG = true;

export class ElectronSampleApp 
	extends ElectronAppBase {

	constructor(appRoot: string) {
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
	public isDebug(): boolean {
		return DEBUG;
	}

	/**
	 * Public method must always have JSDoc comment.
	 */
	public getDefaultWindow(): DefaultWindow {
		return <DefaultWindow>this._windows.get('Default');
	}

	/**
	 * Public method must always have JSDoc comment.
	 */
	public doSomethingSpecial(): void {
		this.logger.debug('Only I have this method, my parent does not!');
	}

	public showOpenDialog(): any {
		return eltr.dialog.showOpenDialog(
			this.getDefaultWindow().native,
			{
				title: 'Custom title',
				buttonLabel: 'Custom action',
				properties: ['openDirectory']
			});
	}


	/**
	 * @override
	 */
	protected onStarted(): void {
		this.addWindow(new DefaultWindow('Default'));
		this.addWindow(new SlaveWindow('Slave'));

		let secondDisplay = this.getSecondDisplay(),
			x = 0,
			y = 0;

		if (secondDisplay) {
			x = secondDisplay.workArea.x;
			y = secondDisplay.workArea.y;
		}
		this.addWindow(new StandaloneWindow('Standalone', x, y));
	}
}