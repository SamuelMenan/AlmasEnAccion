package org.almasenaccion.repository;

import org.almasenaccion.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(String userId);
  long countByUserIdAndReadIsFalse(String userId);
}
