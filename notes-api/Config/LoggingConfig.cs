namespace NotesApi.Config;

/// <summary>
/// Configures Serilog structured logging with Elasticsearch sink.
/// </summary>
public static class LoggingConfig
{
    /// <summary>
    /// Configures Serilog with structured logging to console and Elasticsearch.
    /// Supports graceful fallback if Elasticsearch is unavailable.
    /// </summary>
    public static WebApplicationBuilder AddSerilogLogging(
        this WebApplicationBuilder builder)
    {
        var elasticsearchUrl = builder.Configuration.GetConnectionString("Elasticsearch")
            ?? "http://localhost:9200";

        var loggerConfig = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .Enrich.FromLogContext()
            .Enrich.WithEnvironmentName()
            .Enrich.WithMachineName()
            .Enrich.WithProcessId()
            .Enrich.WithThreadId()
            .WriteTo.Console(
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] {Message:lj}{NewLine}{Exception}");

        // Try to add Elasticsearch sink
        try
        {
            loggerConfig.WriteTo.Elasticsearch(
                new ElasticsearchSinkOptions(new Uri(elasticsearchUrl))
                {
                    IndexFormat = "notes-api-{0:yyyy.MM.dd}",
                    AutoRegisterTemplate = true,
                    AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv7,
                    NumberOfShards = 2,
                    NumberOfReplicas = 1,
                    FailureCallback = e => Console.WriteLine($"Unable to submit event to Elasticsearch: {e.MessageTemplate}"),
                    EmitEventFailure = EmitEventFailureHandling.WriteToSelfLog |
                                       EmitEventFailureHandling.RaiseCallback
                });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Could not configure Elasticsearch sink: {ex.Message}");
            Console.WriteLine("Continuing with console-only logging");
        }

        Log.Logger = loggerConfig.CreateLogger();
        builder.Host.UseSerilog();

        return builder;
    }
}
