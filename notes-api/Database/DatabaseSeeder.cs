using NotesApi.Database.Models;

namespace NotesApi.Database;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(MyDbContext db, Microsoft.Extensions.Logging.ILogger logger)
    {
        if (db.Notes.Any())
        {
            logger.LogInformation("Database already has notes — skipping seed.");
            return;
        }

        var now = DateTime.UtcNow;
        var seeds = new List<Note>
        {
            new()
            {
                Title       = "Welcome to Notes App!",
                Desc        = "This is your new notes app. You can create, edit, pin, and delete notes. Use colors and tags to keep things organised. Click '+ New Note' to get started.",
                Color       = "blue",
                Tags        = "welcome,getting-started",
                IsPinned    = true,
                CreatedDate = now.AddDays(-7),
                UpdatedAt   = now.AddDays(-7),
            },
            new()
            {
                Title       = "Shopping List",
                Desc        = "Milk, Eggs, Bread, Butter, Coffee, Apples, Pasta, Olive Oil, Chicken, Spinach",
                Color       = "green",
                Tags        = "personal,shopping",
                IsPinned    = false,
                CreatedDate = now.AddDays(-5),
                UpdatedAt   = now.AddDays(-1),
            },
            new()
            {
                Title       = "Project Ideas",
                Desc        = "1. Build a habit tracker app\n2. Create a personal finance dashboard\n3. Write a blog about software architecture\n4. Contribute to an open-source project\n5. Learn Rust basics",
                Color       = "purple",
                Tags        = "ideas,projects,work",
                IsPinned    = true,
                CreatedDate = now.AddDays(-4),
                UpdatedAt   = now.AddDays(-2),
            },
            new()
            {
                Title       = "Meeting Notes — Q2 Planning",
                Desc        = "Action items:\n- Review Q1 metrics by Friday\n- Prepare roadmap presentation for stakeholders\n- Assign feature owners for each sprint\n- Schedule 1:1s with team members\n- Update project board",
                Color       = "yellow",
                Tags        = "work,meetings",
                IsPinned    = false,
                CreatedDate = now.AddDays(-3),
                UpdatedAt   = now.AddDays(-3),
            },
            new()
            {
                Title       = "Book Recommendations",
                Desc        = "Currently reading:\n• Clean Code — Robert C. Martin\n\nUp next:\n• The Pragmatic Programmer — Hunt & Thomas\n• Designing Data-Intensive Applications — Martin Kleppmann\n• A Philosophy of Software Design — John Ousterhout",
                Color       = "orange",
                Tags        = "books,learning",
                IsPinned    = false,
                CreatedDate = now.AddDays(-6),
                UpdatedAt   = now.AddDays(-6),
            },
            new()
            {
                Title       = "Workout Routine",
                Desc        = "Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Rest / Walk\nThursday: Shoulders & Core\nFriday: Legs\nSaturday: Cardio 30min\nSunday: Rest\n\nRemember: 3 sets × 12 reps each exercise.",
                Color       = "red",
                Tags        = "health,fitness,personal",
                IsPinned    = false,
                CreatedDate = now.AddDays(-2),
                UpdatedAt   = now.AddDays(-2),
            },
            new()
            {
                Title       = "API Design Tips",
                Desc        = "• Use nouns not verbs in endpoints\n• Version your API from day one (/api/v1/)\n• Return consistent error shapes\n• Use 201 for creation, 204 for deletion\n• Paginate large collections\n• Document with OpenAPI / Swagger\n• Validate inputs server-side always",
                Color       = "pink",
                Tags        = "work,dev,reference",
                IsPinned    = false,
                CreatedDate = now.AddDays(-1),
                UpdatedAt   = now.AddDays(-1),
            },
            new()
            {
                Title       = "Dinner Recipes to Try",
                Desc        = "Italian night: Cacio e pepe, Tiramisu\nAsian fusion: Korean BBQ tacos, Miso soup\nMediterranean: Shakshuka, Hummus from scratch\nComfort food: Beef stew with crusty bread\nQuick weeknight: 20-minute stir fry",
                Color       = "default",
                Tags        = "food,personal",
                IsPinned    = false,
                CreatedDate = now,
                UpdatedAt   = now,
            },
        };

        await db.Notes.AddRangeAsync(seeds);
        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} notes into the database.", seeds.Count);
    }
}
