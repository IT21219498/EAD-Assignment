namespace EAD_Web.Server.DTOs
{
    public class SaveOrderDTO
    {
        public int InvoiceNo { get; set; }
        public CustomerRequest Customer { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }

        public string Address { get; set; }
        public List<OrderItemRequest> OrderItems { get; set; }
    }

    public class CustomerRequest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class OrderItemRequest
    {
        public string ? OrderItemId { get; set; }
        public ProductRequest Product { get; set; }
        public int Quantity { get; set; }
    }

    public class ProductRequest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}