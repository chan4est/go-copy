import Error from './components/Error';

export const metadata = {
  title: '404 Not Found',
  description: '',
};

const errorText = '404 Page Not Found';

export default function NotFound() {
  return <Error errorText={errorText} />;
}
