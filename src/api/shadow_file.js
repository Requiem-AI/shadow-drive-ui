const idl = {
    name: "file",
    type: {
        kind: "struct",
        fields: [
            {
                name: "immutable",
                type: "bool",
            },
            {
                name: "toBeDeleted",
                type: "bool",
            },
            {
                name: "deleteRequestEpoch",
                type: "u32",
            },
            {
                name: "size",
                type: "u64",
            },
            {
                name: "sha256Hash",
                type: {
                    array: ["u8", 32],
                },
            },
            {
                name: "initCounterSeed",
                type: "u32",
            },
            {
                name: "storageAccount",
                type: "publicKey",
            },
            {
                name: "name",
                type: "string",
            },
        ],
    },
}