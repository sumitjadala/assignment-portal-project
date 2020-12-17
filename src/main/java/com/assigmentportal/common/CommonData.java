package com.assigmentportal.common;

import java.util.Arrays;
import java.util.List;

public class CommonData {
  public static final Integer STUDENT_ID = 1;
  public static final Integer FACULTY_ID = 1;
	public static final Integer SUBMIT_STATUS_SUBMITTED = 1;
	public static final Integer SUBMIT_STATUS_NOT_SUBMITTED = 2;
	public static final Integer SUBMIT_STATUS_DUE_DATE_PASSED = 3;
	public static final List<String> ACCEPTED_FILE_TYPE = Arrays.asList("application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document");
	
	public static enum Roles {   ROLE_STUDENT, ROLE_FACULTY, ROLE_ADMIN } 
}
