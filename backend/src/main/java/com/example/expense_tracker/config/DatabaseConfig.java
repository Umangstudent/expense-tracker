package com.example.expense_tracker.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String url;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        boolean hasRemotePostgres = (url != null && !url.isBlank() && !url.contains("localhost:5432"));

        if (hasRemotePostgres) {
            String cleanUrl = url.trim();
            if (cleanUrl.startsWith("jdbc:")) {
                cleanUrl = cleanUrl.substring(5);
            }
            if (cleanUrl.contains("@")) {
                try {
                    String httpUrl = cleanUrl.replaceFirst("^[a-zA-Z0-9_-]+://", "http://");
                    if (!httpUrl.startsWith("http://")) {
                        httpUrl = "http://" + httpUrl;
                    }
                    URI uri = new URI(httpUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();

                    config.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + path);

                    if (uri.getUserInfo() != null) {
                        String[] parts = uri.getUserInfo().split(":", 2);
                        config.setUsername(parts[0]);
                        if (parts.length > 1) {
                            config.setPassword(parts[1]);
                        }
                    } else {
                        if (username != null && !username.isBlank()) config.setUsername(username);
                        if (password != null && !password.isBlank()) config.setPassword(password);
                    }
                } catch (Exception e) {
                    config.setJdbcUrl(url.startsWith("jdbc:") ? url : "jdbc:" + url);
                    if (username != null && !username.isBlank()) config.setUsername(username);
                    if (password != null && !password.isBlank()) config.setPassword(password);
                }
            } else {
                config.setJdbcUrl(url.startsWith("jdbc:") ? url : "jdbc:" + url);
                if (username != null && !username.isBlank()) config.setUsername(username);
                if (password != null && !password.isBlank()) config.setPassword(password);
            }
            config.setDriverClassName("org.postgresql.Driver");
        } else {
            config.setJdbcUrl("jdbc:h2:mem:expense_tracker;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
            config.setDriverClassName("org.h2.Driver");
            config.setUsername("sa");
            config.setPassword("");
        }

        return new HikariDataSource(config);
    }
}
