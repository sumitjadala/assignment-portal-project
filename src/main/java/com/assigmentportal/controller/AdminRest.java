package com.assigmentportal.controller;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.assigmentportal.common.ValidateInput;
import com.assigmentportal.dao.AssignmentDao;
import com.assigmentportal.dao.DepartmentDao;
import com.assigmentportal.dao.FacultyDao;
import com.assigmentportal.dao.RoleRepository;
import com.assigmentportal.dao.StudentsDao;
import com.assigmentportal.dao.UserRepository;
import com.assigmentportal.entity.EAssignment;
import com.assigmentportal.entity.EFaculty;
import com.assigmentportal.entity.ERole;
import com.assigmentportal.entity.EStudent;
import com.assigmentportal.entity.EStudentAssignmentDetailsView;
import com.assigmentportal.entity.Role;
import com.assigmentportal.entity.User;
import com.assigmentportal.payload.response.MessageResponse;
import com.assigmentportal.service.AssignmentService;
import com.assigmentportal.service.FileStorageService;
import com.assigmentportal.service.StudentAssignmentDetailsViewService;

@RestController
@RequestMapping("/api/admin/")
public class AdminRest {

  private static final Logger logger = LoggerFactory.getLogger(FacultyRest.class);

  @Autowired
  AssignmentDao assignmentDao;

  @Autowired
  AssignmentService assignmentService;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  FileStorageService fileStorageService;
  
  @Autowired
  DepartmentDao departmentDao;
  
  @Autowired
  StudentsDao studentsDao;

  @Autowired
  StudentAssignmentDetailsViewService studentAssignmentDetailsViewService;
  
  @Autowired
  FacultyDao facultyDao;

  @GetMapping("getAssignment")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Page<EAssignment>> getAssignments(Pageable pageable) {
    Page<EAssignment> ass = assignmentService.getAssignments(pageable);
    return ResponseEntity.ok(ass);
  }

  @GetMapping("/getAssignmentById/assignmentId/{assignmentId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<EAssignment> getAssignmentById(@PathVariable Integer assignmentId) {
    EAssignment assignment = assignmentService.getAssignmentById(assignmentId);
    return ResponseEntity.ok(assignment);
  }

  @RequestMapping(value = "/updateAssignment/assignmentId/{assignmentId}", consumes = "multipart/form-data", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<EAssignment> updateAssignment(HttpServletRequest request) {
    String title = request.getParameter("title");
    String subject = request.getParameter("subject");
    String description = request.getParameter("description");
    Long submissionDate = Long.valueOf(request.getParameter("submissionDate"));
    Integer assignmentId = Integer.parseInt(request.getParameter("assignmentId"));
    EAssignment assignment = assignmentService.updateAssignmentAdmin(title, subject, description, submissionDate,
        assignmentId);

    return ResponseEntity.ok(assignment);
  }

  @DeleteMapping("/deleteAssignment/assignmentId/{assignmentId}")
  @PreAuthorize("hasRole('ADMIN')")
  public void deleteAssignment(@PathVariable("assignmentId") Integer assignmentId) {
    assignmentService.deleteAssignment(assignmentId);
  }

  @GetMapping("studentAssignmentsStatus")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Page<EStudentAssignmentDetailsView>> getStudentAssignmentsStatus(Pageable pageable) {
    Page<EStudentAssignmentDetailsView> allAssignment = studentAssignmentDetailsViewService.getStudentAssignmentsStatus(pageable);
    return ResponseEntity.ok(allAssignment);
  }

  @PostMapping("/signup")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> registerUser(HttpServletRequest request) {
    String username = request.getParameter("username");
    String email = request.getParameter("email");
    String password = request.getParameter("password");
    String mobileNo = request.getParameter("mobileNo");
    String name = request.getParameter("name");
    String strRole = request.getParameter("role");
    String departmentName = request.getParameter("selectedDepartmentName");
    if (userRepository.existsByUsername(request.getParameter("username"))) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    }
    if (userRepository.existsByEmail(request.getParameter("email"))) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }

    User user = new User(username, email, encoder.encode(password));
    Set<Role> roles = new HashSet<>();

    switch (strRole) {
    case "Admin":
      Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(adminRole);
      break;
    case "Faculty":
      Role facultyRole = roleRepository.findByName(ERole.ROLE_FACULTY)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(facultyRole);
      break;
    default:
      Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(studentRole);
    }

    user.setRoles(roles);
    User u = userRepository.saveAndFlush(user);
    if (strRole.equals("Student")) {
      EStudent student = new EStudent();
      if (departmentName != null && !departmentName.isEmpty()) {
        student.setDepartmentId(departmentDao.getIdByDepartmentName(departmentName));
      }
      student.setUserId(u.getId().intValue());
      student.setEmailAddress(email);
      student.setMobileNumber(mobileNo);
      student.setStudentName(name);
      studentsDao.save(student);
    } else if (strRole.equals("Faculty")) {
      EFaculty faculty = new EFaculty();
      if (departmentName != null && !departmentName.isEmpty()) {
        faculty.setDepartmentId(departmentDao.getIdByDepartmentName(departmentName));
      }
      faculty.setEmail(email);
      faculty.setFacultyName(name);
      faculty.setUserId(u.getId().intValue());
      facultyDao.save(faculty);
    }
    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @GetMapping("/downloadFile/{fileName}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Resource> downloadFile(@PathVariable("fileName") String fileName, HttpServletRequest request)
      throws Exception {
    Resource resource = fileStorageService.loadFileAsResource(fileName);
    String contentType = null;
    try {
      contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
    } catch (IOException ex) {
      logger.info("Could not determine file type.");
    }
    if (contentType == null) {
      contentType = "application/octet-stream";
    }

    return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"").body(resource);
  }

  @GetMapping("validateUsername")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> validateUsername(@RequestParam("username") String username) {
    Boolean results = ValidateInput.isValidUsername(username);
    Boolean userAlreadyExist = userRepository.existsByUsername(username);
    if(results && !userAlreadyExist) {
      return ResponseEntity.ok().body("Valid username");
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username not valid");
    }
  }

  @GetMapping("validateEmail")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<String> validateEmail(@RequestParam("email") String email) {
    Boolean results = ValidateInput.isValidEmail(email);
    Boolean emailAlreadyExist = userRepository.existsByEmail(email);
    if(results && !emailAlreadyExist) {
      return ResponseEntity.ok("Valid email");
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email not valid");
    }
  }

  @GetMapping("departmentNames")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<String>> getAllDepartmentName() {
    return ResponseEntity.ok(departmentDao.getAllDepartmentNames());
  }

}
