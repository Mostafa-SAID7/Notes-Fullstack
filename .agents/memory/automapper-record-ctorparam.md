---
name: AutoMapper records ForCtorParam
description: AutoMapper requires ForCtorParam (not ForMember) when mapping to C# record constructor parameters
---

When the destination type is a C# `record` (positional constructor), AutoMapper maps via constructor parameters, not properties. `ForMember` only works for property-based setters.

**Rule:** Use `ForCtorParam("paramName", opt => opt.MapFrom(...))` for records.

**Example (string → List<string> for comma-separated Tags field):**
```csharp
CreateMap<Note, NoteDto>()
    .ForCtorParam("tags", opt => opt.MapFrom(src =>
        string.IsNullOrWhiteSpace(src.Tags)
            ? new List<string>()
            : src.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries)
                      .Select(t => t.Trim())
                      .Where(t => !string.IsNullOrWhiteSpace(t))
                      .ToList()));
```

**Why:** Records use constructor injection; AutoMapper's `ForMember` targets property setters which records don't expose for constructor parameters.

**How to apply:** Whenever a DTO is a `record` with constructor params that need custom mapping, use `ForCtorParam` with the lowercase parameter name matching the constructor argument name.
