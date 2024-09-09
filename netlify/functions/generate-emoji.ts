import type { Config, Context } from "@netlify/functions";
import Replicate from "replicate";
const replicate = new Replicate({
  auth: Netlify.env.get("REPLICATE_API_TOKEN"),
});

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const emojiText = url.searchParams.get("query");

  const input = {
    mask: "https://replicate.delivery/pbxt/JT6K0z55b9kVVAvjzirEYBSMB3kGbRWdw6nbdxsvbIqY4K99/1024x1024-border-mask.png",
    width: 1024,
    height: 1024,
    prompt: `A TOK emoji of ${emojiText}, white background`,
    refine: "expert_ensemble_refiner",
    scheduler: "K_EULER",
    lora_scale: 0.6,
    num_outputs: 1,
    guidance_scale: 10.55,
    apply_watermark: false,
    high_noise_frac: 1,
    negative_prompt: "soft, underexposed, cropped",
    prompt_strength: 1,
    num_inference_steps: 50,
  };

  const image_url = await replicate.run(
    "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
    { input },
  );
  return Response.json(
    { image_url },
    {
      headers: {
        "Netlify-CDN-Cache-Control": "public, max-age=600, durable",
        "Netlify-Vary": "query",
      },
    },
  );
};

export const config: Config = {
  path: "/generate-emoji",
};
