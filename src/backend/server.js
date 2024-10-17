import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { tutorialRoutes } from "./routes/tutorials.js";
import { profileRoutes } from "./routes/profiles.js";
import { paymentRoutes } from "./routes/payments.js";
import { supabase } from "./utils/supabase.js";
import dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

// Authentication middleware
app.use(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  console.log('Auth header:', authHeader); // Add this line
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    console.log('Supabase auth result:', { user, error }); // Add this line
    if (user && !error) {
      c.set('user', user);
      console.log('User set in context:', user); // Add this line
    } else {
      console.error('Auth error:', error);
    }
  } else {
    console.log('No auth header present'); // Add this line
  }
  await next();
});

app.route("/tutorials", tutorialRoutes);
app.route("/profiles", profileRoutes);
app.route("/api/payments", paymentRoutes);

const port = 5173;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: port
});
