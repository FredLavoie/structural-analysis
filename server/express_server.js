/******************************************** REQUIRED PACKAGES / PORT ***********************************************/
/*********************************************************************************************************************/
import express, { json, urlencoded, static as staticMiddleware } from "express";
const app = express();
import { readFile, writeFile } from "fs";
import { execFile } from "child_process";
const PORT = process.env.PORT || 8080; // default port 8080
import { validateForm } from "./lib/validate-form-server.js";
import { createInputObject } from "./lib/create-input-object.js";
import { createInputString } from "./lib/create-input-string.js";

/*********************************************** SET / USE / LISTEN **************************************************/
/*********************************************************************************************************************/

app.set("view engine", "ejs");
app.set("views", "public/views");

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(staticMiddleware("public"));
app.use(staticMiddleware("program"));

app.listen(PORT, () => {
    console.log(`structural_analysis app listening on port ${PORT}`);
});

/************************************************** GET REQUEST ******************************************************/
/*********************************************************************************************************************/

app.get("/", (req, res) => {
    console.log("rendering index.ejs");
    res.render("index");
});

app.get("/documentation", (req, res) => {
    console.log("rendering documentation.ejs");
    res.render("documentation");
});

app.get("/error-exec", (req, res) => {
    console.error("There was an error parsing the data in the output JSON file");
    res.render("error-exec");
});

app.get("/results-json", (req, res) => {
    readFile("program/data_out.json", "utf-8", (error, data) => {
        if (error) {
            console.error("There was an error reading the output JSON file");
            console.error(error);
            res.render("error-exec");
            return;
        }
        try {
            const parsedData = JSON.parse(data);
            res.send(parsedData);
        } catch (error) {
            res.status(500);
        }
    });
});

/************************************************* POST REQUEST ******************************************************/
/*********************************************************************************************************************/

app.post("/results", (req, res) => {
    const validForm = validateForm(req.body);

    if (validForm.valid === false) {
        res.render("error-input", validForm);
        return;
    }

    const inputObject = createInputObject(req.body);
    const dataString = createInputString(inputObject);

    // code to write to the input file
    writeFile("program/data_in.txt", dataString, (error) => {
        if (error) {
            console.error("There was an error writing the input file");
            console.error(error);
            res.render("error-write");
            return;
        }
        // code to run executable, then render 'results' page
        execFile("program/sa-linux-exec", (error) => {
            if (error) {
                console.error("There was an error running the executable");
                console.error(error);
                res.render("error-exec");
                return;
            }
            console.log("rendering results.ejs");
            res.render("results");
        });
    });
});
