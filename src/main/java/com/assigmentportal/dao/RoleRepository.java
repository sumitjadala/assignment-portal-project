package com.assigmentportal.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.ERole;
import com.assigmentportal.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{
	Optional<com.assigmentportal.entity.Role> findByName(ERole role);
}
