using Microsoft.EntityFrameworkCore;

namespace Data.Chat;

public class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options) { }

    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<ConversationMember> ConversationMembers => Set<ConversationMember>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<Conversation>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Type).HasMaxLength(16);
            e.HasMany(x => x.Members).WithOne(x => x.Conversation).HasForeignKey(x => x.ConversationId);
            e.HasMany(x => x.Messages).WithOne(x => x.Conversation).HasForeignKey(x => x.ConversationId);
        });

        b.Entity<ConversationMember>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.UserId, x.ConversationId }).IsUnique();
        });

        b.Entity<Message>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.ConversationId, x.CreatedAt });
        });

        b.Entity<MessageAttachment>(e => e.HasKey(x => x.Id));
    }
}
