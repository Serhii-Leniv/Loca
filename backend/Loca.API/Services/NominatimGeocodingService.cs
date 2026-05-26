using System.Globalization;
using System.Text.Json;
using Loca.API.Interfaces;
using Microsoft.Extensions.Logging;

namespace Loca.API.Services;

public sealed class NominatimGeocodingService : IGeocodingService
{
    private readonly HttpClient _http;
    private readonly ILogger<NominatimGeocodingService> _logger;

    public NominatimGeocodingService(HttpClient http, ILogger<NominatimGeocodingService> logger)
    {
        _http = http;
        _logger = logger;
    }

    public async Task<string?> ResolveCityAsync(double latitude, double longitude, CancellationToken ct = default)
    {
        var lat = latitude.ToString("G", CultureInfo.InvariantCulture);
        var lon = longitude.ToString("G", CultureInfo.InvariantCulture);
        var url = $"reverse?lat={lat}&lon={lon}&format=json&zoom=10&addressdetails=1";

        try
        {
            using var response = await _http.GetAsync(url, ct);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Nominatim returned {Status} for ({Lat},{Lon})", response.StatusCode, lat, lon);
                return null;
            }

            await using var stream = await response.Content.ReadAsStreamAsync(ct);
            using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: ct);

            if (!doc.RootElement.TryGetProperty("address", out var address))
                return null;

            // Прийнятні рівні: city → town → village → municipality → county → state
            foreach (var key in new[] { "city", "town", "village", "municipality", "county", "state" })
            {
                if (address.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.String)
                {
                    var name = value.GetString();
                    if (!string.IsNullOrWhiteSpace(name))
                        return name.Trim();
                }
            }

            return null;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogWarning(ex, "Failed reverse geocoding ({Lat},{Lon})", lat, lon);
            return null;
        }
    }
}
