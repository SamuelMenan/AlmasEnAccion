package org.almasenaccion.dto;

import jakarta.validation.constraints.NotNull;
import org.almasenaccion.model.Role;

public class RoleUpdateRequest {
  @NotNull
  private Role role;

  public Role getRole() { return role; }
  public void setRole(Role role) { this.role = role; }
}
