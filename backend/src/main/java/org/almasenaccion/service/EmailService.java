package org.almasenaccion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private final JavaMailSender sender;
  @Value("${spring.mail.username:}")
  private String from;

  public EmailService(JavaMailSender sender) {
    this.sender = sender;
  }

  public void send(String to, String subject, String text) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(to);
    msg.setSubject(subject);
    msg.setText(text);
    if (from != null && !from.isBlank()) msg.setFrom(from);
    try {
      sender.send(msg);
    } catch (Exception ignored) {
    }
  }
}
