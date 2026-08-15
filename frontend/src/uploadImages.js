import { supabase } from "./supabaseClient";

/**
 * Supabase Storage에 이미지 파일을 업로드하고 Public URL을 반환하는 함수
 * @param {File} file - 업로드할 File 객체
 * @param {string} bucketName - Supabase Storage 버킷 이름 (기본값: 'images')
 * @returns {Promise<string|null>} 생성된 이미지 URL (실패 시 null)
 */
export const uploadImage = async (file, bucketName = 'images') => {
  if (!file) return null;

  try {
    // 1. 파일명 난수화 및 확장자 추출 (한글 파일명/공백/특수문자 에러 방지)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    // 2. Supabase Storage에 파일 업로드
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase 업로드 실패:', error.message);
      return null;
    }

    // 3. 업로드된 파일의 Public URL 가져오기
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('이미지 업로드 과정 중 예외 발생:', err);
    return null;
  }
};