import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPost } from "../posts";
import { getPrimaryTopic } from "../taxonomy";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const topic = getPrimaryTopic(post);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff8ed",
          color: "#12233a",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#f27319",
          }}
        >
          <span>Sundee Fundee</span>
          <span>{topic.label}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 74,
              lineHeight: 1.02,
              fontWeight: 800,
              maxWidth: 980,
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#536174",
              maxWidth: 920,
            }}
          >
            {post.description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 28,
            color: "#12233a",
          }}
        >
          <span>{post.readMinutes} min read</span>
          <span>•</span>
          <span>Recovery-aware strength training</span>
        </div>
      </div>
    ),
    size,
  );
}
