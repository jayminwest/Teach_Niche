import { Hono } from 'hono'
import { supabase } from '../utils/supabase.js'

const tutorialRoutes = new Hono()

tutorialRoutes.post('/', (c) => c.json({ message: 'Create Tutorial' }))
tutorialRoutes.get('/', (c) => c.json({ message: 'Read Tutorials' }))
tutorialRoutes.put('/:id', (c) => c.json({ message: 'Update Tutorial' }))
tutorialRoutes.delete('/:id', (c) => c.json({ message: 'Delete Tutorial' }))

export { tutorialRoutes }