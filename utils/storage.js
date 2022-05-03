const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

import { SupabaseStorageClient } from "@supabase/storage-js";

export let storageClient = null;

export const setupStorage = (jwtToken) => {
  storageClient = new SupabaseStorageClient(STORAGE_URL, {
    apikey: jwtToken,
    Authorization: `Bearer ${jwtToken}`,
  });
};

export const getS3FileUrl = (key) =>
  `${process.env.NEXT_PUBLIC_STORAGE_S3_URL}/${key}`;
