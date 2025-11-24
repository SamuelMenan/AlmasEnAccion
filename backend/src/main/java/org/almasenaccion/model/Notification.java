package org.almasenaccion.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.UUID;

@Document(collection = "notifications")
public class Notification {
  @Id
  private String id;
  private String userId;
  private String title;
  private String message;
  private String link;
  private boolean read;
  private boolean priority;
  private String activityId;
  private Instant createdAt;

  public void initOnCreate() {
    this.id = UUID.randomUUID().toString();
    this.createdAt = Instant.now();
    this.read = false;
    this.priority = false;
  }

  public String getId() { return id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public String getLink() { return link; }
  public void setLink(String link) { this.link = link; }
  public boolean isRead() { return read; }
  public void setRead(boolean read) { this.read = read; }
  public boolean isPriority() { return priority; }
  public void setPriority(boolean priority) { this.priority = priority; }
  public String getActivityId() { return activityId; }
  public void setActivityId(String activityId) { this.activityId = activityId; }
  public Instant getCreatedAt() { return createdAt; }
}
