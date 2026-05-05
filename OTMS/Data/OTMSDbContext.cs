using Microsoft.EntityFrameworkCore;
using OTMS.Entities.Models;
using System;

namespace OTMS.Data
{
    public class OTMSDbContext(DbContextOptions<OTMSDbContext> options) : DbContext(options)
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Entities.Models.Task> Tasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
    }
}
