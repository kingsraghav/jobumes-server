var BasicAuth = require('basic-auth');

var Validator = require('../security/validator');
var utils = require('../models/utilities');
var errors = require('../security/errors');

var AdminService = require('../services/admin-service');
var RoleManagementService = require('../services/role-management-service');
var ProfileManagementService = require('../services/profile-management-service');
var RoleManagementService = require('../services/role-management-service');
var MailService = require('../services/mail-service');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
     user: 'aredgummi@gmail.com',
     pass:'redgummi123'
            // clientId: '163224009781-sl6let00gr7rkh2amiiuo1ov8hd62s6u.apps.googleusercontent.com',
            // clientSecret: 'Tk9na4aNwQW2TnSis1vq6TqE',
            // refreshToken: '1/Ag8OIJyjnLefihl43WGtWiaY-l8f_vkv9RkuJf-DwB4'
    }
})



//jshint unused:false
exports.mailSample = (req, res) => {
  return new Promise(
    (resolve, reject) => {
    var to  = req.body.to;
    var subject = req.body.subject;
    var text = req.body.text;
    console.log('text :: '+text);
  var mailOptions = {
      from: 'Admin<aredgummi@gmail.com>',
      to: ''+to,
      subject: ''+subject,
      text: ''+text
  }
  console.log('mailOptions :: %j',mailOptions);

  MailService.sendEmail(mailOptions)
  .then(result => {
    console.log('result :: %j',result);
    return res.status(200).send(result).end();
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err).end();
  });
  // Validator.isValidCredentials(req)
  // .then(result => {
  //   var params = {};
  //   params.period = (req.query.period === 'total') ? -1 : Number(req.query.period);
  //   params.moreInfo = (req.query.moreInfo === 'true') ? true : false;
  //   return AdminService.getAllJobsPosted(params);
  // })
  // .then(dto => { return res.status(200).send(dto).end(); })
  // .catch(err => {
  //   console.error('Err: %s', JSON.stringify(err));
  //   return res.status(err.code).send(err).end();
  // });
});
};


// Create an email template

exports.createMailTemplate = (req, res) => {
 "use strict";

 if (utils.isEmptyObj(req.body)) { return res.status(400).send(errors.emptyRequestBody).end(); }

 Validator.isValidCredentials(req)
 .then(result => { return ProfileManagementService.getProfileByAuthCredentials(req); })
 .then(userProfile =>{ return MailService.createMailTemplate(userProfile.uuid,req.body); })
 .then(createdTemplate => { return res.status(201).send(createdTemplate).end(); })
 .catch(err => {
   console.info('err: %j', err);
   return res.status(err.code).send(err).end();
 });
};

// Get All alerts by user
exports.listTemplates = (req, res) => {
  "use strict";

  Validator.isValidCredentials(req)
  .then(result => { return ProfileManagementService.getProfileByAuthCredentials(req); })
  .then(profile => { return MailService.listTemplates(profile.uuid); })
  .then(alerts => { return res.status('200').send(alerts); })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err);
  });
};

exports.editMailTemplate = (req, res) => {
 "use strict";

 if (utils.isEmptyObj(req.body)) { return res.status(400).send(errors.emptyRequestBody).end(); }

 Validator.isValidCredentials(req)
 .then(result => { return ProfileManagementService.getProfileByAuthCredentials(req); })
 .then(userProfile =>{ return MailService.editMailTemplate(userProfile.uuid,req.body); })
 .then(editedTemplate => { return res.status(201).send(editedTemplate).end(); })
 .catch(err => {
   console.info('err: %j', err);
   return res.status(err.code).send(err).end();
 });
};