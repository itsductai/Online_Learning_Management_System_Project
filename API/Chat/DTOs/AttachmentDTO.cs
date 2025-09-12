namespace API.Chat.DTOs;

public class AttachmentDTO
{
    public Guid Id { get; set; }
    public string Url { get; set; } = "";
    public string FileName { get; set; } = "";
    public long FileSize { get; set; }
    public string ContentType { get; set; } = "";
    public int? Width { get; set; }
    public int? Height { get; set; }
}