import { redirect } from 'react-router';

export const loader = () => {
  return redirect('/', { status: 301 });
};
