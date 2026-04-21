namespace NotesApi.Config;

/// <summary>
/// Configures structured logging with appropriate log levels per namespace.
/// </summary>
public static class LoggingConfig
{
    /// <summary>
    /// Adds structured logging configuration to the logging builder.
    /// Sets log levels by namespace for better control over output verbosity.
    /// </summary>
    public static ILoggingBuilder AddStructuredLogging(
        this ILoggingBuilder logging,
        IConfiguration configuration)
    {
        logging.ClearProviders();
        logging.AddConsole();
        logging.AddDebug();

        // Set log levels by namespace
        logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.Warning);
        logging.AddFilter("Microsoft.AspNetCore", LogLevel.Information);
        logging.AddFilter("NotesApi", LogLevel.Debug);

        return logging;
    }
}
