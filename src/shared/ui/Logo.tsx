'use client';

import Image from 'next/image';

export default function Logo() {
  return (
    <div className="w-7 h-7 relative">
      <Image
        src="/logo.png"
        alt="Logo"
        fill
        sizes="28px"
        className="object-contain"
        priority
      />
    </div>
  );
}
