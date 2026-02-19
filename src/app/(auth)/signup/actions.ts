'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const role = formData.get('role') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name,
                role,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user) {
        // Auth hook handles profile creation usually, but we can do it explicitly if needed
        // In our schema, we have a trigger or we handle it here.
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name, role })
            .eq('id', data.user.id)

        // Note: Insert usually happens via trigger, but we update to be sure
    }

    redirect('/login?message=Check your email to confirm your account.')
}
