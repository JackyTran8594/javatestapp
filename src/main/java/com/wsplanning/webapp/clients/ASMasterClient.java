package com.wsplanning.webapp.clients;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.record.PageBreakRecord.Break;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpSession;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * Created by ThuyetLV
 */
@Component
public class ASMasterClient {

    private RestTemplate restTemplate;
    private String endpointUrl;
    private String url;
    private static HashMap<String, String> hsmSite;

    @Autowired
    public ASMasterClient(RestTemplate restTemplate, @Value("${apiEndpointUrl}") String apiEndpointUrl) {
        this.restTemplate = restTemplate;
        this.restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        this.endpointUrl = apiEndpointUrl + "/api/ASMaster";
        this.url = apiEndpointUrl + "/api/";
        hsmSite = new HashMap<>();
    }

    public String getSiteName(String Id) {
        if (hsmSite == null || hsmSite.isEmpty()) {
            getSites();
        }
        return hsmSite.get(Id);
    }

    public String getSites() {
        String url = String.format("%s?command=getSites", this.endpointUrl);

        String response = restTemplate.getForObject(url, String.class);
        if (hsmSite == null || hsmSite.isEmpty()) {
            if (hsmSite == null) {
                hsmSite = new HashMap<>();
            }
            JSONArray jsonArray = new JSONArray(response);
            JSONObject itemObj = null;
            for (int i = 0; i < jsonArray.length(); i++) {
                itemObj = jsonArray.getJSONObject(i);
                hsmSite.put(itemObj.getString("Id"), itemObj.getString("Name"));
            }
        }
        return response;
    }

