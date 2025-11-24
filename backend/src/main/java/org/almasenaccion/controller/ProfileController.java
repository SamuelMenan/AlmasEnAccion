package org.almasenaccion.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.almasenaccion.dto.UpdateProfileRequest;
import org.almasenaccion.dto.RoleUpdateRequest;
import org.almasenaccion.model.Role;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.almasenaccion.repository.UserRepository;
import java.io.IOException;
import org.almasenaccion.model.User;
import org.almasenaccion.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {
  private final UserService userService;
  private final GridFsTemplate gridFsTemplate;
  private final UserRepository userRepository;

  @Autowired
  public ProfileController(UserService userService, GridFsTemplate gridFsTemplate, UserRepository userRepository) {
    this.userService = userService;
    this.gridFsTemplate = gridFsTemplate;
    this.userRepository = userRepository;
  }

  @GetMapping("/me")
  public ResponseEntity<User> me(Authentication auth) {
    User u = userService.getByEmail(auth.getName());
    return ResponseEntity.ok(u);
  }

  @PutMapping(value = "/me", consumes = {"multipart/form-data"})
  public ResponseEntity<User> update(
      Authentication auth,
      @RequestPart("data") String data,
      @RequestPart(value = "avatar", required = false) MultipartFile avatar
  ) throws IOException {
      System.out.println("===> Entrando a update (multipart/form-data)");
      System.out.println("Avatar: " + (avatar != null ? avatar.getOriginalFilename() : "null"));
      System.out.println("Data: " + data);

      ObjectMapper mapper = new ObjectMapper();
      UpdateProfileRequest req = mapper.readValue(data, UpdateProfileRequest.class);

      User u = userService.getByEmail(auth.getName());
      if (avatar != null && !avatar.isEmpty()) {
          String contentType = avatar.getContentType();
          String filename = avatar.getOriginalFilename();
          var fileId = gridFsTemplate.store(avatar.getInputStream(), filename, contentType);
          u.setAvatarUrl(fileId.toString());
      }
      if (req.getFirstName() != null) u.setFirstName(req.getFirstName());
      if (req.getLastName() != null) u.setLastName(req.getLastName());
      if (req.getPhone() != null) u.setPhone(req.getPhone());
      if (req.getAddress() != null) u.setAddress(req.getAddress());
      u.touch();
      User updated = userRepository.save(u);
      return ResponseEntity.ok(updated);
  }

  // Si quieres aceptar JSON puro (sin imagen), puedes agregar este método:
  @PutMapping(value = "/me", consumes = "application/json")
  public ResponseEntity<User> updateJson(
      Authentication auth,
      @RequestBody @Validated UpdateProfileRequest req
  ) {
    User u = userService.getByEmail(auth.getName());
    if (req.getFirstName() != null) u.setFirstName(req.getFirstName());
    if (req.getLastName() != null) u.setLastName(req.getLastName());
    if (req.getPhone() != null) u.setPhone(req.getPhone());
    if (req.getAddress() != null) u.setAddress(req.getAddress());
    u.touch();
    User updated = userRepository.save(u);
    return ResponseEntity.ok(updated);
  }

  @GetMapping("/avatar/{id}")
  public ResponseEntity<byte[]> getAvatar(@PathVariable String id) throws IOException {
    GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
    if (file == null) return ResponseEntity.notFound().build();
    GridFsResource resource = gridFsTemplate.getResource(file);
    byte[] data = resource.getInputStream().readAllBytes();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType(resource.getContentType() != null ? resource.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE));
    headers.setContentLength(data.length);
    return new ResponseEntity<>(data, headers, HttpStatus.OK);
  }

  @PutMapping("/role")
  public ResponseEntity<User> updateRole(Authentication auth, @RequestBody @Validated RoleUpdateRequest req) {
    User u = userService.getByEmail(auth.getName());
    Role desired = req.getRole();
    if (desired == Role.ADMIN) {
      return ResponseEntity.badRequest().build();
    }
    u.setRole(desired);
    u.touch();
    User updated = userRepository.save(u);
    return ResponseEntity.ok(updated);
  }
}
