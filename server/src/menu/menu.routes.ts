import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./menu.database";
import { error } from "console";


export function createRouter(collectionName: keyof typeof collections){

const menuRouter = express.Router();
menuRouter.use(express.json());

menuRouter.get("/", async (_req, res) => {
    try {
        const items = await collections[collectionName]?.find({}).toArray();
        res.status(200).send(items);
    } catch(error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

menuRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const item = await collections[collectionName]?.findOne(query);

        if(item) {
            res.status(200).send(item);
        } else {
            res.status(404).send(`Failed to find an item: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an item ID ${req?.params?.id}`);
    }
});

menuRouter.post("/", async (req, res) => {
    try {
        const item = req.body;
        const result = await collections[collectionName]?.insertOne(item);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new item: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new item.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

menuRouter.put("/:id", async(req, res) => {
    try {
        const id = req?.params?.id;
        const item = req.body;
        const query = { _id: new ObjectId(id)};
        const result = await collections[collectionName]?.updateOne(query, { $set:item });
        
        if (result && result?.matchedCount) {
            res.status(200).send(`Updated an item: ID ${id}.`);
        } else if (!result?.matchedCount){
            res.status(404).send(`Failed to find an item: ID ${id}`);
        } else {
            res.status(304).send(`Failed to updated an item: ID ${id}`);
        }   
     } catch(error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send (message);
     }
});

menuRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections[collectionName]?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an item: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an item: ID ${id}`);
        } else if( !result.deletedCount) {
            res.status(404).send(`Failed to find an item: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message); 
    }
});
    return menuRouter;
};