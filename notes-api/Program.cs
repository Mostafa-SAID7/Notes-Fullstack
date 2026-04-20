using NotesApi.Config;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddCorsPolicy();
builder.Services.AddSwagger();

// ── App pipeline ──────────────────────────────────────────────────────────────
var app = builder.Build();

await app.InitialiseDatabaseAsync();

if (app.Environment.IsDevelopment())
    app.UseSwaggerDocs();

app.UseCorsPolicy();
app.UseAuthorization();
app.MapControllers();

app.Run();
