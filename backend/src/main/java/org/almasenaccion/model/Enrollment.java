package org.almasenaccion.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
  @UniqueConstraint(name = "uk_enrollment_user_activity", columnNames = {"user_id", "activity_id"})
})
public class Enrollment {
  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(optional = false)
  @JoinColumn(name = "activity_id", nullable = false)
  private Activity activity;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    this.id = UUID.randomUUID();
    this.createdAt = Instant.now();
  }

  public UUID getId() { return id; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public Activity getActivity() { return activity; }
  public void setActivity(Activity activity) { this.activity = activity; }
  public Instant getCreatedAt() { return createdAt; }
}
