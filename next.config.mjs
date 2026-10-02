/**
 * Served on the shop at goldengoosetools.com/tools/cottage-food-labels
 * (the shop proxies this deployment under the same path).
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/tools/cottage-food-labels";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  reactStrictMode: true,
  transpilePackages: ["ggt-design-kit"],
};

export default nextConfig;
