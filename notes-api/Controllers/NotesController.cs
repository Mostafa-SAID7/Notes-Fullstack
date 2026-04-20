using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApi.Database;
using NotesApi.Database.Models;

namespace NotesApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NotesController(MyDbContext db) : ControllerBase
{
    // GET api/Notes
    [HttpGet]
    public async Task<ActionResult<List<Note>>> GetAll()
        => await db.Notes.ToListAsync();

    // GET api/Notes/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Note>> GetById(int id)
    {
        var note = await db.Notes.FindAsync(id);
        return note is null ? NotFound() : note;
    }

    // POST api/Notes
    [HttpPost]
    public async Task<ActionResult<Note>> Create([FromBody] Note note)
    {
        note.CreatedDate = DateTime.UtcNow;
        db.Notes.Add(note);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = note.Id }, note);
    }

    // PUT api/Notes
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Note value)
    {
        var note = await db.Notes.FindAsync(value.Id);
        if (note is null) return NotFound();

        note.Title = value.Title;
        note.Desc  = value.Desc;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE api/Notes/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var note = await db.Notes.FindAsync(id);
        if (note is null) return NotFound();

        db.Notes.Remove(note);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
