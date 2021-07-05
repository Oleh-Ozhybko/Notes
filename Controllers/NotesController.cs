using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NoteCore.Models;
using Microsoft.EntityFrameworkCore;

namespace NoteCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        NoteContext noteContext;
        public NotesController(NoteContext context)
        {
            noteContext = context;
            if (!noteContext.Notes.Any())
            {
                noteContext.Notes.Add(new Note { CreationDate = DateTime.Now, Description = "Desc", Title ="first" });
                noteContext.Notes.Add(new Note { CreationDate = DateTime.Now, Description = "Desc", Title = "second" });
                noteContext.SaveChanges();
            }
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Note>>> Get()
        {
            return await noteContext.Notes.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> Get(int id)
        {
            Note note = await noteContext.Notes.FirstOrDefaultAsync(i => i.Id == id);
            if (note == null)
            {
                return NotFound();
            }
            return new ObjectResult(note);
        }
        [HttpPost]
        public async Task<ActionResult<Note>> Post(Note note)
        {
            if (note == null)
                return BadRequest();
            noteContext.Notes.Add(note);
            await noteContext.SaveChangesAsync();

            return Ok(note);
        }
        [HttpPut]
        public async Task<ActionResult<Note>> Put(Note note)
        {
            if (note == null)
                return BadRequest();
         
            if (!noteContext.Notes.Any(i => i.Id == note.Id))
                return NotFound();

            noteContext.Update(note);
            await noteContext.SaveChangesAsync();
            return Ok(note);
        }
        [HttpDelete]
        public async Task<ActionResult<Note>> Delete(int id)
        {
            Note note = noteContext.Notes.FirstOrDefault(i => i.Id == id);
            if (note == null)
                return NotFound();

            noteContext.Notes.Remove(note);
            await noteContext.SaveChangesAsync();
            return Ok(note);
        }
    }
}
