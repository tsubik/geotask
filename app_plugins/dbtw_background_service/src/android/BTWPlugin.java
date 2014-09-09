package com.tsubik.cordova.dbtw_background_service;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.util.Log;

public class BTWPlugin extends CordovaPlugin {
    private static final String TAG = "BTWPlugin";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.d(TAG, "BTWPlugin execute action: "+ action + " args: " + args.toString());
        
        if(action.equalsIgnoreCase("startService")){
        	startService();
        	callbackContext.success();
        }
        else if(action.equalsIgnoreCase("stopService")){ 
        	stopService();
        	callbackContext.success();
        }
        else if(action.equalsIgnoreCase("getStatus")){ 
        	callbackContext.success(String.valueOf(isServiceRunning()));
        }
        else{ 
            return false;
        }
        return true;

    }
    
    private void startService(){
    	Context context = this.cordova.getActivity().getApplicationContext();
    	Intent intent = new Intent(context, com.tsubik.cordova.dbtw_background_service.BTWService.class);
    	Log.d(TAG, "Attempting to start service");
    	context.startService(intent);
    }
    
    private void stopService(){
    	Context context = this.cordova.getActivity().getApplicationContext();
    	Intent intent = new Intent(context, com.tsubik.cordova.dbtw_background_service.BTWService.class);
    	Log.d(TAG, "Attempting to stop service");
    	context.stopService(intent);
    }
    
    private boolean isServiceRunning()
	{
		boolean result = false;
		
		try {
			Context context = this.cordova.getActivity().getApplicationContext();
			// Return Plugin with ServiceRunning true/ false
			ActivityManager manager = (ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE); 
			for (RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) { 
				if (service.service.getClassName()=="") { 
					result = true; 
				} 
			} 
		} catch (Exception ex) {
			Log.d(TAG, "isServiceRunning failed", ex);
		}

	    return result;
	}

}

//	
//	public ExecuteResult getStatus()
//	{
//		ExecuteResult result = null;
//		
//		result = new ExecuteResult(ExecuteStatus.OK, createJSONResult(true, ERROR_NONE_CODE, ERROR_NONE_MSG));
//		
//		return result;
//	}
//	
//	/*
//	 ************************************************************************************************
//	 * Private Methods 
//	 ************************************************************************************************
//	 */
//	private boolean bindToService() {
//		boolean result = false;
//		
//		Log.d(LOCALTAG, "Starting bindToService");
//		
//		try {
//			this.mService = new Intent(this.mServiceName);
//
//			Log.d(LOCALTAG, "Attempting to start service");
//			this.mContext.startService(this.mService);
//
//			Log.d(LOCALTAG, "Attempting to bind to service");
//			if (this.mContext.bindService(this.mService, serviceConnection, 0)) {
//				Log.d(LOCALTAG, "Waiting for service connected lock");
//				synchronized(mServiceConnectedLock) {
//					while (mServiceConnected==null) {
//						try {
//							mServiceConnectedLock.wait();
//						} catch (InterruptedException e) {
//							Log.d(LOCALTAG, "Interrupt occurred while waiting for connection", e);
//						}
//					}
//					result = this.mServiceConnected;
//				}
//			}
//		} catch (Exception ex) {
//			Log.d(LOCALTAG, "bindToService failed", ex);
//		}
//
//		Log.d(LOCALTAG, "Finished bindToService");
//
//		return result;
//	}
	
//
//}
