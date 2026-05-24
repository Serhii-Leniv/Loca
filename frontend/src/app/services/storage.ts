import { apiRequest } from './api';

export type UploadUrlResponse = {
    uploadUrl: string;
    key: string;
};

export async function getUploadUrl(fileName: string, contentType: string) {
    return apiRequest<UploadUrlResponse>(
        `/api/storage/upload-url?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`,
        { method: 'POST' }
    );
}

export async function uploadFileToMinio(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to upload file to storage');
    }
}