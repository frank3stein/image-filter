import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { Request, Response } from "express";
import { filter } from "bluebird";
import fs from "fs";
import { join } from "path";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url: string = req.query.image_url;
    if (!image_url) {
      res.status(400).send("Image url is missing.");
    }
    const filteredImage = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredImage);
    const tmp = join(__dirname + "/util/tmp/");

    // get all the files in the directory
    fs.readdir(tmp, async (err, files) => {
      if (err) {
        console.log(err);
      }
      //create an array of the files' paths.
      const toBeDeleted = files.map(file => {
        console.log(`${file} is deleted`);
        return join(tmp + file);
      });
      // delete all the files with every request.
      deleteLocalFiles(toBeDeleted);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
