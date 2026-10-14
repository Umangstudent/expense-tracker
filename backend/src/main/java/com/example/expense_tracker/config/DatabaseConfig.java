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
            if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
                try {
                    String cleanUrl = url.replaceFirst("^postgres(ql)?://", "http://");
                    URI uri = new URI(cleanUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();

                    config.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + path);

                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":");
                        config.setUsername(userInfo[0]);
                        if (userInfo.length > 1) {
                            config.setPassword(userInfo[1]);
                        }
                    } else {
                        config.setUsername(username.isBlank() ? "postgres" : username);
                        config.setPassword(password.isBlank() ? "password" : password);
                    }
                } catch (Exception e) {
                    config.setJdbcUrl(url.startsWith("jdbc:") ? url : "jdbc:" + url);
                    config.setUsername(username.isBlank() ? "postgres" : username);
                    config.setPassword(password.isBlank() ? "password" : password);
                }
            } else {
                config.setJdbcUrl(url);
                config.setUsername(username.isBlank() ? "postgres" : username);
                config.setPassword(password.isBlank() ? "password" : password);
            }
            config.setDriverClassName("org.postgresql.Driver");
        } else {
            // In cloud environments where PostgreSQL is not yet configured,
            // fall back to H2 so the service starts up and is immediately healthy and live.
            config.setJdbcUrl("jdbc:h2:mem:expense_tracker;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
            config.setDriverClassName("org.h2.Driver");
            config.setUsername("sa");
            config.setPassword("");
        }

        return new HikariDataSource(config);
    }
}

