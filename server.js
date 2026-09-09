const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.send("Kairos Backend Running");
});

app.get("/about", (req, res) => {
    res.send("Welcome to Kairos Faith Ministry Backend");
});

app.post("/contact", (req, res) => {

    if (req.body.website) {
        return res.status(400).json({
            success: false,
            message: "Spam submission blocked."
        });
    }

    console.log("New Contact Form Submission");
    console.log(req.body);

    res.json({
        success: true,
        message: "Thank you for contacting Kairos Faith Ministry International! "
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
