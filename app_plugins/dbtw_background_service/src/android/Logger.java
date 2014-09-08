package com.tsubik.cordova.dbtw_background_service;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

public class Logger {
	protected String TAG;
	protected Context context;
	protected boolean isToastEnabled;
	
	public Logger(String TAG, Context context,boolean isToastEnabled){
		this.TAG = TAG;
		this.context = context;
		this.isToastEnabled = isToastEnabled;
	}
	
	public void log(int priority, String message){
		Log.println(priority, TAG, message);
		if(isToastEnabled){
			Toast.makeText(context, message, 2000).show();
		}
	}
	
}
