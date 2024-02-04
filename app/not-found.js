import Image from 'next/image';
import { LeftBorder } from './components/LeftBorder';
import { RightBorder } from './components/RightBorder';
import questionMark from '../public/201-qm.webp';
import style from './styles/error.css';

export const metadata = {
  title: '404 Not Found',
  description: '',
};

export default function NotFound() {
  return (
    <>
      <body>
        <LeftBorder />
        <RightBorder />
        <main>
          <Image
            src={questionMark}
            height={200}
            width={200}
            alt=""
            className={'question-image'}
            quality={100}
          />
          <h2>404 Page Not Found</h2>
          <p>
            If you believe there is supposed to be something here,&nbsp;
            <a href="mailto:chan4est@gmail.com?subject=GO Copy! Issue&body=Please include screenshots of your screen and browser console if possible">
              please email me
            </a>
            .
          </p>
          <p>
            Include details of what you did before encountering this error along
            with what you expected. Thank you!
          </p>
          <p>
            Go back to the <a href="/">Main Page</a>
          </p>
        </main>
      </body>
    </>
  );
}
