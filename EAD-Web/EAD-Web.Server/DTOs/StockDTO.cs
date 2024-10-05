using System.ComponentModel.DataAnnotations;

namespace EAD_Web.Server.DTOs
{
    public class StockDTO
    {
        public string Id { get; set; }
        [Required]
        public string ProductId { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}