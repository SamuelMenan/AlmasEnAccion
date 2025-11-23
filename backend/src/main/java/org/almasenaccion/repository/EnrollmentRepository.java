package org.almasenaccion.repository;

import org.almasenaccion.model.Activity;
import org.almasenaccion.model.Enrollment;
import org.almasenaccion.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
  int countByActivity(Activity activity);
  Optional<Enrollment> findByUserAndActivity(User user, Activity activity);
  List<Enrollment> findByUser(User user);
}
