package com.assigmentportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.assigmentportal.dao.UserRepository;
import com.assigmentportal.entity.User;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  UserRepository userRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) {
    try {
      User user = userRepository.findByUsername(username);
      return UserDetailsImpl.build(user);
    } catch (Exception e) {
      throw new UsernameNotFoundException("User Not Found with username: " + username);
    }
  }

}
