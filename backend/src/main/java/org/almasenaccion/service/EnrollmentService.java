package org.almasenaccion.service;

import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Enrollment;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.almasenaccion.model.Notification;
import org.almasenaccion.repository.NotificationRepository;
import org.almasenaccion.service.NotificationService;
import org.almasenaccion.repository.SubscriptionEventRepository;
import org.almasenaccion.model.SubscriptionEvent;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnrollmentService {
  private final EnrollmentRepository enrollments;
  private final NotificationRepository notifications;
  private final NotificationService notifier;
  private final SubscriptionEventRepository subEvents;

  public EnrollmentService(EnrollmentRepository enrollments, NotificationRepository notifications, NotificationService notifier, SubscriptionEventRepository subEvents) {
    this.enrollments = enrollments;
    this.notifications = notifications;
    this.notifier = notifier;
    this.subEvents = subEvents;
  }

  @Transactional
  public Enrollment enroll(User user, Activity activity) {
    if (enrollments.findByUserIdAndActivityId(user.getId(), activity.getId()).isPresent()) throw new IllegalStateException("Ya inscrito");
    int count = enrollments.countByActivityId(activity.getId());
    if (count >= activity.getCapacity()) throw new IllegalStateException("No quedan cupos");
    Enrollment e = new Enrollment();
    e.setUserId(user.getId());
    e.setActivityId(activity.getId());
    e.initOnCreate();
    Enrollment saved = enrollments.save(e);
    Notification n = new Notification();
    n.initOnCreate();
    n.setUserId(user.getId());
    n.setActivityId(activity.getId());
    n.setTitle("Inscripción confirmada: " + activity.getName());
    String fecha = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(java.time.ZoneId.systemDefault()).format(activity.getScheduledAt());
    n.setMessage("Fecha/Hora: " + fecha + "\nLugar: " + activity.getLocation());
    n.setLink("/activities/" + activity.getId());
    notifications.save(n);
    notifier.pushToUser(user.getId(), n);
    saved.setNotifiedAt(java.time.Instant.now());
    enrollments.save(saved);
    SubscriptionEvent ev = new SubscriptionEvent();
    ev.initOnCreate();
    ev.setUserId(user.getId());
    ev.setActivityId(activity.getId());
    ev.setType("SUBSCRIBE");
    subEvents.save(ev);
    // Notificar al coordinador
    Notification c = new Notification();
    c.initOnCreate();
    c.setUserId(activity.getCreatedById());
    c.setActivityId(activity.getId());
    c.setTitle("Nuevo inscrito: " + user.getFirstName() + (user.getLastName()!=null? (" "+user.getLastName()):""));
    c.setMessage("Actividad: " + activity.getName());
    c.setLink("/activities/" + activity.getId());
    notifications.save(c);
    notifier.pushToUser(activity.getCreatedById(), c);
    return saved;
  }

  @Transactional
  public void unenroll(User user, Activity activity, String reason) {
    var existing = enrollments.findByUserIdAndActivityId(user.getId(), activity.getId()).orElseThrow(() -> new IllegalStateException("No inscrito"));
    enrollments.delete(existing);
    SubscriptionEvent ev = new SubscriptionEvent();
    ev.initOnCreate();
    ev.setUserId(user.getId());
    ev.setActivityId(activity.getId());
    ev.setType("UNSUBSCRIBE");
    ev.setReason(reason);
    subEvents.save(ev);
    Notification c = new Notification();
    c.initOnCreate();
    c.setUserId(activity.getCreatedById());
    c.setActivityId(activity.getId());
    c.setTitle("Desinscripción: " + user.getFirstName() + (user.getLastName()!=null? (" "+user.getLastName()):""));
    c.setMessage((reason!=null? ("Razón: "+reason+"\n"): "") + "Actividad: " + activity.getName());
    c.setLink("/activities/" + activity.getId());
    notifications.save(c);
    notifier.pushToUser(activity.getCreatedById(), c);

    // Notificar al usuario desinscrito
    Notification nu = new Notification();
    nu.initOnCreate();
    nu.setUserId(user.getId());
    nu.setActivityId(activity.getId());
    nu.setTitle("Has sido desinscrito: " + activity.getName());
    String fecha = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(java.time.ZoneId.systemDefault()).format(activity.getScheduledAt());
    nu.setMessage(((reason!=null && !reason.isBlank())? ("Razón: "+reason+"\n"): "") + "Fecha/Hora: " + fecha + "\nLugar: " + activity.getLocation());
    nu.setLink("/activities/" + activity.getId());
    notifications.save(nu);
    notifier.pushToUser(user.getId(), nu);
  }

  @Transactional
  public Enrollment assign(User user, Activity activity) {
    Enrollment e = enroll(user, activity);
    e.setManual(true);
    return enrollments.save(e);
  }

  @Transactional
  public Enrollment confirm(String enrollmentId) {
    Enrollment e = enrollments.findById(enrollmentId).orElseThrow(() -> new IllegalStateException("Inscripción no encontrada"));
    e.setConfirmed(true);
    e.setConfirmedAt(java.time.Instant.now());
    return enrollments.save(e);
  }

  @Transactional
  public Enrollment markAttendance(User coordinator, String enrollmentId) {
    Enrollment e = enrollments.findById(enrollmentId).orElseThrow(() -> new IllegalStateException("Inscripción no encontrada"));
    e.setAttendanceAttempts((e.getAttendanceAttempts()) + 1);
    e.setLastAttemptAt(java.time.Instant.now());
    if (e.isAttended()) {
      enrollments.save(e);
      throw new IllegalStateException("Asistencia ya registrada");
    }
    e.setAttended(true);
    e.setAttendedAt(java.time.Instant.now());
    e.setAttendedByCoordinatorId(coordinator.getId());
    return enrollments.save(e);
  }
}
