using System.ComponentModel.DataAnnotations;

namespace EAD_Web.Server.DTOs
{
    public class StockDTO
    {
        public string Id { get; set; }
        public string? ProductId { get; set; }
        public string? ProductName { get; set; }
        public double? SellingPrice { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}