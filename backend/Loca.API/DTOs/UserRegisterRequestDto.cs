using System.ComponentModel.DataAnnotations;

namespace Loca.API.DTOs;

public sealed class UserRegisterRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;

    [Required]
    [MinLength(2)]
    public string Name { get; init; } = string.Empty;
}

