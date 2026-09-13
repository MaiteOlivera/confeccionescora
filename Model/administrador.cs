namespace CoraConfecciones.Models;

public class Administrador
{
    public int Id { get; set; }

    public string Usuario { get; set; } = "";

    public string PasswordHash { get; set; } = "";
}