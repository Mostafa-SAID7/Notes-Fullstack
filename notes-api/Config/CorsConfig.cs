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
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod());
        });

        return services;
    }

    /// <summary>Applies the CORS policy to the middleware pipeline.</summary>
    public static IApplicationBuilder UseCorsPolicy(this IApplicationBuilder app)
        => app.UseCors(PolicyName);
}
