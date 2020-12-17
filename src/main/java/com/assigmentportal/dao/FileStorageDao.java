package com.assigmentportal.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.assigmentportal.entity.EFileStorageProperties;

@Repository
public interface FileStorageDao extends JpaRepository<EFileStorageProperties, Integer> {

	@Query("select a from EFileStorageProperties a where user_id = ?1 and assignment_id = ?2")
	EFileStorageProperties checkDocumentByUserId(Integer userId, Integer assignmentId);

	@Query("select fileName from EFileStorageProperties a where user_id = ?1")
	String getUploadDocumentPath(Integer userId, String docType);

}
