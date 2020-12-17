package com.assigmentportal.common;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidateInput {

  public static final String USERNAME = "^[A-Za-z]\\w{5,29}$";
  public static final String EMAIL = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";

  public static boolean isValidUsername(String name) {
    Pattern p = Pattern.compile(USERNAME);
    if (name == null || name.isEmpty()) {
      return false;
    }
    Matcher m = p.matcher(name);
    return m.matches();
  }

  public static boolean isValidEmail(String email) {
    Pattern p = Pattern.compile(EMAIL);
    if (email == null || email.isEmpty()) {
      return false;
    }
    Matcher m = p.matcher(email);
    return m.matches();
  }
}
