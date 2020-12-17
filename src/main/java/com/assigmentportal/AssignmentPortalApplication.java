package com.assigmentportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.assigmentportal.entity.EFileStorageProperties;

@SpringBootApplication
@EnableConfigurationProperties(EFileStorageProperties.class)
public class AssignmentPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssignmentPortalApplication.class, args);
	}

}
