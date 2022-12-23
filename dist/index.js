"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(port, () => {
    console.log(`Run server in PORT: ${port}`);
});
//ROUTES
app.get("/", (req, res) => {
    res.status(200).json({ success: "OK", msg: "Simple-Api" });
});
//ROUTES CONTACTS
const contacts = [];
let lastId = 0;
app.get("/contacts", (_, res) => {
    if (!contacts.length) {
        return res
            .status(404)
            .json({ success: "ERROR", msg: "Contacts NotFound" });
    }
    res.status(200).json({
        success: "OK",
        msg: "List Contacts ok",
        data: { contacts },
    });
});
app.post("/contacts", (req, res) => {
    const response = req.body;
    if (response.name && response.cell) {
        lastId += 1;
        contacts.push(Object.assign(Object.assign({}, response), { id: lastId }));
        return res
            .status(200)
            .json({ success: "OK", msg: "Contact Add Successful" });
    }
    return res.status(400).json({
        success: "ERROR",
        msg: "Contact not created, required name and cell",
    });
});
app.get("/contacts/:id", (req, res) => {
    const { id } = req.params;
    const contacts = contacts.find((item) => item.id === Number(id));
});
