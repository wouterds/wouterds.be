export const extractDatoCmsApiKey = (context: Record<string, unknown>) => {
  const env = context.env as Record<string, string>;
  if (!env?.DATOCMS_API_KEY) {
    throw new Error('Missing DATOCMS_API_KEY');
  }

  return env.DATOCMS_API_KEY;
};
