using CoraConfecciones.Models;
using Microsoft.EntityFrameworkCore;

namespace CoraConfecciones.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options
    ) : base(options)
    {
    }


    public DbSet<Servicio> Servicios =>
        Set<Servicio>();


    public DbSet<Administrador> Administradores =>
        Set<Administrador>();


    public DbSet<PreguntaFrecuente> PreguntasFrecuentes =>
        Set<PreguntaFrecuente>();


    public DbSet<ImagenGaleria> ImagenesGaleria =>
        Set<ImagenGaleria>();
}