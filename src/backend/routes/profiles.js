import { Hono } from 'hono'
import { supabase } from '../utils/supabase.js'

const profileRoutes = new Hono()

profileRoutes.post('/', (c) => c.json({ message: 'Create Profile' }))
profileRoutes.get('/', (c) => c.json({ message: 'Read Profiles' }))
profileRoutes.put('/:id', (c) => c.json({ message: 'Update Profile' }))
profileRoutes.delete('/:id', (c) => c.json({ message: 'Delete Profile' }))

export { profileRoutes }