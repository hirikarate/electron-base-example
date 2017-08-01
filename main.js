try {
	const { ElectronSampleApp } = require('./dist/app');

	// electron-builder and webpack handle the value of `__dirname`
	// after they have bundled all source files. Therefore:
	// - Use `__dirname` for relative path reference in code.
	// - User `process.cwd()` for absolute path to physical location.
	new ElectronSampleApp(__dirname).start();
} catch (ex) {
	console.error(ex);
	process.exit();
}