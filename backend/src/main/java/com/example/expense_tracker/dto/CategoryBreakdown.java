package com.example.expense_tracker.dto;

import java.math.BigDecimal;

public interface CategoryBreakdown {
    String getCategory();
    BigDecimal getTotal();
}
