/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This tells Next.js to export static files
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
}

export default nextConfig;

