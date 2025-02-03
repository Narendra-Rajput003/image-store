"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";

export default function FileUpload(
    { onSuccess }: { onSuccess: (response: IKUploadResponse) => void }
) {
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const onError = (error: { message: string }) => {
        setError(error.message);
        setUploading(false);
    };

    const handleSuccess = (response: IKUploadResponse) => {
        setUploading(false);
        setError(null);
        onSuccess(response);
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
        setProgress(0);
    };

    const handleUploadProgress = (evt: ProgressEvent<XMLHttpRequestEventTarget>) => {
        if (evt.lengthComputable) {
            const progress = (evt.loaded / evt.total) * 100;
            setProgress(progress);
        }
    };

    return (
        <div className="space-y-2">
            <IKUpload
                fileName="product-image.jpg"
                onError={onError}
                onSuccess={handleSuccess}
                onUploadStart={handleStartUpload}
                onUploadProgress={handleUploadProgress}
                className="file-input file-input-bordered w-full max-w-xs"
                validateFile={(file: File) => {
                    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                    if (!validTypes.includes(file.type)) {
                        setError("Invalid file type");
                        return false;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        setError("File size must be less than 5MB");
                        return false;
                    }
                    return true;
                }}
            />

            {uploading && (
                <progress className="progress w-full max-w-xs" value={progress} max="100"></progress>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}