package com.tsubik.cordova.dbtw_background_service;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.LocationClient;

import android.R;
import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.app.NotificationManager;


public class ReceiveTransitionsIntentService extends IntentService {
	protected BeepHelper beepHelper;
	protected TaskNotifier taskNotifier;
	
    /**
     * Sets an identifier for the service
     */
    public ReceiveTransitionsIntentService() {
        super("ReceiveTransitionsIntentService");
        beepHelper = new BeepHelper();
        
    }
    /**
     * Handles incoming intents
     *@param intent The Intent sent by Location Services. This
     * Intent is provided
     * to Location Services (inside a PendingIntent) when you call
     * addGeofences()
     */
    @Override
    protected void onHandleIntent(Intent intent) {
    	taskNotifier = new TaskNotifier((NotificationManager)this.getSystemService(Context.NOTIFICATION_SERVICE), this);
    	TaskService taskService = new TaskService(this.getApplicationContext());
    	Logger logger = new Logger("BTWService", this.getApplicationContext(), true);
    	JSONArray tasks = taskService.GetTasks();
        // First check for errors
        if (LocationClient.hasError(intent)) {
            // Get the error code with a static method
            int errorCode = LocationClient.getErrorCode(intent);
            // Log the error
            Log.e("ReceiveTransitionsIntentService",
                    "Location Services error: " +
                    Integer.toString(errorCode));
            /*
             * You can also send the error code to an Activity or
             * Fragment with a broadcast Intent
             */
        /*
         * If there's no error, get the transition type and the IDs
         * of the geofence or geofences that triggered the transition
         */
        } else {
            // Get the type of transition (entry or exit)
            int transitionType =
                    LocationClient.getGeofenceTransition(intent);
//            // Test that a valid transition was reported
//            if (transitionType == Geofence.GEOFENCE_TRANSITION_ENTER)
//            {
//            	notify("Wejście");
//            	beepHelper.startTone("beep_beep_beep");
//            }
//            else if(transitionType == Geofence.GEOFENCE_TRANSITION_EXIT){
//            	notify("Wyjście");
//            	beepHelper.startTone("chirp_chirp_chirp");
//            }
            		
              if  ((transitionType == Geofence.GEOFENCE_TRANSITION_ENTER)
                 ||
                (transitionType == Geofence.GEOFENCE_TRANSITION_EXIT)
               ) {
            	 logger.log(Log.DEBUG, "Geofence transition detected");
                List <Geofence> triggerList = LocationClient.getTriggeringGeofences(intent);
                
                for(Geofence fence : triggerList){
                	String fenceId = fence.getRequestId();
                	JSONObject task = taskService.FindTaskById(tasks, fenceId);
                	if(task != null){
                		
                		taskNotifier.notify(task, (transitionType == Geofence.GEOFENCE_TRANSITION_ENTER));
                	}
                }
            }
            else {
            	logger.log(Log.ERROR,
                        "Geofence transition error: " +
                        transitionType);
            }
        } 
    }
}