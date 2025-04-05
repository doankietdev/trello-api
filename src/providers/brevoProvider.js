const brevo = require('@getbrevo/brevo')
const { BREVO } = require('~/configs/environment')

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = BREVO.API_KEY

const sendEmail = async (recipientEmail, subject, htmlContent) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.subject = subject
  sendSmtpEmail.sender = { email: BREVO.EMAIL_ADDRESS, name: BREVO.EMAIL_NAME }
  sendSmtpEmail.to = [{ email: recipientEmail }]
  sendSmtpEmail.htmlContent = htmlContent
  return await apiInstance.sendTransacEmail(sendSmtpEmail)
}

export default {
  sendEmail
}
