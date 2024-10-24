import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  pageNumberRehypePlugin,
  crossProjectLinksPlugin,
} from "remark-rehype-plugins"
import { sidebar } from "./sidebar.mjs"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "v2/resources",
            },
            "user-guide": {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "v2/user-guide",
            },
            ui: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "ui",
            },
            api: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "v2/api",
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
      [brokenLinkCheckerPlugin],
      [localLinksRehypePlugin],
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
      [rehypeSlug],
      [
        cloudinaryImgRehypePlugin,
        {
          cloudinaryConfig: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
            flags: ["fl_lossy", "f_auto"],
            resize: {
              action: "pad",
              aspectRatio: "16:9",
            },
            roundCorners: 16,
          },
        },
      ],
      [
        pageNumberRehypePlugin,
        {
          sidebar: sidebar,
        },
      ],
    ],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/v2",
  async rewrites() {
    return {
      fallback: [
        {
          source: "/v2/resources",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/v2/resources`,
          basePath: false,
        },
        {
          source: "/v2/resources/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/v2/resources/:path*`,
          basePath: false,
        },
        {
          source: "/v2/api/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL || "https://localhost:3001"
          }/v2/api/:path*`,
          basePath: false,
        },
        // TODO comment out once we have the user guide published
        // {
        //   source: "/user-guide",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide`,
        //   basePath: false,
        // },
        // {
        //   source: "/user-guide/:path*",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide/:path*`,
        //   basePath: false,
        // },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: "/advanced-development/:path*",
        destination: "/learn/advanced-development/:path*",
        permanent: true,
      },
      {
        source: "/basics/:path*",
        destination: "/learn/basics/:path*",
        permanent: true,
      },
      {
        source: "/customization/:path*",
        destination: "/learn/customization/:path*",
        permanent: true,
      },
      {
        source: "/debugging-and-testing/:path*",
        destination: "/learn/debugging-and-testing/:path*",
        permanent: true,
      },
      {
        source: "/deployment/:path*",
        destination: "/learn/deployment/:path*",
        permanent: true,
      },
      {
        source: "/first-customizations/:path*",
        destination: "/learn/first-customizations/:path*",
        permanent: true,
      },
      {
        source: "/more-resources/:path*",
        destination: "/learn/more-resources/:path*",
        permanent: true,
      },
      {
        source: "/storefront-development/:path*",
        destination: "/learn/storefront-development/:path*",
        permanent: true,
      },
      {
        source: "/more-resources/examples",
        destination: "/resources/examples",
        permanent: true,
      },
    ]
  },
}

export default withMDX(nextConfig)
