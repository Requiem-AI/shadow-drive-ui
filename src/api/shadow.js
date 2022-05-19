import {ShdwDrive} from "@shadow-drive/sdk";
import * as web3 from "@solana/web3.js";
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import axios from 'axios'
// import { TOKEN_PROGRAM_ID  } from "@solana/spl-token";

export class Shadow {
    connection;

    program = new web3.PublicKey("SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y");

    drive = null


    constructor() {
    }

    async initDrive() {
        const pk = new PhantomWalletAdapter();
        await pk.connect();

        this.connection = new web3.Connection(
            web3.clusterApiUrl('mainnet-beta'),
            'finalized',
        );

        console.log(pk)
        this.drive = await new ShdwDrive(this.connection, pk._wallet).init();
        console.log("Connected to shadow drive");
    }

    async getSOLBalance(walletAddr) {
        const pk = new web3.PublicKey(walletAddr)
        return this.connection.getBalance(pk)
    }

    async getSHDWBalances(walletAddr) {
        const pk = new web3.PublicKey(walletAddr)
        return this.connection.getParsedTokenAccountsByOwner(pk, { mint: this.program })
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

    async uploadMultipleFiles(drive, daraArr) {
        const pk = new web3.PublicKey(drive)
        console.log("Uploading multiple file to drive: ", pk.toString(), daraArr)
        return this.drive.uploadMultipleFiles(pk, daraArr);
    }

    async deleteFile(drive, filename) {
        const pk = new web3.PublicKey(drive)
        return this.drive.deleteFile(pk, filename);
    }

    async setImmutable(drive) {
        const pk = new web3.PublicKey(drive)
        return this.drive.setImmutable(pk);
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