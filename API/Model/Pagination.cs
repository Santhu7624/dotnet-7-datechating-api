namespace API.Model
{
    public class Pagination
    {
        
        public Pagination(int currentPage, int itemsPerPage, int totalItems, int totalPages) 
        {
            CurrentPage = currentPage;
            ItemsPerPage = itemsPerPage;
            TotalItems = totalItems;
            TotalPages = totalPages;
   
        }

        public int CurrentPage { get; set; }

        public int ItemsPerPage { get; set; }

        public int TotalItems { get; set; }

        public int TotalPages { get; set; }

        //public IReadOnlyList<T> Data {get; set;}
    }
}