package org.almasenaccion.service;

import org.almasenaccion.dto.ActivityRequest;
import org.almasenaccion.model.Activity;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class ActivityService {
  private final ActivityRepository activities;

  public ActivityService(ActivityRepository activities) {
    this.activities = activities;
  }

  @Transactional
  public Activity create(User creator, ActivityRequest req) {
    if (req.getScheduledAt() == null || req.getScheduledAt().toInstant().isBefore(java.time.Instant.now())) throw new IllegalStateException("Fecha debe ser futura");
    Activity a = new Activity();
    a.setName(req.getName());
    a.setDescription(req.getDescription());
    a.setLocation(req.getLocation());
    a.setCapacity(req.getCapacity());
    a.setScheduledAt(req.getScheduledAt().toInstant());
    a.setCreatedById(creator.getId());
    a.initOnCreate();
    return activities.save(a);
  }

  public List<Activity> list() {
    return activities.findAll();
  }
}
