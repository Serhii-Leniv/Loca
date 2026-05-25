import { useState } from 'react';
import { ChevronLeft, UploadCloud, Music, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router';
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
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 text-white">
            {/* Шапка (як на інших екранах) */}
            <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </Link>
                    <h1 className="text-[16px] font-medium text-white">Завантаження</h1>
                    <div className="w-10 h-10" /> {/* Пустий блок для балансу */}
                </div>
            </div>

            <div className="px-4 mt-4 max-w-xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadCloud className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-[24px] font-bold text-white mb-2">Створити реліз</h2>
                    <p className="text-[13px] text-gray-400">Поділися своєю творчістю зі світом</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Поля вводу */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[13px] text-gray-400 mb-1.5 ml-1">Ім'я артиста *</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-[15px] text-white outline-none focus:border-purple-500/50 transition-colors"
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                required
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
                            <label className="block text-[13px] text-gray-400 mb-1.5 ml-1">Назва пісні *</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-[15px] text-white outline-none focus:border-purple-500/50 transition-colors"
                                value={trackTitle}
                                onChange={(e) => setTrackTitle(e.target.value)}
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

                    {/* Завантаження файлів */}
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
                                onChange={handleAudioChange}
                                required
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <Music className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium text-white">Аудіофайл *</p>
                                    <p className="text-[12px] text-purple-300/70 truncate">{audioFile ? audioFile.name : 'Обери MP3 або WAV'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all duration-200"
                        >
                            <span className="text-[15px] font-medium text-white">
                                {isUploading ? statusText : 'Відправити на модерацію'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}