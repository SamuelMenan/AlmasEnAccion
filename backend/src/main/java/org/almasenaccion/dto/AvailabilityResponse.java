package org.almasenaccion.dto;

public class AvailabilityResponse {
  private int capacity;
  private int enrolled;
  private int available;

  public AvailabilityResponse(int capacity, int enrolled) {
    this.capacity = capacity;
    this.enrolled = enrolled;
    this.available = Math.max(0, capacity - enrolled);
  }

  public int getCapacity() { return capacity; }
  public int getEnrolled() { return enrolled; }
  public int getAvailable() { return available; }
}
