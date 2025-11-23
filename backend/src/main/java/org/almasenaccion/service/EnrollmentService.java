package org.almasenaccion.service;

import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Enrollment;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnrollmentService {
  private final EnrollmentRepository enrollments;

  public EnrollmentService(EnrollmentRepository enrollments) {
    this.enrollments = enrollments;
  }

  @Transactional
  public Enrollment enroll(User user, Activity activity) {
    if (enrollments.findByUserAndActivity(user, activity).isPresent()) throw new IllegalStateException("Ya inscrito");
    int count = enrollments.countByActivity(activity);
    if (count >= activity.getCapacity()) throw new IllegalStateException("No quedan cupos");
    Enrollment e = new Enrollment();
    e.setUser(user);
    e.setActivity(activity);
    return enrollments.save(e);
  }
}
