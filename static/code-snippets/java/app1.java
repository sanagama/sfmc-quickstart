package com.sfmcsamples;
import com.exacttarget.fuelsdk.*;

public class App 
{
    public static void main( String[] args )
    {
        // TODO: Update these variables before you compile & run this sample
        String clientId = "-- replace me --";
        String clientSecret = "-- replace me --";

        System.out.println("\nDEMO: Connect to Marketing Cloud\n");
        try
        {
            // Establish a connection to Marketing Cloud
            ETConfiguration config = new ETConfiguration();
            config.set("clientId", clientId);
            config.set("clientSecret", clientSecret);
            ETClient client = new ETClient(config);
            System.out.println("\nConnected to Marketing Cloud!");
        }
        catch(ETSdkException e)
        {
            System.out.println("\n** Exception:\n" + e.toString());
        }

        System.out.println("All done.\n");
    }
}