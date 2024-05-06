import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { getName as getCountryName } from 'country-list';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(8, { message: 'Please enter your full name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(48, {
    message:
      'Oops, it seems your message is rather short. To better understand your needs, please provide a more detailed message. Feel free to include as much details as possible!',
  }),
});

type Schema = z.infer<typeof schema>;

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

export const action = async ({ request, response, context }: ActionFunctionArgs) => {
  const form = await request.formData();
  const ip = request.headers.get('CF-Connecting-IP') as string;
  const country = request.headers.get('CF-IPCountry') as string;
  const data = Object.fromEntries(form) as Schema;

  try {
    schema.parse(data);
  } catch {
    response!.status = 400;
    return { success: false };
  }

  const token = form.get('cf-turnstile-response')?.toString();
  const payload = new FormData();
  payload.append('secret', context.cloudflare.env.CLOUDFLARE_TURNSTILE_SECRET);
  payload.append('response', token!);
  payload.append('remoteip', ip);

  const { success: validatedCaptcha } = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      body: payload,
      method: 'POST',
    },
  ).then((response) => response.json<{ success: boolean }>());

  if (!validatedCaptcha) {
    response!.status = 403;
    return { success: false };
  }

  try {
    let TextPart = '';
    TextPart += `Name: ${data.name}\n`;
    TextPart += `Email: ${data.email}\n`;
    TextPart += `Message: ${data.message}\n\n`;
    TextPart += `--\n`;
    TextPart += `IP: ${ip || 'unknown'}, location: ${
      country ? getCountryName(country) : 'unknown' || country
    }\n`;

    let HTMLPart = '';
    HTMLPart += `<p>`;
    HTMLPart += `<strong>Name:</strong> ${data.name}<br />`;
    HTMLPart += `<strong>Email:</strong> ${data.email}<br />`;
    HTMLPart += `<strong>Message:</strong>`;
    HTMLPart += `</p>`;
    HTMLPart += `<p>${data.message.replace(/\n/g, '<br />')}</p>`;
    HTMLPart += `<hr />`;
    HTMLPart += `<p><strong>IP:</strong> ${ip || 'unknown'}, <strong>location:</strong> ${
      country ? getCountryName(country) : 'unknown' || country
    }</p>`;

    const { ok: mailSent } = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(
          `${context.cloudflare.env.MAILJET_API_KEY}:${context.cloudflare.env.MAILJET_API_SECRET}`,
        )}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: 'noreply@wouterds.be' },
            To: [{ Email: 'wouter.de.schuyter@gmail.com', Name: 'Wouter De Schuyter' }],
            ReplyTo: { Email: data.email, Name: data.name },
            Subject: `[Contact] New message from ${data.name}!`,
            TextPart,
            HTMLPart,
          },
        ],
      }),
    });

    if (!mailSent) {
      response!.status = 500;
      return { success: false };
    }

    return { success: true };
  } catch {
    response!.status = 500;
    return { success: false };
  }
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
    if (data?.success) {
      reset();
    }
  }, [reset, data?.success]);

  if (data?.success) {
    return (
      <p className="text-green-700 dark:text-green-400">
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
        onSubmit={isValid ? undefined : handleSubmit((data) => console.log(data))}>
        {data?.success === false && (
          <p className="text-red-600 dark:text-red-400 mt-2 mb-4">
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
              className={errors.name ? 'border-red-600 dark:border-red-400' : undefined}
            />
            {errors.name?.message && (
              <p className="text-red-600 dark:text-red-400 mt-1.5">
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
              className={errors.email ? 'border-red-600 dark:border-red-400' : undefined}
            />
            {errors.email?.message && (
              <p className="text-red-600 dark:text-red-400 mt-1.5">
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
            className={errors.message ? 'border-red-600 dark:border-red-400' : undefined}
          />
          {errors.message?.message && (
            <p className="text-red-600 dark:text-red-400 mt-1.5">
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
