package com.example.governmentsubsidy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "regions")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 30, nullable = false, unique = true)
    private String code;

    @Column(name = "state_name", length = 100, nullable = false)
    private String stateName;

    @Column(name = "district_name", length = 100, nullable = false)
    private String districtName;

    @Column(name = "sub_district", length = 100)
    private String subDistrict;

    @Column(name = "allocated_budget", precision = 18, scale = 2, nullable = false)
    private BigDecimal allocatedBudget = BigDecimal.ZERO;

    @Column(name = "utilized_budget", precision = 18, scale = 2, nullable = false)
    private BigDecimal utilizedBudget = BigDecimal.ZERO;

    public Region() {}

    public Region(String code, String stateName, String districtName, String subDistrict, BigDecimal allocatedBudget) {
        this.code = code;
        this.stateName = stateName;
        this.districtName = districtName;
        this.subDistrict = subDistrict;
        this.allocatedBudget = allocatedBudget != null ? allocatedBudget : BigDecimal.ZERO;
        this.utilizedBudget = BigDecimal.ZERO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getSubDistrict() {
        return subDistrict;
    }

    public void setSubDistrict(String subDistrict) {
        this.subDistrict = subDistrict;
    }

    public BigDecimal getAllocatedBudget() {
        return allocatedBudget;
    }

    public void setAllocatedBudget(BigDecimal allocatedBudget) {
        this.allocatedBudget = allocatedBudget;
    }

    public BigDecimal getUtilizedBudget() {
        return utilizedBudget;
    }

    public void setUtilizedBudget(BigDecimal utilizedBudget) {
        this.utilizedBudget = utilizedBudget;
    }
}
