import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Run server in PORT: ${port}`);
});

//ROUTES
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ success: "OK", msg: "Simple-Api" });
});

//ROUTES CONTACTS

const contacts: any = [];
let lastId: number = 0;

app.get("/contacts", (_, res: Response) => {
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

app.post("/contacts", (req: Request, res: Response) => {
    const response = req.body;

    const validateContactNumber = contacts.find(
        (item: any) => item.cell === response.cell
    );

    if (validateContactNumber) {
        return res.status(400).json({
            success: "ERROR",
            msg: "ERROR, this contact was found saved",
        });
    } else if (response.name && response.cell) {
        lastId += 1;
        contacts.push({ ...response, id: lastId });

        return res
            .status(200)
            .json({ success: "OK", msg: "Contact Add Successful" });
    }

    return res.status(400).json({
        success: "ERROR",
        msg: "Contact not created, required name and cell",
    });
});

app.get("/contacts/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const contact = contacts.find((item: any) => item.id === Number(id));

    if (!contact) {
        return res
            .status(404)
            .json({ success: "ERROR", msg: "Contact not exist" });
    }
    return res
        .status(200)
        .json({ success: "OK", msg: "Contact Get", data: { contact } });
});

app.delete("/contacts/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const contact = contacts.find((item: any) => item.id === Number(id));

    if (!contact) {
        res.status(404).json({ success: "ERROR", msg: "Contact not exist" });
    }

    const index = contacts.findIndex((item: any) => item.id === Number(id));

    contacts.splice(index, 1);

    return res
        .status(200)
        .json({ success: "OK", msg: "Contact Delete Successful" });
});

app.put("/contacts/:id", (req: Request, res: Response) => {
    const response = req.body;
    const { id } = req.params;

    const contact = contacts.find((item: any) => item.id === Number(id));

    if (!contact) {
        return res.status(404).json({
            success: "ERROR",
            msg: "Contact Not Exist",
        });
    }

    if (response.name && response.cell) {
        const index = contacts.findIndex((item: any) => item.id === Number(id));

        contacts[index] = { ...response, id: Number(id) };

        return res.status(200).json({ success: "OK", msg: "Contact Update" });
    }

    return res.status(400).json({
        success: "ERROR",
        msg: "Contact not update, required name and cell",
    });
});
