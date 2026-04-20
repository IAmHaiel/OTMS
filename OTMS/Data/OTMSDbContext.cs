using Microsoft.EntityFrameworkCore;
using OTMS.Entities.Models;
using System;

namespace OTMS.Data
{
    public class OTMSDbContext(DbContextOptions<OTMSDbContext> options) : DbContext(options)
    {
        public DbSet<Employee> Employees { get; set; }
    }
}
