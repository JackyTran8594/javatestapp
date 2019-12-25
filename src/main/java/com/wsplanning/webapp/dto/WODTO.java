package com.wsplanning.webapp.dto;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class WODTO {

    public Integer WorkOrderNo;
    public Integer WorkOrderId;
    
    public String ServiceDate;

    public String ExecutionDate;

    public String CheckInDate;

    public String CheckOutDate;

    public String BookMOTDate;

    public String BookTireDate;

    public String ServiceAdvisorId;
    public String DeliveredBy;
    public String TransactionType;
    public String DeptId;
    public String StampStatus;
    public String WorkReadyDate;

    public String WorkReadyForInvoiceDate;
    public String ContactLName ;
    public String ContactFName ;
    public String ContactPhone ;
    public String ContactEmail ;
    public Integer IsCustomerWaiting;
    public String TimeBarText;
    public String SiteId;
    public Integer IsTimeReservation;
    public Integer Mileage;
    public Integer StampId;
    public String VisitReasonCode;
    public Integer BookingId;
    public String JobTitle;
    public String CustomerComplaint;
    public Integer IsPickupService;
    public String PickupSmanId;
    public String PickupNote;
    public Integer IsReturnService;
    public String ReturnSmanId;
    public String ReturnNote;
    public String Vehicle;
    public WOVehicleDTO WOVehicle;
    public WOCustomerDTO WOCustomer;
    public WOCustomerDTO WOContact;
    public List<WOAttachmentDTO> WOAttachments;
    public List<WOResourceDTO> BookedResources;
    public List<WOResourcePoolDTO> BookedResourcePools;
    public List<WOJobDTO> WOJobs;
    public TokenDTO Token;   
}