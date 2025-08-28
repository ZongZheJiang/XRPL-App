// FILE: /app/actions.ts
'use server'; // This directive is crucial

import { db } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

// This function ONLY runs on the server
export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;

  if (!name) {
    return { error: 'Project name is required.' };
  }

  await db.project.create({ data: { name } });

  // Clear the cache for the dashboard page so it shows the new project
  revalidatePath('/dashboard');

  return { success: true };
}