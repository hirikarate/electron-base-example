import { ElectronWindowBase } from 'electron-base';


export class StandaloneWindow 
	extends ElectronWindowBase {

	constructor(name: string, x: number, y: number) {
		super(name, {
			x, y,
			triggerGlobalClose: false, // If `false` (as default), closing this window won't quit the app.
		});
	}

	/**
	 * @override
	 */
	public start(): void {
		this.loadView('standalone.html');
	}
}