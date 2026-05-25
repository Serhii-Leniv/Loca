using System.Net;
using System.Text;
using FluentAssertions;
using Loca.API.Services;
using Microsoft.Extensions.Logging.Abstractions;

namespace Loca.API.Tests.Services;

public sealed class NominatimGeocodingServiceTests
{
    [Fact]
    public async Task ResolveCityAsync_ShouldReturnCity_WhenAddressContainsCity()
    {
        var handler = new StubHandler((HttpStatusCode)200, """
            {"address":{"city":"Kyiv","country":"Ukraine"}}
        """);
        var service = CreateService(handler);

        var city = await service.ResolveCityAsync(50.45, 30.52);

        city.Should().Be("Kyiv");
        handler.LastRequestUri!.Query.Should().Contain("lat=50.45").And.Contain("lon=30.52");
    }

    [Fact]
    public async Task ResolveCityAsync_ShouldFallbackToTown_WhenCityMissing()
    {
        var handler = new StubHandler((HttpStatusCode)200, """
            {"address":{"town":"Bila Tserkva"}}
        """);
        var service = CreateService(handler);

        var city = await service.ResolveCityAsync(49.8, 30.1);

        city.Should().Be("Bila Tserkva");
    }

    [Fact]
    public async Task ResolveCityAsync_ShouldReturnNull_WhenResponseHasNoAddress()
    {
        var handler = new StubHandler((HttpStatusCode)200, "{}");
        var service = CreateService(handler);

        var city = await service.ResolveCityAsync(0, 0);

        city.Should().BeNull();
    }

    [Fact]
    public async Task ResolveCityAsync_ShouldReturnNull_OnNon2xx()
    {
        var handler = new StubHandler(HttpStatusCode.InternalServerError, "");
        var service = CreateService(handler);

        var city = await service.ResolveCityAsync(0, 0);

        city.Should().BeNull();
    }

    private static NominatimGeocodingService CreateService(HttpMessageHandler handler)
    {
        var client = new HttpClient(handler) { BaseAddress = new Uri("https://nominatim.test/") };
        return new NominatimGeocodingService(client, NullLogger<NominatimGeocodingService>.Instance);
    }

    private sealed class StubHandler : HttpMessageHandler
    {
        private readonly HttpStatusCode _status;
        private readonly string _body;

        public StubHandler(HttpStatusCode status, string body)
        {
            _status = status;
            _body = body;
        }

        public Uri? LastRequestUri { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            LastRequestUri = request.RequestUri;
            return Task.FromResult(new HttpResponseMessage(_status)
            {
                Content = new StringContent(_body, Encoding.UTF8, "application/json"),
            });
        }
    }
}
