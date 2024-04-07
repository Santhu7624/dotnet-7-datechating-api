using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.IO.Pipelines;
using Microsoft.AspNetCore.StaticFiles;

namespace API.Controllers
{
    
    public class FileController : BaseApiController
    {
        private readonly ILogger<FileController> _logger ;

        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
        }
        [HttpPost, DisableRequestSizeLimit]
        [Route("uploadfile")]
        public async Task<IActionResult> UploadFile()
        {
            try{
                //var file = Request.Form.Files[0];
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();
                
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if(file.Length > 0){
                    var fileName = ContentDispositionHeaderValue.
                                        Parse(file.ContentDisposition).FileName.Trim('"');

                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using(var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new {dbPath});
                }
                else{
                    return BadRequest();
                }
            }catch(Exception ex){
                return StatusCode(500, $"Internal server error: {ex}"); 
            }
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadfile")]
        public async  Task<IActionResult> DownloadFile([FromQuery] string fileUrl)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), fileUrl);
            
            if(!System.IO.File.Exists(filePath))
                return NotFound("Wrong File");
            
            var memoryStream = new MemoryStream();

            await using(var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }

            memoryStream.Position = 0;
            return File(memoryStream, GetContentType(filePath), filePath);

            
        }

        

        [HttpGet, DisableRequestSizeLimit]
        [Route("getemojis")]
        public async Task<IActionResult> GetEmojis()
        {
            var folderName = Path.Combine("Resources", "Images");
            _logger.LogInformation("Folder Name : "+ folderName);
            var pathToRead = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            _logger.LogInformation("Read File Path  : "+ pathToRead);
            // only get the photos
            var emojis = Directory.EnumerateFiles(pathToRead)
                                    .Where(isImageFile)
                                    .Select(fullPath => Path.Combine(folderName, Path.GetFileName(fullPath)));
                               
            
            return Ok(new {emojis});
        }


        private bool isImageFile(string fileName)
        {
            return fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
                    || fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                    || fileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase);
        }

        private string GetContentType(string filePath)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            
            if(!provider.TryGetContentType(filePath, out contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
    }
}