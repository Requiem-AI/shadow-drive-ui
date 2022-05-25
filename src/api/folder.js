export class DriveConfig {
	folders = {
		// "0x0": new Folder("0x0", ["File-0x1"], ["0x3"]),
		// "0x1": new Folder("0x1", ["File-0x1"], []),
		// "0x2": new Folder("0x2", ["File-0x1"], []),
		// "0x3": new Folder("0x3", ["File-0x1"], []),
		// "0x4": new Folder("0x4", ["File-0x1"], []),
		// "0x5": new Folder("0x5", ["File-0x1"], []),
		// "0x6": new Folder("0x6", ["File-0x1"], ["0x4", "0x1"]),
	}

	root = "_root"

	constructor(data = "") {
		if (data !== "") {
			console.log("Building drive config: ", data)
			this.import(data)
			if (data.root) {
				this.root = typeof data.root === "string" ? data.root : data.root.name;
				// console.log("Root set: ", this.root)
			}
		}

		//If root folder doesnt exist, create it
		if (!this.folders[this.root]) {
			this.folders[this.root] = new Folder(this.root, [], [])
		}
	}

	import(data) {
		const folders = data.folders || {}
		// console.log("Importing: ", data, folders)

		const ok = Object.keys(folders)
		for (let i = 0; i < ok.length; i++) {
			const key = ok[i]
			const f = folders[key]
			this.folders[key] = new Folder(f.name, f.files, f.folders)
		}
		// console.log("Imported", this.folders)
	}

	export() {
		return JSON.stringify(this)
	}

	getRoot() {
		if (!this.folders[this.root])
			return new Folder("DEFAULT", [], [])

		return this.folders[this.root];
	}

	addFile(folderName, file) {
		if (!this.folders[folderName]) {
			console.error("Folder does not exist: ", folderName)
			return;
		}

		if (this.folders[folderName].files.includes(file))
			return

		this.folders[folderName].files.push(file)
	}

	addFolder(parent, folderName) {
		if (parent === "")
			parent = this.getRoot().name

		console.log("Adding", folderName, parent, Object.keys(this.folders))

		// if (!this.folders[parent])
		// 	this.folders[parent] = new Folder()

		const ok = Object.keys(this.folders)
		for (let i = 0; i < ok.length; i++) {
			if (this.folders[ok[i]].folders.includes(folderName))
				return "Name in use";
		}

		if (this.folders[parent].folders.includes(folderName))
			return "Already in folder";

		this.folders[folderName] = new Folder(folderName, [], [])
		this.folders[parent].addFolder(folderName)

		return null;
	}

	deleteFolder(folderName) {
		console.log("Deleting folder: ", folderName)
		delete this.folders[folderName]

		const ok = Object.keys(this.folders)
		for (let i = 0; i < ok.length; i++) {
			const idx = this.folders[ok[i]].folders.indexOf(folderName)
			if (idx > -1) {
				console.log(`Removing subfolder: ${folderName} - From: ${ok[i]} - Idx: ${idx}`, this.folders[ok[i]].folders)
				this.folders[ok[i]].folders.splice(idx, 1)
			}
		}
	}
}


export class FolderStructure {
	cfg


	currentFolder = ""
	skipNextAdd = false;
	history = [];

	constructor(cfg) {
		console.log("Building folder structure", cfg.export())
		this.cfg = cfg
	}

	reset() {
		this.cfg = new DriveConfig("")
		this.history = [];
	}

	buildFromZip(zip) {
		console.log("Building Zip: ", zip)
	}

	getRoot() {
		return this.cfg.getRoot();
	}

	getRootName() {
		return this.cfg.root;
	}

	getFolderNames() {
		return Object.keys(this.cfg.folders)
	}

	getFiles(folder = "") {
		if (folder === this.getRootName() || folder === "")
			return this.getRoot().files

		if (!this.cfg.folders[folder]) {
			console.error("Unable to find files for folder: ", folder)
			return [];
		}

		return this.cfg.folders[folder].files
	}

	getFolders(folder = "") {
		if (folder === this.getRootName() || folder === "")
			return this.getRoot().folders

		if (!this.cfg.folders[folder]) {
			console.error("Unable to find folder: ", folder)
			return [];
		}

		return this.cfg.folders[folder].folders
	}

	getHistory() {
		return this.history;
	}

	popHistory() {
		const h = this.history.pop() || "";
		if (h !== "") {
			this.skipNextAdd = true;
		}
		return h
	}

	setActive(folderName) {
		this.addHistory(this.currentFolder)
		this.currentFolder = folderName
	}

	addHistory(folderName) {
		if (this.skipNextAdd) {
			this.skipNextAdd = false;
			return
		}

		console.log("Adding folder history: ", folderName)
		this.history.push(folderName)
		if (this.history.length > 20) {
			this.history = this.history.slice(this.history.length - 20)
		}
	}


	folderHasFile(folder, file) {
		return this.getFiles(folder).includes(file)
	}

	export() {
		return this.cfg.export()
	}
}

export class Folder {
	name
	files = [];
	folders = [];

	constructor(name, files, folders = []) {
		this.name = name;
		this.files = files;
		this.folders = folders;
	}

	addFile(file) {
		this.files.push(file)
	}

	addFolder(folder) {
		this.folders.push(folder)
	}
}