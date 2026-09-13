using CoraConfecciones.Data;
using CoraConfecciones.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);


// ============================================
// BASE DE DATOS
// ============================================

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    );
});


// ============================================
// LOGIN / COOKIES
// ============================================

builder.Services
    .AddAuthentication(
        CookieAuthenticationDefaults.AuthenticationScheme
    )
    .AddCookie(options =>
    {
        options.LoginPath = "/login.html";

        options.Cookie.Name = "CoraAdmin";

        options.Cookie.HttpOnly = true;

        options.Cookie.SameSite =
            SameSiteMode.Strict;

        options.ExpireTimeSpan =
            TimeSpan.FromHours(2);

        options.Events.OnRedirectToLogin = context =>
        {
            if(context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode =
                    StatusCodes.Status401Unauthorized;

                return Task.CompletedTask;
            }

            context.Response.Redirect("/login.html");

            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();


// ============================================
// ARCHIVOS HTML / CSS / JS
// ============================================

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseAuthentication();

app.UseAuthorization();


// ============================================
// APLICAR MIGRACIONES
// ============================================

using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await db.Database.MigrateAsync();


    // ========================================
    // CREAR ADMIN INICIAL
    // ========================================

    var usuarioAdmin =
        builder.Configuration["Admin:Usuario"];

    var passwordAdmin =
        builder.Configuration["Admin:Password"];

    if(
        !string.IsNullOrWhiteSpace(usuarioAdmin) &&
        !string.IsNullOrWhiteSpace(passwordAdmin) &&
        !await db.Administradores.AnyAsync()
    )
    {
        var administrador = new Administrador
        {
            Usuario = usuarioAdmin
        };

        var hasher =
            new PasswordHasher<Administrador>();

        administrador.PasswordHash =
            hasher.HashPassword(
                administrador,
                passwordAdmin
            );

        db.Administradores.Add(administrador);

        await db.SaveChangesAsync();
    }
}


// ============================================
// LOGIN
// ============================================

app.MapPost(
    "/api/admin/login",
    async (
        LoginRequest datos,
        AppDbContext db,
        HttpContext http
    ) =>
    {
        var administrador =
            await db.Administradores
                .FirstOrDefaultAsync(
                    a => a.Usuario == datos.Usuario
                );

        if(administrador == null)
        {
            return Results.Unauthorized();
        }

        var hasher =
            new PasswordHasher<Administrador>();

        var resultado =
            hasher.VerifyHashedPassword(
                administrador,
                administrador.PasswordHash,
                datos.Password
            );

        if(resultado == PasswordVerificationResult.Failed)
        {
            return Results.Unauthorized();
        }

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.Name,
                administrador.Usuario
            ),

            new Claim(
                ClaimTypes.Role,
                "Administrador"
            )
        };

        var identidad =
            new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults
                    .AuthenticationScheme
            );

        var principal =
            new ClaimsPrincipal(identidad);

        await http.SignInAsync(
            CookieAuthenticationDefaults
                .AuthenticationScheme,
            principal
        );

        return Results.Ok(
            new
            {
                mensaje = "Login correcto"
            }
        );
    }
);


// ============================================
// LOGOUT
// ============================================

app.MapPost(
    "/api/admin/logout",
    async (HttpContext http) =>
    {
        await http.SignOutAsync(
            CookieAuthenticationDefaults
                .AuthenticationScheme
        );

        return Results.Ok();
    }
)
.RequireAuthorization();


// ============================================
// PANEL ADMIN
// ============================================

app.MapGet(
    "/admin",
    () =>
    {
        var archivo = Path.Combine(
            app.Environment.ContentRootPath,
            "Admin",
            "admin.html"
        );

        return Results.File(
            archivo,
            "text/html"
        );
    }
)
.RequireAuthorization();


// ============================================
// LISTAR SERVICIOS
// PÚBLICO
// ============================================

app.MapGet(
    "/api/servicios",
    async (AppDbContext db) =>
    {
        var servicios =
            await db.Servicios
                .Where(s => s.Activo)
                .OrderBy(s => s.Id)
                .ToListAsync();

        return Results.Ok(servicios);
    }
);


