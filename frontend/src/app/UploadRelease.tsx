import { useState } from 'react';
import { getUploadUrl, uploadFileToMinio } from './services/storage';
import { createAlbum } from './services/albums';
import { createTrack } from './services/tracks';
export default function UploadRelease() {
    const [artistName, setArtistName] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    const [trackTitle, setTrackTitle] = useState('');
    const [locationName, setLocationName] = useState('');

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [statusText, setStatusText] = useState('');

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            if (!trackTitle) {
                setTrackTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile || !albumTitle || !artistName || !trackTitle) {
            alert('Заповніть усі обов’язкові поля та виберіть аудіофайл.');
            return;
        }

        setIsUploading(true);

        try {
            let coverKey = undefined;

            if (coverFile) {
                setStatusText('Завантаження обкладинки...');
                const coverInfo = await getUploadUrl(coverFile.name, coverFile.type || 'image/jpeg');
                await uploadFileToMinio(coverInfo.uploadUrl, coverFile);
                coverKey = coverInfo.key;
            }

            setStatusText('Створення релізу...');
            const albumResponse = await createAlbum({
                title: albumTitle,
                artistName,
                coverImageUrl: coverKey,
            });

            setStatusText('Завантаження треку...');
            const audioInfo = await getUploadUrl(audioFile.name, audioFile.type || 'audio/mpeg');
            await uploadFileToMinio(audioInfo.uploadUrl, audioFile);

            setStatusText('Збереження треку...');
            await createTrack({
                title: trackTitle,
                artistName,
                albumId: albumResponse.albumId,
                storageFileKey: audioInfo.key,
                duration: 0,
                locationName: locationName || 'Unknown',
                coverImageUrl: coverKey,
            });

            alert('Успіх! Твій реліз відправлено на модерацію.');

            setAlbumTitle(''); setTrackTitle(''); setArtistName(''); setLocationName('');
            setCoverFile(null); setAudioFile(null);

        } catch (error: any) {
            console.error(error);
            alert(error?.message || 'Помилка під час завантаження.');
        } finally {
            setIsUploading(false);
            setStatusText('');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-card text-card-foreground rounded-lg border border-border mt-10 shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">Створити реліз</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-sm">Ім'я артиста *</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-border rounded-md bg-input-background focus:outline-ring"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm">Назва альбому / синглу *</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-border rounded-md bg-input-background focus:outline-ring"
                        value={albumTitle}
                        onChange={(e) => setAlbumTitle(e.target.value)}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm">Назва треку *</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-border rounded-md bg-input-background focus:outline-ring"
                        value={trackTitle}
                        onChange={(e) => setTrackTitle(e.target.value)}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-sm">Місто (для "Музики поруч")</label>
                    <input
                        type="text"
                        placeholder="Наприклад: Київ"
                        className="w-full p-2 border border-border rounded-md bg-input-background focus:outline-ring"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        disabled={isUploading}
                    />
                </div>

                <div className="border border-border p-4 rounded-md">
                    <label className="block mb-2 font-medium text-sm">Обкладинка (необов'язково)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        disabled={isUploading}
                        className="text-sm w-full text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
                    />
                </div>

                <div className="border border-border p-4 rounded-md">
                    <label className="block mb-2 font-medium text-sm">Аудіофайл *</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        required
                        disabled={isUploading}
                        className="text-sm w-full text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isUploading ? statusText : 'Відправити на модерацію'}
                    </button>
                </div>
            </form>
        </div>
    );
}