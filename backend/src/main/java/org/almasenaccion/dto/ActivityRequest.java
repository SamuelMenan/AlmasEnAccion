package org.almasenaccion.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public class ActivityRequest {
  @NotBlank
  @Size(max = 150)
  private String name;
  @Size(max = 1000)
  private String description;
  @Future
  private OffsetDateTime scheduledAt;
  @Size(max = 255)
  private String location;
  @Min(1)
  private int capacity;

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
}
