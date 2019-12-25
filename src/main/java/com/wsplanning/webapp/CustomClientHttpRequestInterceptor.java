package com.wsplanning.webapp;

import com.wsplanning.CustomAuthenticationProvider;
import groovy.util.logging.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
@Slf4j
public class CustomClientHttpRequestInterceptor implements ClientHttpRequestInterceptor {

    @Autowired
    private HttpSession session;

    @Override
    public ClientHttpResponse intercept(HttpRequest httpRequest, byte[] bytes, ClientHttpRequestExecution clientHttpRequestExecution) throws IOException {
        try {
            String token = getToken();
            if(StringUtils.isNotBlank(token)) {
                HttpHeaders headers = httpRequest.getHeaders();
                if(!headers.containsKey("Token")) {
                    headers.set("Token", token);
                }
            }
            return clientHttpRequestExecution.execute(httpRequest, bytes);
        } catch (IOException e) {
            return null;
        }
    }

    private String getToken() {
        String token = (String) session.getAttribute(CustomAuthenticationProvider.SESSION_TOKEN);
        return token;
    }
}
