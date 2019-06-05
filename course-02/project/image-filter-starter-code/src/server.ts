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

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url: string = req.query.image_url;
    if (!image_url) {
      res.status(402).send("Image url is missing.");
    }
    const filteredImage = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredImage);
    const tmp = join(__dirname + "/util/tmp/");
    fs.readdir(tmp, async (err, files) => {
      if (err) {
        console.log(err);
      }
      const toBeDeleted = files.map(file => {
        console.log(`${file} is deleted`);
        return join(tmp + file);
      });
      deleteLocalFiles(toBeDeleted);
    });
  });

  //! END @TODO1

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
