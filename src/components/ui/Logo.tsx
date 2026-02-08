'use client';

import Image from 'next/image';

export default function Logo() {
  return (
    <div className="w-10 h-10 relative">
      <Image
        src="/logo.png"
        alt="Logo"
        fill
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
