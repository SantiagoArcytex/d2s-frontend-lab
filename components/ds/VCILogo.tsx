import Image from 'next/image';

interface VCILogoProps {
  size?: number;
}

export function VCILogo({ size = 28 }: VCILogoProps) {
  return (
    <Image
      src="/Type=Primary.svg"
      alt="Logo"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
