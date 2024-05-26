import { AppLoadContext } from '@remix-run/cloudflare';

type Contact = {
  name?: string;
  email: string;
};

export class MailjetMailer {
  private _context: AppLoadContext;
  private _sender?: Contact;
  private _replyTo?: Contact;
  private _receiver?: Contact;
  private _subject?: string;
  private _textMessage?: string;
  private _htmlMessage?: string;

  public constructor(context: AppLoadContext) {
    this._context = context;
  }

  public static create(context: AppLoadContext) {
    return new MailjetMailer(context);
  }

  private get apiKey() {
    return this._context.cloudflare.env.MAILJET_API_KEY;
  }

  private get apiSecret() {
    return this._context.cloudflare.env.MAILJET_API_SECRET;
  }

  private get auth() {
    return btoa(`${this.apiKey}:${this.apiSecret}`);
  }

  public setSender(sender: Contact) {
    this._sender = sender;

    return this;
  }

  private get sender() {
    if (!this._sender) {
      throw new Error('Sender is missing');
    }

    return { Email: this._sender.email, Name: this._sender.name };
  }

  public setReceiver(receiver: Contact) {
    this._receiver = receiver;

    return this;
  }

  private get receiver() {
    if (!this._receiver) {
      throw new Error('Receiver is missing');
    }

    return { Email: this._receiver.email, Name: this._receiver.name };
  }

  public setReplyTo(replyTo: Contact) {
    this._replyTo = replyTo;

    return this;
  }

  private get replyTo() {
    if (this._replyTo) {
      return { Email: this._replyTo.email, Name: this._replyTo.name };
    }

    return this._sender;
  }

  public setSubject(subject: string) {
    this._subject = subject;

    return this;
  }

  private get subject() {
    if (!this._subject) {
      throw new Error('Subject is missing');
    }

    return this._subject;
  }

  public setTextMessage(textPart: string) {
    this._textMessage = textPart;

    return this;
  }

  private get textMessage() {
    if (!this._textMessage) {
      throw new Error('TextPart is missing');
    }

    return this._textMessage + '\n\r';
  }

  public setHTMLMessage(htmlPart: string) {
    this._htmlMessage = htmlPart;

    return this;
  }

  private get htmlMessage() {
    return this._htmlMessage;
  }

  public async send() {
    try {
      const response = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
        body: JSON.stringify({
          Messages: [
            {
              From: this.sender,
              To: [this.receiver],
              ReplyTo: this.replyTo,
              Subject: this.subject,
              TextPart: this.textMessage,
              HTMLPart: this.htmlMessage,
            },
          ],
        }),
      });

      if (response.ok) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
