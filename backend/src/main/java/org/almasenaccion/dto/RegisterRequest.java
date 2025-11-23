package org.almasenaccion.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
  @NotBlank
  @Size(max = 100)
  private String firstName;
  @Size(max = 100)
  private String lastName;
  @Email
  @NotBlank
  private String email;
  @NotBlank
  @Size(min = 8, max = 255)
  private String password;
  @Size(max = 30)
  private String phone;
  @Size(max = 255)
  private String address;
  @Size(max = 500)
  private String skills;

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }
  public String getSkills() { return skills; }
  public void setSkills(String skills) { this.skills = skills; }
}
