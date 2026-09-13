package com.example.governmentsubsidy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_releases")
public class FundRelease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false, unique = true)
    private DisbursementMilestone milestone;

    @Column(name = "transaction_ref_number", length = 100, nullable = false, unique = true)
    private String transactionRefNumber;

    @Column(name = "released_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal releasedAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "released_by_user_id", nullable = false)
    private User releasedByUser;

    @Column(name = "payment_mode", length = 50, nullable = false)
    private String paymentMode = "DIRECT_BENEFIT_TRANSFER";

    @Column(name = "treasury_status", length = 30, nullable = false)
    private String treasuryStatus = "PROCESSED";

    @Column(name = "released_at", nullable = false, updatable = false)
    private LocalDateTime releasedAt = LocalDateTime.now();

    public FundRelease() {}

    public FundRelease(DisbursementMilestone milestone, String transactionRefNumber,
                       BigDecimal releasedAmount, User releasedByUser,
                       String paymentMode, String treasuryStatus) {
        this.milestone = milestone;
        this.transactionRefNumber = transactionRefNumber;
        this.releasedAmount = releasedAmount;
        this.releasedByUser = releasedByUser;
        this.paymentMode = paymentMode != null ? paymentMode : "DIRECT_BENEFIT_TRANSFER";
        this.treasuryStatus = treasuryStatus != null ? treasuryStatus : "PROCESSED";
        this.releasedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DisbursementMilestone getMilestone() {
        return milestone;
    }

    public void setMilestone(DisbursementMilestone milestone) {
        this.milestone = milestone;
    }

    public String getTransactionRefNumber() {
        return transactionRefNumber;
    }

    public void setTransactionRefNumber(String transactionRefNumber) {
        this.transactionRefNumber = transactionRefNumber;
    }

    public BigDecimal getReleasedAmount() {
        return releasedAmount;
    }

    public void setReleasedAmount(BigDecimal releasedAmount) {
        this.releasedAmount = releasedAmount;
    }

    public User getReleasedByUser() {
        return releasedByUser;
    }

    public void setReleasedByUser(User releasedByUser) {
        this.releasedByUser = releasedByUser;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getTreasuryStatus() {
        return treasuryStatus;
    }

    public void setTreasuryStatus(String treasuryStatus) {
        this.treasuryStatus = treasuryStatus;
    }

    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(LocalDateTime releasedAt) {
        this.releasedAt = releasedAt;
    }
}
