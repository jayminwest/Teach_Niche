import { Hono } from "hono";
import { supabase } from "../utils/supabase.js";

const tutorialRoutes = new Hono();

tutorialRoutes.post("/", (c) => c.json({ message: "Create Tutorial" }));
tutorialRoutes.get("/", (c) => c.json({ message: "Read Tutorials" }));
tutorialRoutes.put("/:id", (c) => c.json({ message: "Update Tutorial" }));
tutorialRoutes.delete("/:id", (c) => c.json({ message: "Delete Tutorial" }));
tutorialRoutes.get("/:id", async (c) => {
  const tutorialId = c.req.param('id');
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  try {
    // Check if the user has purchased the tutorial
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('tutorial_id', tutorialId)
      .single();

    if (purchaseError || !purchase) {
      return c.json({ error: 'You have not purchased this tutorial' }, 403);
    }

    // Fetch the tutorial content
    const { data: tutorial, error: tutorialError } = await supabase
      .from('tutorials')
      .select('*')
      .eq('id', tutorialId)
      .single();

    if (tutorialError) {
      return c.json({ error: 'Tutorial not found' }, 404);
    }

    return c.json(tutorial);
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return c.json({ error: 'An error occurred while fetching the tutorial' }, 500);
  }
});

export { tutorialRoutes };
