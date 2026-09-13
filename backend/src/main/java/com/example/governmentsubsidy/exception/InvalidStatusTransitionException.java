package com.example.governmentsubsidy.exception;

import com.example.governmentsubsidy.enums.ApplicationStatus;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(ApplicationStatus from, ApplicationStatus to) {
        super("Invalid application status transition from [" + from + "] to [" + to + "]");
    }

    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
