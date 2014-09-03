package com.tsubik.cordova.dbtw_background_service;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.webkit.WebBackForwardList;
import android.webkit.WebHistoryItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebSettings.LayoutAlgorithm;
import android.location.Location;
import android.location.Criteria;
import android.location.LocationListener;
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

import org.json.*;

import com.tsubik.cordova.plugin.asynclocalstorage.LocalStorage;

class MyJavaScriptInterface {
	public static Context applicationContext;

	public void someCallback(final String jsResult) {
		Handler h = new Handler();

		h.post(new Runnable() {
			@Override
			public void run() {
				Toast.makeText(MyJavaScriptInterface.applicationContext,jsResult,Toast.LENGTH_LONG).show();
			}
		});
	}
}

public class BTWService extends Service implements LocationListener{
	private Context _Context;
	protected LocationManager locationManager;
	protected TaskService taskService;
	private ToneGenerator toneGenerator;
	private NotificationManager notificationManager;
	// Internal List of Geofence objects
    List<Geofence> mGeofenceList;
	
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
		_Context = this.getApplicationContext();
		Log.d(TAG, "Service created");
		taskService = new TaskService(this.getApplicationContext());
		toneGenerator = new ToneGenerator(AudioManager.STREAM_NOTIFICATION, 100);
		notificationManager = (NotificationManager)this.getSystemService(Context.NOTIFICATION_SERVICE);
		tasks = taskService.GetTasks();
		
	}
	
	public Location getLocation() {
        Location location = null;
		try {
        	
            locationManager = (LocationManager) _Context
                    .getSystemService(LOCATION_SERVICE);
 
            // getting GPS status
            isGPSEnabled = locationManager
                    .isProviderEnabled(LocationManager.GPS_PROVIDER);
 
            // getting network status
            isNetworkEnabled = locationManager
                    .isProviderEnabled(LocationManager.NETWORK_PROVIDER);
 
            if (!isGPSEnabled && !isNetworkEnabled) {
                // no network provider is enabled
            } else {
                this.canGetLocation = true;
                // First get location from Network Provider
                if (isNetworkEnabled) {
                    locationManager.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER,
                            MIN_TIME_BW_UPDATES,
                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                    Log.d("Network", "Network");
                    if (locationManager != null) {
                        location = locationManager
                                .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    }
                }
                // if GPS Enabled get lat/long using GPS Services
                if (isGPSEnabled) {
                    if (location == null) {
                        locationManager.requestLocationUpdates(
                                LocationManager.GPS_PROVIDER,
                                MIN_TIME_BW_UPDATES,
                                MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                        Log.d("GPS Enabled", "GPS Enabled");
                        if (locationManager != null) {
                            location = locationManager
                                    .getLastKnownLocation(LocationManager.GPS_PROVIDER);
                        }
                    }
                }
            }
 
        } catch (Exception e) {
            e.printStackTrace();
        }
 
        return location;
    }

	/**
     * Plays debug sound
     * @param name
     */
    private void startTone(String name) {
        int tone = 0;
        int duration = 1000;
        
        if (name.equals("beep")) {
            tone = ToneGenerator.TONE_PROP_BEEP;
        } else if (name.equals("beep_beep_beep")) {
            tone = ToneGenerator.TONE_CDMA_CONFIRM;
        } else if (name.equals("long_beep")) {
            tone = ToneGenerator.TONE_CDMA_ABBR_ALERT;
        } else if (name.equals("doodly_doo")) {
            tone = ToneGenerator.TONE_CDMA_ALERT_NETWORK_LITE;
        } else if (name.equals("chirp_chirp_chirp")) {
            tone = ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD;
        } else if (name.equals("dialtone")) {
            tone = ToneGenerator.TONE_SUP_RINGTONE;
        }
        toneGenerator.startTone(tone, duration);
    }
	
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
	    //TODO do something useful
		getLocation();
		return Service.START_REDELIVER_INTENT;
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
		Toast.makeText(this, "service done", Toast.LENGTH_SHORT).show();
	}

	@Override
	public void onLocationChanged(Location location) {
		// TODO Auto-generated method stub
		//startTone("beep");
		Log.d(TAG,"onLocationChanged");
		Log.d(TAG, "Current location "+ location.toString());
		for (int i = 0; i < tasks.length(); i++) {
			try {
				JSONObject task = tasks.getJSONObject(i);
				JSONArray locationReminders = task.getJSONArray("locationReminders");
				for (int j = 0; j < locationReminders.length(); j++) {
					JSONObject locationReminder = locationReminders.getJSONObject(j);
					int radius = locationReminder.getInt("radius");
					JSONObject loc = locationReminder.getJSONObject("location");
					JSONObject coords = loc.getJSONObject("coords");
					
					float locLat = (float)coords.getDouble("latitude");
					float locLng = (float)coords.getDouble("longitude");
					Location locObj = new Location("");
					locObj.setLatitude(locLat);
					locObj.setLongitude(locLng);
					Log.d(TAG, "Location reminder object "+ locObj.toString());
					Log.d(TAG, "Location reminder radiu " + radius);
					if(location.distanceTo(locObj) < radius){
						notify("aaa");startTone("beep beep beep");
					}
					
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	private void setGeoFence(float lat, float lng, int radius, boolean isEntering){
		
	}
	
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
	public void onProviderDisabled(String arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onProviderEnabled(String arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onStatusChanged(String arg0, int arg1, Bundle arg2) {
		// TODO Auto-generated method stub
		
	}
}