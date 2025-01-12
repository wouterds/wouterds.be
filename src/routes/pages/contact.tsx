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
  mailer.setSender({ email: 'noreply@wouterds.be' });
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
    )}</p><hr /><p><strong>IP:</strong> ${ip}, <strong>location:</strong> ${location}</p>`,
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
        possible (goal, timeline, budget, ...). For everything else, write as you please, I&apos;ll
        be more than happy to reply!
      </p>
      <Form
        className="flex flex-col gap-4 mt-6"
        action="/contact"
        method="post"
        onSubmit={isValid ? undefined : handleSubmit(() => {})}>
        {data?.success === false && (
          <p className="text-rose-600 mt-2 mb-4">Something went wrong, please try again later.</p>
        )}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="name">
              name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={errors.name ? 'border-rose-600' : undefined}
            />
            {errors.name?.message && (
              <p className="text-rose-600 mt-1.5">{errors.name?.message as string}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="email">
              email
            </label>
            <input
              type="text"
              id="email"
              {...register('email')}
              className={errors.email ? 'border-rose-600' : undefined}
            />
            {errors.email?.message && (
              <p className="text-rose-600 mt-1.5">{errors.email?.message as string}</p>
            )}
          </div>
        </div>
        <div>
          <label className="font-semibold inline-block mb-1" htmlFor="message">
            message
          </label>
          <textarea
            id="message"
            {...register('message')}
            className={errors.message ? 'border-rose-600' : undefined}
          />
          {errors.message?.message && (
            <p className="text-rose-600 mt-1.5">{errors.message?.message as string}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <button
              type="submit"
              className="relative leading-none flex items-center justify-center group font-medium bg-gray-50 hover:bg-gray-100">
              <span className="text-xl relative left-0" style={{ bottom: -3 }}>
                &#8990;
              </span>
              <span
                className="text-xl absolute left-0 hidden group-hover:inline-block"
                style={{ top: -4 }}>
                &#8988;
              </span>
              <span>submit</span>
              <span className="text-xl relative" style={{ top: -4, right: 1 }}>
                &#8989;
              </span>
              <span
                className="text-xl absolute hidden group-hover:inline-block"
                style={{ bottom: -3, right: 1 }}>
                &#8991;
              </span>
            </button>
          </div>
          <div>
            <Turnstile siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_KEY} />
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
