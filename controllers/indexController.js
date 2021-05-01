// // require moudels
const nodemailer = require("nodemailer");
// require app files
const newsletterModel = require('../models/newsletter');


// Export all moudels
module.exports = {

    // handle get request for index
    index: (req, res) => res.render('index'),

    // handle get request for dashborad
    dashboard: (req, res) => res.render('dashboard', { user: req.user }),

    //handle post request for newsletter
    newsletter: (req, res) => {
        if (!req.body.email) {
            req.flash('error_msg', 'Enter email first');
            res.redirect('/');
        }
        newsletterModel.findOne({ email: req.body.email }).then(user => {
            if (user) {
                console.log('hai phly')
                req.flash('error_msg', 'You have already subscribed');
                res.redirect('/');
            } else {
                const newsltr = new newsletterModel({
                    email: req.body.email
                });
                newsltr.save(err => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(newsltr);
                        var smtpTransport = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            service: 'gmail',
                            auth: {
                                user: 'nodestore.1100@gmail.com',
                                pass: 'malik.123'
                            }
                        });
                        var mailOptions = {
                            to: newsltr.email,
                            from: '"Idio Fashion" <nodestore.1100@gmail.com>',
                            subject: 'Newsletter Subscribtion',
                            text:
                                'Dear Coustomer, Thanks for your subscription. \n' +
                                'Now you can received monthly promotions and updated from Idio fashion '
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            console.log('Newsletter Email send');
                            req.flash('success_msg', 'Thanks For Your Subscrtion');
                            res.redirect('/');
                        });

                    }
                });
            }
        });
    },

    contact: (req, res) => {
        res.render('contact', { user: req.user });
    },

    //handle requet for contact form
    sendContact: (req, res) => {
        var name = req.body.name;
        var email = req.body.email;
        var subject = req.body.subject;
        var enquiry = req.body.message;
        var emailMessage = `Hi Admin  ${name},\n\nContact You.\n\nCustomer email is: ${email}.\n\nCustomer enquiry is: ${enquiry}\n.`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nodestore.1100@gmail.com',
                pass: 'malik.123'
            }
        });

        var emailOptions = {
            from: '"Idio Fashion" <nodestore.1100@gmail.com>',
            to: email,
            to: 'Abubakarzoomii@gmail.com',
            cc: 'nodestore.1100@gmail.com',
            subject: subject,
            text: emailMessage
        };

        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                console.log(error);
                req.flash('error_msg', 'There are some probelm to Contact');
                res.redirect('/contact');
            } else {
                console.log('Message Sent: ' + info.response);
                console.log('Email Message: ' + emailMessage);
                req.flash('success_msg', 'Thanks for your contact, We will repond you soon !')
                res.redirect('/contact');
            }
        });
    },

    //get product pages
    mshirt: (req, res) => res.render('men_shirt', { user: req.user }),
    mjean: (req, res) => res.render('men_jean', { user: req.user }),
    mshoes: (req, res) => res.render('men_shoes', { user: req.user }),
    maccess: (req, res) => res.render('men_accessry', { user: req.user }),
    wfabric: (req, res) => res.render('women_fabric', { user: req.user }),
    wjewelry: (req, res) => res.render('women_jewelry', { user: req.user }),
    wshoes: (req, res) => res.render('women_shoes', { user: req.user }),
    waccess: (req, res) => res.render('women_accessry', { user: req.user }),
    koutwear: (req, res) => res.render('kid_outwear', { user: req.user }),
    ktoy: (req, res) => res.render('kid_toys', { user: req.user }),
    kshoes: (req, res) => res.render('kid_shoes', { user: req.user }),
    kaccess: (req, res) => res.render('kid_accessry', { user: req.user }),

    // get single product page
    singleproduct: (req, res) => res.render('single_product', { user: req.user }),



}
