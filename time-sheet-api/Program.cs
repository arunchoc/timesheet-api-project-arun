using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers().ConfigureApiBehaviorOptions((options) =>
{
    options.InvalidModelStateResponseFactory = (e) =>
    {
        var error = e.ModelState.Where(a => a.Value != null && a.Value.Errors.Count > 0).Select(a => a.Value!.Errors.Select(b => new { b.ErrorMessage, b.Exception, Field = a.Key })).SelectMany(a => a).FirstOrDefault();
        var responseMsg = new
        {
            Message = "Validation failed",
            Error = error

        };
        return new BadRequestObjectResult(responseMsg);
    };
});

// Enable CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
         policy => policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();
//Configure the HTTP request pipeline.
app.UseCors("AllowReactApp");  // Apply the CORS policy
                               // Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(
        options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "Version One");
        }
    );
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();

