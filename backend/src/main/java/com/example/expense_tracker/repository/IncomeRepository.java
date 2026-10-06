package com.example.expense_tracker.repository;

import com.example.expense_tracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);

    @Query("SELECT YEAR(i.date) as year, MONTH(i.date) as month, SUM(i.amount) as total FROM Income i WHERE i.user.id = :userId GROUP BY YEAR(i.date), MONTH(i.date) ORDER BY year, month")
    List<Map<String, Object>> getMonthlySummary(@Param("userId") Long userId);
}
