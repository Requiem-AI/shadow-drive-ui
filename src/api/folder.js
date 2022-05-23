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

    root = new Folder("root", [], [])


    constructor(data = "") {
        if (data === "")
            return

        this.root = data.root
        this.folders = data.folders
    }

    export() {
        return JSON.stringify(this)
    }

    getRoot() {
        return this.root;
    }

    addFile(folderName, file) {
        if (this.folders[folderName].files.includes(file))
            return

        this.folders[folderName].files.push(file)
    }

    addFolder(folderName, folder) {
        if (this.folders[folderName].folders.includes(folder))
            return

        this.folders[folderName].folders.push(folder)
    }
}


export class FolderStructure {
    cfg

    constructor(cfg) {
        this.cfg = cfg
    }


    buildFromZip(zip) {
        console.log("Building Zip: ", zip)
    }

    createFolder(folderName, files = []) {
        const f = new Folder(folderName, files)
        this.cfg.folders[f.name] = f
    }

    getRoot() {
        return this.cfg.getRoot();
    }

    getFiles(folder = "") {
        if (folder === "_root" || folder === "")
            return this.getRoot().files

        if (!this.cfg.folders[folder]) {
            console.error("Unable to find files for folder: ", folder)
        }

        return this.cfg.folders[folder].files
    }

    getFolders(folder = "") {
        if (folder === "_root" || folder === "")
            return this.getRoot().folders

        return this.cfg.folders[folder].folders
    }


    folderHasFile(folder, file) {
        const files = this.getFiles(folder)
        return files.includes(file)
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