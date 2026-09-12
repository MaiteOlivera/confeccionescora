using CoraConfecciones.Data;
using CoraConfecciones.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


// ============================================
// OBTENER TODOS LOS SERVICIOS
// ============================================

app.MapGet("/api/servicios", async (AppDbContext db) =>
{
    var servicios = await db.Servicios.ToListAsync();

    return Results.Ok(servicios);
});


// ============================================
// OBTENER SERVICIO POR ID
// ============================================

app.MapGet("/api/servicios/{id}", async (
    int id,
    AppDbContext db
) =>
{
    var servicio = await db.Servicios.FindAsync(id);

    if (servicio == null)
    {
        return Results.NotFound();
    }

    return Results.Ok(servicio);
});


// ============================================
// AGREGAR SERVICIO
// ============================================

app.MapPost("/api/servicios", async (
    Servicio servicio,
    AppDbContext db
) =>
{
    db.Servicios.Add(servicio);

    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/servicios/{servicio.Id}",
        servicio
    );
});


// ============================================
// EDITAR SERVICIO
// ============================================

app.MapPut("/api/servicios/{id}", async (
    int id,
    Servicio actualizado,
    AppDbContext db
) =>
{
    var servicio = await db.Servicios.FindAsync(id);

    if (servicio == null)
    {
        return Results.NotFound();
    }

    servicio.Nombre = actualizado.Nombre;
    servicio.Descripcion = actualizado.Descripcion;
    servicio.Precio = actualizado.Precio;
    servicio.Imagen = actualizado.Imagen;
    servicio.Activo = actualizado.Activo;

    await db.SaveChangesAsync();

    return Results.Ok(servicio);
});


// ============================================
// ELIMINAR SERVICIO
// ============================================

app.MapDelete("/api/servicios/{id}", async (
    int id,
    AppDbContext db
) =>
{
    var servicio = await db.Servicios.FindAsync(id);

    if (servicio == null)
    {
        return Results.NotFound();
    }

    db.Servicios.Remove(servicio);

    await db.SaveChangesAsync();

    return Results.Ok(
        new
        {
            mensaje = "Servicio eliminado correctamente"
        }
    );
});


app.Run();