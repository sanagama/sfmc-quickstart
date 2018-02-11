package com.sfmcsamples;
import com.exacttarget.fuelsdk.*;
import com.exacttarget.fuelsdk.internal.*;

public class App 
{
    public static void main( String[] args )
    {
        // Use ClientId and ClientSecret from the playground
        String clientId = System.getenv("SFMC_PLAYGROUND_CLIENTID");
        String clientSecret = System.getenv("SFMC_PLAYGROUND_CLIENTSECRET");
        String sendToEmailAddress = "-- receipient e-mail address --";

        String emailKey = "play-" + org.apache.commons.lang.RandomStringUtils.randomAlphanumeric(20);
        String triggeredSendKey = "play-" + org.apache.commons.lang.RandomStringUtils.randomAlphanumeric(20);

        System.out.println("\nDEMO: Connect to Marketing Cloud, create a contact, create an e-mail, send e-mail and check status.");
        try
        {
            // Establish a connection to Marketing Cloud
            System.out.println("Connecting to Marketing Cloud...");
            ETConfiguration config = new ETConfiguration();
            config.set("clientId", clientId);
            config.set("clientSecret", clientSecret);
            ETClient client = new ETClient(config);
            System.out.println("Successfully connected to Marketing Cloud from playground!");

            // Create a new e-mail
            System.out.println("Creating a new e-mail...");
            ETEmail email = new ETEmail();
            email.setId(emailKey);
            email.setKey(emailKey);
            email.setName(emailKey);
            email.setSubject("Test e-mail from Marketing Cloud SDK playground - Java");
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
            triggeredSend.setDescription("Marketing Cloud SDK playground - Java");
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
            System.out.println("Sleeping for 5 seconds");
            try { Thread.sleep(5000); } catch( InterruptedException ev) {}  

            // Check e-mail send status
            ETResponse<ETSentEvent> sentEventResponse = client.retrieve(ETSentEvent.class, "subscriberKey=" + sendToEmailAddress);
            if(sentEventResponse.getStatus() == ETResult.Status.OK)
            {
                System.out.println("E-mail send response:\n" + sentEventResponse.getResult().toString());
            }
            else
            {
                System.out.println("** ERROR: could not get Sent Event response:\n" + sentEventResponse.toString());
            }

            System.out.println("\nAll done. Please check the Inbox of " + "'" + sendToEmailAddress + "'" + " for an e-mail from Marketing Cloud.");
        }
        catch(ETSdkException e)
        {
            System.out.println("\n** Exception:\n" + e.toString());
        }
    }
}