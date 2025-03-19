using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using static API.DTOs.ProgressDTO;
using System.Net.Http.Headers;

namespace Tests.Controllers
{
    public class ProgressControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public ProgressControllerTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        /// ✅ **Test API: Enroll Course (Ghi danh khóa học)**
        [Fact]
        public async Task EnrollCourse_ReturnsSuccess()
        {
            // 🟢 Thiết lập token hợp lệ (Bạn tự dán token thật của bạn vào đây)
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3NDIzNjEzMDYsImlzcyI6Ik9MTVMiLCJhdWQiOiJPTE1TVXNlcnMifQ.BQxSIyFjR8kannHOwmrw0QNiL0z0-WqdYw56fC6lax0");

            var request = new { CourseId = 22 };
            var response = await _client.PostAsJsonAsync("/api/progress/enroll", request);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        ///// ✅ **Test API: Update Progress (Cập nhật tiến trình)**
        //[Fact]
        //public async Task UpdateProgress_ReturnsSuccess()
        //{
        //    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "your-access-token");

        //    var request = new ProgressUpdateDto
        //    {
        //        LessonId = 5,
        //        ProgressPercentage = 50
        //    };

        //    var response = await _client.PutAsJsonAsync("/api/progress/update", request);

        //    response.StatusCode.Should().Be(HttpStatusCode.OK);
        //}

        ///// ✅ **Test API: Get User Progress (Lấy tiến trình khóa học)**
        //[Fact]
        //public async Task GetUserProgress_ReturnsSuccess()
        //{
        //    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "your-access-token");

        //    var response = await _client.GetAsync("/api/progress/user/22");

        //    response.StatusCode.Should().Be(HttpStatusCode.OK);

        //    var progress = await response.Content.ReadFromJsonAsync<UserProgressDto>();

        //    progress.Should().NotBeNull();
        //    progress.CourseId.Should().Be(22);
        //}

        /// ✅ **Test API: Get Enrollments (Admin)**
        [Fact]
        public async Task GetEnrollments_ReturnsSuccess()
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3NDIzNjEzMDYsImlzcyI6Ik9MTVMiLCJhdWQiOiJPTE1TVXNlcnMifQ.BQxSIyFjR8kannHOwmrw0QNiL0z0-WqdYw56fC6lax0");

            var response = await _client.GetAsync("/api/progress/admin/enrollments");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        /// ✅ **Test API: Get Progress Statistics (Admin)**
        [Fact]
        public async Task GetProgressStatistics_ReturnsSuccess()
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3NDIzNjEzMDYsImlzcyI6Ik9MTVMiLCJhdWQiOiJPTE1TVXNlcnMifQ.BQxSIyFjR8kannHOwmrw0QNiL0z0-WqdYw56fC6lax0");

            var response = await _client.GetAsync("/api/progress/admin/statistics");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
