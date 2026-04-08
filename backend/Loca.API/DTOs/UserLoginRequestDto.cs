using System.ComponentModel.DataAnnotations;

namespace Loca.API.DTOs;

public sealed class UserLoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;
}

