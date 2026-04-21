using UnitOfWorkImpl = NotesApi.UnitOfWork.UnitOfWork;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog Logging ───────────────────────────────────────────────────────────
builder.AddSerilogLogging();

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddRedisCache(builder.Configuration);
builder.Services.AddScoped<IUnitOfWork, UnitOfWorkImpl>();
builder.Services.AddCorsPolicy();
builder.Services.AddSwagger();
builder.Services.AddMediatRPipeline();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddValidation();

// ── App Pipeline ──────────────────────────────────────────────────────────────
var app = builder.Build();

await app.InitialiseDatabaseAsync();

if (app.Environment.IsDevelopment())
    app.UseSwaggerDocs();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCorsPolicy();
app.UseAuthorization();
app.MapControllers();

try
{
    app.Logger.LogInformation("Starting Notes API application");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

/// <summary>
/// Program class for integration testing
/// </summary>
public partial class Program { }
