package com.example.expense_tracker.service;

import com.example.expense_tracker.entity.Income;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {
    
    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public List<Income> getIncomesByUserId(Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    public Income createIncome(Income income) {
        return incomeRepository.save(income);
    }

    public void deleteIncome(Long id) {
        Income income = incomeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        incomeRepository.delete(income);
    }
}
