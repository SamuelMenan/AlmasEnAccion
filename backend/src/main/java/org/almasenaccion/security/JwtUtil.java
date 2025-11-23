package org.almasenaccion.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

public class JwtUtil {
  private final Key key;
  private final long expirationMillis;

  public JwtUtil(String secret, long expirationMinutes) {
    this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    this.expirationMillis = expirationMinutes * 60_000L;
  }

  public String generate(String subject, Map<String, Object> claims) {
    return Jwts.builder().setSubject(subject).addClaims(claims).setIssuedAt(new Date()).setExpiration(new Date(Instant.now().toEpochMilli() + expirationMillis)).signWith(key, SignatureAlgorithm.HS256).compact();
  }

  public Claims parse(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
  }
}
