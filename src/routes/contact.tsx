import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, json, useActionData, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { MailjetMailer } from '~/lib/mailjet';
import { TurnstileValidator } from '~/lib/turnstile';

export const loader = ({ context }: LoaderFunctionArgs) => {
  return {
    CLOUDFLARE_TURNSTILE_KEY: context.cloudflare.env.CLOUDFLARE_TURNSTILE_KEY,
  };
};

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

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const form = await request.formData();
  const data = Object.fromEntries(form) as Schema;

  try {
    schema.parse(data);
  } catch {
    return json({ success: false }, { status: 400 });
  }

  const ip = request.headers.get('cf-connecting-ip')!;
  const validator = TurnstileValidator.fromContext(context).setIp(ip);
  if (!(await validator.validate(form.get('cf-turnstile-response')?.toString()))) {
    return json({ success: false }, { status: 403 });
  }

  const location = `${context.cloudflare.cf.city ? `${context.cloudflare.cf.city}, ` : ''}${
    context.cloudflare.cf.region ? `${context.cloudflare.cf.region}, ` : ''
  }${context.cloudflare.cf.country || 'Unknown'}`;

  const mailer = MailjetMailer.fromContext(context);
  mailer.setSender({ email: 'noreply@wouterds.be' });
  mailer.setReceiver({ name: 'Wouter De Schuyter', email: 'wouter.de.schuyter@gmail.com' });
  mailer.setSubject(`[Contact] New message from ${data.name}!`);
  mailer.setTextMessage(
    `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}\n\n--\nIP: ${ip}, location: ${location}`,
  );
  mailer.setHTMLMessage(
    `<p><strong>Name:</strong> ${data.name}<br /><strong>Email:</strong> ${
      data.email
    }<br /><strong>Message:</strong></p><p>${data.message.replace(
      /\n/g,
      '<br />',
    )}</p><hr /><p><strong>IP:</strong> ${ip}, <strong>location:</strong> ${location}</p>`,
  );

  if (await mailer.send()) {
    return json({ success: true });
  }

  return json({ success: false }, { status: 500 });
};

export default function Contact() {
  const { CLOUDFLARE_TURNSTILE_KEY } = useLoaderData<typeof loader>();
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
      <p className="text-emerald-700 dark:text-emerald-400">
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
          <p className="text-rose-600 dark:text-rose-400 mt-2 mb-4">
            Something went wrong, please try again later.
          </p>
        )}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={errors.name ? 'border-rose-600 dark:border-rose-400' : undefined}
            />
            {errors.name?.message && (
              <p className="text-rose-600 dark:text-rose-400 mt-1.5">
                {errors.name?.message as string}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email')}
              className={errors.email ? 'border-rose-600 dark:border-rose-400' : undefined}
            />
            {errors.email?.message && (
              <p className="text-rose-600 dark:text-rose-400 mt-1.5">
                {errors.email?.message as string}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="font-semibold inline-block mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            {...register('message')}
            className={errors.message ? 'border-rose-600 dark:border-rose-400' : undefined}
          />
          {errors.message?.message && (
            <p className="text-rose-600 dark:text-rose-400 mt-1.5">
              {errors.message?.message as string}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <button type="submit">Submit</button>
          </div>
          <div>
            <Turnstile siteKey={CLOUDFLARE_TURNSTILE_KEY} />
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
