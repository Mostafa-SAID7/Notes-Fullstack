using NotesApi.Database;
using NotesApi.Database.Models;
using Microsoft.AspNetCore.Mvc;

namespace NotesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public NotesController(MyDbContext db)
        {
            _db = db;
        }

        // GET api/notes
        [HttpGet]
        public ActionResult<List<Note>> Get()
        {
            return _db.Notes.ToList();
        }

        // GET api/notes/5
        [HttpGet("{id}")]
        public ActionResult<Note> Get(int id)
        {
            var note = _db.Notes.FirstOrDefault(x => x.Id == id);
            if (note == null) return NotFound();
            return note;
        }

        // POST api/notes
        [HttpPost]
        public ActionResult Post([FromBody] Note value)
        {
            value.CreatedDate = DateTime.UtcNow;
            _db.Notes.Add(value);
            _db.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = value.Id }, value);
        }

        // PUT api/notes
        [HttpPut]
        public ActionResult Put([FromBody] Note value)
        {
            var note = _db.Notes.FirstOrDefault(x => x.Id == value.Id);
            if (note == null) return NotFound();

            note.Title = value.Title;
            note.Desc = value.Desc;
            _db.SaveChanges();
            return NoContent();
        }

        // DELETE api/notes/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var note = _db.Notes.FirstOrDefault(x => x.Id == id);
            if (note == null) return NotFound();

            _db.Notes.Remove(note);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
