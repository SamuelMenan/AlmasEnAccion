package org.almasenaccion.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
  @Size(max = 100)
  private String firstName;
  @Size(max = 100)
  private String lastName;
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
  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }
  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }
  public String getSkills() { return skills; }
  public void setSkills(String skills) { this.skills = skills; }
}
