// src/lib/services/emailService.ts
import { supabase } from '$lib/supabaseClient';
import type { EmailTemplate, EmailLog, Purchase, Kit } from '$lib/types/courses';

export class EmailService {
  // Send purchase confirmation email
  async sendPurchaseConfirmation(purchase: Purchase, kit: Kit, userEmail: string, userName: string) {
    try {
      // Get or create purchase confirmation template
      let template = await this.getEmailTemplate('purchase_confirmation');
      
      if (!template) {
        template = await this.createDefaultPurchaseTemplate();
      }

      // Replace template variables
      const subject = this.replaceVariables(template.subject, {
        kitName: kit.name,
        userName: userName
      });

      const htmlContent = this.replaceVariables(template.html_content, {
        kitName: kit.name,
        kitTheme: kit.theme,
        kitLevel: kit.level.toString(),
        userName: userName,
        purchaseDate: new Date(purchase.created_at).toLocaleDateString(),
        amount: purchase.amount === 0 ? 'FREE' : `$${purchase.amount}`,
        coursesUrl: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/courses`
      });

      const textContent = this.replaceVariables(template.text_content, {
        kitName: kit.name,
        kitTheme: kit.theme,
        kitLevel: kit.level.toString(),
        userName: userName,
        purchaseDate: new Date(purchase.created_at).toLocaleDateString(),
        amount: purchase.amount === 0 ? 'FREE' : `$${purchase.amount}`,
        coursesUrl: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/courses`
      });

      // Log the email
      await this.logEmail({
        user_id: purchase.user_id,
        template_id: template.id,
        to_email: userEmail,
        subject,
        content: htmlContent,
        status: 'pending'
      });

      // Send the email (integrate with your email provider)
      await this.sendEmail(userEmail, subject, htmlContent, textContent);

      return { success: true };
    } catch (error) {
      console.error('Failed to send purchase confirmation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Send kit code redemption confirmation
  async sendCodeRedemptionConfirmation(kit: Kit, userEmail: string, userName: string) {
    try {
      let template = await this.getEmailTemplate('code_redemption');
      
      if (!template) {
        template = await this.createDefaultCodeRedemptionTemplate();
      }

      const subject = this.replaceVariables(template.subject, {
        kitName: kit.name,
        userName: userName
      });

      const htmlContent = this.replaceVariables(template.html_content, {
        kitName: kit.name,
        kitTheme: kit.theme,
        kitLevel: kit.level.toString(),
        userName: userName,
        redemptionDate: new Date().toLocaleDateString(),
        coursesUrl: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/courses`
      });

      const textContent = this.replaceVariables(template.text_content, {
        kitName: kit.name,
        kitTheme: kit.theme,
        kitLevel: kit.level.toString(),
        userName: userName,
        redemptionDate: new Date().toLocaleDateString(),
        coursesUrl: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/courses`
      });

      // Send the email
      await this.sendEmail(userEmail, subject, htmlContent, textContent);

      return { success: true };
    } catch (error) {
      console.error('Failed to send code redemption confirmation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get email template by name
  async getEmailTemplate(name: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      console.error('Failed to get email template:', error);
      return null;
    }

    return data;
  }

  // Create default purchase confirmation template
  async createDefaultPurchaseTemplate(): Promise<EmailTemplate> {
    const template = {
      name: 'purchase_confirmation',
      subject: 'Welcome to {kitName} - Your Electrofun Kit is Ready!',
      html_content: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #012d58; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #012d58; color: white; text-decoration: none; border-radius: 6px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Electrofun!</h1>
            </div>
            <div class="content">
              <h2>Hi {userName},</h2>
              <p>Thank you for purchasing <strong>{kitName}</strong>! You now have access to all the courses and content for this kit.</p>
              
              <h3>Kit Details:</h3>
              <ul>
                <li><strong>Kit:</strong> {kitName}</li>
                <li><strong>Theme:</strong> {kitTheme}</li>
                <li><strong>Level:</strong> {kitLevel}</li>
                <li><strong>Purchase Date:</strong> {purchaseDate}</li>
                <li><strong>Amount:</strong> {amount}</li>
              </ul>
              
              <p>Ready to start learning? Click the button below to access your courses:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{coursesUrl}" class="button">Start Learning</a>
              </div>
              
              <p>Happy building! 🚀</p>
              <p>- The Electrofun Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Electrofun. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text_content: `
        Welcome to Electrofun!
        
        Hi {userName},
        
        Thank you for purchasing {kitName}! You now have access to all the courses and content for this kit.
        
        Kit Details:
        - Kit: {kitName}
        - Theme: {kitTheme}
        - Level: {kitLevel}
        - Purchase Date: {purchaseDate}
        - Amount: {amount}
        
        Ready to start learning? Visit: {coursesUrl}
        
        Happy building!
        - The Electrofun Team
        
        © 2024 Electrofun. All rights reserved.
      `,
      variables: ['kitName', 'kitTheme', 'kitLevel', 'userName', 'purchaseDate', 'amount', 'coursesUrl']
    };

    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create default code redemption template
  async createDefaultCodeRedemptionTemplate(): Promise<EmailTemplate> {
    const template = {
      name: 'code_redemption',
      subject: 'Kit Unlocked: {kitName} - Welcome to Electrofun!',
      html_content: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 6px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔓 Kit Unlocked!</h1>
            </div>
            <div class="content">
              <h2>Hi {userName},</h2>
              <p>Great news! You've successfully redeemed your code and unlocked <strong>{kitName}</strong>!</p>
              
              <h3>Kit Details:</h3>
              <ul>
                <li><strong>Kit:</strong> {kitName}</li>
                <li><strong>Theme:</strong> {kitTheme}</li>
                <li><strong>Level:</strong> {kitLevel}</li>
                <li><strong>Redemption Date:</strong> {redemptionDate}</li>
              </ul>
              
              <p>You now have full access to all courses and content for this kit. Ready to start learning?</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{coursesUrl}" class="button">Start Learning</a>
              </div>
              
              <p>Happy building! 🚀</p>
              <p>- The Electrofun Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Electrofun. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text_content: `
        Kit Unlocked!
        
        Hi {userName},
        
        Great news! You've successfully redeemed your code and unlocked {kitName}!
        
        Kit Details:
        - Kit: {kitName}
        - Theme: {kitTheme}
        - Level: {kitLevel}
        - Redemption Date: {redemptionDate}
        
        You now have full access to all courses and content for this kit.
        Ready to start learning? Visit: {coursesUrl}
        
        Happy building!
        - The Electrofun Team
        
        © 2024 Electrofun. All rights reserved.
      `,
      variables: ['kitName', 'kitTheme', 'kitLevel', 'userName', 'redemptionDate', 'coursesUrl']
    };

    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Replace variables in template
  private replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  }

  // Log email
  async logEmail(logData: Partial<EmailLog>): Promise<void> {
    const { error } = await supabase
      .from('email_logs')
      .insert(logData);

    if (error) {
      console.error('Failed to log email:', error);
    }
  }

  // Send email (integrate with your email provider)
  private async sendEmail(to: string, subject: string, htmlContent: string, textContent: string): Promise<void> {
    // TODO: Integrate with your email provider (SendGrid, AWS SES, etc.)
    // For now, just log the email
    console.log('Email would be sent:', {
      to,
      subject,
      htmlContent: htmlContent.substring(0, 100) + '...',
      textContent: textContent.substring(0, 100) + '...'
    });

    // Example integration with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to,
      from: 'noreply@electrofun.com',
      subject,
      text: textContent,
      html: htmlContent,
    };
    
    await sgMail.send(msg);
    */
  }
}

export const emailService = new EmailService(); 