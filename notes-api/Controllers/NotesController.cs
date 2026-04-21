using MediatR;
using Microsoft.AspNetCore.Mvc;
using NotesApi.DTOs;
using NotesApi.Features.Notes;

namespace NotesApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NotesController(IMediator mediator) : ControllerBase
{
    // GET api/Notes
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NoteDto>>> GetAll()
    {
        var result = await mediator.Send(new GetAllNotesQuery());
        return Ok(result);
    }

    // GET api/Notes/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<NoteDto>> GetById(int id)
    {
        var result = await mediator.Send(new GetNoteByIdQuery(id));
        if (result is null)
            return NotFound();

        return Ok(result);
    }

    // POST api/Notes
    [HttpPost]
    public async Task<ActionResult<NoteDto>> Create([FromBody] CreateNoteRequest request)
    {
        var command = new CreateNoteCommand(request.Title, request.Desc);
        var result = await mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // PUT api/Notes
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateNoteRequest request)
    {
        var command = new UpdateNoteCommand(request.Id, request.Title, request.Desc);
        var result = await mediator.Send(command);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    // DELETE api/Notes/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var command = new DeleteNoteCommand(id);
        var success = await mediator.Send(command);

        if (!success)
            return NotFound();

        return NoContent();
    }
}
