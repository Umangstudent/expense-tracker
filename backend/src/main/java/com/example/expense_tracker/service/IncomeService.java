package com.example.expense_tracker.service;

import com.example.expense_tracker.entity.Income;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.IncomeRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IncomeService {
    
    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public List<Income> getIncomesForUser(User user) {
        return incomeRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    public List<Income> getIncomesByUserId(Long userId) {
        return incomeRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Income getIncomeById(Long id, User user) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        if (income.getUser() == null || !income.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this income");
        }
        return income;
    }

    public Income createIncome(Income income, User user) {
        income.setUser(user);
        if (income.getDate() == null) {
            income.setDate(LocalDate.now());
        }
        return incomeRepository.save(income);
    }

    public Income updateIncome(Long id, Income incomeDetails, User user) {
        Income income = getIncomeById(id, user);
        if (incomeDetails.getSource() != null) {
            income.setSource(incomeDetails.getSource());
        }
        if (incomeDetails.getAmount() != null) {
            income.setAmount(incomeDetails.getAmount());
        }
        if (incomeDetails.getDate() != null) {
            income.setDate(incomeDetails.getDate());
        }
        return incomeRepository.save(income);
    }

    public void deleteIncome(Long id, User user) {
        Income income = getIncomeById(id, user);
        incomeRepository.delete(income);
    }

    public void deleteIncome(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        incomeRepository.delete(income);
    }

    public Income createIncome(Income income) {
        return incomeRepository.save(income);
    }
}
