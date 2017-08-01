import { ElectronWindowBase } from 'electron-base';


export class SlaveWindow 
	extends ElectronWindowBase {

	constructor(name: string) {
		super(name, {
			triggerGlobalClose: true // Closing this window quits the app.
		});
	}

	/**
	 * @override
	 */
	public start(): void {
		this.loadView('slave.html');
	}
}