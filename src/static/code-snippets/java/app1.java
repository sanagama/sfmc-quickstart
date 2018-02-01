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

        try
        {
            System.out.println("\nDEMO: Connect to Marketing Cloud, create a contact, create an e-mail, send e-mail and check status.\n");

            // Establish a connection to Marketing Cloud 
            ETConfiguration configuration = new ETConfiguration();
            configuration.set("clientId", clientId);
            configuration.set("clientSecret", clientSecret);
            ETClient etClient = new ETClient(configuration);
            System.out.println("\nConnected to Marketing Cloud!");
        }
        catch(ETSdkException e)
        {
            System.out.println("** Exception: " + e.toString());
        }

        System.out.println("All done.\n");
    }
}