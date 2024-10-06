const validate = async (ip: string, value?: string) => {
  if (!value) {
    return false;
  }

  try {
    const payload = new FormData();
    payload.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET!);
    payload.append('remoteip', ip);
    payload.append('response', value);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: payload,
    }).then((response) => response.json() as Promise<{ success: boolean }>);

    if (!response.success) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const CloudflareTurnstileValidator = {
  validate,
};
