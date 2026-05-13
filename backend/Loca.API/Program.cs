using Amazon.S3;
using Amazon.Runtime;
using Loca.API.Data;
using Loca.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Реєструємо базу даних у системі, вказуючи драйвер PostgreSQL та адресу підключення з файлу налаштувань.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<IAmazonS3>(_ =>
{
    var cfg = builder.Configuration;
    var endpoint = cfg["MinIO:Endpoint"] ?? "localhost:9000";
    var normalizedEndpoint = endpoint
        .Replace("https://", string.Empty, StringComparison.OrdinalIgnoreCase)
        .Replace("http://", string.Empty, StringComparison.OrdinalIgnoreCase)
        .Trim();

    var s3Config = new AmazonS3Config
    {
        UseHttp = true,
        ServiceURL = $"http://{normalizedEndpoint}",
        ForcePathStyle = true,
        RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED,
        ResponseChecksumValidation = ResponseChecksumValidation.WHEN_REQUIRED,
    };
    return new AmazonS3Client(cfg["MinIO:AccessKey"], cfg["MinIO:SecretKey"], s3Config);
});

builder.Services.AddControllers();
builder.Services.AddScoped<Loca.API.Interfaces.IStorageService, MinioStorageService>();
builder.Services.AddScoped<Loca.API.Interfaces.ITokenService, TokenService>();
builder.Services.AddScoped<Microsoft.AspNetCore.Identity.IPasswordHasher<Loca.API.Models.User>,
    Microsoft.AspNetCore.Identity.PasswordHasher<Loca.API.Models.User>>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDevServer", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSection = builder.Configuration.GetSection("JwtSettings");
        var issuer = jwtSection["Issuer"] ?? builder.Configuration["Jwt:Issuer"] ?? "LocaAPI";
        var audience = jwtSection["Audience"] ?? builder.Configuration["Jwt:Audience"] ?? "LocaAPIUsers";
        var secretKey = jwtSection["SecretKey"] ?? builder.Configuration["Jwt:SecretKey"] ?? "CHANGE_ME_TO_A_LONG_RANDOM_SECRET";

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.FromMinutes(5),
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Loca API", Version = "v1" });

    var bearerScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'",
    };

    options.AddSecurityDefinition("Bearer", bearerScheme);

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendDevServer");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await BucketInitializer.EnsureBucketExistsAsync(app.Services);

app.Run();
