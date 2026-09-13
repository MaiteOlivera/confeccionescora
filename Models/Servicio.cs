namespace CoraConfecciones.Models;

public class Servicio
{
    public int Id { get; set; }

    public string Nombre { get; set; } = "";

    public string Descripcion { get; set; } = "";

    public decimal? Precio { get; set; }

    public string? Imagen { get; set; }

    public bool Activo { get; set; } = true;
}