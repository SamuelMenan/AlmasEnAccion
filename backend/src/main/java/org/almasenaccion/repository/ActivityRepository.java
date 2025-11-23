package org.almasenaccion.repository;

import org.almasenaccion.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {
}
