package org.almasenaccion.repository;

import org.almasenaccion.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActivityRepository extends MongoRepository<Activity, String> {
}
