import { useEffect, useState } from 'react';
import { ChevronLeft, Check, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { getPendingTracks, approveTrack, rejectTrack, type PendingTrack } from './services/moderation';

export default function ModerationPanel() {
    const [tracks, setTracks] = useState<PendingTrack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingTracks();
    }, []);

    const fetchPendingTracks = async () => {
        try {
            setIsLoading(true);
            const data = await getPendingTracks();
            setTracks(data);
            setError(null);
        } catch (err: any) {
            setError(err?.message || 'Не вдалося завантажити список треків');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await approveTrack(id);
            setTracks((prev) => prev.filter((t) => t.id !== id));
        } catch (err: any) {
            alert(err?.message || 'Помилка при схваленні');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        const isConfirmed = window.confirm('Ви впевнені, що хочете відхилити та видалити цей трек?');
        if (!isConfirmed) return;

        setProcessingId(id);
        try {
            await rejectTrack(id);
            setTracks((prev) => prev.filter((t) => t.id !== id));
        } catch (err: any) {
            alert(err?.message || 'Помилка при відхиленні');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 text-white">
            {/* Шапка */}
            <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <h1 className="text-[16px] font-medium text-white">Модерація</h1>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </div>

            <div className="px-4 mt-4 max-w-3xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center mt-20">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="mt-10 p-4 border border-red-500/30 bg-red-500/10 rounded-2xl text-center text-red-400 text-[14px]">
                        {error}
                    </div>
                ) : tracks.length === 0 ? (
                    <div className="mt-20 p-8 border border-white/10 bg-white/5 rounded-3xl text-center">
                        <ShieldCheck className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-[16px] font-medium text-white mb-1">Все чисто!</p>
                        <p className="text-[13px] text-gray-400">Немає нових треків на перевірку.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-[13px] text-gray-400 mb-4 px-2">Треків на перевірку: {tracks.length}</p>

                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-5 items-center hover:bg-white/10 transition-colors"
                            >
                                {/* Інформація про трек */}
                                <div className="flex-1 w-full min-w-0">
                                    <h2 className="text-[16px] font-semibold text-white truncate mb-1">{track.title}</h2>
                                    <p className="text-[13px] text-gray-400 truncate mb-4">{track.artistName}</p>

                                    {track.streamUrl ? (
                                        <audio controls src={track.streamUrl} className="w-full h-9 rounded-full outline-none" />
                                    ) : (
                                        <p className="text-[12px] text-red-400">Аудіофайл недоступний</p>
                                    )}
                                </div>

                                {/* Кнопки дій */}
                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleApprove(track.id)}
                                        disabled={processingId === track.id}
                                        className="flex-1 md:flex-none h-11 px-6 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span className="text-[14px] font-medium">Схвалити</span>
                                    </button>

                                    <button
                                        onClick={() => handleReject(track.id)}
                                        disabled={processingId === track.id}
                                        className="flex-1 md:flex-none h-11 px-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        <span className="text-[14px] font-medium">Відхилити</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}