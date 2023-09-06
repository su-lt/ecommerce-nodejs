const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
    db: { host, name, port },
} = require("../configs/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }
    //connect
    connect(type = "mongodb") {
        //dev mode
        if (true) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(connectString, {
                maxPoolSize: 500,
            })
            .then((_) => {
                console.log("Connected MongoDB Successfully");
                countConnect();
            })
            .catch((err) => console.log("Error Connect !!"));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
