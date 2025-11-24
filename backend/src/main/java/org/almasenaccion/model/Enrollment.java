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

  private boolean manual;
  private Instant notifiedAt;
  private boolean confirmed;
  private Instant confirmedAt;

  private boolean attended;
  private Instant attendedAt;
  private String attendedByCoordinatorId;
  private int attendanceAttempts;
  private Instant lastAttemptAt;

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
  public boolean isManual() { return manual; }
  public void setManual(boolean manual) { this.manual = manual; }
  public Instant getNotifiedAt() { return notifiedAt; }
  public void setNotifiedAt(Instant notifiedAt) { this.notifiedAt = notifiedAt; }
  public boolean isConfirmed() { return confirmed; }
  public void setConfirmed(boolean confirmed) { this.confirmed = confirmed; }
  public Instant getConfirmedAt() { return confirmedAt; }
  public void setConfirmedAt(Instant confirmedAt) { this.confirmedAt = confirmedAt; }
  public boolean isAttended() { return attended; }
  public void setAttended(boolean attended) { this.attended = attended; }
  public Instant getAttendedAt() { return attendedAt; }
  public void setAttendedAt(Instant attendedAt) { this.attendedAt = attendedAt; }
  public String getAttendedByCoordinatorId() { return attendedByCoordinatorId; }
  public void setAttendedByCoordinatorId(String attendedByCoordinatorId) { this.attendedByCoordinatorId = attendedByCoordinatorId; }
  public int getAttendanceAttempts() { return attendanceAttempts; }
  public void setAttendanceAttempts(int attendanceAttempts) { this.attendanceAttempts = attendanceAttempts; }
  public Instant getLastAttemptAt() { return lastAttemptAt; }
  public void setLastAttemptAt(Instant lastAttemptAt) { this.lastAttemptAt = lastAttemptAt; }
}
