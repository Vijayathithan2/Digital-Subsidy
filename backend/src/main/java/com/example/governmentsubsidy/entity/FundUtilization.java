package com.example.governmentsubsidy.entity;

import com.example.governmentsubsidy.enums.UtilizationVerificationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_utilizations")
public class FundUtilization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private SubsidyApplication application;

    @Column(name = "utilized_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal utilizedAmount;

    @Column(name = "proof_document_path", length = 500)
    private String proofDocumentPath;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", length = 30, nullable = false)
    private UtilizationVerificationStatus verificationStatus = UtilizationVerificationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedByUser;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    public FundUtilization() {}

    public FundUtilization(SubsidyApplication application, BigDecimal utilizedAmount,
                           String proofDocumentPath, String remarks) {
        this.application = application;
        this.utilizedAmount = utilizedAmount;
        this.proofDocumentPath = proofDocumentPath;
        this.remarks = remarks;
        this.verificationStatus = UtilizationVerificationStatus.PENDING;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SubsidyApplication getApplication() {
        return application;
    }

    public void setApplication(SubsidyApplication application) {
        this.application = application;
    }

    public BigDecimal getUtilizedAmount() {
        return utilizedAmount;
    }

    public void setUtilizedAmount(BigDecimal utilizedAmount) {
        this.utilizedAmount = utilizedAmount;
    }

    public String getProofDocumentPath() {
        return proofDocumentPath;
    }

    public void setProofDocumentPath(String proofDocumentPath) {
        this.proofDocumentPath = proofDocumentPath;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public UtilizationVerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(UtilizationVerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public User getVerifiedByUser() {
        return verifiedByUser;
    }

    public void setVerifiedByUser(User verifiedByUser) {
        this.verifiedByUser = verifiedByUser;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
