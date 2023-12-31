import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useFetcher } from '@remix-run/react';
import { getName as getCountryName } from 'i18n-iso-countries';
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

export const meta: MetaFunction = () => {
  return [
    { title: 'Contact' },
    {
      name: 'description',
      content:
        "If you're writing for a project or to work together, please include as much details as possible (goal, timeline, budget, ...). For everything else, write as you please, I'll be more than happy to reply!",
    },
  ];
};

export const action = async (args: ActionFunctionArgs) => {
  const context = args.context as Context;
  const request = args.request;
  const data = await request.formData();

  const cf = (
    request as unknown as {
      cf: {
        country: string;
        city: string;
        postalCode: string;
        timezone: string;
      };
    }
  )?.cf;

  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  if (!name || !email || !message) {
    return new Response('Missing data', { status: 400 });
  }

  try {
    let TextPart = '';
    let HTMLPart = '';
    TextPart += `Name: ${name}\n`;
    HTMLPart += `<p><strong>Name:</strong> ${name}</p>`;
    TextPart += `Email: ${email}\n`;
    HTMLPart += `<p><strong>Email:</strong> ${email}</p>`;
    TextPart += `Message: ${message}\n\n`;
    HTMLPart += `<p><strong>Message:</strong></p><p>${message
      ?.toString()
      ?.replace(/\n/g, '<br />')}</p>`;
    TextPart += `--\n`;
    HTMLPart += `<br /><hr style="border-top: 1px solid #ccc" />`;
    TextPart += `IP: ${request.headers.get('CF-Connecting-IP')}\n`;
    HTMLPart += `<p><strong>IP:</strong> ${request.headers.get(
      'CF-Connecting-IP',
    )}</p>`;
    TextPart += `Location: ${
      cf.country === 'T1'
        ? 'Tor Network'
        : cf.country === 'XX'
          ? 'Unknown'
          : cf.country
            ? `${getCountryName(cf.country, 'en')}, ${cf.postalCode} ${cf.city}`
            : 'Unknown'
    }\n`;
    HTMLPart += `<p><strong>Location:</strong> ${
      cf.country === 'T1'
        ? 'Tor Network'
        : cf.country === 'XX'
          ? 'Unknown'
          : cf.country
            ? `${getCountryName(cf.country, 'en')}, ${cf.postalCode} ${cf.city}`
            : 'Unknown'
    }</p>`;
    TextPart += `Timezone: ${cf.timezone}\n`;
    HTMLPart += `<p><strong>Timezone:</strong> ${cf.timezone}</p>`;

    const response = await fetch(`${context.env.MAILJET_API_URL}/send`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(
          `${context.env.MAILJET_API_KEY}:${context.env.MAILJET_API_SECRET}`,
        )}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: 'noreply@wouterds.be',
            },
            To: [
              {
                Email: 'wouter.de.schuyter@gmail.com',
                Name: 'Wouter De Schuyter',
              },
            ],
            ReplyTo: {
              Email: email as string,
              Name: name as string,
            },
            Subject: `[Contact] New message from ${name}!`,
            TextPart,
            HTMLPart,
          },
        ],
      }),
    });

    if (!response.ok) {
      return new Response('Failed to send email', { status: 500 });
    }

    return new Response('ok', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Failed to send email', { status: 500 });
  }
};

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const fetcher = useFetcher();
  console.log(fetcher.state);

  return (
    <>
      <p className="mb-4">
        If you&apos;re writing for a project or to work together, please include
        as much details as possible (goal, timeline, budget, ...). For
        everything else, write as you please, I&apos;ll be more than happy to
        reply!
      </p>
      <fetcher.Form
        className="flex flex-col gap-4 mt-6"
        method="post"
        onSubmit={handleSubmit((data) => {
          fetcher.submit(data, { method: 'POST' });
        })}
        style={{ maxWidth: '640px' }}>
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={
                errors.name ? 'border-red-600 dark:border-red-400' : undefined
              }
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
              className={
                errors.email ? 'border-red-600 dark:border-red-400' : undefined
              }
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
            className={
              errors.message ? 'border-red-600 dark:border-red-400' : undefined
            }
          />
          {errors.message?.message && (
            <p className="text-red-600 dark:text-red-400 mt-1.5">
              {errors.message?.message as string}
            </p>
          )}
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </fetcher.Form>
    </>
  );
}
