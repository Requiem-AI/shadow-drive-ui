import {ShdwDrive} from "@alphabatem/shadow-drive-sdk";
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import axios from 'axios'
import {BN, web3} from "@project-serum/anchor";

export class Shadow {
    connection;

    program = new web3.PublicKey("SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y");
    driveProgram = new web3.PublicKey("2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ");

    drive = null

    wallet;

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
        return this.drive.getStorageAccounts();
    }

    async create(name, size, denom) {
        console.log("Drive", this.drive)
        console.log("Create storage account: ", name, size, denom);
        return this.drive.createStorageAccount(name, this.toSizeDenom(size, denom));
    }

    async reduceSize(id, size, denom) {
        const pk = new web3.PublicKey(id)
        console.log("Reduce storage account: ", pk.toString(), size, denom);
        return this.drive.reduceStorage(pk, this.toSizeDenom(size, denom));
    }

    async increaseSize(id, size, denom) {
        const pk = new web3.PublicKey(id)
        console.log("Increase storage account: ", pk.toString(), size, denom);
        return this.drive.addStorage(pk, this.toSizeDenom(size, denom));
    }

    async show(id) {
        const pk = new web3.PublicKey(id)
        console.log("show", pk)
        return this.drive.getStorageAccount(pk);
    }

    async indexFiles(driveID) {
        return axios.post(`https://shadow-storage.genesysgo.net/list-objects`, {storageAccount: driveID})
    }

    async delete(id) {
        const pk = new web3.PublicKey(id)
        console.log("deleting", pk)
        return this.drive.deleteStorageAccount(pk);
    }

    async undelete(id) {
        const pk = new web3.PublicKey(id)
        console.log("un-deleting", pk)
        return this.drive.cancelDeleteStorageAccount(pk);
    }

    async undoDelete() {
        return this.drive.cancelDeleteStorageAccount();
    }

    async undoDeleteFile() {
        return this.drive.cancelDeleteFile();
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
        let fileAccounts = []
        let fileCounter = new BN(drive.account.initCounter).toNumber() - 1;

        for (let counter = 0; counter <= fileCounter; counter++) {
            let fileSeed = new BN(counter).toTwos(64).toArrayLike(Buffer, "le", 4);

            let [file] = await web3.PublicKey.findProgramAddress(
                [drive.publicKey.toBytes(), fileSeed],
                this.driveProgram)

            fileAccounts.push(file)
        }

        return await this.drive.getProgram().account.file.fetchMultiple(fileAccounts)
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