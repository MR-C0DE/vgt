/** @type {import('next').NextConfig} */

import { i18n } from 'next-i18next';

const nextConfig = {
  ...i18n,
  reactStrictMode: true,
  // D'autres options de configuration Next.js
};

export default nextConfig;
