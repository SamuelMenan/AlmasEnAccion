package org.almasenaccion.controller;

import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Enrollment;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.ActivityRepository;
import org.almasenaccion.service.EnrollmentService;
import org.almasenaccion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/activities")
public class EnrollmentController {
  private final EnrollmentService enrollmentService;
  private final ActivityRepository activityRepository;
  private final UserService userService;

  public EnrollmentController(EnrollmentService enrollmentService, ActivityRepository activityRepository, UserService userService) {
    this.enrollmentService = enrollmentService;
    this.activityRepository = activityRepository;
    this.userService = userService;
  }

  @PostMapping("/{id}/enroll")
  @PreAuthorize("hasRole('VOLUNTARIO')")
  public ResponseEntity<Enrollment> enroll(Authentication auth, @PathVariable("id") String id) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    User user = userService.getByEmail(auth.getName());
    Enrollment e = enrollmentService.enroll(user, activity);
    return ResponseEntity.ok(e);
  }
}
