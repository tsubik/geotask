package com.tsubik.cordova.dbtw_background_service;
 
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.content.BroadcastReceiver;
import android.content.Context;
 
public class StartAppAtBootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
            Intent serviceIntent = new Intent(context, BTWService.class);
            context.startService(serviceIntent);
    }
}