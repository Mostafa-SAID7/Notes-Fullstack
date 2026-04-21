namespace NotesApi.Config;

/// <summary>
/// Configures MediatR pipeline with behaviors for validation, logging, and caching.
/// </summary>
public static class MediatRConfig
{
    /// <summary>
    /// Registers MediatR with all handlers and pipeline behaviors.
    /// Behaviors are executed in order: Validation → Logging → Cache Interceptor
    /// </summary>
    public static IServiceCollection AddMediatRPipeline(
        this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            cfg.AddOpenBehavior(typeof(CacheInterceptorBehavior<,>));
        });

        return services;
    }
}
