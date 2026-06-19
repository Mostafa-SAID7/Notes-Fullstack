namespace NotesApi.Config;

public static class CorsConfig
{
    public const string PolicyName = "DefaultCors";

    /// <summary>
    /// Registers the CORS policy.
    /// In production, replace AllowAnyOrigin with an explicit origins list.
    /// </summary>
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                // In production, replace with explicit allowed origins.
                // The Vite proxy tunnels all browser requests through localhost,
                // so direct browser-to-API calls only come from known origins.
                policy
                    .WithOrigins(
                        "http://localhost:5000",
                        "https://localhost:5000",
                        "http://localhost:5173"
                    )
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .SetIsOriginAllowed(origin =>
                        origin.Contains("localhost") ||
                        origin.Contains(".replit.dev") ||
                        origin.Contains(".repl.co"))
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithExposedHeaders("Content-Disposition");
            });
        });

        return services;
    }

    /// <summary>Applies the CORS policy to the middleware pipeline.</summary>
    public static IApplicationBuilder UseCorsPolicy(this IApplicationBuilder app)
        => app.UseCors(PolicyName);
}
