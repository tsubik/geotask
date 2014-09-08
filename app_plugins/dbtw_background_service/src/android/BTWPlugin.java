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
//        Log.d(TAG, "BTWPlugin execute action: "+ action + " args: " + args.toString());
//        ServiceDetails
//        
//        if(action.equalsIgnoreCase("startService")){
//            callbackContext.success(this.localStorage.getItem(o.getString("key")));    
//        }
//        else if(action.equalsIgnoreCase("stopService")){ 
//            this.localStorage.setItem(o.getString("key"), o.getString("value"));    
//        }
//        else if(action.equalsIgnoreCase("getStatus")){ 
//            this.localStorage.removeItem(o.getString("key"));
//        }
//        else{ 
//            return false;
//        }
        return true;

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
//	public ExecuteResult startService()
//	{
//		Log.d(LOCALTAG, "Starting startService");
//		ExecuteResult result = null;
//		
//		try {
//			Log.d(LOCALTAG, "Attempting to bind to Service");
//			if (this.bindToService()) {
//				Log.d(LOCALTAG, "Bind worked");
//				result = new ExecuteResult(ExecuteStatus.OK, createJSONResult(true, ERROR_NONE_CODE, ERROR_NONE_MSG));
//			} else {
//				Log.d(LOCALTAG, "Bind Failed");
//				result = new ExecuteResult(ExecuteStatus.ERROR, createJSONResult(false, ERROR_UNABLE_TO_BIND_TO_BACKGROUND_SERVICE_CODE, ERROR_UNABLE_TO_BIND_TO_BACKGROUND_SERVICE_MSG));
//			}
//		} catch (Exception ex) {
//			Log.d(LOCALTAG, "startService failed", ex);
//			result = new ExecuteResult(ExecuteStatus.ERROR, createJSONResult(false, ERROR_EXCEPTION_CODE, ex.getMessage()));
//		}
//		
//		Log.d(LOCALTAG, "Finished startService");
//		return result;
//	}
//	
//	public ExecuteResult stopService()
//	{
//		ExecuteResult result = null;
//		
//		Log.d("ServiceDetails", "stopService called");
//
//		try {
//			
//			Log.d("ServiceDetails", "Unbinding Service");
//			this.mContext.unbindService(serviceConnection);
//			
//			Log.d("ServiceDetails", "Stopping service");
//			if (this.mContext.stopService(this.mService))
//			{
//				Log.d("ServiceDetails", "Service stopped");
//			} else {
//				Log.d("ServiceDetails", "Service not stopped");
//			}
//			result = new ExecuteResult(ExecuteStatus.OK, createJSONResult(true, ERROR_NONE_CODE, ERROR_NONE_MSG));
//		} catch (Exception ex) {
//			Log.d(LOCALTAG, "stopService failed", ex);
//			result = new ExecuteResult(ExecuteStatus.ERROR, createJSONResult(false, ERROR_EXCEPTION_CODE, ex.getMessage()));
//		}
//		
//		return result;
//	}

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
