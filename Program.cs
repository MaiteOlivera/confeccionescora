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
// AUTENTICACIÓN
// ============================================

builder.Services
    .AddAuthentication(
        CookieAuthenticationDefaults.AuthenticationScheme
    )
    .AddCookie(options =>
    {
        options.LoginPath="/login.html";

        options.Cookie.Name="CoraAdmin";

        options.Cookie.HttpOnly=true;

        options.Cookie.SameSite=
            SameSiteMode.Strict;

        options.Cookie.SecurePolicy=
            CookieSecurePolicy.SameAsRequest;

        options.ExpireTimeSpan=
            TimeSpan.FromHours(2);

        options.Events.OnRedirectToLogin=context =>
        {
            if(
                context.Request.Path
                    .StartsWithSegments("/api")
            )
            {
                context.Response.StatusCode=
                    StatusCodes.Status401Unauthorized;

                return Task.CompletedTask;
            }

            context.Response.Redirect(
                "/login.html"
            );

            return Task.CompletedTask;
        };
    });


builder.Services.AddAuthorization();


var app=builder.Build();


app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();


// ============================================
// CREAR ADMINISTRADOR INICIAL
// ============================================

using(var scope=app.Services.CreateScope())
{
    var db=
        scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

    var usuarioAdmin=
        builder.Configuration["Admin:Usuario"];

    var passwordAdmin=
        builder.Configuration["Admin:Password"];

    if(
        !string.IsNullOrWhiteSpace(usuarioAdmin)
        &&
        !string.IsNullOrWhiteSpace(passwordAdmin)
        &&
        !await db.Administradores.AnyAsync()
    )
    {
        var administrador=
            new Administrador
            {
                Usuario=usuarioAdmin
            };

        var hasher=
            new PasswordHasher<Administrador>();

        administrador.PasswordHash=
            hasher.HashPassword(
                administrador,
                passwordAdmin
            );

        db.Administradores.Add(
            administrador
        );

        await db.SaveChangesAsync();
    }
}


// ============================================
// LOGIN ADMIN
// ============================================

app.MapPost(
    "/api/admin/login",
    async (
        LoginRequest datos,
        AppDbContext db,
        HttpContext http
    ) =>
    {
        var administrador=
            await db.Administradores
                .FirstOrDefaultAsync(
                    a=>a.Usuario==datos.Usuario
                );

        if(administrador==null)
        {
            return Results.Unauthorized();
        }

        var hasher=
            new PasswordHasher<Administrador>();

        var resultado=
            hasher.VerifyHashedPassword(
                administrador,
                administrador.PasswordHash,
                datos.Password
            );

        if(
            resultado==
            PasswordVerificationResult.Failed
        )
        {
            return Results.Unauthorized();
        }

        var claims=
            new List<Claim>
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

        var identidad=
            new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults
                    .AuthenticationScheme
            );

        var principal=
            new ClaimsPrincipal(
                identidad
            );

        await http.SignInAsync(
            CookieAuthenticationDefaults
                .AuthenticationScheme,
            principal
        );

        return Results.Ok(
            new
            {
                mensaje=
                    "Login correcto"
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
// PANEL ADMIN PROTEGIDO
// ============================================

app.MapGet(
    "/admin",
    () =>
    {
        var archivo=
            Path.Combine(
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
// SERVICIOS PÚBLICOS
// ============================================

app.MapGet(
    "/api/servicios",
    async (AppDbContext db) =>
    {
        var servicios=
            await db.Servicios
                .Where(s=>s.Activo)
                .ToListAsync();

        return Results.Ok(servicios);
    }
);


app.MapGet(
    "/api/servicios/{id}",
    async (
        int id,
        AppDbContext db
    ) =>
    {
        var servicio=
            await db.Servicios.FindAsync(id);

        if(servicio==null)
        {
            return Results.NotFound();
        }

        return Results.Ok(servicio);
    }
);


// ============================================
// AGREGAR SERVICIO
// SOLO ADMIN
// ============================================

app.MapPost(
    "/api/servicios",
    async (
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
    }
)
.RequireAuthorization();


// ============================================
// EDITAR SERVICIO
// SOLO ADMIN
// ============================================

app.MapPut(
    "/api/servicios/{id}",
    async (
        int id,
        Servicio actualizado,
        AppDbContext db
    ) =>
    {
        var servicio=
            await db.Servicios.FindAsync(id);

        if(servicio==null)
        {
            return Results.NotFound();
        }

        servicio.Nombre=
            actualizado.Nombre;

        servicio.Descripcion=
            actualizado.Descripcion;

        servicio.Precio=
            actualizado.Precio;

        servicio.Imagen=
            actualizado.Imagen;

        servicio.Activo=
            actualizado.Activo;

        await db.SaveChangesAsync();

        return Results.Ok(servicio);
    }
)
.RequireAuthorization();


// ============================================
// ELIMINAR SERVICIO
// SOLO ADMIN
// ============================================

app.MapDelete(
    "/api/servicios/{id}",
    async (
        int id,
        AppDbContext db
    ) =>
    {
        var servicio=
            await db.Servicios.FindAsync(id);

        if(servicio==null)
        {
            return Results.NotFound();
        }

        db.Servicios.Remove(servicio);

        await db.SaveChangesAsync();

        return Results.Ok(
            new
            {
                mensaje=
                    "Servicio eliminado"
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

