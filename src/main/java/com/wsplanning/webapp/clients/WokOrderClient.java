package com.wsplanning.webapp.clients;

import com.google.gson.Gson;
import com.wsplanning.webapp.dto.WODTO;
import com.wsplanning.webapp.dto.WOJobDTO;
import com.wsplanning.webapp.utils.Utils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Created by ThuyetLV
 */
@Component
public class WokOrderClient {

  private RestTemplate restTemplate;
  private String endpointUrl;

  @Autowired
  public WokOrderClient(RestTemplate restTemplate, @Value("${apiEndpointUrl}") String apiEndpointUrl) {
    this.restTemplate = restTemplate;
    this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
    this.endpointUrl = apiEndpointUrl + "/api/WorkOrders";
  }

  private HttpHeaders generateHearderWO(String token,Map<String, String> params){
    String skey = params.get("skey");
    String page = params.get("page");
    String limit = params.get("limit");
    String DeptId = params.get("DeptId");
    String Receiver = params.get("Receiver");
    String TransactionType = params.get("TransactionType");
    String VisitReasonCode = params.get("VisitReasonCode");
    String MyWO = params.get("MyWO");
    String LoadAttachment = params.get("LoadAttachment");
    String LoadAttachmentData = params.get("LoadAttachmentData");
    String ServDateFrom = params.get("FromDate");
    String ServDateTo = params.get("ToDate");
    String shiftId = params.get("shiftId");
    String sortByField = params.get("SortByField");
    String sortDesc = params.get("SortDesc");


    //Filter
    String workOrderStatus = params.get("WorkOrderStatus");
    String subStatus = params.get("SubStatus");
    String visitReasonCode = params.get("VisitReasonCode");
    String onlyToday = params.get("OnlyToday");

    HttpHeaders headers = new HttpHeaders();
    headers.set("Token", token);
    if (StringUtils.isNotBlank(skey)) {
      headers.set("skey", Base64.getEncoder().encodeToString(skey.getBytes()));
    }

    if (StringUtils.isNotBlank(limit)) {
      headers.set("PageCount", limit);
    }
    if (StringUtils.isNotBlank(page)) {
      headers.set("Page", page);
    }

    if (StringUtils.isNotBlank(shiftId)) {
      headers.set("ShiftId", shiftId);
    }

    if (StringUtils.isNotBlank(DeptId)) {
      headers.set("DeptId", DeptId);
    }
    if (StringUtils.isNotBlank(sortByField)) {
      headers.set("SortByField", sortByField);
    }
    if (StringUtils.isNotBlank(sortDesc)) {
      headers.set("SortDesc", sortDesc);
    }

    if (StringUtils.isNotBlank(Receiver)) {
      headers.set("Receiver", Receiver);
    }
    if (StringUtils.isNotBlank(TransactionType)) {
      headers.set("TransactionType", TransactionType);
    }
    if (StringUtils.isNotBlank(VisitReasonCode)) {
      headers.set("VisitReasonCode", VisitReasonCode);
    }
    if (StringUtils.isNotBlank(MyWO) && "true".equalsIgnoreCase(MyWO)) {
      headers.set("MyWO", "true");
    }
    if (StringUtils.isNotBlank(LoadAttachment) && "true".equalsIgnoreCase(LoadAttachment)) {
      headers.set("LoadAttachment", "true");
    }
    if (StringUtils.isNotBlank(LoadAttachmentData) && "true".equalsIgnoreCase(LoadAttachmentData)) {
      headers.set("LoadAttachmentData", "true");
    }
    if (StringUtils.isNotBlank(ServDateFrom)) {
      headers.set("ServDateFrom", Utils.formateDateAPI(ServDateFrom));
    }
    if (StringUtils.isNotBlank(ServDateTo)) {
      headers.set("ServDateTo", Utils.formateDateAPI(ServDateTo));
    }

    //Filter
    if (StringUtils.isNotBlank(workOrderStatus)) {
      headers.set("WorkOrderStatus", workOrderStatus);
    }
    if (StringUtils.isNotBlank(subStatus)) {
      headers.set("SubStatus", subStatus);
    }
    if (StringUtils.isNotBlank(visitReasonCode)) {
      headers.set("VisitReasonCode", visitReasonCode);
    }

    if (StringUtils.isNotBlank(onlyToday) && "true".equalsIgnoreCase(onlyToday)) {
      headers.set("OnlyToday", "true");
    }else{
      headers.set("OnlyToday", "false");
    }
    return headers;
  }

  public String countWO(String token, String siteId, Map<String, String> params) {
    String viewName = params.get("ViewName");

    HttpHeaders headers = generateHearderWO(token,params);

    HttpEntity entity = new HttpEntity(headers);

    String url = String.format("%s?SiteId=%s&ViewName=%s&getCountOnly=%s", this.endpointUrl, siteId, viewName, "true");
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
    return response.getBody();
  }

