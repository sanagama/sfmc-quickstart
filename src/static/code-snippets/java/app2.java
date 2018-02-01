package com.sfmcsamples;
import com.exacttarget.fuelsdk.*;
import com.exacttarget.fuelsdk.internal.*;

public class App 
{
    public static void main( String[] args )
    {
        // TODO: Update these variables before you compile & run this sample
        String clientId = "-- replace me --";
        String clientSecret = "-- replace me --";
        String contactEmailAddress = "-- replace me --";
        String contactFirstName = "-- replace me --";
        String contactLastName = "-- replace me --";

        try
        {
            System.out.println("\nDEMO: Connect to Marketing Cloud, create a contact, create an e-mail, send e-mail and check status.\n");

            // Establish a connection to Marketing Cloud 
            ETConfiguration configuration = new ETConfiguration();
            configuration.set("clientId", clientId);
            configuration.set("clientSecret", clientSecret);
            ETClient etClient = new ETClient(configuration);
            System.out.println("\nConnected to Marketing Cloud!");

            // Create a new subscriber. An ETSubscriber object represents an email subscriber in Marketing Cloud.
            System.out.println("Creating a new subscriber...");
            ETSubscriber subscriber = new ETSubscriber();
            subscriber.setClient(etClient);
            subscriber.setKey("demo-contact");
            subscriber.setEmailAddress(contactEmailAddress);
            subscriber.setStatus(ETSubscriber.Status.ACTIVE);
            subscriber.setPreferredEmailType(ETEmail.Type.HTML);
            subscriber.setAttributes(java.util.Arrays.asList(new ETProfileAttribute("FirstName", contactFirstName), new ETProfileAttribute("LastName", contactLastName)));
            ETResponse<ETSubscriber> subscriberResponse = etClient.create(subscriber);
            if(!subscriberResponse.getResponseCode().equals("OK"))
            {
                throw new ETSdkException("** ERROR: could not create a new subscriber: " + subscriberResponse.toString());
            }
            System.out.println("Created new subscriber: " + subscriberResponse.getObject().getEmailAddress());

            // Create a new e-mail
            System.out.println("Creating a new e-mail...");
            ETEmail etEmail = new ETEmail();
            etEmail.setKey("demo-email");
            etEmail.setName("demo-email");
            etEmail.setSubject("E-mail from Java SDK demo");
            etEmail.setHtmlBody("<b>What a wonderful world!</b>");
            etEmail.setTextBody("What a wonderful world!");
            ETResponse<ETEmail> emailResponse = etClient.create(etEmail);
            if(!emailResponse.getResponseCode().equals("OK"))
            {
                throw new ETSdkException("** ERROR: could not create a new email");
            }
            System.out.println("Created new e-mail: " + emailResponse.getObject().getName());
            
            // Send e-mail to new subscriber
            System.out.println("Sending e-mail to subscriber...");
            ETTriggeredEmail triggeredEmail = new ETTriggeredEmail();
            triggeredEmail.setClient(etClient);
            triggeredEmail.setKey("demo-triggered-email");
            triggeredEmail.setName("demo-triggered-email");
            triggeredEmail.setEmail(etEmail);
            SendClassification classification = new SendClassification();
            classification.setCustomerKey("Default Commercial");
            triggeredEmail.setSendClassification(classification);
            ETResponse<ETTriggeredEmail> sendResponse = triggeredEmail.send(subscriber);
            if(!sendResponse.getResponseCode().equals("OK"))
            {
                System.out.println("sendResponse: " + sendResponse.toString());
                // throw new ETSdkException("** ERROR: could not send e-mail");
            }
            System.out.println("Sent e-mail to : " + emailResponse.getObject().getName());

            // Check e-mail status

            // Clean-up
            System.out.println("Cleaning up...");
            emailResponse = etClient.delete(etEmail);
            System.out.println("Deleted e-mail: " + etEmail.getName());
            subscriberResponse = etClient.delete(subscriber);
            System.out.println("Deleted subscriber: " + subscriber.getEmailAddress());
        }
        catch(ETSdkException e)
        {
            System.out.println("** Exception: " + e.toString());
        }

        System.out.println("All done.\n");
    }
}