import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to upload an image to Supabase storage
export async function uploadImage(
  file: File,
  bucket: 'logos' | 'thumbnails',
  fileName: string
): Promise<string> {
  try {
    // Ensure file is an image
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Maximum file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }

    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${fileName}-${Date.now()}.${fileExt}`;

    // Upload the file
    const { error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Function to delete an image from Supabase storage
export async function deleteImage(
  bucket: 'logos' | 'thumbnails',
  filePath: string
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Function to list files in a bucket
export async function listFiles(bucket: 'logos' | 'thumbnails') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error listing files in ${bucket} bucket:`, error);
    throw error;
  }
} 