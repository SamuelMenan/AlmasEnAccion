package org.almasenaccion.controller;

import org.almasenaccion.dto.ActivityRequest;
import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Role;
import org.almasenaccion.model.User;
import org.almasenaccion.service.ActivityService;
import org.almasenaccion.service.UserService;
import org.almasenaccion.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {
  private final ActivityService activityService;
  private final UserService userService;
  private final NotificationService notificationService;

  public ActivityController(ActivityService activityService, UserService userService, NotificationService notificationService) {
    this.activityService = activityService;
    this.userService = userService;
    this.notificationService = notificationService;
  }

  @GetMapping
  public ResponseEntity<List<Activity>> list() {
    return ResponseEntity.ok(activityService.list());
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('COORDINADOR','ADMIN')")
  public ResponseEntity<Activity> create(Authentication auth, @Validated @RequestBody ActivityRequest req) {
    User creator = userService.getByEmail(auth.getName());
    Activity created = activityService.create(creator, req);
    notificationService.notifyNewActivity(created);
    return ResponseEntity.ok(created);
  }
}
