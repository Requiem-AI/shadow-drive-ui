import ShdwDrive from "@shadow-drive/sdk";
import * as web3 from "@solana/web3.js";
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';


export class Shadow {
    connection;

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

        window.co2 = this.connection

        console.log(pk)
        this.drive = await new ShdwDrive(this.connection, pk._wallet).init();
        console.log("Connected to shadow drive");
    }


    async index() {
        return this.drive.getStorageAccounts();
    }

    async create(name, size, denom) {
        console.log("Drive", this.drive)
        console.log("Create storage account: ", name, size, denom);
        return this.drive.createStorageAccount(name, this.toSizeDenom(size, denom));
    }

    async updateSize(name, size, denom) {
        return this.drive.reduceStorage(name, this.toSizeDenom(size, denom));
    }

    async delete(name) {
        console.log("deleting", name)
        return this.drive.deleteStorageAccount(name);
    }

    async undoDelete() {
        return this.drive.cancelDeleteStorageAccount();
    }

    async undoDeleteFile() {
        return this.drive.cancelDeleteFile();
    }

    async uploadFile(filename, drive, data) {
        return this.drive.uploadFile(filename, drive, data);
    }

    async deleteFile(filename, drive, data) {
        return this.drive.deleteFile(filename, drive, data);
    }

    async setImmutable(drive) {
        return this.drive.setImmutable(drive);
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