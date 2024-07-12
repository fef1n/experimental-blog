import express from "express";
import bodyParser from "body-parser";
import * as fs from 'node:fs/promises'

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var pAuthorList = [];
var pTitleList = [];
var pContentList = [];
var filePath , fileContent;

app.get("/", (req,res) => {
    res.render("index.ejs", {
        authorList: pAuthorList,
        titleList: pTitleList, 
        contentList: pContentList   
    });
})

app.get("/create", (req,res) => {
    res.render("create.ejs", {
    });
})

app.post("/post", (req,res) => {
    res.render("post.ejs", {
        pTitle: req.body["title"],
        pAuthor: req.body["author"],
        pContent: req.body["content"],
        pFilePath: req.body["path"],
        pIndex: req.body["index"]
    });
})

app.post("/submit", (req, res) => {
    pAuthorList.push(req.body["author"]);
    pTitleList.push(req.body["title"]);
    pContentList.push(req.body["content"]);
    filePath = "views/posts/" + req.body["title"] + ".ejs";
    fileContent = 
    `<h1> <%= pTitle %> </h1>
    <h2>Author: <%= pAuthor %> </h2>
    <p><%= pContent %></p>`;
    fs.writeFile(filePath, fileContent, (err) => {      
       if (err) throw err;
       console.log('The file has been saved!');
     });
    filePath = "posts/" + req.body["title"] + ".ejs";
    let postIndex = pAuthorList.length - 1
    setTimeout(() => {
        res.render("post.ejs", {
            pAuthor: req.body["author"],
            pTitle: req.body["title"], 
            pContent: req.body["content"],
            pIndex: postIndex,
            pFilePath: filePath
        })
      }, "100");
    })

    app.post("/update", (req,res) => {
        let updateAuthor = pAuthorList[req.body["index"]];
        let updateTitle = pTitleList[req.body["index"]];
        console.log(updateAuthor + " " + updateTitle);
        res.render("update.ejs", {
           pAuthor: updateAuthor,
           pTitle: updateTitle
        })
    })
    app.post("/delete", (req,res) => {
        let deleteTitle = pTitleList[req.body["index"]];
        let deletePath = "views/posts/" + deleteTitle + ".ejs";
        delete pAuthorList[req.body["index"]];
        delete pTitleList[req.body["index"]];
        delete pContentList[req.body["index"]];
        fs.unlink(deletePath, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`File ${deleteTitle}.ejs was deleted.`);
            }
          });
          res.render("index.ejs");
    })

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})