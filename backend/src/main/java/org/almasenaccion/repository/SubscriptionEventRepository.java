package org.almasenaccion.repository;

import org.almasenaccion.model.SubscriptionEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SubscriptionEventRepository extends MongoRepository<SubscriptionEvent, String> {}
