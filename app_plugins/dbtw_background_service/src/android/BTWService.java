package com.tsubik.cordova.dbtw_background_service;

import android.app.AlarmManager;
import android.app.Dialog;
import android.app.NotificationManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.content.IntentSender;
import android.webkit.WebBackForwardList;
import android.webkit.WebHistoryItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebSettings.LayoutAlgorithm;
import android.location.Location;
import android.location.Criteria;
import android.location.LocationManager;
import android.widget.Toast;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.util.Log;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.Notification;
import android.support.v4.app.*;
import android.R;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient.ConnectionCallbacks;
import com.google.android.gms.common.GooglePlayServicesClient.OnConnectionFailedListener;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationClient.OnAddGeofencesResultListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationStatusCodes;
import com.google.android.gms.location.LocationListener;

import java.util.List;
import java.util.ArrayList;

import org.json.*;       

import com.tsubik.cordova.plugin.asynclocalstorage.LocalStorage;


public class BTWService extends Service implements 
	LocationListener,
	ConnectionCallbacks,
	OnConnectionFailedListener,
	OnAddGeofencesResultListener
{
	private final static int
    CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;
	
	private Context _Context;
	protected LocationManager locationManager;
	protected TaskService taskService;

	private NotificationManager notificationManager;
	// Internal List of Geofence objects
    List<Geofence> geoFences;
    private Boolean servicesAvailable = false;
    
	
    // Holds the location client
    private LocationClient mLocationClient;
    private LocationRequest mLocationRequest;
    
    // Stores the PendingIntent used to request geofence monitoring
    private PendingIntent mGeofenceRequestIntent;
    // Defines the allowable request types.
    public enum REQUEST_TYPE {ADD};
    private REQUEST_TYPE mRequestType;
    // Flag that indicates if a request is underway.
    private boolean mInProgress;
    
	// flag for GPS status
    boolean isGPSEnabled = false;
 
    // flag for network status
    boolean isNetworkEnabled = false;
 
    boolean canGetLocation = false;
 // The minimum distance to change Updates in meters
    private static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 1; // 50 meters
 
    // The minimum time between updates in milliseconds
    private static final long MIN_TIME_BW_UPDATES = 1000 * 10; // 30 sec
    
    private JSONArray tasks= null;
    private static final String TAG = "BTWService";
	
	@Override
	public void onCreate() {
		mInProgress = false;
		_Context = this.getApplicationContext();
		Log.d(TAG, "Service created");
		taskService = new TaskService(this.getApplicationContext());
		notificationManager = (NotificationManager)this.getSystemService(Context.NOTIFICATION_SERVICE);
		tasks = taskService.GetTasks();
		geoFences = new ArrayList<Geofence>();
		setGeoFences(tasks);
		
		mInProgress = false;
        // Create the LocationRequest object
        mLocationRequest = LocationRequest.create();
        // Use high accuracy
        mLocationRequest.setPriority(LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY);
       
        // Set the update interval to 5 seconds
        mLocationRequest.setInterval(1000 * 5);
        // Set the fastest update interval to 1 second
        mLocationRequest.setFastestInterval(1000);
        
        servicesAvailable = servicesConnected();
        if(servicesAvailable){
        	Log.d(TAG, "Google play services available");
        }
        /*
         * Create a new location client, using the enclosing class to
         * handle callbacks.
         */
        mLocationClient = new LocationClient(this, this, this);
	}
	
	private boolean servicesConnected() {
    	
        // Check that Google Play services is available
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        
        // If Google Play services is available
        if (ConnectionResult.SUCCESS == resultCode) {
            return true;
        } else {
            return false;
        }
    }
	
	private void setGeoFences(JSONArray tasks){
		for (int i = 0; i < tasks.length(); i++) {
			try {
				JSONObject task = tasks.getJSONObject(i);
				JSONArray locationReminders = task.getJSONArray("locationReminders");
				for (int j = 0; j < locationReminders.length(); j++) {
					JSONObject locationReminder = locationReminders.getJSONObject(j);
					int radius = locationReminder.getInt("radius");
					String id = locationReminder.getString("id");
					JSONObject loc = locationReminder.getJSONObject("location");
					JSONObject coords = loc.getJSONObject("coords");
					boolean whenIgetCloser = locationReminder.getBoolean("whenIgetCloser");
					float lat = (float)coords.getDouble("latitude");
					float lng = (float)coords.getDouble("longitude");
					setGeoFence(id,lat, lng, radius, whenIgetCloser);
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	private void setGeoFence(String id, float lat, float lng, int radius, boolean isEntering){
		Geofence fence = new Geofence.Builder()
        .setRequestId(id)
        .setTransitionTypes(isEntering? Geofence.GEOFENCE_TRANSITION_ENTER : Geofence.GEOFENCE_TRANSITION_EXIT)
        .setCircularRegion(lat,lng,radius)
        .setExpirationDuration(Geofence.NEVER_EXPIRE)
        .build();
		geoFences.add(fence);
	}
	
//	public Location getLocation() {
//        Location location = null;
//		try {
//        	
//            locationManager = (LocationManager) _Context
//                    .getSystemService(LOCATION_SERVICE);
// 
//            // getting GPS status
//            isGPSEnabled = locationManager
//                    .isProviderEnabled(LocationManager.GPS_PROVIDER);
// 
//            // getting network status
//            isNetworkEnabled = locationManager
//                    .isProviderEnabled(LocationManager.NETWORK_PROVIDER);
// 
//            if (!isGPSEnabled && !isNetworkEnabled) {
//                // no network provider is enabled
//            } else {
//                this.canGetLocation = true;
//                // First get location from Network Provider
//                if (isNetworkEnabled) {
//                    locationManager.requestLocationUpdates(
//                            LocationManager.NETWORK_PROVIDER,
//                            MIN_TIME_BW_UPDATES,
//                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//                    Log.d("Network", "Network");
//                    if (locationManager != null) {
//                        location = locationManager
//                                .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
//                    }
//                }
//                // if GPS Enabled get lat/long using GPS Services
//                if (isGPSEnabled) {
//                    if (location == null) {
//                        locationManager.requestLocationUpdates(
//                                LocationManager.GPS_PROVIDER,
//                                MIN_TIME_BW_UPDATES,
//                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
//                        Log.d("GPS Enabled", "GPS Enabled");
//                        if (locationManager != null) {
//                            location = locationManager
//                                    .getLastKnownLocation(LocationManager.GPS_PROVIDER);
//                        }
//                    }
//                }
//            }
// 
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
// 
//        return location;
//    }

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
	    
		setUpLocationClientIfNeeded();
        if(!mLocationClient.isConnected() || !mLocationClient.isConnecting() && !mInProgress)
        {
        	Log.d(TAG,"Starting onStartCommand");
        	mInProgress = true;
        	Log.d(TAG,"Connecting location client");
        	mLocationClient.connect();
        }
		
		//getLocation();
		return Service.START_REDELIVER_INTENT;
	}
	
	/*
     * Create a new location client, using the enclosing class to
     * handle callbacks.
     */
    private void setUpLocationClientIfNeeded()
    {
    	if(mLocationClient == null) 
            mLocationClient = new LocationClient(this, this, this);
    }
	
	@Override
    public boolean stopService(Intent intent) {
        Toast.makeText(this, "Background location tracking stopped", Toast.LENGTH_SHORT).show();
        return super.stopService(intent);
    }

	@Override
	public IBinder onBind(Intent intent) {
	  //TODO for communication return IBinder implementation
		return null;
	}

	@Override
	public void onDestroy() {
		// Turn off the request flag
        mInProgress = false;
        if(servicesAvailable && mLocationClient != null) {
	        mLocationClient.removeLocationUpdates(this);
	        // Destroy the current location client
	        mLocationClient = null;
        }
        // Display the connection status
        // Toast.makeText(this, DateFormat.getDateTimeInstance().format(new Date()) + ": Disconnected. Please re-connect.", Toast.LENGTH_SHORT).show();
        //appendLog(DateFormat.getDateTimeInstance().format(new Date()) + ": Stopped", Constants.LOG_FILE);
        super.onDestroy();  
	}

//	@Override
//	public void onLocationChanged(Location location) {
//		// TODO Auto-generated method stub
//		//startTone("beep");
//		Log.d(TAG,"onLocationChanged");
//		Log.d(TAG, "Current location "+ location.toString());
//		for (int i = 0; i < tasks.length(); i++) {
//			try {
//				JSONObject task = tasks.getJSONObject(i);
//				JSONArray locationReminders = task.getJSONArray("locationReminders");
//				for (int j = 0; j < locationReminders.length(); j++) {
//					JSONObject locationReminder = locationReminders.getJSONObject(j);
//					int radius = locationReminder.getInt("radius");
//					JSONObject loc = locationReminder.getJSONObject("location");
//					JSONObject coords = loc.getJSONObject("coords");
//					
//					float locLat = (float)coords.getDouble("latitude");
//					float locLng = (float)coords.getDouble("longitude");
//					Location locObj = new Location("");
//					locObj.setLatitude(locLat);
//					locObj.setLongitude(locLng);
//					Log.d(TAG, "Location reminder object "+ locObj.toString());
//					Log.d(TAG, "Location reminder radiu " + radius);
//					if(location.distanceTo(locObj) < radius){
//						notify("aaa");startTone("beep beep beep");
//					}
//					
//				}
//			} catch (JSONException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//	}
	
	private void notify(String text){
		Log.d(TAG, "notification");
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
		    .setSmallIcon(R.drawable.ic_notification_overlay)
		    .setContentTitle("Done by the way task")
		    .setContentText("Helloł motherfucker");
		NotificationCompat.InboxStyle inboxStyle =
		        new NotificationCompat.InboxStyle();
		
		mBuilder.setStyle(inboxStyle);
		
		notificationManager.notify(100, mBuilder.build());
	}

	

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
    	mInProgress = false;
    	Log.d(TAG, "Connecting to google services fail - " + connectionResult.toString());
        /*
         * Google Play services can resolve some errors it detects.
         * If the error has a resolution, try sending an Intent to
         * start a Google Play services activity that can resolve
         * error.
         */
        if (connectionResult.hasResolution()) {
 
        // If no resolution is available, display an error dialog
        } else {
 
        }
    }

    /*
     * Create a PendingIntent that triggers an IntentService in your
     * app when a geofence transition occurs.
     */
    private PendingIntent getTransitionPendingIntent() {
        // Create an explicit Intent
        Intent intent = new Intent(this,
                ReceiveTransitionsIntentService.class);
        /*
         * Return the PendingIntent
         */
        return PendingIntent.getService(
                this,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
    }
    
	/*
     * Provide the implementation of ConnectionCallbacks.onConnected()
     * Once the connection is available, send a request to add the
     * Geofences
     */
    @Override
    public void onConnected(Bundle dataBundle) {
        Log.d(TAG, "Google play services connected");
        Log.d(TAG, "Adding geofences");
     // Get the PendingIntent for the request
        mLocationClient.addGeofences(geoFences, getTransitionPendingIntent(), this);
//    	// Request location updates using static settings
//        mLocationClient.requestLocationUpdates(mLocationRequest, this);
    }
    /*
     * Provide the implementation of
     * OnAddGeofencesResultListener.onAddGeofencesResult.
     * Handle the result of adding the geofences
     *
     */
    
    @Override
    public void onAddGeofencesResult(
            int statusCode, String[] geofenceRequestIds) {
        // If adding the geofences was successful
        if (LocationStatusCodes.SUCCESS == statusCode) {
        	Log.d(TAG,"Geofences successfully added");
            /*
             * Handle successful addition of geofences here.
             * You can send out a broadcast intent or update the UI.
             * geofences into the Intent's extended data.
             */
        } else {
        	Log.d(TAG,"Adding geofences failed");
        // If adding the geofences failed
            /*
             * Report errors here.
             * You can log the error using Log.e() or update
             * the UI.
             */
        }
        // Turn off the in progress flag and disconnect the client
        mInProgress = false;
        mLocationClient.disconnect();
    }
    

    /*
     * Implement ConnectionCallbacks.onDisconnected()
     * Called by Location Services once the location client is
     * disconnected.
     */
    @Override
    public void onDisconnected() {
    	// Turn off the request flag
        mInProgress = false;
        // Destroy the current location client
        mLocationClient = null;
        // Display the connection status
        // Toast.makeText(this, DateFormat.getDateTimeInstance().format(new Date()) + ": Disconnected. Please re-connect.", Toast.LENGTH_SHORT).show();
        Log.d(TAG, "Google play services Disconnected");
    }

	@Override
	public void onLocationChanged(Location arg0) {
		// TODO Auto-generated method stub
		Log.d(TAG, "Location changed");
	}
	
}