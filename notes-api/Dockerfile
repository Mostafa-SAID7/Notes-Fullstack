# ── Build stage ──────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore dependencies first (layer cache)
COPY notes-api.csproj ./
RUN dotnet restore --locked-mode 2>/dev/null || dotnet restore

# Copy source and publish
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5272
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5272

ENTRYPOINT ["dotnet", "NotesApi.dll"]
