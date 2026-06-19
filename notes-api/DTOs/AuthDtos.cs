namespace NotesApi.DTOs;

public sealed record RegisterRequest(string Username, string Email, string Password);
public sealed record LoginRequest(string Email, string Password);
public sealed record AuthResponse(string Token, string Email, string Username);
