// import {ShdwDrive} from "@alphabatem/metaplex-shadow-drive";
import {ShdwDrive} from "@cloakd/shadow-drive";
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import axios from 'axios'
import {BN, web3} from "@project-serum/anchor";

export class Shadow {
	connection;

	program = new web3.PublicKey("SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y");
	driveProgram = new web3.PublicKey("2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ");

	drive = null

	wallet;

	v1Drives = {
		//
	}

	async initDrive() {
		const pk = new PhantomWalletAdapter();
		await pk.connect();

		this._startConnection();

		console.log("PK: ", pk)
		this.wallet = pk._wallet;
		this.drive = await new ShdwDrive(this.connection, this.wallet).init();
		console.log("Connected to shadow drive");
	}

	_startConnection() {
		this.connection = new web3.Connection(
			"https://ssc-dao.genesysgo.net/",
			'finalized',
		);
	}

	toPublicKey(strAddr) {
		return new web3.PublicKey(strAddr)
	}

	async getSOLBalance(walletAddr) {
		const pk = new web3.PublicKey(walletAddr)
		return this.connection.getBalance(pk)
	}

	async getSHDWBalances(walletAddr) {
		const pk = new web3.PublicKey(walletAddr)
		return this.connection.getParsedTokenAccountsByOwner(pk, {mint: this.program})
	}


	async index() {
		const v1Accs = await this.drive.getStorageAccounts("v1")
		const v2Accs = await this.drive.getStorageAccounts("v2")

		for (let i = 0; i < v2Accs.length; i++) {
			console.log("Getting info: %v", v2Accs[i].publicKey)
			const info = await this.driveInfo(v2Accs[i].publicKey)
			v2Accs[i].account = Object.assign(v2Accs[i].account, info.data)
			console.log("Info: ", v2Accs[i])
		}

		this.v1Drives = {}
		v1Accs.map((a) => this.v1Drives[a.publicKey] = true)

		return [...v1Accs, ...v2Accs]
	}

	async create(name, size, denom, version = "v2") {
		console.log("Drive", this.drive)
		console.log("Create storage account: ", name, size, denom);
		return this.drive.createStorageAccount(name, this.toSizeDenom(size, denom), version);
	}

	async reduceSize(id, size, denom, version = "v2") {
		if (this.v1Drives[id])
			version = "v1"

		const pk = new web3.PublicKey(id)
		console.log("Reduce storage account: ", pk.toString(), size, denom);
		return this.drive.reduceStorage(pk, this.toSizeDenom(size, denom), version);
	}

	async increaseSize(id, size, denom, data, version = "v2") {
		if (this.v1Drives[id])
			version = "v1"

		const pk = new web3.PublicKey(id)
		console.log("Increase storage account: ", pk.toString(), size, denom, version);
		return this.drive.addStorage(pk, this.toSizeDenom(size, denom), version);
	}

	async show(id) {
		const pk = new web3.PublicKey(id)
		console.log("show", pk)
		return this.drive.getStorageAccount(pk);
	}

	async indexFiles(driveID) {
		const resp = await axios.post(`https://shadow-storage.genesysgo.net/list-objects`, {storageAccount: driveID})
		const files = []

		for (let f in resp.data.keys) {
			files.push({
				deleteRequestEpoch: 0,
				immutable: false,
				initCounterSeed: 0,
				size: 0,
				storageAccount: driveID,
				name: resp.data.keys[f],
				toBeDeleted: false
			})
		}

		console.log("IndexFiles", files)
		return files
	}

	async driveInfo(driveID) {
		return axios.post(`https://shadow-storage.genesysgo.net/storage-account-info`, {storage_account: driveID})
	}

	async delete(id, version = "v2") {
		if (this.v1Drives[id])
			version = "v1"

		const pk = new web3.PublicKey(id)
		console.log("deleting", pk)
		return this.drive.deleteStorageAccount(pk, version);
	}

	async undelete(id, version = "v2") {
		if (this.v1Drives[id])
			version = "v1"

		const pk = new web3.PublicKey(id)
		console.log("un-deleting", pk)
		return this.drive.cancelDeleteStorageAccount(pk, version);
	}

	async undoDelete(version = "v2") {
		// if (this.v1Drives[id])
		// 	version = "v1"

		return this.drive.cancelDeleteStorageAccount(version);
	}

	async undoDeleteFile(version = "v2") {
		// if (this.v1Drives[id])
		// 	version = "v1"

		return this.drive.cancelDeleteFile(version);
	}

	async uploadFile(drive, data) {
		const pk = new web3.PublicKey(drive)
		console.log("Uploading file to drive: ", pk.toString())
		return this.drive.uploadFile(pk, data);
	}

	async editFile(drive, fileUrl, data) {
		const pk = new web3.PublicKey(drive)
		console.log("Uploading EDITED file to drive: ", pk.toString())
		return this.drive.editFile(pk, fileUrl, data);
	}

	async uploadMultipleFiles(drive, daraArr) {
		const pk = new web3.PublicKey(drive)
		console.log("Uploading multiple file to drive: ", pk.toString(), daraArr)
		return this.drive.uploadMultipleFiles(pk, daraArr);
	}

	async deleteFile(drive, fileUrl) {
		const pk = new web3.PublicKey(drive)
		return this.drive.deleteFile(pk, fileUrl);
	}

	async setImmutable(drive) {
		const pk = new web3.PublicKey(drive)
		return this.drive.setImmutable(pk);
	}

	async fileInfo(drive) {
		console.log("Getting file info: ", drive)

		if (!drive.account.owner2) {
			return await this.indexFiles(drive.publicKey)
		}

		let fileAccounts = []
		let fileCounter = new BN(drive.account.initCounter).toNumber() - 1;

		for (let counter = 0; counter <= fileCounter; counter++) {
			let fileSeed = new BN(counter).toTwos(64).toArrayLike(Buffer, "le", 4);

			let [file] = await web3.PublicKey.findProgramAddress(
				[drive.publicKey.toBytes(), fileSeed],
				this.driveProgram)

			fileAccounts.push(file)
		}

		return await this.drive.program.account.file.fetchMultiple(fileAccounts)
	}

	toSizeDenom(size, denom) {
		const validDenoms = ["KB", "MB", "GB"]
		if (!validDenoms.includes(denom)) {
			return `${size}KB`;
		}

		return `${size}${denom}`;
	}
}

export default new Shadow()