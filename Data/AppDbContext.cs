using Microsoft.EntityFrameworkCore;
using CoraConfecciones.Models;

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
}