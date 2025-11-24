package org.almasenaccion.controller;

import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Enrollment;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.ActivityRepository;
import org.almasenaccion.service.EnrollmentService;
import org.almasenaccion.service.UserService;
import org.almasenaccion.dto.AvailabilityResponse;
import org.almasenaccion.dto.AssignByEmailRequest;
import org.almasenaccion.repository.EnrollmentRepository;
import org.almasenaccion.repository.UserRepository;
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
  private final EnrollmentRepository enrollments;
  private final UserRepository userRepository;

  public EnrollmentController(EnrollmentService enrollmentService, ActivityRepository activityRepository, UserService userService, EnrollmentRepository enrollments, UserRepository userRepository) {
    this.enrollmentService = enrollmentService;
    this.activityRepository = activityRepository;
    this.userService = userService;
    this.enrollments = enrollments;
    this.userRepository = userRepository;
  }

  @PostMapping("/{id}/enroll")
  @PreAuthorize("hasRole('VOLUNTARIO')")
  public ResponseEntity<Enrollment> enroll(Authentication auth, @PathVariable("id") String id) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    User user = userService.getByEmail(auth.getName());
    Enrollment e = enrollmentService.enroll(user, activity);
    return ResponseEntity.ok(e);
  }

  @DeleteMapping("/{id}/enroll")
  @PreAuthorize("hasRole('VOLUNTARIO')")
  public ResponseEntity<Void> unenroll(Authentication auth, @PathVariable("id") String id, @RequestParam(value = "reason", required = false) String reason) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    User user = userService.getByEmail(auth.getName());
    enrollmentService.unenroll(user, activity, reason);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{id}/availability")
  public ResponseEntity<AvailabilityResponse> availability(@PathVariable("id") String id) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    int enrolled = enrollments.countByActivityId(activity.getId());
    return ResponseEntity.ok(new AvailabilityResponse(activity.getCapacity(), enrolled));
  }

  @GetMapping("/{id}/my/enrollment")
  @PreAuthorize("hasRole('VOLUNTARIO')")
  public ResponseEntity<java.util.Map<String, Object>> myEnrollment(Authentication auth, @PathVariable("id") String id) {
    java.util.Optional<Activity> activityOpt = activityRepository.findById(id);
    if (activityOpt.isEmpty()) {
      return ResponseEntity.ok(java.util.Map.of("enrolled", false));
    }
    User user = userService.getByEmail(auth.getName());
    boolean enrolled = enrollments.findByUserIdAndActivityId(user.getId(), activityOpt.get().getId()).isPresent();
    return ResponseEntity.ok(java.util.Map.of("enrolled", enrolled));
  }

  @PostMapping("/{id}/assign/{userId}")
  @PreAuthorize("hasAnyRole('COORDINADOR','ADMIN')")
  public ResponseEntity<Enrollment> assign(@PathVariable("id") String id, @PathVariable("userId") String userId) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));
    Enrollment e = enrollmentService.assign(user, activity);
    return ResponseEntity.ok(e);
  }

  @PostMapping("/confirm/{enrollmentId}")
  public ResponseEntity<Enrollment> confirm(@PathVariable("enrollmentId") String enrollmentId) {
    Enrollment e = enrollmentService.confirm(enrollmentId);
    return ResponseEntity.ok(e);
  }

  @PostMapping("/{id}/assignByEmail")
  @PreAuthorize("hasAnyRole('COORDINADOR','ADMIN')")
  public ResponseEntity<Enrollment> assignByEmail(@PathVariable("id") String id, @RequestBody @jakarta.validation.Valid AssignByEmailRequest req) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    User user = userService.getByEmail(req.getEmail());
    Enrollment e = enrollmentService.assign(user, activity);
    return ResponseEntity.ok(e);
  }

  @GetMapping("/{id}/enrollments")
  @PreAuthorize("hasAnyRole('COORDINADOR','ADMIN')")
  public ResponseEntity<java.util.List<java.util.Map<String,Object>>> listEnrollments(@PathVariable("id") String id) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    java.util.List<Enrollment> es = enrollments.findByActivityId(activity.getId());
    java.util.List<java.util.Map<String,Object>> items = new java.util.ArrayList<>();
    for (Enrollment e : es) {
      User u = userRepository.findById(e.getUserId()).orElse(null);
      java.util.Map<String,Object> m = new java.util.HashMap<>();
      m.put("enrollmentId", e.getId());
      m.put("userId", e.getUserId());
      m.put("name", u != null ? (u.getFirstName() + (u.getLastName() != null ? (" " + u.getLastName()) : "")) : "");
      m.put("email", u != null ? u.getEmail() : "");
      m.put("attended", e.isAttended());
      m.put("attendedAt", e.getAttendedAt());
      items.add(m);
    }
    return ResponseEntity.ok(items);
  }

  @PostMapping("/attendance/{enrollmentId}/mark")
  @PreAuthorize("hasAnyRole('COORDINADOR','ADMIN')")
  public ResponseEntity<Enrollment> markAttendance(Authentication auth, @PathVariable("enrollmentId") String enrollmentId) {
    User coordinator = userService.getByEmail(auth.getName());
    Enrollment e = enrollmentService.markAttendance(coordinator, enrollmentId);
    return ResponseEntity.ok(e);
  }

  @DeleteMapping("/{id}/unenroll/{userId}")
  @PreAuthorize("hasAnyRole('COORDINADOR','ADMIN')")
  public ResponseEntity<Void> adminUnenroll(@PathVariable("id") String id, @PathVariable("userId") String userId, @RequestParam(value = "reason", required = false) String reason) {
    Activity activity = activityRepository.findById(id).orElseThrow(() -> new IllegalStateException("Actividad no encontrada"));
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));
    enrollmentService.unenroll(user, activity, reason);
    return ResponseEntity.ok().build();
  }
}
