import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n69ixl32";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Ensures fresh content is fetched immediately
});

const builder = createImageUrlBuilder(sanityClient);

export type SanityImageSource = Parameters<
  ReturnType<typeof createImageUrlBuilder>["image"]
>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface SanityImage {
  asset?: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  [key: string]: unknown;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug?: { current: string };
  number?: string;
  category: string;
  headline: string;
  mediaType?: "image" | "video";
  image?: SanityImage;
  videoFileUrl?: string;
  videoUrl?: string;
  problem: string;
  system: string;
  result: string;
  metrics?: string;
  order?: number;
  link?: string;
}

export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc, _createdAt asc) {
  _id,
  title,
  slug,
  number,
  category,
  headline,
  mediaType,
  image,
  "videoFileUrl": videoFile.asset->url,
  videoUrl,
  problem,
  system,
  result,
  metrics,
  order,
  link
}`;

export interface CaseStudyData {
  id: string;
  number: string;
  name: string;
  category: string;
  headline: string;
  src: string;
  alt: string;
  mediaType?: "image" | "video";
  videoSrc?: string;
  problem: string;
  system: string;
  result: string;
  metrics?: string;
  link?: string;
}

export function mapSanityToCaseStudy(
  p: SanityProject,
  idx: number,
): CaseStudyData {
  let imgSrc = "";
  if (p.image) {
    try {
      imgSrc = urlFor(p.image).width(1200).quality(85).url();
    } catch {
      imgSrc = "";
    }
  }

  const videoSrc = p.videoFileUrl || p.videoUrl || undefined;
  const mediaType: "image" | "video" =
    p.mediaType || (videoSrc ? "video" : "image");

  return {
    id: p._id || p.slug?.current || `project-${idx}`,
    number: p.number || String(idx + 1).padStart(2, "0"),
    name: p.title,
    category: p.category || "Case Study",
    headline: p.headline || p.title,
    src: imgSrc,
    alt: p.image?.alt || `${p.title} preview`,
    mediaType,
    videoSrc,
    problem: p.problem || "",
    system: p.system || "",
    result: p.result || "",
    metrics: p.metrics,
    link: p.link,
  };
}

export async function getProjects(): Promise<SanityProject[]> {
  try {
    const projects =
      await sanityClient.fetch<SanityProject[]>(PROJECTS_QUERY);
    return projects || [];
  } catch (err) {
    console.error("Failed to fetch projects from Sanity:", err);
    return [];
  }
}
