namespace Loca.API.Interfaces;

public interface IGeocodingService
{
    Task<string?> ResolveCityAsync(double latitude, double longitude, CancellationToken ct = default);
}
