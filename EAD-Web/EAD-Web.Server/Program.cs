using EAD_Web.Server.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;
using AspNetCore.Identity.MongoDbCore.Models;


var builder = WebApplication.CreateBuilder(args);

// Configure MongoDB settings
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// Register MongoDB client
builder.Services.AddSingleton<IMongoClient, MongoClient>(
    sp => new MongoClient(builder.Configuration.GetValue<string>("MongoDBSettings:ConnectionString")));

// Register MongoDBContext
builder.Services.AddScoped<MongoDBContext>();

// MongoDB connection string
var mongoConnectionString = "mongodb+srv://admin:admin@lms.vg1lyyk.mongodb.net/?retryWrites=true&w=majority&appName=LMS";


// Add Identity services
builder.Services.AddIdentity<Users, MongoIdentityRole<Guid>>()
    .AddMongoDbStores<Users, MongoIdentityRole<Guid>, Guid>(mongoConnectionString, "VendiCore")
    .AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
