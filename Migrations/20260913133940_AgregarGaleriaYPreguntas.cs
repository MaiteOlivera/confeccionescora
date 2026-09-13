using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoraConfecciones.Migrations
{
    /// <inheritdoc />
    public partial class AgregarGaleriaYPreguntas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImagenesGaleria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Titulo = table.Column<string>(type: "TEXT", nullable: false),
                    Imagen = table.Column<string>(type: "TEXT", nullable: false),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImagenesGaleria", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PreguntasFrecuentes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Pregunta = table.Column<string>(type: "TEXT", nullable: false),
                    Respuesta = table.Column<string>(type: "TEXT", nullable: false),
                    Activo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreguntasFrecuentes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImagenesGaleria");

            migrationBuilder.DropTable(
                name: "PreguntasFrecuentes");
        }
    }
}
