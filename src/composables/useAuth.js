import { ref } from 'vue'
import { supabase } from '../utils/supabase'

export function useAuth() {
  const user = ref(null)

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  loadUser()

  return { user }
}
