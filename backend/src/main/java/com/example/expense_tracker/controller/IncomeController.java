package com.example.expense_tracker.controller;

import com.example.expense_tracker.entity.Income;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.IncomeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {
    
    private final IncomeRepository incomeRepository;

    public IncomeController(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }
    
    @GetMapping("/user/{userId}")
    public List<Income> getIncomes(@PathVariable Long userId) {
        return incomeRepository.findByUserId(userId);
    }
    
    @PostMapping
    public Income createIncome(@RequestBody Income income) {
        return incomeRepository.save(income);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        Income income = incomeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        incomeRepository.delete(income);
        return ResponseEntity.ok().build();
    }
}
