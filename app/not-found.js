import Image from 'next/image';
import { LeftBorder } from './Components/LeftBorder';
import { RightBorder } from './Components/RightBorder';
import questionMark from '../public/unown-qm.png';

export const metadata = {
  title: '404 Not Found',
  description: '',
};

export default function NotFound() {
  return (
    <>
      <LeftBorder />
      <RightBorder />
      <main
        style={{
          display: 'grid',
          'text-align': 'center',
          width: '70%',
          'padding-top': '40px',
        }}
      >
        <Image
          src={questionMark}
          height={200}
          width={200}
          alt=""
          style={{ 'justify-self': 'center', 'pointer-events': 'none' }}
        />
        <h1>404 Page Not Found</h1>
        <p>
          If you beleive there is supposed to be a something here,&nbsp;
          <a href="mailto:chan4est@gmail.com?subject=GO Copy Issue&body=Please include screenshots of your screen and browser console if possible">
            please email me
          </a>
          &nbsp;and include details of what you did and what you expected.
        </p>
        <p>
          Go back to the <a href="/">Main Page</a>
        </p>
      </main>
    </>
  );
}
