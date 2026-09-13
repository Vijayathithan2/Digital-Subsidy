package com.example.governmentsubsidy.dto.beneficiary;

import com.example.governmentsubsidy.enums.BeneficiaryCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BeneficiaryRequest {

    @NotBlank(message = "Identity number is required")
    private String identityNumber;

    @NotNull(message = "Region ID is required")
    private Long regionId;

    @NotNull(message = "Category is required")
    private BeneficiaryCategory category;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotNull(message = "Annual income is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Income cannot be negative")
    private BigDecimal annualIncome;

    private BigDecimal landHoldingHectares = BigDecimal.ZERO;

    private boolean disabled = false;

    @NotBlank(message = "Bank account number is required")
    private String bankAccountNumber;

    @NotBlank(message = "Bank IFSC code is required")
    private String bankIfscCode;

    @NotBlank(message = "Bank name is required")
    private String bankName;

    @NotBlank(message = "Address is required")
    private String addressLine;

    public BeneficiaryRequest() {}

    public String getIdentityNumber() {
        return identityNumber;
    }

    public void setIdentityNumber(String identityNumber) {
        this.identityNumber = identityNumber;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public BeneficiaryCategory getCategory() {
        return category;
    }

    public void setCategory(BeneficiaryCategory category) {
        this.category = category;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }

    public BigDecimal getLandHoldingHectares() {
        return landHoldingHectares;
    }

    public void setLandHoldingHectares(BigDecimal landHoldingHectares) {
        this.landHoldingHectares = landHoldingHectares;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankIfscCode() {
        return bankIfscCode;
    }

    public void setBankIfscCode(String bankIfscCode) {
        this.bankIfscCode = bankIfscCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }
}
