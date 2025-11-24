package org.almasenaccion.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.UUID;

@Document(collection = "subscription_events")
public class SubscriptionEvent {
  @Id
  private String id;
  private String userId;
  private String activityId;
  private String type; // SUBSCRIBE | UNSUBSCRIBE
  private String reason;
  private Instant createdAt;

  public void initOnCreate() {
    this.id = UUID.randomUUID().toString();
    this.createdAt = Instant.now();
  }

  public String getId() { return id; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getActivityId() { return activityId; }
  public void setActivityId(String activityId) { this.activityId = activityId; }
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public Instant getCreatedAt() { return createdAt; }
}
