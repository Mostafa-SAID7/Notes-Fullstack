namespace NotesApi.Config;

/// <summary>
/// Configures FluentValidation for the application.
/// </summary>
public static class ValidationConfig
{
    /// <summary>
    /// Registers all validators from the assembly containing the Program class.
    /// </summary>
    public static IServiceCollection AddValidation(
        this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<Program>();
        return services;
    }
}
