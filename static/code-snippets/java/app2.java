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
        String sendToEmailAddress = "-- replace me --";

        String emailKey = "demo-" + org.apache.commons.lang.RandomStringUtils.randomAlphanumeric(20);
        String triggeredSendKey = "demo-" + org.apache.commons.lang.RandomStringUtils.randomAlphanumeric(20);

        System.out.println("\nDEMO: Connect to Marketing Cloud, create a contact, create an e-mail, send e-mail and check status.\n");
        try
        {
            // Establish a connection to Marketing Cloud
            ETConfiguration config = new ETConfiguration();
            config.set("clientId", clientId);
            config.set("clientSecret", clientSecret);
            ETClient client = new ETClient(config);
            System.out.println("\nConnected to Marketing Cloud!");

            // Create a new e-mail
            System.out.println("Creating a new e-mail...");
            ETEmail email = new ETEmail();
            email.setId(emailKey);
            email.setKey(emailKey);
            email.setName(emailKey);
            email.setSubject("Test e-mail from Marketing Cloud Java SDK demo");
            email.setHtmlBody("<p>Learn more about <a href=\"https://www.salesforce.com/products/marketing-cloud/overview\">Marketing Cloud</a></p>");
            email.setTextBody("Learn more about Marketing Cloud: https://www.salesforce.com/products/marketing-cloud/overview");
            ETResponse<ETEmail> emailResponse = client.create(email);
            if(emailResponse.getStatus() == ETResult.Status.OK)
            {
                System.out.println("Created e-mail: " + email.getKey());
            }
            else
            {
                System.out.println("** ERROR: could not create new e-mail:\n");
                throw new ETSdkException(emailResponse.toString());
            }
            
            // Send e-mail
            System.out.println("Sending e-mail to: " + sendToEmailAddress + "...");
            ETTriggeredEmail triggeredSend = new ETTriggeredEmail();
            triggeredSend.setClient(client);
            triggeredSend.setDescription("Marketing Cloud Java SDK demo");
            triggeredSend.setKey(triggeredSendKey);
            triggeredSend.setName(triggeredSendKey);
            triggeredSend.setEmail(email);
            triggeredSend.setPriority("High");
            SendClassification classification = new SendClassification();
            classification.setCustomerKey("Default Commercial");
            triggeredSend.setSendClassification(classification);
            ETResponse<ETTriggeredEmail> sendResponse = client.create(triggeredSend);
            if(sendResponse.getStatus() == ETResult.Status.OK)
            {
                System.out.println("Created Triggered send: " + triggeredSend.getName());
            }
            else
            {
                System.out.println("** ERROR: could not create Triggered Send:\n");
                throw new ETSdkException(sendResponse.toString());
            }

            triggeredSend.setStatus(ETTriggeredEmail.Status.ACTIVE);
            sendResponse = client.update(triggeredSend);
            if(sendResponse.getStatus() == ETResult.Status.OK)
            {
                System.out.println("Activated Triggered send: " + triggeredSend.getName());
            }
            else
            {
                System.out.println("** ERROR: could not activate Triggered Send:\n");
                throw new ETSdkException(sendResponse.toString());
            }

            sendResponse = triggeredSend.send(sendToEmailAddress);
            if(sendResponse.getStatus() == ETResult.Status.OK)
            {
                System.out.println("Sent e-mail to: " + sendToEmailAddress);
            }
            else
            {
                System.out.println("** ERROR: could not send e-mail:\n");
                throw new ETSdkException(sendResponse.toString());
            }

            // Sleep for a few seconds
            System.out.println("Sleeping for 15 seconds - go check for an e-mail from Marketing Cloud in your Inbox!");
            try { Thread.sleep(15000); } catch( InterruptedException ev) {}  

            // Check e-mail send status
            ETResponse<ETSentEvent> sentEventResponse = client.retrieve(ETSentEvent.class, "subscriberKey=" + sendToEmailAddress);
            if(sentEventResponse.getStatus() == ETResult.Status.OK)
            {
                System.out.println("E-mail send response:\n" + sentEventResponse);
            }
            else
            {
                System.out.println("** ERROR: could not get Sent Event response:\n" + sentEventResponse.toString());
            }
        }
        catch(ETSdkException e)
        {
            System.out.println("\n** Exception:\n" + e.toString());
        }

        System.out.println("All done.\n");
    }
}