// ============================================
// OBTENER SERVICIO
// ============================================

app.MapGet(
    "/api/servicios/{id}",
    async (
        int id,
        AppDbContext db
    ) =>
    {
        var servicio =
            await db.Servicios.FindAsync(id);

        if(servicio == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(servicio);
    }
);


// ============================================
// AGREGAR SERVICIO
// ============================================

app.MapPost(
    "/api/servicios",
    async (
        Servicio servicio,
        AppDbContext db
    ) =>
    {
        if(string.IsNullOrWhiteSpace(servicio.Nombre))
        {
            return Results.BadRequest(
                new
                {
                    mensaje = "El nombre es obligatorio."
                }
            );
        }

        if(string.IsNullOrWhiteSpace(servicio.Descripcion))
        {
            return Results.BadRequest(
                new
                {
                    mensaje = "La descripción es obligatoria."
                }
            );
        }

        servicio.Activo = true;

        db.Servicios.Add(servicio);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/servicios/{servicio.Id}",
            servicio
        );
    }
)
.RequireAuthorization();


// ============================================
// EDITAR SERVICIO
// ============================================

app.MapPut(
    "/api/servicios/{id}",
    async (
        int id,
        Servicio actualizado,
        AppDbContext db
    ) =>
    {
        var servicio =
            await db.Servicios.FindAsync(id);

        if(servicio == null)
        {
            return Results.NotFound();
        }

        servicio.Nombre =
            actualizado.Nombre;

        servicio.Descripcion =
            actualizado.Descripcion;

        servicio.Precio =
            actualizado.Precio;

        servicio.Imagen =
            actualizado.Imagen;

        servicio.Activo =
            actualizado.Activo;

        await db.SaveChangesAsync();

        return Results.Ok(servicio);
    }
)
.RequireAuthorization();


// ============================================
// ELIMINAR SERVICIO
// ============================================

app.MapDelete(
    "/api/servicios/{id}",
    async (
        int id,
        AppDbContext db
    ) =>
    {
        var servicio =
            await db.Servicios.FindAsync(id);

        if(servicio == null)
        {
            return Results.NotFound();
        }

        db.Servicios.Remove(servicio);

        await db.SaveChangesAsync();

        return Results.Ok(
            new
            {
                mensaje =
                    "Servicio eliminado correctamente."
            }
        );
    }
)
.RequireAuthorization();

app.MapPost(
    "/api/admin/upload",
    async (HttpRequest request) =>
    {
        if(!request.HasFormContentType)
        {
            return Results.BadRequest(
                new { mensaje = "No se recibió una imagen." }
            );
        }

        var form = await request.ReadFormAsync();

        var archivo = form.Files.GetFile("imagen");

        if(archivo == null || archivo.Length == 0)
        {
            return Results.BadRequest(
                new { mensaje = "La imagen está vacía." }
            );
        }


        // Máximo 5 MB

        if(archivo.Length > 5 * 1024 * 1024)
        {
            return Results.BadRequest(
                new { mensaje = "La imagen no puede superar los 5 MB." }
            );
        }


        var tiposPermitidos = new[]
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        if(!tiposPermitidos.Contains(archivo.ContentType))
        {
            return Results.BadRequest(
                new
                {
                    mensaje =
                        "Solo se permiten JPG, PNG o WEBP."
                }
            );
        }


        var extension =
            Path.GetExtension(archivo.FileName)
                .ToLowerInvariant();


        var nombre =
            $"{Guid.NewGuid()}{extension}";


        var carpeta = Path.Combine(
            app.Environment.WebRootPath,
            "uploads"
        );


        Directory.CreateDirectory(carpeta);


        var rutaCompleta =
            Path.Combine(
                carpeta,
                nombre
            );


        await using var stream =
            new FileStream(
                rutaCompleta,
                FileMode.Create
            );


        await archivo.CopyToAsync(stream);


        var url =
            $"/uploads/{nombre}";


        return Results.Ok(
            new
            {
                url
            }
        );
    }
)
.RequireAuthorization();


app.Run();


record LoginRequest(
    string Usuario,
    string Password
);