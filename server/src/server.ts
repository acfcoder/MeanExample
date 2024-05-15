import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./menu/menu.database";
import { createRouter } from "./menu/menu.routes";
import { appendFile } from "fs";

dotenv.config();

const { ATLAS_URI } = process.env;

if(!ATLAS_URI) {
    console.error(
        "No ATLAS_URI environment variable has been defined in config.env"
    );
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(()=> {
        const app = express();
        app.use(cors());

        const productRouter = createRouter("products");
        const categoryRouter = createRouter("categories");
        
        app.use("/products", productRouter);
        app.use("/categories", categoryRouter);
        app.listen(5200, () => {
            console.log(`Server running at http://localhsot:5200 ...`);
        });
    })
    .catch((error) => console.error(error));

