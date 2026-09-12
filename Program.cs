var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

var servicios = new List<Servicio>
{
    new Servicio
    {
        Id = 1,
        Nombre = "Confección a medida",
        Descripcion = "Prendas confeccionadas de forma personalizada."
    },
    new Servicio
    {
        Id = 2,
        Nombre = "Arreglos de prendas",
        Descripcion = "Ajustes y modificaciones según tus necesidades."
    }
};


// ============================================
// OBTENER TODOS LOS SERVICIOS
// ============================================

app.MapGet("/api/servicios", () =>
{
    return Results.Ok(servicios);
});


// ============================================
// OBTENER UN SERVICIO POR ID
// ============================================

app.MapGet("/api/servicios/{id}", (int id) =>
{
    var servicio = servicios.FirstOrDefault(s => s.Id == id);

    if (servicio == null)
    {
        return Results.NotFound(
            new
            {
                mensaje = "Servicio no encontrado."
            }
        );
    }

    return Results.Ok(servicio);
});


// ============================================
// AGREGAR SERVICIO
// ============================================

app.MapPost("/api/servicios", (Servicio servicio) =>
{
    if (string.IsNullOrWhiteSpace(servicio.Nombre))
    {
        return Results.BadRequest(
            new
            {
                mensaje = "El nombre es obligatorio."
            }
        );
    }

    if (string.IsNullOrWhiteSpace(servicio.Descripcion))
    {
        return Results.BadRequest(
            new
            {
                mensaje = "La descripción es obligatoria."
            }
        );
    }

    servicio.Id = servicios.Count == 0
        ? 1
        : servicios.Max(s => s.Id) + 1;

    servicios.Add(servicio);

    return Results.Created(
        $"/api/servicios/{servicio.Id}",
        servicio
    );
});


// ============================================
// EDITAR SERVICIO
// ============================================

app.MapPut("/api/servicios/{id}", (int id, Servicio servicioActualizado) =>
{
    var servicio = servicios.FirstOrDefault(s => s.Id == id);

    if (servicio == null)
    {
        return Results.NotFound(
            new
            {
                mensaje = "Servicio no encontrado."
            }
        );
    }

    if (string.IsNullOrWhiteSpace(servicioActualizado.Nombre))
    {
        return Results.BadRequest(
            new
            {
                mensaje = "El nombre es obligatorio."
            }
        );
    }

    if (string.IsNullOrWhiteSpace(servicioActualizado.Descripcion))
    {
        return Results.BadRequest(
            new
            {
                mensaje = "La descripción es obligatoria."
            }
        );
    }

    servicio.Nombre = servicioActualizado.Nombre;
    servicio.Descripcion = servicioActualizado.Descripcion;

    return Results.Ok(servicio);
});


// ============================================
// ELIMINAR SERVICIO
// ============================================

app.MapDelete("/api/servicios/{id}", (int id) =>
{
    var servicio = servicios.FirstOrDefault(s => s.Id == id);

    if (servicio == null)
    {
        return Results.NotFound(
            new
            {
                mensaje = "Servicio no encontrado."
            }
        );
    }

    servicios.Remove(servicio);

    return Results.Ok(
        new
        {
            mensaje = "Servicio eliminado correctamente."
        }
    );
});


app.Run();


// ============================================
// CLASE SERVICIO
// ============================================

class Servicio
{
    public int Id { get; set; }

    public string Nombre { get; set; } = "";

    public string Descripcion { get; set; } = "";
}