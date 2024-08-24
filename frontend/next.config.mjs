/** @type {import('next').NextConfig} */
import withPlaiceholder from "@plaiceholder/next"
import { hostname } from "os";
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "books.google.com",
            },
            {
                hostname: "*.googleusercontent.com"
            }
        ],
    }
};

export default withPlaiceholder(nextConfig);
