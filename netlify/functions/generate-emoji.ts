import type { Config, Context } from "@netlify/functions";
import Replicate from "replicate";
const replicate = new Replicate({
  auth: Netlify.env.get("REPLICATE_API_TOKEN"),
});

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const emojiText = url.searchParams.get("query");
  const input = {
    prompt: `A ${emojiText} emoji`,
    apply_watermark: false,
  };

  const image_url = await replicate.run(
    "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
    { input },
  );
  return Response.json(
    { image_url },
    {
      headers: { "cache-control": "s-maxage=604800", "Netlify-Vary": "query" },
    },
  );
};

export const config: Config = {
  path: "/generate-emoji",
};
