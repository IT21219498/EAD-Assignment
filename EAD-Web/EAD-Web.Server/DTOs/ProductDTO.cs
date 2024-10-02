using System.ComponentModel.DataAnnotations;

namespace EAD_Web.Server.DTOs
{
    public class ProductDto
    {
        public string? Id { get; set; }
        [Required]
        public string Name { get; set; }

        [Required]
        public string Code { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public double Price { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Cost must be greater than zero.")]
        public double Cost { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Reorder Level must be at least 1.")]
        public int ReorderLevel { get; set; }

        [Required]
        public string CategoryId { get; set; }

        [Required]
        public string MeasurementUnitId { get; set; }

        public string Description { get; set; }

        public int? ItemPerCase { get; set; }

        public string? SupplierId { get; set; }

        public string? ImageUrl { get; set; }
        public string? CategoryName { get; set; }
        public string? MeasurementUnitName { get; set; }
        public bool? IsActive { get; set; }
    }
}
