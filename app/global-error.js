'use client';

import Error from './components/Error';

export const metadata = {
  title: '500 Server Error',
  description: '',
};

const errorText = '500 Internal Server Error';

export default function GlobalError() {
  return <Error errorText={errorText} />;
}
