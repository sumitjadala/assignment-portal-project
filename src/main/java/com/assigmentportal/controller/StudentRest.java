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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.assigmentportal.common.CommonData;
import com.assigmentportal.entity.EStudentAssignmentDetails;
import com.assigmentportal.entity.EStudentAssignmentDetailsView;
import com.assigmentportal.service.FileStorageService;
import com.assigmentportal.service.StudentAssignmentDetailsService;
import com.assigmentportal.service.StudentAssignmentDetailsViewService;

@RestController
@RequestMapping("/api/student/")
public class StudentRest {

	private final Logger logger = LoggerFactory.getLogger(StudentRest.class);

	@Autowired
	StudentAssignmentDetailsService studentAssignmentDetailsService;

	@Autowired
	FileStorageService fileStorageService;
	
	@Autowired
	StudentAssignmentDetailsViewService studentAssignmentDetailsViewService;

	@GetMapping("getAllAssignments/{id}")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<Page<EStudentAssignmentDetailsView>> getAllAssignmentsBasedOnStudentId(@PathVariable Integer id, Pageable pageable) {
	  Page<EStudentAssignmentDetailsView> allAssignment = studentAssignmentDetailsViewService.getAllAssignmentsBasedOnStudentId(id, pageable);
		return ResponseEntity.ok(allAssignment);
	}

	@GetMapping("pendingAssignments/{id}")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<Page<EStudentAssignmentDetailsView>> getPendingAssignments(@PathVariable Integer id, Pageable pageable) {
	  Page<EStudentAssignmentDetailsView> pendingAssignment = studentAssignmentDetailsViewService.getPendingAssignments(id, pageable);
		return ResponseEntity.ok(pendingAssignment);
	}

  @PostMapping("/submitAssignment")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<?> uploadFile(HttpServletRequest request,  @RequestParam("submittedAssignmentFile") MultipartFile file) {
    if(CommonData.ACCEPTED_FILE_TYPE.contains(file.getContentType())) {
      String title = request.getParameter("title");
      Integer studentId = Integer.parseInt(request.getParameter("userId"));
      Integer assignmentId = Integer.parseInt(request.getParameter("assignmentId"));
      String fileName = fileStorageService.storeFile(file, studentId, file.getContentType(), title);
      EStudentAssignmentDetails assignment = studentAssignmentDetailsService.submitAssignment(fileName, studentId, assignmentId);
      return ResponseEntity.ok("Submitted Successfully");
    } else {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Please upload pdf/docs file");
    }
	}

	@GetMapping("/downloadFile/{fileName}")
	@PreAuthorize("hasRole('STUDENT')")
	public ResponseEntity<Resource> downloadFile(@PathVariable("fileName") String fileName, HttpServletRequest request) throws Exception {
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
