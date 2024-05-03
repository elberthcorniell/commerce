import Image from 'next/image';
import logo from './logo-black.png';

export default function Logo({ height }: { height?: number }) {
  const width = height ? height * 5 : 250;
  return (
    <div
      className=" relative"
      style={{
        height: height || '100%',
        width
      }}
    >
      <Image alt="Sovereign logo" className=" object-contain" fill src={logo} />
    </div>
  );
}
