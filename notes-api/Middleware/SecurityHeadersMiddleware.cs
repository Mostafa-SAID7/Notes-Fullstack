namespace NotesApi.Middleware;

/// <summary>
/// Adds HTTP security response headers on every request.
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        headers["X-Content-Type-Options"]    = "nosniff";
        headers["X-Frame-Options"]           = "DENY";
        headers["X-XSS-Protection"]          = "1; mode=block";
        headers["Referrer-Policy"]           = "strict-origin-when-cross-origin";
        headers["Permissions-Policy"]        = "camera=(), microphone=(), geolocation=()";
        headers["Cache-Control"]             = "no-store";
        headers["Pragma"]                    = "no-cache";

        // Remove headers that leak server implementation details
        context.Response.Headers.Remove("Server");
        context.Response.Headers.Remove("X-Powered-By");

        await _next(context);
    }
}
