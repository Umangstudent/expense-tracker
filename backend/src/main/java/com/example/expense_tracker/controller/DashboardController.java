package com.example.expense_tracker.controller;

import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.security.SecurityUtils;
import com.example.expense_tracker.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private final DashboardService dashboardService;
    private final SecurityUtils securityUtils;

    public DashboardController(DashboardService dashboardService, SecurityUtils securityUtils) {
        this.dashboardService = dashboardService;
        this.securityUtils = securityUtils;
    }
    
    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {
        User user = securityUtils.getCurrentUser();
        return dashboardService.getDashboardSummary(user);
    }

    @GetMapping("/{userId}/summary")
    public Map<String, Object> getDashboardSummaryByUserId(@PathVariable Long userId) {
        User user = securityUtils.getCurrentUser();
        return dashboardService.getDashboardSummary(user);
    }
}