  public String getWO(String token, String siteId, Map<String, String> params) {

    String viewName = params.get("ViewName");

    HttpHeaders headers = generateHearderWO(token,params);

    HttpEntity entity = new HttpEntity(headers);
    String url = String.format("%s?SiteId=%s&ViewName=%s", this.endpointUrl, siteId, viewName);
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
    return response.getBody();
  }

  public String detail(String token, String siteId, Map<String, String> params) {
    String workOrderId = params.get("WorkOrderId");
    String LoadRows = params.get("LoadRows");
    String LoadAttachmentData = params.get("LoadAttachmentData");
    String LoadAttachment = params.get("LoadAttachment");

    HttpHeaders headers = new HttpHeaders();
    headers.set("Token", token);
    if(StringUtils.isNotBlank(LoadRows)) {
      headers.set("LoadRows", LoadRows);
    }
    if (StringUtils.isNotBlank(LoadAttachment) && "true".equalsIgnoreCase(LoadAttachment)) {
      headers.set("LoadAttachment", "true");
    }
    // if(StringUtils.isNotBlank(LoadAttachmentData)) {
    //   headers.set("LoadAttachmentData", LoadAttachmentData);
    // }
    
    HttpEntity entity = new HttpEntity(headers);
    String url = String.format("%s?SiteId=%s&WorkOrderId=%s", this.endpointUrl, siteId, workOrderId);
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
    return response.getBody();
  }

  public String getPhoto(String token, String siteId, Map<String, String> params) {
    String workOrderId = params.get("workOrderId");
    String jobRowId = params.get("jobRowId");
    String LoadWOAttachmentData = params.get("LoadWOAttachmentData");

    HttpHeaders headers = new HttpHeaders();
    headers.set("Token", token);
    if(StringUtils.isNotBlank(LoadWOAttachmentData)){
      headers.set("LoadWOAttachmentData", LoadWOAttachmentData);
    }
    
    HttpEntity entity = new HttpEntity(headers);
    String url = String.format("%s?SiteId=%s&WorkOrderId=%s&JobRowId=%s", this.endpointUrl, siteId, workOrderId, jobRowId);
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
    return response.getBody();
  }


  public String postWO2(String token, Map<String, String> params) {
    String postAction = params.get("postAction");
    String swodto = params.get("wodto");
    Gson gson = new Gson();
    WODTO wodto = gson.fromJson(swodto, WODTO.class);

    HttpHeaders headers = new HttpHeaders();
    if (StringUtils.isNotBlank(token)) {
      headers.set("Token", token);
    }
    if (StringUtils.isNotBlank(postAction)) {
      headers.set("PostAction", postAction);
    }
    HttpEntity<WODTO> entity = new HttpEntity<WODTO>(wodto, headers);
    String url = String.format("%s", this.endpointUrl);
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    return response.getBody();
  }

  public String postWO(String token, String postAction, WODTO wodto) {
    HttpHeaders headers = new HttpHeaders();
    if (StringUtils.isNotBlank(token)) {
      headers.set("Token", token);
    }
    if (StringUtils.isNotBlank(postAction)) {
      headers.set("PostAction", postAction);
      if (postAction == "saveHeader") {
        wodto.WOJobs = new ArrayList<>();
      }else if (postAction == "saveResource") {
      }else if (postAction == "createNew") {

      }
      // if(postAction == "saveRows") {
      //   wodto. = new  ArrayList<>();;
      // }
    }

    if(StringUtils.isEmpty(wodto.ContactPhone)) {
      wodto.ContactPhone = "";
    }
    if(StringUtils.isEmpty(wodto.ContactEmail)) {
      wodto.ContactEmail = "";
    }
    if(StringUtils.isEmpty(wodto.ContactFName)) {
      wodto.ContactFName = "";
    }
    if(StringUtils.isEmpty(wodto.ContactLName)) {
      wodto.ContactLName = "";
    }
    
    HttpEntity<WODTO> entity = new HttpEntity<WODTO>(wodto, headers);
    String url = String.format("%s", this.endpointUrl);
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    return response.getBody();
  }


  public String getResource(String siteId, String date, String DeptId, String ShiftId) {
    if(DeptId == null || DeptId.trim().length() == 0 || "0".equalsIgnoreCase(DeptId)){
      DeptId = "";
    }
    if(ShiftId == null || ShiftId.trim().length() == 0 || "0".equalsIgnoreCase(ShiftId)){
      ShiftId = "";
    }
    String url = String.format("%s?SiteId=%s&Day=%s&DeptId=%s&ShiftId=%s", this.endpointUrl, siteId, date, DeptId, ShiftId);
    return restTemplate.getForObject(url, String.class);
  }

  public String getGridWO(String token, String siteId, Map<String, String> params) {
    String viewName = params.get("ViewName");

    HttpHeaders headers = generateHearderWO(token,params);

    headers.set("LoadRows", "true");
    headers.set("LoadAllResource", "true");

    HttpEntity entity = new HttpEntity(headers);
    String url = String.format("%s?SiteId=%s&ViewName=%s", this.endpointUrl, siteId, viewName);
    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, new HashMap<>());
    return response.getBody();
  }

}
