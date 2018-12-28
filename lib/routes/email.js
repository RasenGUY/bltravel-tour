const nodemailer = require('nodemailer'),
mongoose         = require("mongoose"),
bodyParser       = require("body-parser"),
{google}         = require('googleapis'),
express          = require("express"),
Tour             = require('../models/tour'),
User             = require('../models/user'),
router           = express.Router();

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  // client ID
  '517994342314-2s6sef0paro85eioqerbjm1irrh56gkq.apps.googleusercontent.com',
  // secret key
  '-9EaW3DtaEyPo_hFGggffDE9',
  // refreshToken
  '1/8If60A4ncscJ-VGbSqyCrn68eTEos66Z2k10t1wbdT8'
);
oauth2Client.setCredentials({
  refresh_token: "1/8If60A4ncscJ-VGbSqyCrn68eTEos66Z2k10t1wbdT8"
});

// pageInfo
let page = {
  title: "",
}
let accessToken = ""
async function getAccess() {
  const tokens = await oauth2Client.getAccessToken()
  accessToken = tokens.token
}

// POST ROUTE for email form of contact page
router.post("/contact", (req, res) => {

  const outputToBlt = `
  <h1> You have received a new message from a new client: ${req.body.name} with the email: ${req.body.email}<h1>

  <p>${req.body.messagebody}<p>

  <p> Please take contact with the client <p>`
  const outputToClient= `
  <h1> Thank you ${req.body.name}, </h1>
  <p> we have received your message succesfully, we will respond to your message as soon as one of our staff picks it up </p>

  <p>Thank you for choosing BL Travel & Tour Co., Ltd.</p>
  `
  console.log(outputToBlt);
  getAccess().catch(console.error);
  const smtpTransport = nodemailer.createTransport({
       service: "gmail",
       auth: {
            type: "OAuth2",
            user: "bltraveltour@gmail.com",
            clientId: "517994342314-2s6sef0paro85eioqerbjm1irrh56gkq.apps.googleusercontent.com",
            clientSecret: "-9EaW3DtaEyPo_hFGggffDE9",
            refreshToken: "1/8If60A4ncscJ-VGbSqyCrn68eTEos66Z2k10t1wbdT8",
            accessToken: accessToken
       }
  });
  const toClient = {
       from: '"BL Travel & Tour Co., Ltd (Noreply)" <bltraveltour@gmail.com>',
       to: req.body.email,
       subject: "We have received your message",
       generateTextFromHTML: true,
       html: outputToClient
  };
  const toBlt = {
        from: '"BL Travel & Tour Co., Ltd (Bot Mailer)" <bltraveltour@gmail.com>',
        to: "bltraveltour@gmail.com",
        subject: req.body.messageHeader,
        generateTextFromHTML: true,
        html: outputToBlt
  }
  smtpTransport.sendMail(toClient, (error, response) => {
        if(error){
          error = error;
          res.redirect("/register/error");
        } else {
          console.log(response);
          res.redirect("/register/success");
          smtpTransport.close();
        }
  })
  smtpTransport.sendMail(toBlt, (error, response) => {
        if(error){
          error = error;
          res.redirect("/register/error");
        } else {
          console.log(response);
          res.redirect("/register/success");
          smtpTransport.close();
        }
  })
})

// POST ROUTE for the form on the REGISTER page
router.post("/tours/:id/register", (req, res) => {
  Tour.findById(req.params.id, (err, tour) => {
    if (err){
      console.log(err)
    } else {
      query = tour;

      const outputToClient = `
        <p>Thank you ${req.body.firstN}, <p>

        <p> We have received your registration for the <strong>${tour.title}</strong> tour. </p>

        <p> We will go ahead now and process your information. <p>
        <p> Keep an eye on your email, we will contact you in the next 24 hours for finalizing your registration. <p>

        <p>Thank you for choosing BL Travel & Tour Co., Ltd.<p>
      `;
      const outputToBlt = `
      <h3>Travel Details</h3>
      <p>Period of travel: <b>${new Date(req.body.startD)}</b> - <b>${new Date(req.body.endD)}</b></p>
      <p>Amount of travelers: <b>${req.body.travelAmount}</b></p>

      <h3>Information Of Traveler for the ${tour.title} tour </h3>
      <p>First Name: <b>${req.body.firstN}</b> |   Last Name: <b>${req.body.lastN}</b></p>
      <p>Email: <b>${req.body.formEmail}</b></p>
      <p>Adress 1: <b>${req.body.adress1}</b></p>
      <p>Adress 2: <b>${req.body.adress2}</b></p>
      <p>City: <b>${req.body.city}</b> |   State/Province/Region: <b>${req.body.state}</b></p>
      <p>ZIP/Postal Code: <b>${req.body.czip}</b> |  Country: <b>${req.body.country}</b></p>
      <p>Cell Number: <b>${req.body.cellNumber}</b></p>
      <p>Home Number: <b>${req.body.homeNumber}</b></p>

      <h3>Passport Information</h3>
      <p>Passport Number: <b>${req.body.passportNumber}</b></p>
      <p>Place of Issue: <b>${req.body.placeOfIssue}</b></p>
      <p>Birth PLace: <b>${req.body.birthPlace}</b></p>
      <p>Issue Date: <b>${req.body.issueDate}</b></p>
      <p>Expiry Date: <b>${req.body.expiryDate}</b></p>
      <p>Citizenship: <b>${req.body.citizenship}</b>  </p>
      `;

      getAccess().catch(console.error);
      const smtpTransport = nodemailer.createTransport({
           service: "gmail",
           auth: {
                type: "OAuth2",
                user: "bltraveltour@gmail.com",
                clientId: "517994342314-2s6sef0paro85eioqerbjm1irrh56gkq.apps.googleusercontent.com",
                clientSecret: "-9EaW3DtaEyPo_hFGggffDE9",
                refreshToken: "1/8If60A4ncscJ-VGbSqyCrn68eTEos66Z2k10t1wbdT8",
                accessToken: accessToken
           }
      });
      const toClient = {
           from: '"BL Travel & Tour Co., Ltd (Noreply)" <bltraveltour@gmail.com>',
           to: req.body.formEmail,
           subject: "Registration BL Travel & Tour Co., Ltd.",
           generateTextFromHTML: true,
           html: outputToClient
      };
      const toBlt = {
            from: '"BL Travel & Tour Co., Ltd" <bltraveltour@gmail.com>',
            to: "bltraveltour@gmail.com",
            subject: "YOU HAVE A NEW COSTUMER",
            generateTextFromHTML: true,
            html: outputToBlt
      }

      smtpTransport.sendMail(toClient, (error, response) => {
            if(error){
              error = error;
              res.redirect("/register/error");
            } else {
              console.log(response);
              res.redirect("/register/success");
              smtpTransport.close();
            }
      })
      smtpTransport.sendMail(toBlt, (error, response) => {
            if(error){
              error = error;
              res.redirect("/register/error");
            } else {
              console.log(response);
              res.redirect("/register/success");
              smtpTransport.close();
            }
      })
    }
  });
});

// GET ROUTE for SUCCES after submitting registration
router.get("/register/success", (req, res) => {
  const msg = "Your Registration has been received successfully";
  page.title = "Message Send Success"
  res.render("success", {msg: msg, page: page});
});

// GET ROUTE for ERROR  after submitting registration
router.get("/register/error", (req, res) => {
  page.title = "Message Send Error"
  const error = "An Error has occured, try resending the message/registration";
  res.render("error", {error: error, page: page});
});

module.exports = router;
