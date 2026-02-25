const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const { getAdminNotificationTemplate, getUserAutoReplyTemplate } = require('./emailTemplates');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig.smtp);
    this.churchInfo = emailConfig.church;
    this.notificationEmails = emailConfig.notificationEmails;
  }

  // Envoyer un email
  async sendEmail(to, subject, html, from = this.churchInfo.email) {
    try {
      const mailOptions = {
        from: `"${this.churchInfo.name}" <${from}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Envoyer les notifications pour un nouveau message
  async sendNewMessageNotifications(formData, language = 'fr') {
    try {
      const results = [];
      
      // 1. Envoyer la notification aux administrateurs
      const adminTemplate = getAdminNotificationTemplate(formData, language);
      const adminResult = await this.sendEmail(
        this.notificationEmails,
        adminTemplate.subject,
        adminTemplate.html
      );
      results.push({ type: 'admin', ...adminResult });

      // 2. Envoyer la réponse automatique à l'utilisateur
      const userTemplate = getUserAutoReplyTemplate(formData, language);
      const userResult = await this.sendEmail(
        formData.email,
        userTemplate.subject,
        userTemplate.html
      );
      results.push({ type: 'user', ...userResult });

      return { success: true, results };
    } catch (error) {
      console.error('Error sending notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Vérifier la connexion SMTP
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  }
}

// Exporter une instance unique
const emailService = new EmailService();
module.exports = emailService;