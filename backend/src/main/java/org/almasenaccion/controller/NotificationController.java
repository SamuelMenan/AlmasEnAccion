package org.almasenaccion.controller;

import org.almasenaccion.model.Notification;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.NotificationRepository;
import org.almasenaccion.service.NotificationService;
import org.almasenaccion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
  private final NotificationRepository notifications;
  private final NotificationService service;
  private final UserService users;

  public NotificationController(NotificationRepository notifications, NotificationService service, UserService users) {
    this.notifications = notifications;
    this.service = service;
    this.users = users;
  }

  @GetMapping
  public ResponseEntity<List<Notification>> list(Authentication auth) {
    User u = users.getByEmail(auth.getName());
    return ResponseEntity.ok(notifications.findTop10ByUserIdOrderByCreatedAtDesc(u.getId()));
  }

  @GetMapping("/unread/count")
  public ResponseEntity<Long> unreadCount(Authentication auth) {
    User u = users.getByEmail(auth.getName());
    return ResponseEntity.ok(notifications.countByUserIdAndReadIsFalse(u.getId()));
  }

  @PostMapping("/{id}/read")
  public ResponseEntity<Void> markRead(Authentication auth, @PathVariable("id") String id) {
    Notification n = notifications.findById(id).orElseThrow();
    n.setRead(true);
    notifications.save(n);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/stream")
  public SseEmitter stream(Authentication auth) {
    User u = users.getByEmail(auth.getName());
    return service.register(u.getId());
  }
}
