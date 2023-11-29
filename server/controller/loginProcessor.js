const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");
const StatusCodes = require("./StatusCodes");

class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser();
      this.statusCode = new StatusCodes();
    }

    async verifyLogin(email, password) {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) return STATUS_CODES.GONE;
            return await bcrypt.compare(password, login[0].account_password) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
    
    async createAccount(username, password, email) {
        try {
            console.log(password);
            const hash = await this.#hashPassword(password);
            console.log(hash);
            await this.parser.storeLogin(username, email, hash);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async setToken(email, refreshToken) {
        try {
            await this.parser.storeToken(email, refreshToken);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async verifyToken(email, refreshToken) {
        try {
            const result = await this.parser.parseToken(email);
            if(result.length === 0) return STATUS_CODES.GONE;
            return (result[0].refreshtoken === refreshToken) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    #getStatusCode(error) {
        switch(error.code) {
            case '23505':
                console.log("Duplicate data.");
                return STATUS_CODES.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return STATUS_CODES.CONNECTION_ERROR;
            case '23514':
                console.log("Bad data.");
                return STATUS_CODES.BAD_REQUEST;    
            default:
                console.error("Fatal server error.", error);
                return STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
    }

    async #hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

module.exports = LoginAPI;
