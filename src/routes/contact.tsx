import { MetaFunction } from '@remix-run/cloudflare';

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

export default function Contact() {
  return (
    <>
      <p className="mb-4">
        If you&apos;re writing for a project or to work together, please include
        as much details as possible (goal, timeline, budget, ...). For
        everything else, write as you please, I&apos;ll be more than happy to
        reply!
      </p>
      <form
        action=""
        method="post"
        className="flex flex-col gap-4"
        style={{ maxWidth: '640px' }}>
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="block px-2 py-1.5 border border-gray-300 rounded-sm"
              type="text"
              name="name"
              id="name"
              required
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold inline-block mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="block px-2 py-1.5 border border-gray-300 rounded-sm"
              type="email"
              name="email"
              id="email"
              required
            />
          </div>
        </div>
        <div>
          <label className="font-semibold inline-block mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            className="block px-2 py-1.5 border border-gray-300 rounded-sm"
            name="message"
            id="message"
            required
          />
        </div>
        <div>
          <button
            className="inline-block px-4 py-1.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-sm"
            type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
