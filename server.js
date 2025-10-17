require("dotenv").config();
const express = require('express')
const nodemailer = require('nodemailer')
const axios = require("axios"); // ✅ Added for CAPTCHA verification
// const cors = require('cors');

const app = express()
const port = 8050

app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views");
});

// var corsOptions = {
//     origin: 'http://localhost:8050',
// }

// app.use(cors(corsOptions));

// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.post("/sendmail", (req, res) => {
    // ✅ STEP 1: Get CAPTCHA token from frontend
    const token = req.body["cf-turnstile-response"];

    if (!token) {
        return res.status(400).send("Missing Turnstile token.");
    }

    try {
        // ✅ STEP 2: Verify CAPTCHA token with Cloudflare
        const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        const secret = process.env.TURNSTILE_SECRET; // put this in your .env

        const verifyResponse = axios.post(
            verifyUrl,
            new URLSearchParams({
                secret: secret,
                response: token,
                remoteip: req.ip, // optional
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const data = verifyResponse.data;

        if (!data.success) {
            console.error("Turnstile failed:", data["error-codes"]);
            return res.status(403).send("Turnstile verification failed.");
        }


        // ✅ STEP 3: CAPTCHA passed → send the email
        var transporter = nodemailer.createTransport({
            host: process.env.host,
            port: process.env.hostport,
            secure: true,
            auth: {
                user: process.env.user,
                pass: process.env.pass,
            },
        });

        var mailOptions = {
            // send mail with defined transport object
            from: process.env.from, // sender address
            to: process.env.to, // list of receivers
            subject: `Contact Form Trackscope`, // Subject line
            html: `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="box-sizing: border-box;">
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <style>
        @media (max-width:625px) {
          .desktop_hide table.icons-inner {
            display: inline-block !important;
          }
        
          .icons-inner {
            text-align: center;
          }
        
          .icons-inner td {
            margin: 0 auto;
          }
        
          .mobile_hide {
            display: none;
          }
        
          .row-content {
            width: 100% !important;
          }
        
          .stack .column {
            width: 100%;
            display: block;
          }
        
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }
        
          .desktop_hide,
        .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
        </style>
        </head>
        
        <body style="box-sizing: border-box; background-color: #ffffff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" bgcolor="#ffffff">
                <tbody style="box-sizing: border-box;">
                    <tr style="box-sizing: border-box;">
                        <td style="box-sizing: border-box;">
                            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody style="box-sizing: border-box;">
                                    <tr style="box-sizing: border-box;">
                                        <td style="box-sizing: border-box;">
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 605.00px; margin: 0 auto;" width="605.00">
                                                <tbody style="box-sizing: border-box;">
                                                    <tr style="box-sizing: border-box;">
                                                        <td class="column column-1" width="100%" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 5px; padding-right: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" align="left" valign="top">
                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr style="box-sizing: border-box;">
                                                                    <td class="pad" style="box-sizing: border-box; width: 100%;" width="100%">
                                                                        <div class="alignment" align="center" style="box-sizing: border-box; line-height: 10px;">
                                                                            <div style="box-sizing: border-box; max-width: 595px;"><img src="http://103.211.239.62/trackscopecompro/views/assets/images/logo.png" style="box-sizing: border-box; display: block; height: auto; border: 0; width: 100%;" width="595" alt="I'm an image" title="logo"></div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr style="box-sizing: border-box;">
                                                                    <td class="pad" style="box-sizing: border-box;">
                                                                        <div style="box-sizing: border-box; font-family: sans-serif;">
                                                                            <div class="" style="box-sizing: border-box; font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-size: 18px; text-align: left; mso-line-height-alt: 19.2px;"><strong style="box-sizing: border-box;">You've received a new message!</strong></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr style="box-sizing: border-box;">
                                                                    <td class="pad" style="box-sizing: border-box;">
                                                                        <div class="alignment" align="center" style="box-sizing: border-box;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                <tr style="box-sizing: border-box;">
                                                                                    <td class="divider_inner" style="box-sizing: border-box; font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;"><span style="box-sizing: border-box;">&#8202;</span></td>
                                                                                </tr>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <table class="text_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr style="box-sizing: border-box;">
                                                                    <td class="pad" style="box-sizing: border-box;">
                                                                        <div style="box-sizing: border-box; font-family: sans-serif;">
                                                                            <div class="" style="box-sizing: border-box; font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                                                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-size: 16px; mso-line-height-alt: 14.399999999999999px; letter-spacing: normal;">From: ${req.body.email}</p>
                                                                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-size: 16px; mso-line-height-alt: 14.399999999999999px; letter-spacing: normal;">Name: ${req.body.name}</p>
                                                                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-size: 16px; mso-line-height-alt: 14.399999999999999px; letter-spacing: normal;">&nbsp;</p>
                                                                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-size: 16px; mso-line-height-alt: 14.399999999999999px; letter-spacing: normal;">${req.body.message}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" bgcolor="#ffffff">
                                <tbody style="box-sizing: border-box;">
                                    <tr style="box-sizing: border-box;">
                                        <td style="box-sizing: border-box;">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        
        </html>`, // plain text body
        };

        transporter.sendMail(mailOptions, (error, responose) => {
            if (error) {
                res.send("error");
            } else {
                res.send("success");
            }
        });
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).send("Verification or mail sending failed.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}...`);
})