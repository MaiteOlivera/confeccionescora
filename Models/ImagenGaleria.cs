namespace CoraConfecciones.Models;

public class ImagenGaleria
{
    public int Id { get; set; }

    public string Titulo { get; set; } = "";

    public string Imagen { get; set; } = "";

    public bool Activo { get; set; } = true;
}