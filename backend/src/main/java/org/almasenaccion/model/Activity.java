package org.almasenaccion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(name = "activities")
public class Activity {
  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @NotBlank
  @Size(max = 150)
  @Column(name = "name", nullable = false)
  private String name;

  @Size(max = 1000)
  @Column(name = "description")
  private String description;

  @Future
  @Column(name = "scheduled_at", nullable = false)
  private OffsetDateTime scheduledAt;

  @Size(max = 255)
  @Column(name = "location")
  private String location;

  @Min(1)
  @Column(name = "capacity", nullable = false)
  private int capacity;

  @ManyToOne(optional = false)
  @JoinColumn(name = "created_by", nullable = false)
  private User createdBy;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  void prePersist() {
    this.id = UUID.randomUUID();
    this.createdAt = OffsetDateTime.now(ZoneOffset.UTC);
  }

  public UUID getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public OffsetDateTime getScheduledAt() { return scheduledAt; }
  public void setScheduledAt(OffsetDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }
  public int getCapacity() { return capacity; }
  public void setCapacity(int capacity) { this.capacity = capacity; }
  public User getCreatedBy() { return createdBy; }
  public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
}
