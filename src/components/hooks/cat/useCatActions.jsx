// src/components/hooks/cat/useCatActions.jsx
"use client";

import { useGetCats } from "./useGetCats";
import { useGetCatById } from "./useGetCatById";
import { useCreateCat } from "./useCreateCat";
import { useUpdateCat } from "./useUpdateCat";
import { useDeleteCat } from "./useDeleteCat";
import { useUploadCatAvatar } from "./useUploadCatAvatar";
import { useGetCatBreeds } from "./useGetCatBreeds";

/**
 * Hook tổng hợp tất cả các actions liên quan đến cat
 * Giúp việc import và sử dụng đơn giản hơn
 */
export function useCatActions() {
  return {
    useGetCats,
    useGetCatById,
    useCreateCat,
    useUpdateCat,
    useDeleteCat,
    useUploadCatAvatar,
    useGetCatBreeds,
  };
}

