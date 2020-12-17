package com.assigmentportal.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.assigmentportal.dao.FileStorageDao;
import com.assigmentportal.entity.EFileStorageProperties;
import com.assigmentportal.exception.FileStorageException;

@Service
public class FileStorageService {

	private final Path fileStorageLocation;

	@Autowired
	FileStorageDao fileStorageDao;

	@Autowired
	public FileStorageService(EFileStorageProperties eFileStorageProperties) {
		this.fileStorageLocation = Paths.get(eFileStorageProperties.getUploadDir()).toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("Could not create the directory where the uploaded files will be stored.");
		}
	}

	public String storeFile(MultipartFile file, Integer userId, String docType, String title) {
		String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
		String fileName = "";

		try {
			if (originalFileName.contains("..")) {
				throw new FileStorageException("Sorry! Filename contains invalid path sequence " + originalFileName);
			}
			String fileExtension = "";

			try {
				fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
			} catch (Exception e) {
				fileExtension = "";
			}

			fileName = userId.toString() + "_"+ title.replace(" ", "_") + fileExtension;
			Path targetLocation = this.fileStorageLocation.resolve(fileName);
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

			return fileName;
		} catch (IOException ex) {
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!");
		}
	}

	public Resource loadFileAsResource(String fileName) throws Exception {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists()) {
				return resource;
			} else {
				throw new FileNotFoundException("File not found " + fileName);
			}
		} catch (MalformedURLException ex) {
			throw new FileNotFoundException("File not found " + fileName);
		}
	}

}
