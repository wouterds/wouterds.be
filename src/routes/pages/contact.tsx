import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { byInternet as lookupCountryByCode } from 'country-code-lookup';
import { StatusCodes } from 'http-status-codes';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  type ActionFunctionArgs,
  data,
  Form,
  type MetaFunction,
  useActionData,
} from 'react-router';
import * as z from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { CloudflareTurnstileValidator } from '~/lib/cloudflare.server';
import { MailjetMailer } from '~/lib/mailjet.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Contact' },
    {
      name: 'description',
      content:
        "If you're writing for a project or to work together, please include as much details as possible. For everything else, write as you please, I'll be more than happy to reply!",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formData = Object.fromEntries(form) as Schema;

  try {
    schema.parse(formData);
  } catch {
    return data({ success: false }, { status: StatusCodes.BAD_REQUEST });
  }

  const ip = request.headers.get('cf-connecting-ip')!;
  const location = lookupCountryByCode(request.headers.get('cf-ipcountry')!)?.country || 'Unknown';
  const response = form.get('cf-turnstile-response')?.toString();

  if (!(await CloudflareTurnstileValidator.validate(ip, response))) {
    return data({ success: false }, { status: StatusCodes.FORBIDDEN });
  }

  const mailer = new MailjetMailer();
  mailer.setSender({ email: 'noreply@wouterds.com' });
  mailer.setReplyTo({ name: formData.name, email: formData.email });
  mailer.setReceiver({ name: 'Wouter De Schuyter', email: 'wouter.de.schuyter@gmail.com' });
  mailer.setSubject(`[Contact] New message from ${formData.name}!`);
  mailer.setTextMessage(
    `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}\n\n--\nIP: ${ip}, location: ${location}`,
  );
  mailer.setHTMLMessage(
    `<p><strong>Name:</strong> ${formData.name}<br /><strong>Email:</strong> ${
      formData.email
    }<br /><strong>Message:</strong></p><p>${formData.message.replace(
      /\n/g,
      '<br />',
    )}</p>--<p><strong>IP:</strong> ${ip}, <strong>location:</strong> ${location}</p>`,
  );

  if (await mailer.send()) {
    return data({ success: true });
  }

  return data({ success: false }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
};

export default function Contact() {
  const data = useActionData<typeof action>();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data?.success) reset();
  }, [reset, data?.success]);

  if (data?.success) {
    return (
      <p className="text-emerald-700">
        Your message has been sent, I&apos;ll get back to you as soon as possible!
      </p>
    );
  }

  return (
    <>
      <p className="mb-4">
        If you&apos;re writing for a project or to work together, please include as much details as
        possible (goal, timeline, budget, ..). For everything else, write as you please!
      </p>
      <Form
        className="flex flex-col gap-4 mt-6"
        action="/contact"
        method="post"
        onSubmit={isValid ? undefined : handleSubmit(() => {})}>
        {data?.success === false && (
          <p className="text-rose-600 text-sm mt-2 mb-4">
            Something went wrong, please try again later.
          </p>
        )}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <Label htmlFor="name">
              Name <span className="text-slate-600">*</span>
            </Label>
            <Input type="text" id="name" {...register('name')} />
            {errors.name?.message && (
              <p className="text-rose-600 text-sm mt-1.5">{errors.name?.message as string}</p>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="email">
              Email <span className="text-slate-600">*</span>
            </Label>
            <Input type="text" id="email" {...register('email')} />
            {errors.email?.message && (
              <p className="text-rose-600 text-sm mt-1.5">{errors.email?.message as string}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="message">
            Message <span className="text-slate-600">*</span>
          </Label>
          <Textarea id="message" {...register('message')} />
          {errors.message?.message && (
            <p className="text-rose-600 text-sm mt-1.5">{errors.message?.message as string}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <Button type="submit">Send message</Button>
          </div>
          <div>
            <Turnstile
              siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_KEY}
              options={{ theme: 'light' }}
            />
          </div>
        </div>
      </Form>
    </>
  );
}

const schema = z.object({
  name: z.string().min(8, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(48, { message: 'Oops, it seems your message is rather short.' }),
});

type Schema = z.infer<typeof schema>;
