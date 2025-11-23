package org.almasenaccion.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.UUID;

@Document(collection = "enrollments")
@CompoundIndex(name = "uk_enrollment_user_activity", def = "{ 'userId': 1, 'activityId': 1 }", unique = true)
public class Enrollment {
  @Id
  private String id;

  private String userId;

  private String activityId;

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
  public Instant getCreatedAt() { return createdAt; }
}
