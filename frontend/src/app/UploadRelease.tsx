import { useState } from 'react';
import { ChevronLeft, UploadCloud, Music, Image as ImageIcon, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { getUploadUrl, uploadFileToMinio } from './services/storage';
import { createAlbum } from './services/albums';
import { createTrack } from './services/tracks';

export default function UploadRelease() {
    const navigate = useNavigate();
    const [artistName, setArtistName] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    const [locationName, setLocationName] = useState('');

    const [coverFile, setCoverFile] = useState<File | null>(null);

    // Тепер зберігаємо МАСИВ аудіофайлів
    const [audioFiles, setAudioFiles] = useState<File[]>([]);

    const [isUploading, setIsUploading] = useState(false);
    const [statusText, setStatusText] = useState('');

    // Обробка вибору кількох файлів
    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setAudioFiles((prev) => [...prev, ...newFiles]);

            // Якщо це перший файл, спробуємо розумно витягнути Артиста і Альбом з назви
            if (!artistName && !albumTitle && newFiles.length === 1) {
                const fileName = newFiles[0].name.replace(/\.[^/.]+$/, ''); // Видаляємо .mp3
                const parts = fileName.split(' - ');
                if (parts.length >= 2) {
                    setArtistName(parts[0].trim());
                    setAlbumTitle(parts[1].trim()); // Тимчасово ставимо назву треку як назву синглу
                } else {
                    setAlbumTitle(fileName);
                }
            }
        }
    };

    const removeFile = (indexToRemove: number) => {
        setAudioFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (audioFiles.length === 0 || !albumTitle || !artistName) {
            alert('Заповніть усі обов’язкові поля та виберіть хоча б один аудіофайл.');
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

            // Завантажуємо КОЖЕН трек з масиву
            for (let i = 0; i < audioFiles.length; i++) {
                const file = audioFiles[i];
                setStatusText(`Завантаження треку ${i + 1} з ${audioFiles.length}...`);

                // Генеруємо назву треку з файлу (якщо юзер не ввів)
                const trackTitle = file.name.replace(/\.[^/.]+$/, '').split(' - ').pop()?.trim() || file.name;

                const audioInfo = await getUploadUrl(file.name, file.type || 'audio/mpeg');
                await uploadFileToMinio(audioInfo.uploadUrl, file);

                setStatusText(`Збереження треку ${i + 1}...`);
                await createTrack({
                    title: trackTitle,
                    artistName,
                    albumId: albumResponse.albumId,
                    storageFileKey: audioInfo.key,
                    duration: 0,
                    locationName: locationName || 'Unknown',
                    coverImageUrl: coverKey,
                });
            }

            alert('Успіх! Твій реліз відправлено на модерацію.');
            navigate('/home');

        } catch (error: any) {
            console.error(error);
            alert(error?.message || 'Помилка під час завантаження.');
        } finally {
            setIsUploading(false);
            setStatusText('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 text-white">
            <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </Link>
                    <h1 className="text-[16px] font-medium text-white">Завантаження</h1>
                    <div className="w-10 h-10" />
                </div>
            </div>

            <div className="px-4 mt-4 max-w-xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadCloud className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-[24px] font-bold text-white mb-2">Створити реліз</h2>
                    <p className="text-[13px] text-gray-400">Завантаж сингл, EP або повноцінний альбом</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[13px] text-gray-400 mb-1.5 ml-1">Ім'я артиста *</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-[15px] text-white outline-none focus:border-purple-500/50 transition-colors"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                disabled={isUploading}
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] text-gray-400 mb-1.5 ml-1">Назва альбому / синглу *</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-[15px] text-white outline-none focus:border-purple-500/50 transition-colors"
                                value={albumTitle}
                                onChange={(e) => setAlbumTitle(e.target.value)}
                                required
                                disabled={isUploading}
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] text-gray-400 mb-1.5 ml-1">Місто (для Музики поруч)</label>
                            <input
                                type="text"
                                placeholder="Наприклад: Львів"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-[15px] text-white outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-600"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                disabled={isUploading}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 mt-6">
                        <div className="relative overflow-hidden bg-white/5 border border-white/10 border-dashed rounded-xl p-4 hover:bg-white/10 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium text-white">Обкладинка (необов'язково)</p>
                                    <p className="text-[12px] text-gray-500">{coverFile ? coverFile.name : 'Натисни, щоб вибрати фото'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden bg-purple-600/10 border border-purple-500/30 border-dashed rounded-xl p-4 hover:bg-purple-600/20 transition-colors">
                            <input
                                type="file"
                                accept="audio/*"
                                multiple // ДОЗВОЛЯЄМО ВИБИРАТИ БАГАТО ФАЙЛІВ
                                onChange={handleAudioChange}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <Music className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium text-white">Додати аудіофайли *</p>
                                    <p className="text-[12px] text-purple-300/70 truncate">Можна вибрати декілька MP3/WAV</p>
                                </div>
                            </div>
                        </div>

                        {/* Список вибраних пісень */}
                        {audioFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-[13px] text-gray-400 mb-2 ml-1">Вибрані треки ({audioFiles.length}):</p>
                                {audioFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                                        <p className="text-[13px] text-white truncate max-w-[85%]">{file.name}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            disabled={isUploading}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isUploading || audioFiles.length === 0}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all duration-200"
                        >
                            <span className="text-[15px] font-medium text-white">
                                {isUploading ? statusText : 'Завантажити'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}