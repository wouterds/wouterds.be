export const config = {
  get baseUrl() {
    if (import.meta.env.PROD) {
      return 'https://wouterds.com';
    }

    return 'http://localhost:5173';
  },
};
