using MediatR;

namespace NotesApi.Behaviors;

/// <summary>
/// MediatR pipeline behavior that logs request/response for all commands and queries.
/// </summary>
public class LoggingBehavior<TRequest, TResponse>(
    ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        logger.LogInformation("Executing {RequestName}", requestName);

        try
        {
            var response = await next();
            logger.LogInformation("Completed {RequestName} successfully", requestName);
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error executing {RequestName}", requestName);
            throw;
        }
    }
}
