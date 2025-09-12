namespace Data.Chat;

public class MessageAttachment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MessageId { get; set; }
    public string Url { get; set; } = "";
    public string FileName { get; set; } = "";
    public long FileSize { get; set; }
    public string ContentType { get; set; } = "";
    public int? Width { get; set; }
    public int? Height { get; set; }

    public Message Message { get; set; } = null!;
}