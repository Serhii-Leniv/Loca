namespace Loca.API.DTOs;

public sealed class UpdateProfileRequestDto
{
    public string Email { get; init; } = string.Empty;
    public string? City { get; init; }
}
