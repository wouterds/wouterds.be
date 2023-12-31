import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, json, MetaFunction } from '@remix-run/cloudflare';
import { Form, useActionData } from '@remix-run/react';
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
  const data = Object.fromEntries(await request.formData()) as Schema;
  const countryCode = request.headers.get('CF-IPCountry') as string;

  try {
    schema.parse(data);
  } catch {
    return json({ success: false }, { status: 400 });
  }

  try {
    let TextPart = '';
    TextPart += `Name: ${data.name}\n`;
    TextPart += `Email: ${data.email}\n`;
    TextPart += `Message: ${data.message}\n\n`;
    TextPart += `--\n`;
    TextPart += `IP: ${
      request.headers.get('CF-Connecting-IP') || 'unknown'
    }, location: ${
      countryCode ? getCountryName(countryCode) : 'unknown' || countryCode
    }\n`;

    let HTMLPart = '';
    HTMLPart += `<p>`;
    HTMLPart += `<strong>Name:</strong> ${data.name}<br />`;
    HTMLPart += `<strong>Email:</strong> ${data.email}<br />`;
    HTMLPart += `<strong>Message:</strong>`;
    HTMLPart += `</p>`;
    HTMLPart += `<p>${data.message.replace(/\n/g, '<br />')}</p>`;
    HTMLPart += `<hr />`;
    HTMLPart += `<p><strong>IP:</strong> ${
      request.headers.get('CF-Connecting-IP') || 'unknown'
    }, <strong>location:</strong> ${
      countryCode ? getCountryName(countryCode) : 'unknown' || countryCode
    }</p>`;

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
              Email: data.email,
              Name: data.name,
            },
            Subject: `[Contact] New message from ${data.name}!`,
            TextPart,
            HTMLPart,
          },
        ],
      }),
    });

    if (!response.ok) {
      return json({ success: false }, { status: 500 });
    }

    return json({ success: true });
  } catch {
    return json({ success: false }, { status: 500 });
  }
};

export default function Contact() {
  const data = useActionData<typeof action>();
  const success = data?.success;

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (success) {
      reset();
    }
  }, [reset, success]);

  if (success) {
    return (
      <p className="text-green-700 dark:text-green-400">
        Your message has been sent, I&apos;ll get back to you as soon as
        possible!
      </p>
    );
  }

  return (
    <>
      <p className="mb-4">
        If you&apos;re writing for a project or to work together, please include
        as much details as possible (goal, timeline, budget, ...). For
        everything else, write as you please, I&apos;ll be more than happy to
        reply!
      </p>
      <Form
        className="flex flex-col gap-4 mt-6"
        action="/contact"
        method="post"
        onSubmit={
          isValid ? undefined : handleSubmit((data) => console.log(data))
        }
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
        {typeof success === 'boolean' && !success && (
          <p className="text-red-600 dark:text-red-400 mt-2">
            Something went wrong, please try again later.
          </p>
        )}
      </Form>
    </>
  );
}
