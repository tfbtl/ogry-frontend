/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  //trailingSlash: true,
  transpilePackages: ["@ogrency/core"],

  images: {
    unoptimized: true, // ✅ export modunda şart
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fpivpnytwndkixmyajpv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },

  //output: "export",
};

export default nextConfig;
