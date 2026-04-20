using Microsoft.OpenApi.Models;

namespace NotesApi.Config;

public static class SwaggerConfig
{
    /// <summary>Registers Swagger / OpenAPI generation services.</summary>
    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title   = "Notes API",
                Version = "v1",
                Description = "REST API for the Notes fullstack application.",
            });
        });

        return services;
    }

    /// <summary>Enables the Swagger UI middleware (development only).</summary>
    public static IApplicationBuilder UseSwaggerDocs(this IApplicationBuilder app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Notes API v1");
            options.RoutePrefix = "swagger";
        });

        return app;
    }
}
