package com.example.expense_tracker.dto;

import java.math.BigDecimal;

public interface MonthlySummary {
    Integer getYear();
    Integer getMonth();
    BigDecimal getTotal();
}
