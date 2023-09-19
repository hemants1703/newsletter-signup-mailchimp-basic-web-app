//jshint esversion: 6

//  importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");  //  body-parser is used to parse the data got from the request of the user
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", function(req, res) {
    
    //  parsing the user's input post to the app
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    //  data object
    const data = {
        members: [
            {
                email_address:  email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/<UNIQUE_KEY>";

    const options = {
        method: "POST",
        auth: "hemant1:<API_KEY>"
    };

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`);
        } else {
            res.sendFile(`${__dirname}/failure.html`);
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    
    /**
     * This code below redirects the code back to the app.get("/", function() {});
     * the same code that starts the app.
     * 
     */

    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("server is running on port 3000");
});
