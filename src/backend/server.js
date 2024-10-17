import { Hono } from 'hono'
import { serve } from 'https://deno.land/std@0.184.0/http/server.ts'
import { tutorialRoutes } from './routes/tutorials.js'
import { profileRoutes } from './routes/profiles.js'
import { paymentRoutes } from './routes/payments.js'

const app = new Hono()

app.route('/tutorials', tutorialRoutes)
app.route('/profiles', profileRoutes)
app.route('/payments', paymentRoutes)

serve(app.fetch)