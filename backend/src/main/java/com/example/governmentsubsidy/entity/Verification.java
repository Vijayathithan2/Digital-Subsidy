package com.example.governmentsubsidy.entity;

import com.example.governmentsubsidy.enums.VerificationDecision;
import com.example.governmentsubsidy.enums.VerificationStage;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verifications")
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private SubsidyApplication application;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage", length = 50, nullable = false)
    private VerificationStage stage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id", nullable = false)
    private User verifiedByUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision", length = 30, nullable = false)
    private VerificationDecision decision;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "verified_at", nullable = false, updatable = false)
    private LocalDateTime verifiedAt = LocalDateTime.now();

    public Verification() {}

    public Verification(SubsidyApplication application, VerificationStage stage, User verifiedByUser,
                        VerificationDecision decision, String remarks) {
        this.application = application;
        this.stage = stage;
        this.verifiedByUser = verifiedByUser;
        this.decision = decision;
        this.remarks = remarks;
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

    public VerificationStage getStage() {
        return stage;
    }

    public void setStage(VerificationStage stage) {
        this.stage = stage;
    }

    public User getVerifiedByUser() {
        return verifiedByUser;
    }

    public void setVerifiedByUser(User verifiedByUser) {
        this.verifiedByUser = verifiedByUser;
    }

    public VerificationDecision getDecision() {
        return decision;
    }

    public void setDecision(VerificationDecision decision) {
        this.decision = decision;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
