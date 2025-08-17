import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// For server components
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

// For client components
export const createClientSupabaseClient = () => {
  return createClientComponentClient<Database>();
};

// Auth helpers
export const getSession = async () => {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user || null;
};

// Protected route wrapper
export const requireAuth = async () => {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
};
