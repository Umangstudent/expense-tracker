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

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username:postgres}")
    private String username;

    @Value("${spring.datasource.password:password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        if (url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                // If it's a URL like postgresql://user:password@host:port/database
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
                    config.setUsername(username);
                    config.setPassword(password);
                }
            } catch (Exception e) {
                config.setJdbcUrl(url.startsWith("jdbc:") ? url : "jdbc:" + url);
                config.setUsername(username);
                config.setPassword(password);
            }
        } else {
            config.setJdbcUrl(url);
            config.setUsername(username);
            config.setPassword(password);
        }

        config.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(config);
    }
}
