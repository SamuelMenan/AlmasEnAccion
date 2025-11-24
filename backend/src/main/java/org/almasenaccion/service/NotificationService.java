package org.almasenaccion.service;

import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Notification;
import org.almasenaccion.model.Role;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.NotificationRepository;
import org.almasenaccion.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {
  private final NotificationRepository notifications;
  private final UserRepository users;
  private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>(); // key: userId

  public NotificationService(NotificationRepository notifications, UserRepository users) {
    this.notifications = notifications;
    this.users = users;
  }

  public SseEmitter register(String userId) {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    emitters.put(userId, emitter);
    emitter.onCompletion(() -> emitters.remove(userId));
    emitter.onTimeout(() -> emitters.remove(userId));
    return emitter;
  }

  public void pushToUser(String userId, Notification n) {
    SseEmitter emitter = emitters.get(userId);
    if (emitter != null) {
      try { emitter.send(n); } catch (Exception ignored) {}
    }
  }

  @Transactional
  public void notifyNewActivity(Activity a) {
    for (User u : users.findAll()) {
      if (u.getRole() != Role.VOLUNTARIO) continue;
      Notification n = new Notification();
      n.initOnCreate();
      n.setUserId(u.getId());
      n.setActivityId(a.getId());
      n.setTitle("[Voluntariado] Nueva Actividad: " + a.getName());
      String fecha = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(java.time.ZoneId.systemDefault()).format(a.getScheduledAt());
      String maps = "https://www.google.com/maps/search/?api=1&query=" + java.net.URLEncoder.encode(a.getLocation(), java.nio.charset.StandardCharsets.UTF_8);
      n.setMessage("Fecha/Hora: " + fecha + "\nLugar: " + a.getLocation() + "\nCupos: " + a.getCapacity());
      n.setLink("/activities/" + a.getId());
      notifications.save(n);
      pushToUser(u.getId(), n);
      // Email eliminado: notificación solo en la app (header + SSE)
    }
  }
}
