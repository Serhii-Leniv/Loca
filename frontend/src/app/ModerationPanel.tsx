import { useEffect, useState } from 'react';
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

    if (isLoading) {
        return <div className="p-6 text-center text-muted-foreground">Завантаження треків...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-destructive">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mt-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Панель Модератора</h1>

            {tracks.length === 0 ? (
                <div className="p-10 border border-border rounded-lg text-center bg-card text-muted-foreground">
                    Ура! Немає нових треків на перевірку.
                </div>
            ) : (
                <div className="space-y-6">
                    {tracks.map((track) => (
                        <div
                            key={track.id}
                            className="p-5 border border-border rounded-lg bg-card text-card-foreground shadow-sm flex flex-col md:flex-row gap-6 items-center"
                        >
                            <div className="flex-1 w-full">
                                <h2 className="text-xl font-semibold mb-1">{track.title}</h2>
                                <p className="text-muted-foreground mb-3">{track.artistName}</p>

                                {track.streamUrl ? (
                                    <audio controls src={track.streamUrl} className="w-full h-10 outline-none" />
                                ) : (
                                    <p className="text-destructive text-sm">Аудіофайл недоступний (помилка MinIO)</p>
                                )}
                            </div>

                            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => handleApprove(track.id)}
                                    disabled={processingId === track.id}
                                    className="flex-1 md:flex-none px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 disabled:opacity-50"
                                >
                                    {processingId === track.id ? '...' : 'Схвалити'}
                                </button>

                                <button
                                    onClick={() => handleReject(track.id)}
                                    disabled={processingId === track.id}
                                    className="flex-1 md:flex-none px-6 py-2 bg-destructive text-destructive-foreground font-medium rounded-md hover:opacity-90 disabled:opacity-50"
                                >
                                    Відхилити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}