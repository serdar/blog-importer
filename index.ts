import fs, { write } from "node:fs";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import "dotenv/config";
import { connect } from "@planetscale/database";
import { Post, PostSchema } from "./posts";
import { z } from "zod";

const importFiles = () => {
   const dirPath = __dirname + "/import/";

   const fileList: string[] = fs.readdirSync(dirPath);

   const files = fileList.map((fileName) => {
      const filePath = dirPath + fileName;

      const file = fs.readFileSync(filePath);

      const parser = new XMLParser();
      const fileContents = parser.parse(file);

      return fileContents;
   });

   return files;
};

const insertRow = async (post: Post) => {
   const config = {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
   };

   const conn = connect(config);

   let sql: string = `insert into posts (title, description, pubDate, published, slug) values (?, ?, ?, ?, ?)`;

   const results = await conn.execute(sql, [
      post.title,
      post.content,
      post.pubDate,
      1,
      post.slug,
   ]);
};

const files = importFiles();

files.map((file) => {
   try {
      //Schema validation
      PostSchema.parse(file.post);

      //Inser row into db
      insertRow(file.post);
   } catch (error) {
      console.log(error);
   }
});
