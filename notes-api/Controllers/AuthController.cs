using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NotesApi.Database;
using NotesApi.DTOs;

namespace NotesApi.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(
    UserManager<IdentityUser> userManager,
    IConfiguration configuration,
    MyDbContext db,
    ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Username, email and password are required." });

        var existing = await userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
            return BadRequest(new { message = "An account with that email already exists." });

        var user = new IdentityUser
        {
            UserName = request.Username.Trim(),
            Email    = request.Email.Trim().ToLowerInvariant(),
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new { message = string.Join(" ", errors) });
        }

        await SeedNotesForUserAsync(user.Id);

        var token = GenerateJwt(user);
        logger.LogInformation("New user registered: {Email}", user.Email);
        return Ok(new AuthResponse(token, user.Email!, user.UserName!));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required." });

        var user = await userManager.FindByEmailAsync(request.Email.Trim().ToLowerInvariant());
        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = GenerateJwt(user);
        logger.LogInformation("User logged in: {Email}", user.Email);
        return Ok(new AuthResponse(token, user.Email!, user.UserName!));
    }

    private string GenerateJwt(IdentityUser user)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryHours = double.Parse(jwtSettings["ExpiryHours"] ?? "168");

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Name, user.UserName!),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
        };

        var token = new JwtSecurityToken(
            issuer:            jwtSettings["Issuer"],
            audience:          jwtSettings["Audience"],
            claims:            claims,
            expires:           DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task SeedNotesForUserAsync(string userId)
    {
        var now = DateTime.UtcNow;
        var seeds = new[]
        {
            new Database.Models.Note { UserId = userId, Title = "Welcome to Notes App!", Desc = "This is your notes app. Create, edit, pin and delete notes. Use colors and tags to stay organised. Click '+ New Note' to get started.", Color = "blue", Tags = "welcome,getting-started", IsPinned = true,  CreatedDate = now.AddDays(-7), UpdatedAt = now.AddDays(-7) },
            new Database.Models.Note { UserId = userId, Title = "Shopping List",          Desc = "Milk, Eggs, Bread, Butter, Coffee, Apples, Pasta, Olive Oil, Chicken, Spinach",                                                       Color = "green",  Tags = "personal,shopping",    IsPinned = false, CreatedDate = now.AddDays(-5), UpdatedAt = now.AddDays(-1) },
            new Database.Models.Note { UserId = userId, Title = "Project Ideas",          Desc = "1. Build a habit tracker\n2. Personal finance dashboard\n3. Blog about software architecture\n4. Contribute to open-source\n5. Learn Rust", Color = "purple", Tags = "ideas,projects,work",  IsPinned = true,  CreatedDate = now.AddDays(-4), UpdatedAt = now.AddDays(-2) },
            new Database.Models.Note { UserId = userId, Title = "Meeting Notes — Q2",     Desc = "Action items:\n- Review Q1 metrics by Friday\n- Prepare roadmap presentation\n- Assign feature owners\n- Schedule 1:1s\n- Update project board", Color = "yellow", Tags = "work,meetings",       IsPinned = false, CreatedDate = now.AddDays(-3), UpdatedAt = now.AddDays(-3) },
            new Database.Models.Note { UserId = userId, Title = "Book Recommendations",   Desc = "Reading:\n• Clean Code — Robert C. Martin\n\nUp next:\n• The Pragmatic Programmer\n• Designing Data-Intensive Applications\n• A Philosophy of Software Design", Color = "orange", Tags = "books,learning",       IsPinned = false, CreatedDate = now.AddDays(-6), UpdatedAt = now.AddDays(-6) },
            new Database.Models.Note { UserId = userId, Title = "Workout Routine",        Desc = "Mon: Chest & Triceps\nTue: Back & Biceps\nWed: Rest\nThu: Shoulders & Core\nFri: Legs\nSat: Cardio 30min\nSun: Rest\n\n3 sets × 12 reps.", Color = "red",    Tags = "health,fitness",       IsPinned = false, CreatedDate = now.AddDays(-2), UpdatedAt = now.AddDays(-2) },
            new Database.Models.Note { UserId = userId, Title = "API Design Tips",        Desc = "• Use nouns not verbs in endpoints\n• Version from day one (/api/v1/)\n• Return consistent error shapes\n• Use 201 for creation, 204 for deletion\n• Paginate large collections\n• Document with OpenAPI", Color = "pink",   Tags = "work,dev,reference",   IsPinned = false, CreatedDate = now.AddDays(-1), UpdatedAt = now.AddDays(-1) },
            new Database.Models.Note { UserId = userId, Title = "Dinner Recipes",         Desc = "Italian: Cacio e pepe, Tiramisu\nAsian: Korean BBQ tacos, Miso soup\nMediterranean: Shakshuka, Hummus\nComfort: Beef stew with crusty bread", Color = "brown",  Tags = "food,personal",        IsPinned = false, CreatedDate = now,             UpdatedAt = now             },
        };
        await db.Notes.AddRangeAsync(seeds);
        await db.SaveChangesAsync();
    }
}
