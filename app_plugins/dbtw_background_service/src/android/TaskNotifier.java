package com.tsubik.cordova.dbtw_background_service;

import org.json.JSONException;
import org.json.JSONObject;

import com.ionicframework.starter.Donebytheway;

import android.R;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.util.Log;
import android.support.v4.app.*;
import android.content.Context;
import android.content.Intent;

public class TaskNotifier {
	private NotificationManager notificationManager;
	private Context context;
	
	public TaskNotifier(NotificationManager notificationManager, Context context){
		this.notificationManager = notificationManager;
		this.context = context;
	}
	
	public void notify(JSONObject task, boolean isEntered){
    	String note;
		try {
			note = task.getString("note");
		} catch (JSONException e) {
			note = "error";
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
		Log.d("BTWService", "notification");
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context)
		    .setSmallIcon(R.drawable.ic_notification_overlay)
		    .setContentTitle("GeoTask")
		    .setContentText(note);
//		NotificationCompat.InboxStyle inboxStyle =
//		        new NotificationCompat.InboxStyle();
//		
//		mBuilder.setStyle(inboxStyle);
//		
		// Creates an explicit intent for an Activity in your app
		Intent resultIntent = new Intent(context, Donebytheway.class);
		// The stack builder object will contain an artificial back stack for the
		// started Activity.
		// This ensures that navigating backward from the Activity leads out of
		// your application to the Home screen.
		TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
		// Adds the back stack for the Intent (but not the Intent itself)
		stackBuilder.addParentStack(Donebytheway.class);
		// Adds the Intent that starts the Activity to the top of the stack
		stackBuilder.addNextIntent(resultIntent);
		PendingIntent resultPendingIntent =
		        stackBuilder.getPendingIntent(
		            0,
		            PendingIntent.FLAG_UPDATE_CURRENT
		        );
		mBuilder.setContentIntent(resultPendingIntent);
		
		notificationManager.notify(100, mBuilder.build());
	}
}
