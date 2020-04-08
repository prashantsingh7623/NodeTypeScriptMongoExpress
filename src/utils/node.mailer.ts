import * as node_mailer from 'nodemailer';
import * as sendgrid_transport from 'nodemailer-sendgrid-transport'

export class NodeMailer {
    private static initializeTransport() {
        return node_mailer.createTransport(sendgrid_transport({
            auth: {
                api_key: 'enter your send grid API key here'
            }
        }))
    }

    static sendEmail(data: { to: [string], subject: string, text: string, html: string}): Promise<any> {
        return NodeMailer.initializeTransport().sendMail({
            from: 'prashant.singh@spit.ac.in',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html
        })
    }
}