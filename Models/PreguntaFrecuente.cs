namespace CoraConfecciones.Models;

public class PreguntaFrecuente
{
    public int Id { get; set; }

    public string Pregunta { get; set; } = "";

    public string Respuesta { get; set; } = "";

    public bool Activo { get; set; } = true;
}