    public String getLanguages() {
        String url = String.format("%s?command=getLanguages", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    // getTransactionTypes&amp;param1=[site_id]

    public String getTransactionTypes(String siteId) {
        String url = String.format("%s?command=getTransactionTypes&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getDepartments(String siteId) {
        String url = String.format("%s?command=getDepartments&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getJobTypes(String siteId) {
        String url = String.format("%s?command=getJobTypes&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getJobCats(String siteId) {
        String url = String.format("%s?command=getJobCats&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getPayers(String siteId) {
        String url = String.format("%s?command=getPayers&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getShifts(String siteId) {
        String url = String.format("%s?command=getShifts&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getVisitReasons(String siteId) {
        String url = String.format("%s?command=getVisitReasons&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getChargeCats(String siteId) {
        String url = String.format("%s?command=getChargeCats&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    public String jobTab(String SiteId, String CustNo, String VehicleId) {
        String url = String.format("%s?SiteId=%s&CustNo=%s&VehiId=%s", this.endpointUrl, SiteId, CustNo, VehicleId);
        return restTemplate.getForObject(url, String.class);
    }

    public String getStampingCode(String param) {
        String url = String.format("%s?command=getStampingCodes&param1=%s", this.endpointUrl, param);
        return restTemplate.getForObject(url, String.class);
    }

    public String getTextLine(String SiteId) {
        String CustNo = "1";
        String VehiId = "1";
        String GetText = "true";
        String url = String.format("%s?SiteId=%s&CustNo=%s&VehiId=%s&bGetText=%s", this.endpointUrl, SiteId, CustNo,
                VehiId, GetText);
        return restTemplate.getForObject(url, String.class);
    }

    public String getTextPredict(Map<String, String> params) {
        String VIN = params.get("VIN");
        String language = params.get("language");
        String skey = params.get("skey");
        String url = String.format("%sTextPredict?VIN=%s&langId=%s&skey=%s", this.url, VIN, language, skey);
        return restTemplate.getForObject(url, String.class);
    }

    public JSONObject loadProperty() {
        String path = "messages/config.properties";
        String path_Menu = "messages/messages.properties";
        InputStream input = getClass().getClassLoader().getResourceAsStream(path);
        InputStream input_Menu = getClass().getClassLoader().getResourceAsStream(path_Menu);
        Properties prop_Auth = new Properties();
        Properties prop_Menu = new Properties();
        JSONArray jsonArray = new JSONArray();
        JSONArray jarray = new JSONArray();
        JSONArray arrIconBtnCommon = new JSONArray();
        JSONArray arrIconBtnDetail = new JSONArray();
        JSONArray arrayTab = new JSONArray();
        JSONArray arrTime = new JSONArray();
        JSONArray arrBtnCommon = new JSONArray();
        JSONArray arrBtnDetail = new JSONArray();
        // JSONArray properties = new JSONArray();
        JSONObject obj = new JSONObject();

        //ThuyetLV
        JSONArray objJobHeader = new JSONArray();
        if (input == null) {
            System.out.println("not found");
            JSONObject jsonItem = new JSONObject();
            jsonItem.put("name", "free");
            jsonItem.put("value", "white");
            objJobHeader.put(jsonItem);

            jsonItem.put("name", "booked");
            jsonItem.put("value", "gray");
            objJobHeader.put(jsonItem);

            jsonItem.put("name", "cap50");
            jsonItem.put("value", "#f2f4f4");
            objJobHeader.put(jsonItem);

            jsonItem.put("name", "cap25");
            jsonItem.put("value", "#808b96");
            objJobHeader.put(jsonItem);

            obj.put("jobHeader", objJobHeader);
        } else {
            try {
                prop_Auth.load(input);
                prop_Menu.load(input_Menu);

                prop_Menu.forEach((k, v) -> {
                    String[] icoStrings = k.toString().split("\\.");

                    if (icoStrings[0].contains("icon")) {
                        JSONObject jmenu = new JSONObject();
                        jmenu.put("name", icoStrings[1]);
                        jmenu.put("class", v.toString());
                        jarray.put(jmenu);
                    }

                    if (icoStrings[0].contains("iconBtn")) {
                        JSONObject jmenu = new JSONObject();
                        if (icoStrings[1].contains("common")) {
                            jmenu.put("name", icoStrings[2]);
                            jmenu.put("class", v.toString());
                            arrIconBtnCommon.put(jmenu);
                        } else {
                            jmenu.put("name", icoStrings[2]);
                            jmenu.put("class", v.toString());
                            arrIconBtnDetail.put(jmenu);
                        }
                    }

                });

                JSONObject objTimeout = new JSONObject();
                JSONObject objBarcode = new JSONObject();


                prop_Auth.forEach((key, value) -> {
                    JSONObject jsonItem = new JSONObject();
                    String strKey = key.toString();
                    if (StringUtils.isNotBlank(strKey)) {
                        String[] subStr = strKey.split("\\.");
                        if (StringUtils.startsWith(subStr[0],"app")) {
                            jsonItem.put("route", subStr[0] + "." + subStr[1] + "." + subStr[2]);
                            jsonItem.put("value", value.toString());
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            jsonArray.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"tab")) {
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("value", value.toString());
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            arrayTab.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"timeout")) {
                            objTimeout.put("name", subStr[0]);
                            objTimeout.put("value", value.toString());
                        }else if (StringUtils.startsWith(subStr[0],"common")) {
                            jsonItem.put("text", subStr[1]);
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            jsonItem.put("value", value.toString());
                            arrBtnCommon.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"detail")) {
                            jsonItem.put("name", subStr[2]);
                            jsonItem.put("ordinalNumber", Integer.parseInt(subStr[3]));
                            jsonItem.put("value", value.toString());
                            arrBtnDetail.put(jsonItem);
                        }else if (StringUtils.startsWith(subStr[0],"barcode")) {
                            objBarcode.put("name", subStr[0]);
                            objBarcode.put("value", value.toString());
                        }else if (StringUtils.startsWith(subStr[0],"jobHeader")) {
                            jsonItem.put("name", subStr[1]);
                            jsonItem.put("value", value.toString());
                            objJobHeader.put(jsonItem);
                        }

                    }
                    // arrTime.put(objTimeout);
                });

                obj.put("auth", jsonArray);
                obj.put("menu", jarray);
                obj.put("tab", arrayTab);
                obj.put("timeout", objTimeout);
                obj.put("common", arrBtnCommon);
                obj.put("detail", arrBtnDetail);
                obj.put("iconCommon", arrIconBtnCommon);
                obj.put("iconDetail", arrIconBtnDetail);
                obj.put("barcode", objBarcode);
                obj.put("jobHeader", objJobHeader);

            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                System.out.println(e);
            }
        }
        return obj;
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getCallCenterDB
    public String getCallCenterDB() {
        String url = String.format("%s?command=getCallCenterDB", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getCallCenterSites&param1=AMSOPRON
    public String getCallCenterSites(String db) {
        String url = String.format("%s?command=getCallCenterSites&param1=%s", this.endpointUrl, db);
        return restTemplate.getForObject(url, String.class);
    }

    // http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getCallCenterTaskType
    public String getCallCenterTaskType() {
        String url = String.format("%s?command=getCallCenterTaskType", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getTaskTypes&param1=102
    public String getTaskTypes(String siteId) {
        String url = String.format("%s?command=getTaskTypes&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getTaskSeries&param1=102
    public String getTaskSeries(String siteId) {
        String url = String.format("%s?command=getTaskSeries&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getSuppliers
    public String getSuppliers() {
        String url = String.format("%s?command=getSuppliers", this.endpointUrl);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getVHCTemplates&param1=102&param2=3222
    public String getVHCTemplates(String siteId, String vehiId) {
        String url = String.format("%s?command=getVHCTemplates&param1=%s&param2=%s", this.endpointUrl, siteId, vehiId);
        return restTemplate.getForObject(url, String.class);
    }

    //http://automaster.alliedsoft.hu:9092/api/ASMaster?command=getWOSort&param1=102
    public String getWOSort(String siteId) {
        String url = String.format("%s?command=getWOSort&param1=%s", this.endpointUrl, siteId);
        return restTemplate.getForObject(url, String.class);
    }
}
