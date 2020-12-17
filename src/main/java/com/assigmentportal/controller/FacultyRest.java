package com.assigmentportal.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.assigmentportal.common.CommonData;
import com.assigmentportal.dao.AssignmentDao;
import com.assigmentportal.entity.EAssignment;
import com.assigmentportal.entity.EStudentAssignmentDetailsView;
import com.assigmentportal.service.AssignmentService;
import com.assigmentportal.service.FacultyService;
import com.assigmentportal.service.FileStorageService;
import com.assigmentportal.service.StudentAssignmentDetailsService;
import com.assigmentportal.service.StudentAssignmentDetailsViewService;

@RestController
@RequestMapping("/api/faculty")
public class FacultyRest {

  private static final Logger logger = LoggerFactory.getLogger(FacultyRest.class);

  @Autowired
  FacultyService facultyService;

  @Autowired
  AssignmentDao assignmentDao;

  @Autowired
  StudentAssignmentDetailsService studentAssignmentDetailsService;

  @Autowired
  AssignmentService assignmentService;

  @Autowired
  FileStorageService fileStorageService;

  @Autowired
  StudentAssignmentDetailsViewService studentAssignmentDetailsViewService;

  @RequestMapping(value = "/createAssignment", consumes = "multipart/form-data", method = RequestMethod.POST)
  @PreAuthorize("hasRole('FACULTY')")
  public ResponseEntity<EAssignment> createAssignment(HttpServletRequest request,
      @RequestParam("assignmentFile") MultipartFile file) {
    if (CommonData.ACCEPTED_FILE_TYPE.contains(file.getContentType())) {
      String title = request.getParameter("title");
      String subject = request.getParameter("subject");
      String description = request.getParameter("description");
      Long submissionDate = Long.valueOf(request.getParameter("submissionDate"));
      Integer facultyId = Integer.parseInt(request.getParameter("userId"));
      String fileName = fileStorageService.storeFile(file, facultyId, file.getContentType(), title);
      EAssignment assignment = facultyService.createAssignment(title, subject, description, submissionDate, file,
          fileName, facultyId);
      return ResponseEntity.ok(assignment);
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Please upload pdf/docs file");
    }
  }

  @RequestMapping(value = "/updateAssignment/facultyId/{facultyId}/assignmentId/{assignmentId}", consumes = "multipart/form-data", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('FACULTY')")
  public ResponseEntity<EAssignment> updateAssignment(HttpServletRequest request,
      @RequestParam("assignmentFile") MultipartFile file) {
    String title = request.getParameter("title");
    String subject = request.getParameter("subject");
    String description = request.getParameter("description");
    Long submissionDate = Long.valueOf(request.getParameter("submissionDate"));
    Integer facultyId = Integer.parseInt(request.getParameter("userId"));
    Integer assignmentId = Integer.parseInt(request.getParameter("assignmentId"));
    String fileName = fileStorageService.storeFile(file, facultyId, file.getContentType(), title);
    EAssignment assignment = assignmentService.updateAssignment(title, subject, description, submissionDate, file,
        fileName, facultyId, assignmentId);

    return ResponseEntity.ok(assignment);
  }

  // Assigning assignment to students
  @RequestMapping(value = "/assignStudents/assignmentId/{assignmentId}/userId/{facultyId}", method = RequestMethod.PUT)
  @PreAuthorize("hasRole('FACULTY')")
  public void assignToStudents(@PathVariable("assignmentId") Integer assignmentId,
      @PathVariable("facultyId") Integer facultyId) {
    studentAssignmentDetailsService.updateIsAssigned(assignmentId, facultyId);
  }

  @DeleteMapping("/deleteAssignment/userId/{facultyId}/assignmentId/{assignmentId}")
  @PreAuthorize("hasRole('FACULTY')")
  public void deleteAssignment(@PathVariable("facultyId") Integer facultyId,
      @PathVariable("assignmentId") Integer assignmentId) {
    assignmentService.deleteAssignment(facultyId, assignmentId);
  }

  @GetMapping("/getAssignment/{facultyId}")
  @PreAuthorize("hasRole('FACULTY')")
  public ResponseEntity<Page<EAssignment>> getAssignmentDetails(@PathVariable Integer facultyId, Pageable pageable) {
    Page<EAssignment> assignments = assignmentService.getAssignmentDetails(facultyId, pageable);
    return ResponseEntity.ok(assignments);
  }

  @GetMapping("/getAssignmentById/userId/{facultyId}/assignmentId/{assignmentId}")
  @PreAuthorize("hasRole('FACULTY')")
  public ResponseEntity<EAssignment> getAssignmentById(@PathVariable Integer assignmentId,
      @PathVariable Integer facultyId) {
    EAssignment assignment = assignmentService.getAssignmentById(facultyId, assignmentId);
    return ResponseEntity.ok(assignment);
  }

//  private Pageable applyPaginationAndSorting(Integer page, Integer size, String[] sort) {
//    List<Order> orders = new ArrayList<Order>();
//    if (sort[0].contains(",")) {
//      for (String sortOrder : sort) {
//        String[] s = sortOrder.split(",");
//        orders.add(new Order(getSortDirection(s[1]), s[0]));
//      }
//    } else {
//      orders.add(new Order(getSortDirection(sort[1]), sort[0]));
//    }
//    Pageable pageable = PageRequest.of(page, size, Sort.by(orders));
//    return pageable;
//  }
//
//  private Direction getSortDirection(String direction) {
//    if (direction.equals("asc")) {
//      return Sort.Direction.ASC;
//    } else if (direction.equals("desc")) {
//      return Sort.Direction.DESC;
//    }
//    return Sort.Direction.ASC;
//  }

  @GetMapping("/studentAssignmentStatus/{facultyId}")
  @PreAuthorize("hasRole('FACULTY')")
  public ResponseEntity<Page<EStudentAssignmentDetailsView>> getStudentAssignmentStatus(@PathVariable Integer facultyId,
      Pageable pageable) {
    return ResponseEntity.ok(studentAssignmentDetailsViewService.getStudentAssignmentStatus(facultyId, pageable));
  }

  @GetMapping("/title/{facultyId}")
  @PreAuthorize("hasRole('FACULTY')")
  public ResponseEntity<String> checkIfTitleUnique(HttpServletRequest request,
      @PathVariable("facultyId") Integer facultyId) {
    String title = request.getParameter("title");
    return ResponseEntity.ok(facultyService.checkIsTitleUnique(facultyId, title));
  }

  @GetMapping("/downloadFile/{fileName}")
  @PreAuthorize("hasRole('FACULTY')")
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
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }

}
