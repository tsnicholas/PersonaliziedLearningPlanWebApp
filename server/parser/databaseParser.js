const pg = require("pg");
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});

class DatabaseParser {
    constructor() {
        console.log("Constructing...");
        this.pool = new pg.Pool({
            host: 'localhost',
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT
        });
        console.log("Constructing complete!");
    }

//Login
    async storeLogin(username, email, password) {
        console.log("Storing login...");
        const query = {
            text: "INSERT INTO ACCOUNT(username, account_password, email) VALUES($1, $2, $3)",
            values: [username, password, email]
        };
        const client = await this.pool.connect();
        await client.query(query);
        client.release();
        console.log("Login Stored!");
    }
    
    async retrieveLogin(email) {
        console.log("Retrieving login...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [email]
        };
        const result = await client.query(query);
        client.release();
        console.log("Login found!");
        return result.rows;
    }

//Token
    async storeToken(email, refreshToken) {
        console.log("Storing refresh token...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE ACCOUNT SET refreshToken = $1 WHERE email = $2",
            values: [refreshToken, email]
        };
        await client.query(query);
        client.release();
        console.log("Token has been set!");
    }

    async parseToken(email) {
        console.log("Retrieving refresh token...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT refreshToken FROM ACCOUNT WHERE email = $1",
            values: [email]
        }
        const result = await client.query(query);
        client.release();
        console.log("Token has been found!");
        return result.rows;
    }

//Profile
    async parseProfile(email) {
        console.log("Getting profile...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM PROFILE WHERE email = $1",
            values: [email]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found profile!");
        return result.rows;
    }

    async storeProfile(firstName, lastName, email) {
        console.log("Creating profile...");
        const client = await this.pool.connect();
        const query = {
            text: "INSERT INTO PROFILE(firstName, lastName, email) VALUES($1, $2, $3)",
            values: [firstName, lastName, email]
        };
        await client.query(query);
        client.release();
        console.log("Profile Created!");
    }

    async updateProfile(firstName, lastName, profilePicture, jobTitle, bio, email, profile_id) {
        console.log("Inserting new data into profile...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE PROFILE SET firstName = $1, lastName = $2, profilePicture = $3, jobTitle = $4, bio = $5, email = $6 WHERE profile_id = $7",
            values: [firstName, lastName, profilePicture, jobTitle, bio, email, profile_id]
        };
        await client.query(query);
        client.release();
        console.log("Profile data saved!");
    }

    async deleteProfile(profile_id) {
        console.log("Deleting Profile...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Profile WHERE profile_id = $1",
            values: [profile_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Profile!");
        return result.rows;
    }

//Dashboard

    async parseDashboard(profile_id) {
        console.log("Getting Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM Dashboarsd WHERE profile_id = $1",
            values: [profile_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found Dashboard!");
        return result.rows;
    }

    async storeDashboard(profile_id) {
        console.log("Creating Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "INSERT INTO Dashboard(profile_id) VALUES($1)",
            values: [profile_id]
        };
        await client.query(query);
        client.release();
        console.log("Dashboard Created!");
    }

    async updateDashboard(profile_id, dashboard_id) {
        console.log("Inserting new data into Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE PROFILE SET profile_id = $1 WHERE dashboard_id = $2",
            values: [profile_id, dashboard_id]
        };
        await client.query(query);
        client.release();
        console.log("Dashboard data saved!");
    }

    async deleteDashboard(dashboard_id) {
        console.log("Deleting Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Dashboard WHERE dashboard_id = $1",
            values: [dashboard_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Dashboard!");
        return result.rows;
    }

//Module
    async storeModule(name, description, completion_percent, email) {
        console.log("Storing Module...");
        const query = {
            text: "INSERT INTO Module(module_name, description, completion_percent, email) VALUES($1, $2, $3, $4)",
            values: [name, description, completion_percent, email]
        };
        const client = await this.pool.connect();
        await client.query(query);
        client.release();
        console.log("Module Stored!");
    }

    async parseModules(email) {
        console.log("Getting Module...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM Module WHERE email = $1",
            values: [email]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found Module!");
        return result.rows;
    }

    async updateModule(name, description, completion_percent, email, module_id) {
        console.log("Inserting updated data into Module...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3, email = $4 WHERE module_id = $5",
            values: [name, description, completion_percent, email, module_id]
        };
        await client.query(query);
        client.release();
        console.log("Module data updated!");
    }

    async deleteModule(module_id) {
        console.log("Deleting Module...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Module WHERE module_id = $1",
            values: [module_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Module!");
        return result.rows;
    }

//Goal
    async parseGoal(module_id) {
        console.log("Getting Goals...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM Goal WHERE module_id = $1",
            values: [module_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found Goals!");
        return result.rows;
    }

    async storeGoal(name, description, completion_perc, module_id) {
        console.log("Storing Goal...");
        const query = {
            text: "INSERT INTO GOAL(name, description, completion_perc, module_id) VALUES($1, $2, $3, $4)",
            values: [name, description, completion_perc, module_id]
        };
        const client = await this.pool.connect();
        await client.query(query);
        client.release();
        console.log("Goal Stored!");
    }

    async updateGoal(name, description, completion, module_id, goal_id) {
        console.log("Inserting updated data into Goal...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE GOAL SET name = $1, description = $2, completion_perc = $3, module_id = $4, goal_id = $5 WHERE goal_id = $5",
            values: [name, description, completion, module_id, goal_id]
        };
        await client.query(query);
        client.release();
        console.log("Goal data updated!");
    }

    async deleteGoal(goal_id) {
        console.log("Deleting Goal...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Goal WHERE goal_id = $1",
            values: [goal_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Goal!");
        return result.rows;
    }
}

module.exports = DatabaseParser;
