using API.Interfaces;
using API.Services;
using API.Extensions;
using API.Middleware;
using Microsoft.Extensions.FileProviders;
using API.Data;
using Microsoft.EntityFrameworkCore;
using ATT.Logger.Library;
using API.Helpers;
using Microsoft.AspNetCore.Identity;
using API.Entities;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerService(builder.Configuration);

builder.Services.AddApplicationService(builder.Configuration);

builder.Services.AddScoped<ITokenService, TokenService>();
// builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddSingleton<ILoggerService, LoggerService>();
builder.Services.AddScoped<LogUserActivity>();
// builder.Services.AddScoped<ILikeRepository, LikeRepository>();
// builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddSignalR();
builder.Services.AddSingleton<PresenceTracker>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddIdentityService(builder.Configuration);

builder.Services.AddMultiPartBodyLength(builder.Configuration);

builder.Host.UseSerilogExtension();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseCors("CORSPolicy");

app.UseStaticFiles();

app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
    RequestPath = new PathString("/Resources")
});

app.MapControllers();
app.MapHub<PresenceHub>("/hubs/presence");
app.MapHub<MessageHub>("/hubs/message");


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogInformation("Seeding Start!!!");
    var context = services.GetRequiredService<DataContext>();
    var usermanager = services.GetRequiredService<UserManager<AppUser>>();
    var rolemanager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    // context.Connections.RemoveRange(context.Connections);
    await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");
    await Seed.SeedUsers(usermanager, rolemanager);
    logger.LogInformation("Seeding End!!!");
}
catch(Exception ex){
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "Migration Error");
}

app.Run();
