package com.sfmcsamples;
import com.exacttarget.fuelsdk.*;

public class App 
{
    public static void main( String[] args )
    {
        // Use ClientId and ClientSecret from the playground
        String clientId = System.getenv("SFMC_PLAYGROUND_CLIENTID");
        String clientSecret = System.getenv("SFMC_PLAYGROUND_CLIENTSECRET");

        System.out.println("\nDEMO: Connect to Marketing Cloud from playground");
        try
        {
            // Establish a connection to Marketing Cloud
            System.out.println("Connecting to Marketing Cloud...");
            ETConfiguration config = new ETConfiguration();
            config.set("clientId", clientId);
            config.set("clientSecret", clientSecret);
            ETClient client = new ETClient(config);
            System.out.println("Successfully connected to Marketing Cloud from playground!");
        }
        catch(ETSdkException e)
        {
            System.out.println("\n** Exception:" + e.toString());
        }
    }
}