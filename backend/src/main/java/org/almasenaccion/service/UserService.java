package org.almasenaccion.service;

import org.almasenaccion.dto.UpdateProfileRequest;
import org.almasenaccion.model.User;
import org.almasenaccion.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository users;

  public UserService(UserRepository users) {
    this.users = users;
  }

  public User getByEmail(String email) {
    return users.findByEmail(email).orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));
  }

  @Transactional
  public User updateProfile(User user, UpdateProfileRequest req) {
    if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
    if (req.getLastName() != null) user.setLastName(req.getLastName());
    if (req.getPhone() != null) user.setPhone(req.getPhone());
    if (req.getAddress() != null) user.setAddress(req.getAddress());
    if (req.getSkills() != null) user.setSkills(req.getSkills());
    return users.save(user);
  }
}
