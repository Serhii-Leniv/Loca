using Amazon.S3;
using Loca.API.Data;
using Loca.API.Interfaces;
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
    var s3Config = new AmazonS3Config
    {
        ServiceURL = $"http://{cfg["MinIO:Endpoint"]}",
        ForcePathStyle = true,
    };
    return new AmazonS3Client(cfg["MinIO:AccessKey"], cfg["MinIO:SecretKey"], s3Config);
});

builder.Services.AddControllers();
builder.Services.AddScoped<IStorageService, MinioStorageService>();

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

    options.AddSecurityRequirement((_) => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer"),
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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await BucketInitializer.EnsureBucketExistsAsync(app.Services);

app.Run();
