using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotesApi.DTOs;
using NotesApi.Features.Notes;

namespace NotesApi.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class NotesController(IMediator mediator) : ControllerBase
{
    private string UserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub")
        ?? throw new UnauthorizedAccessException("User ID claim missing.");

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NoteDto>>> GetAll()
    {
        var result = await mediator.Send(new GetAllNotesQuery(UserId));
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NoteDto>> GetById(int id)
    {
        var result = await mediator.Send(new GetNoteByIdQuery(UserId, id));
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<NoteDto>> Create([FromBody] CreateNoteRequest request)
    {
        var command = new CreateNoteCommand(
            UserId,
            request.Title,
            request.Desc,
            request.Color ?? "default",
            request.Tags ?? []);
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateNoteRequest request)
    {
        var command = new UpdateNoteCommand(
            UserId,
            request.Id,
            request.Title,
            request.Desc,
            request.Color ?? "default",
            request.Tags ?? []);
        var result = await mediator.Send(command);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpPatch("{id:int}/pin")]
    public async Task<IActionResult> Pin(int id, [FromBody] PinNoteRequest request)
    {
        var result = await mediator.Send(new PinNoteCommand(UserId, id, request.IsPinned));
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await mediator.Send(new DeleteNoteCommand(UserId, id));
        if (!success) return NotFound();
        return NoContent();
    }
}
