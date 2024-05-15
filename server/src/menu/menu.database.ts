import * as mongodb from "mongodb";
import { Product } from "./product";
import { Category } from "./category";

export const collections: {
    products?: mongodb.Collection<Product>;
    categories?: mongodb.Collection<Category>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("restaurantApp");
    await applySchemaValidation(db);

    const productsCollection = db.collection<Product>("products");
    collections.products = productsCollection;

    const categoriesCollection = db.collection<Category>("categories");
    collections.categories = categoriesCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const productsJsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "s_desc", "price", "available"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                s_desc: {
                    bsonType: "string",
                    description: "'short description' is required and is a string",
                    minLength: 5
                },
                available: {
                    bsonType: "boolean",
                    description: "'available' is required and is a boolean",
                },
                img: {
                    bsonType: "string",
                    description: "upload a main image for the product"
                },
                price: {
                    bsonType: "number",
                    description: "The price of the product is required",
                },
            },
        },
    };

    const categoriesJsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "showed"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                position: {
                    bsonType: "number",
                    description: "'position' is required and is a number",
                    minLength: 5
                },
                showed: {
                    bsonType: "boolean",
                    description: "'showed' is required and is a boolean",
                },
                img: {
                    bsonType: "string",
                    description: "upload a main image for the product"
                },
            },
        },
    };

    await db.command({
        collMod: "products",
        validator: productsJsonSchema
    }).catch(async (error: mongodb.MongoServerError) =>{
        if(error.codeName === "NamespaceNotFound") {
            await db.createCollection("products", {validator: productsJsonSchema})
        }
    });

    await db.command({
        collMod: "categories",
        validator: categoriesJsonSchema
    }).catch(async (error: mongodb.MongoServerError) =>{
        if(error.codeName === "NamespaceNotFound") {
            await db.createCollection("categories", {validator: categoriesJsonSchema})
        }
    });
    
}