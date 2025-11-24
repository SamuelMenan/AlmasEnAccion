package org.almasenaccion.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

@Document(collection = "activities")
public class Activity {
  @Id
  private String id;

  @NotBlank
  @Size(max = 150)
  private String name;

  @Size(max = 1000)
  private String description;

  @Future
  private Instant scheduledAt;

  @Size(max = 255)
  private String location;

  @Size(max = 100)
  private String city;

  @Size(max = 100)
  private String department;

  @Size(max = 100)
  private String type;

  @Size(max = 150)
  private String project;

  @Min(1)
  private Integer durationHours;

  @Min(1)
  private int capacity;
  private String createdById;

  private Instant createdAt;

  public void initOnCreate() {
    this.id = UUID.randomUUID().toString();
    this.createdAt = Instant.now();
  }

  public String getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public Instant getScheduledAt() { return scheduledAt; }
  public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }
  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }
  public String getDepartment() { return department; }
  public void setDepartment(String department) { this.department = department; }
  public String getType() { return type; }
  public void setType(String type) { this.type = type; }
  public String getProject() { return project; }
  public void setProject(String project) { this.project = project; }
  public Integer getDurationHours() { return durationHours; }
  public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }
  public int getCapacity() { return capacity; }
  public void setCapacity(int capacity) { this.capacity = capacity; }
  public String getCreatedById() { return createdById; }
  public void setCreatedById(String createdById) { this.createdById = createdById; }
  public Instant getCreatedAt() { return createdAt; }
}
