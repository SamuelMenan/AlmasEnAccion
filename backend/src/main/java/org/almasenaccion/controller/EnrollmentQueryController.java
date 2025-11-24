package org.almasenaccion.controller;

import org.almasenaccion.model.Enrollment;
import org.almasenaccion.model.Activity;
import org.almasenaccion.repository.EnrollmentRepository;
import org.almasenaccion.repository.ActivityRepository;
import org.almasenaccion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/enrollments")
public class EnrollmentQueryController {
  private final EnrollmentRepository enrollments;
  private final ActivityRepository activities;
  private final UserService users;

  public EnrollmentQueryController(EnrollmentRepository enrollments, ActivityRepository activities, UserService users) {
    this.enrollments = enrollments;
    this.activities = activities;
    this.users = users;
  }

  @GetMapping("/me")
  public ResponseEntity<List<Object>> myEnrollments(Authentication auth) {
    var user = users.getByEmail(auth.getName());
    List<Enrollment> es = enrollments.findByUserId(user.getId());
    List<Object> items = es.stream().map(e -> {
      Activity a = activities.findById(e.getActivityId()).orElse(null);
      return java.util.Map.of(
        "id", e.getId(),
        "activityId", e.getActivityId(),
        "createdAt", e.getCreatedAt(),
        "activity", a
      );
    }).collect(Collectors.toList());
    return ResponseEntity.ok(items);
  }
}
