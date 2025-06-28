/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // --- Your Existing Configuration ---
  // output: 'standalone',
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   ignoreBuildErrors: true,
  // },
  // images: {
  //   domains: ["img.daisyui.com"],
  // },
  
  // --- The Fix for the 'ws' Library ---
  // This function modifies the webpack configuration to prevent bundling 'ws'
  // on the server, which solves the native addon issue in Vercel's environment.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('ws');
    }
    return config;
  },
};

export default nextConfig;