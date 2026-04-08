using Loca.API.Models;

namespace Loca.API.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}

