import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Webhook } from "https://cdn.skypack.dev/svix"
import type { WebhookEvent } from "https://esm.sh/@clerk/backend@2.14.0?target=deno";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const SIGNING_SECRET = Deno.env.get("SIGNING_SECRET");
  if (!SIGNING_SECRET) {
    return new Response("Error: SIGNING_SECRET is missing", { status: 500 });
  }

  const wh = new Webhook(SIGNING_SECRET);

  // Verify webhook headers
  const headers = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };

  if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
    return new Response("Missing required headers", { status: 400 });
  }

  try {
    const payload = await req.text();
    const event = wh.verify(payload, headers) as WebhookEvent;

    // Supabase client setup
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event.type === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name, username } = event.data;
      const email = email_addresses?.[0]?.email_address;

      const { error } = await supabase
        .from("users")
        .insert({ clerk_id: id, email, image_url, first_name, last_name, username });

      if (error) throw error;
    }

    return new Response("Success", { status: 200 });
    
  } catch (err) {
    console.error("Error:", err);
    return new Response(err.message, { status: 500 });
  }
});