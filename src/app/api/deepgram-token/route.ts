import { createClient } from "@deepgram/sdk";

export async function GET() {
  console.log(process.env.DEEPGRAM_API_KEY);
  const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgramClient.auth.grantToken();

  if(error) {
    console.error(error);
    return new Response("Deepgram client creation failed.", { status: 500 })
  }

  return Response.json({ token: result.access_token });
}
