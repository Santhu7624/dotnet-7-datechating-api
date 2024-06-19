using Microsoft.EntityFrameworkCore;
using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
            IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
            IdentityRoleClaim<int>, IdentityUserToken<int>>
                
    {        
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<AppUser> Users { get; set; }

        public DbSet<UserLike> Likes {get;set;}

        public DbSet<Message> Messages { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<Connection> Connections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                        .HasMany(ur => ur.UserRoles)
                        .WithOne(u => u.User)
                        .HasForeignKey(ur => ur.UserId)
                        .IsRequired();

            modelBuilder.Entity<AppRole>()
                        .HasMany(ur => ur.UserRoles)
                        .WithOne(r => r.Role)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();

            modelBuilder.Entity<UserLike>()
                        .HasKey(k => new {k.SourceUserId, k.TargetUserId});

            modelBuilder.Entity<UserLike>()
                        .HasOne(s => s.SourceUser)
                        .WithMany(l => l.LikedUsers)
                        .HasForeignKey(s => s.SourceUserId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLike>()
                        .HasOne(s => s.TargetUser)
                        .WithMany(l => l.LikedByUsers)
                        .HasForeignKey(s => s.TargetUserId)
                        .OnDelete(DeleteBehavior.Cascade); //DeleteBehavior.NoAction (MS Sql Server)
            
            modelBuilder.Entity<Message>()
                        .HasOne(s => s.Recipient)
                        .WithMany(m => m.MessagesReceived)
                        .OnDelete(DeleteBehavior.Restrict);
                        
            modelBuilder.Entity<Message>()
                        .HasOne(s => s.Sender)
                        .WithMany(m => m.MessagesSent)
                        .OnDelete(DeleteBehavior.Restrict);
                        
        }
    }
}