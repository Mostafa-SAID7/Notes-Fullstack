---
name: EF Core manual migrations
description: What's required when writing EF Core migrations by hand instead of using dotnet-ef
---

When dotnet-ef global tool is unavailable, manual migrations need ALL of these to work:

1. **Migration file** (`YYYYMMDDHHMMSS_Name.cs`) with `Up()`/`Down()` methods
2. **Designer file** (`YYYYMMDDHHMMSS_Name.Designer.cs`) with `[Migration("ID")]` attribute and `BuildTargetModel` snapshot
3. **History record** inserted into `__EFMigrationsHistory`: `INSERT INTO "__EFMigrationsHistory" VALUES ('ID', '9.0.1')`
4. **Model snapshot** (`MyDbContextModelSnapshot.cs`) updated to match the new model

Without the designer file, EF doesn't recognize the migration ID and won't apply the `Up()` commands.

**Why:** EF uses `[Migration("ID")]` attribute (from designer file) to map migration class → migration ID. Without it, EF can't track the migration.

**How to apply:** If columns need to be added urgently, run the ALTER TABLE SQL directly, insert the history record manually, then update the snapshot and designer file so future migrations work cleanly.

**Suppressing PendingModelChangesWarning:** Add `.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))` to DbContext options when the snapshot doesn't perfectly match EF's computed model. This is safe if migrations are correctly applied.
