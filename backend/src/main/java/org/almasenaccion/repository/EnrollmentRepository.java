package org.almasenaccion.repository;

import org.almasenaccion.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
  int countByActivityId(String activityId);
  Optional<Enrollment> findByUserIdAndActivityId(String userId, String activityId);
  List<Enrollment> findByUserId(String userId);
}
