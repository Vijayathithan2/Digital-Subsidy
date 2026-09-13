package com.example.governmentsubsidy.dto.application;

import com.example.governmentsubsidy.enums.DocumentType;
import java.time.LocalDateTime;

public class DocumentDto {

    private Long id;
    private DocumentType documentType;
    private String fileName;
    private String fileType;
    private String filePath;
    private String verificationStatus;
    private LocalDateTime uploadedAt;

    public DocumentDto() {}

    public DocumentDto(Long id, DocumentType documentType, String fileName, String fileType,
                       String filePath, String verificationStatus, LocalDateTime uploadedAt) {
        this.id = id;
        this.documentType = documentType;
        this.fileName = fileName;
        this.fileType = fileType;
        this.filePath = filePath;
        this.verificationStatus = verificationStatus;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
